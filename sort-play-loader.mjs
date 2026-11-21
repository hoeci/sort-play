(async () => {
    if (globalThis.__SORT_PLAY_LOADER_ACTIVE__) return;
    globalThis.__SORT_PLAY_LOADER_ACTIVE__ = true;

    const RAW_URL = "https://raw.githubusercontent.com/hoeci/sort-play/main/sort-play.js";
    const DB_NAME = "SortPlayLoaderCache";
    const STORE = "cache";
    const CACHE_KEY = "main";
    const VERSION_RE = /const\s+SORT_PLAY_VERSION\s*=\s*["']([^"']+)["']/;
    const MIN_BYTES = 50_000;
    const RANGE_BYTES = 4096;
    const IDB_TIMEOUT = 1500;
    const CHECK_TIMEOUT = 3000;
    const FETCH_TIMEOUT = 15_000;
    const RETRY_DELAYS = [2000, 5000, 10_000];

    const parseVersion = (text) => (typeof text === "string" ? text.match(VERSION_RE)?.[1] ?? null : null);
    const isValidScript = (text) => typeof text === "string" && text.length >= MIN_BYTES && !/^\s*</.test(text) && Boolean(parseVersion(text));
    const isValidCache = (rec) => Boolean(rec?.version && rec.blob instanceof Blob && rec.blob.size >= MIN_BYTES);
    const toBlob = (text) => new Blob(
        [text.includes("//# sourceURL=") ? text : `${text}\n//# sourceURL=sort-play.js`],
        { type: "application/javascript" }
    );

    const withTimeout = (promise, ms) => new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error("Timeout")), ms);
        promise.then(
            (v) => { clearTimeout(timer); resolve(v); },
            (e) => { clearTimeout(timer); reject(e); }
        );
    });

    const openDb = () => withTimeout(new Promise((resolve, reject) => {
        if (typeof indexedDB === "undefined") return reject(new Error("No IndexedDB"));
        const req = indexedDB.open(DB_NAME, 1);
        req.onupgradeneeded = () => {
            if (!req.result.objectStoreNames.contains(STORE)) req.result.createObjectStore(STORE);
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
        req.onblocked = () => reject(new Error("IDB blocked"));
    }), IDB_TIMEOUT);

    const idbOp = async (mode, fn) => {
        let db;
        try {
            db = await openDb();
            return await withTimeout(new Promise((resolve, reject) => {
                const tx = db.transaction(STORE, mode);
                const req = fn(tx.objectStore(STORE));
                if (mode === "readonly") {
                    req.onsuccess = () => resolve(req.result ?? null);
                    req.onerror = () => reject(req.error);
                } else {
                    tx.oncomplete = () => resolve(true);
                    tx.onerror = () => reject(tx.error);
                    tx.onabort = () => reject(tx.error ?? new Error("IDB aborted"));
                }
            }), IDB_TIMEOUT);
        } catch {
            return mode === "readonly" ? null : false;
        } finally {
            try { db?.close(); } catch {}
        }
    };

    const readCache = () => idbOp("readonly", (s) => s.get(CACHE_KEY));
    const writeCache = (rec) => idbOp("readwrite", (s) => s.put({ version: rec.version, blob: rec.blob, ts: Date.now() }, CACHE_KEY));
    const clearCache = () => idbOp("readwrite", (s) => s.delete(CACHE_KEY));

    const fetchWithTimeout = async (url, options, timeoutMs) => {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);
        try {
            return await fetch(url, { ...options, signal: controller.signal });
        } finally {
            clearTimeout(timer);
        }
    };

    const executeBlob = async (blob) => {
        const url = URL.createObjectURL(blob);
        try {
            await import(url);
        } finally {
            URL.revokeObjectURL(url);
        }
    };

    const isReloadNav = () => {
        try {
            return performance.getEntriesByType?.("navigation")?.[0]?.type === "reload";
        } catch {
            return false;
        }
    };

    const checkRemote = async () => {
        const bucket = isReloadNav() ? Date.now() : Math.floor(Date.now() / 60_000);
        const res = await fetchWithTimeout(
            `${RAW_URL}?t=${bucket}`,
            { headers: { Range: `bytes=0-${RANGE_BYTES}` }, cache: "no-store" },
            CHECK_TIMEOUT
        );
        if (!res.ok) return null;
        const text = await res.text();
        const version = parseVersion(text);
        if (!version) return null;
        return { version, fullText: res.status === 200 && isValidScript(text) ? text : null };
    };

    const fetchFullScript = async (versionHint) => {
        const url = versionHint
            ? `${RAW_URL}?v=${encodeURIComponent(versionHint)}`
            : `${RAW_URL}?t=${Date.now()}`;
        const res = await fetchWithTimeout(url, { cache: "no-store" }, FETCH_TIMEOUT);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const text = await res.text();
        if (!isValidScript(text)) throw new Error("Invalid payload");
        return { version: parseVersion(text), blob: toBlob(text) };
    };

    const runFresh = async (versionHint, preloadedText, fallbackCache) => {
        try {
            const fresh = preloadedText
                ? { version: parseVersion(preloadedText), blob: toBlob(preloadedText) }
                : await fetchFullScript(versionHint);
            await executeBlob(fresh.blob);
            await writeCache(fresh);
            return true;
        } catch (err) {
            console.warn("[Sort-Play Loader] Fresh load failed:", err);
            if (!fallbackCache) return false;
            try {
                await executeBlob(fallbackCache.blob);
                return true;
            } catch (cacheErr) {
                console.warn("[Sort-Play Loader] Cached fallback failed:", cacheErr);
                await clearCache();
                return false;
            }
        }
    };

    const boot = async () => {
        const cached = await readCache();
        if (!isValidCache(cached)) {
            if (cached) await clearCache();
            return runFresh(null, null, null);
        }

        if (navigator.onLine !== false) {
            const remote = await checkRemote().catch(() => null);
            if (remote && remote.version !== cached.version) {
                return runFresh(remote.version, remote.fullText, cached);
            }
        }

        try {
            await executeBlob(cached.blob);
            return true;
        } catch (err) {
            console.warn("[Sort-Play Loader] Cached script failed, re-fetching:", err);
            await clearCache();
            return runFresh(null, null, null);
        }
    };

    globalThis.__SORT_PLAY_LOADER__ = {
        clearCache,
        getCacheInfo: async () => {
            const rec = await readCache();
            return isValidCache(rec) ? { version: rec.version, bytes: rec.blob.size, ts: rec.ts ?? null } : null;
        }
    };

    if (await boot()) return;

    for (const delayMs of RETRY_DELAYS) {
        await new Promise((r) => setTimeout(r, delayMs));
        if (await boot()) return;
    }

    if (typeof window !== "undefined") {
        let retrying = false;
        const onOnline = async () => {
            if (retrying) return;
            retrying = true;
            try {
                if (await boot()) window.removeEventListener("online", onOnline);
            } finally {
                retrying = false;
            }
        };
        window.addEventListener("online", onOnline);
    }
})();
