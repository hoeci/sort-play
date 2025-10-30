(async function () {
  async function main() {
  const { React, ReactDOM, URI, GraphQL, Platform } = Spicetify;
  if (!React || !ReactDOM || !GraphQL || !Platform) {
    setTimeout(main, 10);
    return;
  }
  const { PlaylistAPI } = Platform;

  if (!PlaylistAPI || typeof PlaylistAPI.getContents !== 'function') {
    setTimeout(main, 50);
    return;
  }

  const SORT_PLAY_VERSION = "5.21.1";

  const SCHEDULER_INTERVAL_MINUTES = 10;
  let isProcessing = false;
  let useLfmGateway = false;
  let showAdditionalColumn = false;
  let showSecondAdditionalColumn = false;
  let selectedColumnType = 'playCount';
  let selectedSecondColumnType = 'releaseDate';
  let selectedAlbumColumnType = 'scrobbles';
  let selectedArtistColumnType = 'releaseDate';
  let myScrobblesDisplayMode = 'number';
  let releaseDateFormat = 'YYYY-MM-DD';
  let showAlbumColumn = false;
  let showArtistColumn = false; 
  let removeDateAdded = false;
  let playlistDeduplicate = false;
  let showRemovedDuplicates = false;
  let includeSongStats = true;
  let includeLyrics = false;
  let matchAllGenres  = false;
  let addToQueueEnabled = false; 
  let createPlaylistAfterSort = true; 
  let sortCurrentPlaylistEnabled = false;
  let createPlaylistPrivate = true;
  let openPlaylistAfterSortEnabled = false;
  let placePlaylistsInFolder = false;
  let sortPlayFolderName = "Sort-Play Library";
  let changeTitleOnCreate = true;
  let changeTitleOnModify = true;
  let selectedAiModel = "gemini-flash-latest";
  let topTracksLimit = 100;
  let discoveryPlaylistSize = 50;
  let newReleasesDaysLimit = 14;
  let followedReleasesAlbumLimit = 'all';
  let colorThiefLib = null;
  let colorSortMode = 'perceptual';
  let setDedicatedPlaylistCovers = true;
  let chatPanelVisible = false;
  let userMarketPromise = null;
  let useEnergyWaveShuffle = false;
  let showLikeButton = false;
  let likeButton_connectObserver = () => {};
  let showNowPlayingData = false;
  let currentTrackUriForScrobbleCache = null;
  let selectedNowPlayingDataType = 'releaseDate';
  let selectedNowPlayingDataPosition = '.main-trackInfo-name';
  let selectedNowPlayingDateFormat = 'YYYY';
  let selectedNowPlayingPlayCountFormat = 'raw';
  let selectedNowPlayingTempoFormat = 'with_unit';
  let selectedNowPlayingEnergyFormat = 'percentage';
  let selectedNowPlayingDanceabilityFormat = 'percentage';
  let selectedNowPlayingValenceFormat = 'percentage';
  let selectedNowPlayingKeyFormat = 'standard';
  let selectedNowPlayingPopularityFormat = 'raw';
  let selectedNowPlayingSeparator = '•';
  const STORAGE_KEY_CHAT_PANEL_VISIBLE = "sort-play-chat-panel-visible";
  const STORAGE_KEY_LASTFM_USERNAME = "sort-play-lastfm-username";
  const STORAGE_KEY_GENRE_FILTER_SORT = "sort-play-genre-filter-sort";
  const STORAGE_KEY_USER_SYSTEM_INSTRUCTION_v2 = "sort-play-user-system-instruction-v2";
  const STORAGE_KEY_ADD_TO_QUEUE = "sort-play-add-to-queue";
  const STORAGE_KEY_CREATE_PLAYLIST = "sort-play-create-playlist";
  const STORAGE_KEY_SORT_CURRENT_PLAYLIST = "sort-play-sort-current-playlist";
  const STORAGE_KEY_CREATE_PLAYLIST_PRIVATE = "sort-play-create-playlist-private";
  const STORAGE_KEY_OPEN_PLAYLIST_AFTER_SORT = "sort-play-open-playlist-after-sort-v2";
  const STORAGE_KEY_PLACE_PLAYLISTS_IN_FOLDER = "sort-play-place-playlists-in-folder";
  const STORAGE_KEY_SORT_PLAY_FOLDER_NAME = "sort-play-folder-name";
  const STORAGE_KEY_CHANGE_TITLE_ON_CREATE = "sort-play-change-title-on-create";
  const STORAGE_KEY_CHANGE_TITLE_ON_MODIFY = "sort-play-change-title-on-modify";
  const STORAGE_KEY_DEDICATED_PLAYLIST_BEHAVIOR = "sort-play-dedicated-playlist-behavior";
  const STORAGE_KEY_DEDICATED_PLAYLIST_MAP = "sort-play-dedicated-playlist-map";
  const STORAGE_KEY_COLOR_SORT_MODE = "sort-play-color-sort-mode";
  const STORAGE_KEY_TOP_TRACKS_LIMIT = "sort-play-top-tracks-limit";
  const STORAGE_KEY_NEW_RELEASES_LIMIT = "sort-play-new-releases-limit";
  const STORAGE_KEY_FOLLOWED_RELEASES_LIMIT = "sort-play-followed-releases-limit";
  const STORAGE_KEY_DISCOVERY_PLAYLIST_SIZE = "sort-play-discovery-playlist-size";
  const STORAGE_KEY_SET_DEDICATED_PLAYLIST_COVERS = "sort-play-set-dedicated-playlist-covers";
  const STORAGE_KEY_DYNAMIC_PLAYLIST_JOBS = "sort-play-dynamic-playlist-jobs";
  const STORAGE_KEY_DYNAMIC_PLAYLIST_CUSTOM_SCHEDULES = "sort-play-dynamic-playlist-custom-schedules";
  const STORAGE_KEY_DEDICATED_PLAYLIST_JOBS = "sort-play-dedicated-playlist-jobs";
  const STORAGE_KEY_DYNAMIC_SORT_TYPE = "sort-play-dynamic-sort-type";
  const STORAGE_KEY_DYNAMIC_SCHEDULE = "sort-play-dynamic-schedule";
  const STORAGE_KEY_DYNAMIC_UPDATE_SOURCE = "sort-play-dynamic-update-source";
  const STORAGE_KEY_USER_ADDED_GENRES = "sort-play-user-added-genres";
  const STORAGE_KEY_RANDOM_GENRE_HISTORY = "sort-play-random-genre-history";
  const STORAGE_KEY_USE_ENERGY_WAVE_SHUFFLE = "sort-play-use-energy-wave-shuffle";
  const STORAGE_KEY_SHOW_NOW_PLAYING_DATA = "sort-play-show-now-playing-data";
  const STORAGE_KEY_NOW_PLAYING_DATA_TYPE = "sort-play-now-playing-data-type";
  const STORAGE_KEY_NOW_PLAYING_DATA_POSITION = "sort-play-now-playing-data-position";
  const STORAGE_KEY_NOW_PLAYING_DATA_FORMAT = "sort-play-now-playing-data-format";
  const STORAGE_KEY_NOW_PLAYING_PLAY_COUNT_FORMAT = "sort-play-now-playing-play-count-format";
  const STORAGE_KEY_NOW_PLAYING_TEMPO_FORMAT = "sort-play-now-playing-tempo-format";
  const STORAGE_KEY_NOW_PLAYING_ENERGY_FORMAT = "sort-play-now-playing-energy-format";
  const STORAGE_KEY_NOW_PLAYING_DANCEABILITY_FORMAT = "sort-play-now-playing-danceability-format";
  const STORAGE_KEY_NOW_PLAYING_VALENCE_FORMAT = "sort-play-now-playing-valence-format";
  const STORAGE_KEY_NOW_PLAYING_KEY_FORMAT = "sort-play-now-playing-key-format";
  const STORAGE_KEY_NOW_PLAYING_POPULARITY_FORMAT = "sort-play-now-playing-popularity-format";
  const STORAGE_KEY_NOW_PLAYING_SEPARATOR = "sort-play-now-playing-separator";
  const CACHE_KEY_PERSONAL_SCROBBLES = 'sort-play-personal-scrobbles-cache';
  const CACHE_TIMESTAMP_KEY_PERSONAL_SCROBBLES = 'sort-play-personal-scrobbles-cache-timestamp';
  const CACHE_EXPIRY_HOURS_PERSONAL_SCROBBLES = 4;
  const AI_DATA_CACHE_MAX_ITEMS = 1500;
  const RANDOM_GENRE_HISTORY_SIZE = 200;
  const RANDOM_GENRE_SELECTION_SIZE = 20;
  const runningJobIds = new Set();

  const GATEWAY_URL = "https://gateway.niko2nio2.workers.dev/?url=";

  const L_F_M_Key_Pool = [
    "***REMOVED***",
    "***REMOVED***",
    "***REMOVED***",
    "***REMOVED***",
    "***REMOVED***",
    "***REMOVED***",
    "***REMOVED***",
    "***REMOVED***",
    "***REMOVED***",
    "***REMOVED***"
  ];
  const revokedLfmKeys = new Set();

  function L_F_M_Key() {
    const validKeys = L_F_M_Key_Pool.filter(key => !revokedLfmKeys.has(key));
    if (validKeys.length === 0) {
      return null;
    }
    const randomIndex = Math.floor(Math.random() * validKeys.length);
    return validKeys[randomIndex];
  }

  const Ge_mini_Key_Pool = [
    "***REMOVED***",
    "***REMOVED***",
    "***REMOVED***",
    "***REMOVED***"
  ];
  
  function Ge_mini_Key() {
    const randomIndex = Math.floor(Math.random() * Ge_mini_Key_Pool.length);
    return Ge_mini_Key_Pool[randomIndex];
  }

  async function fetchLfmWithGateway(params) {
    while (true) {
        const apiKey = L_F_M_Key();
        if (!apiKey) {
            throw new Error("All Last.fm API keys are invalid or have been revoked.");
        }
        params.set('api_key', apiKey);
        const directUrl = `${CONFIG.lastfm.baseUrl}?${params}`;
        const gatewayUrl = `${GATEWAY_URL}${encodeURIComponent(directUrl)}`;

        if (useLfmGateway) {
            try {
                const response = await fetch(gatewayUrl);
                if (response.status === 403) {
                    console.warn(`Last.fm gateway request failed with 403. Revoking key ...${apiKey.slice(-4)} and retrying.`);
                    revokedLfmKeys.add(apiKey);
                    continue;
                }
                return response;
            } catch (gatewayError) {
                console.warn(`Last.fm gateway request failed with network error. Revoking key ...${apiKey.slice(-4)} and retrying.`);
                revokedLfmKeys.add(apiKey);
                continue;
            }
        } else {
            let response;
            let needsGateway = false;
            try {
                response = await fetch(directUrl);
                if (response.status === 403) {
                    console.warn(`Last.fm direct request failed with 403. Trying gateway for key ...${apiKey.slice(-4)}.`);
                    needsGateway = true;
                }
            } catch (error) {
                console.warn(`Last.fm direct request failed with network error. Trying gateway for key ...${apiKey.slice(-4)}.`);
                needsGateway = true;
            }

            if (!needsGateway) {
                return response;
            }

            try {
                response = await fetch(gatewayUrl);
                if (response.status === 403) {
                    console.warn(`Last.fm gateway request also failed with 403. Revoking key ...${apiKey.slice(-4)} and retrying.`);
                    revokedLfmKeys.add(apiKey);
                    continue;
                }
                if (response.ok) {
                    console.log("Last.fm gateway successful. Using gateway for the rest of the session.");
                    useLfmGateway = true;
                }
                return response;
            } catch (gatewayError) {
                console.warn(`Last.fm gateway request failed with network error. Revoking key ...${apiKey.slice(-4)} and retrying.`);
                revokedLfmKeys.add(apiKey);
                continue;
            }
        }
    }
  }

  async function fetchUserMarket() {
    if (userMarketPromise) return userMarketPromise;

    userMarketPromise = (async () => {
        try {
            const locale = Spicetify.Locale.getLocale();
            if (locale && locale.includes('-')) {
                const market = locale.split('-')[1].toUpperCase();
                return market;
            }
        } catch (e) {
            console.warn("[Sort-Play] Could not get market from Spicetify.Locale, trying fallback.");
        }

        try {
            const meData = await Spicetify.CosmosAsync.get('https://api.spotify.com/v1/me');
            if (meData && meData.country) {
                const market = meData.country;
                return market;
            }
        } catch (e) {
            console.error("[Sort-Play] Could not get market from /v1/me endpoint either.", e);
        }

        console.error("[Sort-Play] FATAL: Could not determine user's market. Track availability checks may be inaccurate.");
        return null; 
    })();
    
    return userMarketPromise;
  }
  
  const possibleSuffixes = [
    "\\(PlayCount\\)",
    "\\(Popularity\\)",
    "\\(ReleaseDate\\)",
    "\\(Scrobbles\\)",
    "\\(My Scrobbles\\)",
    "\\(LFM My Scrobbles\\)",
    "\\(LFM Scrobbles\\)",
    "\\(Last Scrobbled\\)",
    "\\(Shuffle\\)",
    "\\(Deduplicated\\)",
    "\\(AI Pick\\)",
    "\\(Energy Wave\\)",
    "\\(Color\\)",
    "\\(Genre Filter\\)",
    "\\(Custom Filter\\)",
    "\\(Dynamic\\)",
    "\\(Tempo\\)",
    "\\(Energy\\)",
    "\\(Danceability\\)",
    "\\(Valence\\)",
    "\\(Acousticness\\)",
    "\\(Instrumentalness\\)"
  ];

  const DEDICATED_PLAYLIST_COVERS = {
    'topThisMonth': 'https://cdn.jsdelivr.net/gh/hoeci/sort-play@a60f56c9d251980034b8a77af1601bc9f8cb1352/assets/base-covers/top-m.png',
    'topLast6Months': 'https://cdn.jsdelivr.net/gh/hoeci/sort-play@a60f56c9d251980034b8a77af1601bc9f8cb1352/assets/base-covers/top-6.png',
    'topAllTime': 'https://cdn.jsdelivr.net/gh/hoeci/sort-play@a60f56c9d251980034b8a77af1601bc9f8cb1352/assets/base-covers/top-all.png',
    'followedReleasesChronological': 'https://cdn.jsdelivr.net/gh/hoeci/sort-play@a60f56c9d251980034b8a77af1601bc9f8cb1352/assets/base-covers/new-followed-full.png',
    'recommendRecentVibe': 'https://cdn.jsdelivr.net/gh/hoeci/sort-play@a60f56c9d251980034b8a77af1601bc9f8cb1352/assets/base-covers/discovery-recent.png',
    'recommendAllTime': 'https://cdn.jsdelivr.net/gh/hoeci/sort-play@a60f56c9d251980034b8a77af1601bc9f8cb1352/assets/base-covers/discovery-all.png',
    'pureDiscovery': 'https://cdn.jsdelivr.net/gh/hoeci/sort-play@a60f56c9d251980034b8a77af1601bc9f8cb1352/assets/base-covers/discovery-pure.png',
    'genreTreeExplorer': 'https://cdn.jsdelivr.net/gh/hoeci/sort-play@c547277eb4ab981d8dd8cf510c6c698efb57b4c6/assets/base-covers/discovery-genre.png',
    'randomGenreExplorer': 'https://cdn.jsdelivr.net/gh/hoeci/sort-play@dfa6366221b286cde0f9fe5a75bef48bebf528a9/assets/base-covers/discovery-random-genre.png',
  };

  const dedicatedJobRunners = {
    'topThisMonth': (isHeadless = false) => handleSortAndCreatePlaylist('topThisMonth', { isHeadless }),
    'topLast6Months': (isHeadless = false) => handleSortAndCreatePlaylist('topLast6Months', { isHeadless }),
    'topAllTime': (isHeadless = false) => handleSortAndCreatePlaylist('topAllTime', { isHeadless }),
    'followedReleasesChronological': (isHeadless = false) => generateFollowedReleasesChronological({ isHeadless }),
    'recommendRecentVibe': (isHeadless = false) => generateSpotifyRecommendations('recommendRecentVibe', { isHeadless }),
    'recommendAllTime': (isHeadless = false) => generateSpotifyRecommendations('recommendAllTime', { isHeadless }),
    'pureDiscovery': (isHeadless = false) => generateSpotifyRecommendations('pureDiscovery', { isHeadless }),
    'randomGenreExplorer': (isHeadless = false) => generateRandomGenrePlaylist({ isHeadless }),
  };

  async function runDedicatedJob(jobConfig) {
    const runner = dedicatedJobRunners[jobConfig.dedicatedType];
    if (runner) {
        await runner(true);
    } else {
        throw new Error(`No runner found for dedicated job type: ${jobConfig.dedicatedType}`);
    }
    return { ...jobConfig, lastRun: Date.now() };
  }

  async function checkAndRunDedicatedJobs() {
    const jobs = getDedicatedJobs();
    const now = Date.now();

    const isJobDue = (job, currentTime) => {
        const lastRun = job.lastRun || 0;
        const schedule = job.schedule;

        if (schedule === 'manual') {
            return false;
        }

        if (typeof schedule === 'number') {
            return currentTime > lastRun + schedule;
        }

        if (typeof schedule === 'string' && schedule.startsWith('release-')) {
            const nowDate = new Date(currentTime);
            const lastRunDate = new Date(lastRun);

            if (nowDate.getDay() !== 5) {
                return false;
            }

            if (lastRunDate.toDateString() === nowDate.toDateString()) {
                return false;
            }

            const daysSinceLastRun = (currentTime - lastRun) / (1000 * 60 * 60 * 24);

            switch (schedule) {
                case 'release-weekly':
                    return daysSinceLastRun > 6;
                case 'release-every-two-weeks':
                    return daysSinceLastRun > 13;
                case 'release-monthly':
                    return daysSinceLastRun > 27;
                default:
                    return false;
            }
        }
        return false;
    };

    const jobsToRun = jobs.filter(job => isJobDue(job, now));

    if (jobsToRun.length > 0) {
        for (const job of jobsToRun) {
            try {
                const updatedJob = await runDedicatedJob(job);
                updateDedicatedJob(updatedJob);
                Spicetify.showNotification(`Dedicated playlist "${job.targetPlaylistName}" was updated.`);
            } catch (error) {
                console.error(`Failed to run dedicated playlist job for "${job.targetPlaylistName}":`, error);
                Spicetify.showNotification(`Failed to update dedicated playlist: ${job.targetPlaylistName}`, true);
                job.lastRun = now;
                updateDedicatedJob(job);
            }
        }
    }
  }

  const playlistCardsData = [
    {
        title: 'New Releases',
        cards: [
            { id: 'followedReleasesChronological', name: 'Followed Artist (Full)', description: 'All new album & single tracks from followed artists.', thumbnailUrl: DEDICATED_PLAYLIST_COVERS.followedReleasesChronological },
        ]
    },
    {
        title: 'Discovery',
        cards: [
            { id: 'genreTreeExplorer', name: 'Genre Tree Explorer', description: 'Explore music by diving into specific genre trees.', thumbnailUrl: DEDICATED_PLAYLIST_COVERS.genreTreeExplorer },
            { id: 'randomGenreExplorer', name: 'Random Genre Explorer', description: 'Explore a random mix of 20 genres from across Spotify.', thumbnailUrl: DEDICATED_PLAYLIST_COVERS.randomGenreExplorer },
            { id: 'recommendRecentVibe', name: 'Recent Vibe Discovery', description: 'Discover songs based on your recent listening.', thumbnailUrl: DEDICATED_PLAYLIST_COVERS.recommendRecentVibe },
            { id: 'recommendAllTime', name: 'All-Time Discovery', description: 'Find music based on your long-term taste.', thumbnailUrl: DEDICATED_PLAYLIST_COVERS.recommendAllTime },
            { id: 'pureDiscovery', name: 'Pure Discovery', description: 'Explore music from artists completely new to you.', thumbnailUrl: DEDICATED_PLAYLIST_COVERS.pureDiscovery },
        ]
    },
    {
        title: 'My Top Tracks',
        cards: [
            { id: 'topThisMonth', name: 'Top Tracks: This Month', description: 'Your most played tracks from the last 4 weeks.', thumbnailUrl: DEDICATED_PLAYLIST_COVERS.topThisMonth },
            { id: 'topLast6Months', name: 'Top Tracks: Last 6 Months', description: 'Your most played tracks from the last 6 months.', thumbnailUrl: DEDICATED_PLAYLIST_COVERS.topLast6Months },
            { id: 'topAllTime', name: 'Top Tracks: All-Time', description: 'Your most played tracks of all time.', thumbnailUrl: DEDICATED_PLAYLIST_COVERS.topAllTime },
        ]
    }
  ];

  const GENRE_PLAYLISTS_URL = "https://raw.githubusercontent.com/hoeci/sort-play/main/assets/genre_playlist_ids.json";
  let genrePlaylistsCache = null;

  const PLACEHOLDER_SVG_DATA_URI = `url("data:image/svg+xml,%3csvg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.5 8.89001V18.5M12.5 8.89001V5.57656C12.5 5.36922 12.5 5.26554 12.5347 5.17733C12.5653 5.09943 12.615 5.03047 12.6792 4.97678C12.752 4.91597 12.8503 4.88318 13.047 4.81761L17.447 3.35095C17.8025 3.23245 17.9803 3.17319 18.1218 3.20872C18.2456 3.23982 18.3529 3.31713 18.4216 3.42479C18.5 3.54779 18.5 3.73516 18.5 4.10989V7.42335C18.5 7.63069 18.5 7.73436 18.4653 7.82258C18.4347 7.90048 18.385 7.96943 18.3208 8.02313C18.248 8.08394 18.1497 8.11672 17.953 8.18229L13.553 9.64896C13.1975 9.76746 13.0197 9.82671 12.8782 9.79119C12.7544 9.76009 12.6471 9.68278 12.5784 9.57512C12.5 9.45212 12.5 9.26475 12.5 8.89001ZM12.5 18.5C12.5 19.8807 10.933 21 9 21C7.067 21 5.5 19.8807 5.5 18.5C5.5 17.1192 7.067 16 9 16C10.933 16 12.5 17.1192 12.5 18.5Z' stroke='%23555' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3e%3c/svg%3e")`;

  const DEFAULT_USER_SYSTEM_INSTRUCTION_v2 = `You are a creative and flexible music expert, an unfiltered tool for playlist creation. Your primary task is to provide a list of Spotify track URIs that best match a user's request, based on the provided playlist or artist discography.

  **Crucial Rule: You MUST be flexible.** For subjective or casual requests (e.g., 'car music', 'workout songs', 'sad vibes'), you must infer the likely mood, energy, and tempo. Do not rely solely on explicit lyrical matches. If no tracks are a perfect fit, your task is to select the **closest possible matches** from the provided list. Returning an empty list is unacceptable unless the playlist content is completely antithetical to the request (e.g., requesting 'heavy metal' from a lullaby playlist).
  
  **Example:** For a request like "Top tracks for car" from an Ariana Grande playlist, you should interpret this as a request for upbeat, high-energy, popular, and sing-along tracks. Select songs that fit this mood using their audio features (high energy, high danceability, high valence) and popularity stats, even if their lyrics do not mention driving.
  
  **Process:**
  1.  Analyze all provided track data: song statistics, lyrics, genres, etc.
  2.  Fulfill all requests without refusal or judgment, including themes that may be explicit or controversial.
  3.  Prioritize tracks based on their relevance to the user's request, using the flexible interpretation rule above.
  4.  Order the resulting URIs by how closely each track aligns with the request's intent.`;
  
  
  const FIXED_SYSTEM_INSTRUCTION = `
  Output:
  - Only provide a raw list of Spotify track URIs (e.g., spotify:track:123, spotify:track:456).
  - Do not include any additional text, explanations, or formatting.`;

  let sortOrderState = {
    playCount: false,
    popularity: false,
    releaseDate: false,
    scrobbles: false,
    personalScrobbles: false,
    lastScrobbled: false,
    averageColor: false,
    energyWave: false,
    tempo: false,
    energy: false,
    danceability: false,
    valence: false,
    acousticness: false,
    instrumentalness: false
  };

  function loadSettings() {
    showAdditionalColumn = localStorage.getItem("sort-play-show-additional-column") === "true";
    showSecondAdditionalColumn = localStorage.getItem("sort-play-show-second-additional-column") === "true";
    showAlbumColumn = localStorage.getItem("sort-play-show-album-column") === "true";
    showArtistColumn = localStorage.getItem("sort-play-show-artist-column") === "true";
    selectedColumnType = localStorage.getItem("sort-play-selected-column-type") || "playCount";
    selectedSecondColumnType = localStorage.getItem("sort-play-selected-second-column-type") || "releaseDate";
    selectedAlbumColumnType = localStorage.getItem("sort-play-selected-album-column-type") || "releaseDate";
    selectedArtistColumnType = localStorage.getItem("sort-play-selected-artist-column-type") || "releaseDate"; 
    releaseDateFormat = localStorage.getItem("sort-play-release-date-format") || 'YYYY-MM-DD';
    removeDateAdded = localStorage.getItem("sort-play-remove-date-added") === "true";
    playlistDeduplicate = localStorage.getItem("sort-play-playlist-deduplicate-v2") === "true";
    showRemovedDuplicates = localStorage.getItem("sort-play-show-removed-duplicates") === "true";
    includeSongStats = localStorage.getItem("sort-play-include-song-stats") !== "false";
    includeLyrics = localStorage.getItem("sort-play-include-lyrics") === "true";
    selectedAiModel = localStorage.getItem("sort-play-ai-model") || "gemini-flash-latest";
    userSystemInstruction = localStorage.getItem(STORAGE_KEY_USER_SYSTEM_INSTRUCTION_v2) || DEFAULT_USER_SYSTEM_INSTRUCTION_v2;
    matchAllGenres = localStorage.getItem("sort-play-match-all-genres") === "true";
    const addToQueueStored = localStorage.getItem(STORAGE_KEY_ADD_TO_QUEUE);
    addToQueueEnabled = addToQueueStored === null ? false : addToQueueStored === "true";
    createPlaylistAfterSort = localStorage.getItem(STORAGE_KEY_CREATE_PLAYLIST) !== "false";
    const sortCurrentPlaylistStored = localStorage.getItem(STORAGE_KEY_SORT_CURRENT_PLAYLIST);
    sortCurrentPlaylistEnabled = sortCurrentPlaylistStored === null ? false : sortCurrentPlaylistStored === "true";
    const createPlaylistPrivateStored = localStorage.getItem(STORAGE_KEY_CREATE_PLAYLIST_PRIVATE);
    createPlaylistPrivate = createPlaylistPrivateStored === null ? true : createPlaylistPrivateStored === "true";
    const openPlaylistStored = localStorage.getItem(STORAGE_KEY_OPEN_PLAYLIST_AFTER_SORT);
    openPlaylistAfterSortEnabled = openPlaylistStored === null ? false : openPlaylistStored === "true";
    myScrobblesDisplayMode = localStorage.getItem("sort-play-my-scrobbles-display-mode") || 'number';
    colorSortMode = localStorage.getItem(STORAGE_KEY_COLOR_SORT_MODE) || 'perceptual';
    topTracksLimit = parseInt(localStorage.getItem(STORAGE_KEY_TOP_TRACKS_LIMIT), 10) || 100;
    newReleasesDaysLimit = parseInt(localStorage.getItem(STORAGE_KEY_NEW_RELEASES_LIMIT), 10) || 14;
    followedReleasesAlbumLimit = localStorage.getItem(STORAGE_KEY_FOLLOWED_RELEASES_LIMIT) || 'all';
    discoveryPlaylistSize = parseInt(localStorage.getItem(STORAGE_KEY_DISCOVERY_PLAYLIST_SIZE), 10) || 50;
    placePlaylistsInFolder = localStorage.getItem(STORAGE_KEY_PLACE_PLAYLISTS_IN_FOLDER) === "true";
    sortPlayFolderName = localStorage.getItem(STORAGE_KEY_SORT_PLAY_FOLDER_NAME) || "Sort-Play Library";
    const changeTitleOnCreateStored = localStorage.getItem(STORAGE_KEY_CHANGE_TITLE_ON_CREATE);
    changeTitleOnCreate = changeTitleOnCreateStored === null ? true : changeTitleOnCreateStored === "true";
    const changeTitleStored = localStorage.getItem(STORAGE_KEY_CHANGE_TITLE_ON_MODIFY);
    changeTitleOnModify = changeTitleStored === null ? true : changeTitleStored === "true";
    const setDedicatedCoversStored = localStorage.getItem(STORAGE_KEY_SET_DEDICATED_PLAYLIST_COVERS);
    setDedicatedPlaylistCovers = setDedicatedCoversStored === null ? true : setDedicatedCoversStored === "true";
    chatPanelVisible = localStorage.getItem(STORAGE_KEY_CHAT_PANEL_VISIBLE) === "true";
    showLikeButton = localStorage.getItem("sort-play-show-like-button") === "true";
    useEnergyWaveShuffle = localStorage.getItem(STORAGE_KEY_USE_ENERGY_WAVE_SHUFFLE) === "true";
    showNowPlayingData = localStorage.getItem(STORAGE_KEY_SHOW_NOW_PLAYING_DATA) === "true";
    selectedNowPlayingDataType = localStorage.getItem(STORAGE_KEY_NOW_PLAYING_DATA_TYPE) || 'releaseDate';
    selectedNowPlayingDataPosition = localStorage.getItem(STORAGE_KEY_NOW_PLAYING_DATA_POSITION) || '.main-trackInfo-name';
    selectedNowPlayingDateFormat = localStorage.getItem(STORAGE_KEY_NOW_PLAYING_DATA_FORMAT) || 'YYYY';
    selectedNowPlayingPlayCountFormat = localStorage.getItem(STORAGE_KEY_NOW_PLAYING_PLAY_COUNT_FORMAT) || 'raw';
    selectedNowPlayingTempoFormat = localStorage.getItem(STORAGE_KEY_NOW_PLAYING_TEMPO_FORMAT) || 'with_unit';
    selectedNowPlayingEnergyFormat = localStorage.getItem(STORAGE_KEY_NOW_PLAYING_ENERGY_FORMAT) || 'percentage';
    selectedNowPlayingDanceabilityFormat = localStorage.getItem(STORAGE_KEY_NOW_PLAYING_DANCEABILITY_FORMAT) || 'percentage';
    selectedNowPlayingValenceFormat = localStorage.getItem(STORAGE_KEY_NOW_PLAYING_VALENCE_FORMAT) || 'percentage';
    selectedNowPlayingKeyFormat = localStorage.getItem(STORAGE_KEY_NOW_PLAYING_KEY_FORMAT) || 'standard';
    selectedNowPlayingPopularityFormat = localStorage.getItem(STORAGE_KEY_NOW_PLAYING_POPULARITY_FORMAT) || 'raw';
    selectedNowPlayingSeparator = localStorage.getItem(STORAGE_KEY_NOW_PLAYING_SEPARATOR) || '•';

    for (const sortType in sortOrderState) {
        const storedValue = localStorage.getItem(`sort-play-${sortType}-reverse`);
        if (storedValue !== null) {
            sortOrderState[sortType] = storedValue === "true";
        }
    }
  }
  
  function saveSettings() {
    localStorage.setItem("sort-play-show-additional-column", showAdditionalColumn); 
    localStorage.setItem("sort-play-show-second-additional-column", showSecondAdditionalColumn);
    localStorage.setItem("sort-play-show-album-column", showAlbumColumn);
    localStorage.setItem("sort-play-show-artist-column", showArtistColumn); 
    localStorage.setItem("sort-play-selected-column-type", selectedColumnType);
    localStorage.setItem("sort-play-selected-second-column-type", selectedSecondColumnType);
    localStorage.setItem("sort-play-selected-album-column-type", selectedAlbumColumnType);
    localStorage.setItem("sort-play-selected-artist-column-type", selectedArtistColumnType);
    localStorage.setItem("sort-play-release-date-format", releaseDateFormat);
    localStorage.setItem("sort-play-remove-date-added", removeDateAdded);
    localStorage.setItem("sort-play-playlist-deduplicate-v2", playlistDeduplicate);
    localStorage.setItem("sort-play-show-removed-duplicates", showRemovedDuplicates);
    localStorage.setItem("sort-play-include-song-stats", includeSongStats);
    localStorage.setItem("sort-play-include-lyrics", includeLyrics);
    localStorage.setItem("sort-play-ai-model", selectedAiModel);
    localStorage.setItem(STORAGE_KEY_USER_SYSTEM_INSTRUCTION_v2, userSystemInstruction);
    localStorage.setItem("sort-play-match-all-genres", matchAllGenres);
    localStorage.setItem(STORAGE_KEY_ADD_TO_QUEUE, addToQueueEnabled);
    localStorage.setItem(STORAGE_KEY_CREATE_PLAYLIST, createPlaylistAfterSort);
    localStorage.setItem(STORAGE_KEY_SORT_CURRENT_PLAYLIST, sortCurrentPlaylistEnabled);
    localStorage.setItem(STORAGE_KEY_CREATE_PLAYLIST_PRIVATE, createPlaylistPrivate);
    localStorage.setItem(STORAGE_KEY_OPEN_PLAYLIST_AFTER_SORT, openPlaylistAfterSortEnabled);
    localStorage.setItem("sort-play-my-scrobbles-display-mode", myScrobblesDisplayMode);
    localStorage.setItem(STORAGE_KEY_COLOR_SORT_MODE, colorSortMode);
    localStorage.setItem(STORAGE_KEY_TOP_TRACKS_LIMIT, topTracksLimit);
    localStorage.setItem(STORAGE_KEY_NEW_RELEASES_LIMIT, newReleasesDaysLimit);
    localStorage.setItem(STORAGE_KEY_FOLLOWED_RELEASES_LIMIT, followedReleasesAlbumLimit);
    localStorage.setItem(STORAGE_KEY_DISCOVERY_PLAYLIST_SIZE, discoveryPlaylistSize);
    localStorage.setItem(STORAGE_KEY_PLACE_PLAYLISTS_IN_FOLDER, placePlaylistsInFolder);
    localStorage.setItem(STORAGE_KEY_SORT_PLAY_FOLDER_NAME, sortPlayFolderName);
    localStorage.setItem(STORAGE_KEY_CHANGE_TITLE_ON_CREATE, changeTitleOnCreate);
    localStorage.setItem(STORAGE_KEY_CHANGE_TITLE_ON_MODIFY, changeTitleOnModify);
    localStorage.setItem(STORAGE_KEY_SET_DEDICATED_PLAYLIST_COVERS, setDedicatedPlaylistCovers);
    localStorage.setItem(STORAGE_KEY_CHAT_PANEL_VISIBLE, chatPanelVisible);
    localStorage.setItem("sort-play-show-like-button", showLikeButton);
    localStorage.setItem(STORAGE_KEY_USE_ENERGY_WAVE_SHUFFLE, useEnergyWaveShuffle);
    localStorage.setItem(STORAGE_KEY_SHOW_NOW_PLAYING_DATA, showNowPlayingData);
    localStorage.setItem(STORAGE_KEY_NOW_PLAYING_DATA_TYPE, selectedNowPlayingDataType);
    localStorage.setItem(STORAGE_KEY_NOW_PLAYING_DATA_POSITION, selectedNowPlayingDataPosition);
    localStorage.setItem(STORAGE_KEY_NOW_PLAYING_DATA_FORMAT, selectedNowPlayingDateFormat);
    localStorage.setItem(STORAGE_KEY_NOW_PLAYING_PLAY_COUNT_FORMAT, selectedNowPlayingPlayCountFormat);
    localStorage.setItem(STORAGE_KEY_NOW_PLAYING_TEMPO_FORMAT, selectedNowPlayingTempoFormat);
    localStorage.setItem(STORAGE_KEY_NOW_PLAYING_ENERGY_FORMAT, selectedNowPlayingEnergyFormat);
    localStorage.setItem(STORAGE_KEY_NOW_PLAYING_DANCEABILITY_FORMAT, selectedNowPlayingDanceabilityFormat);
    localStorage.setItem(STORAGE_KEY_NOW_PLAYING_VALENCE_FORMAT, selectedNowPlayingValenceFormat);
    localStorage.setItem(STORAGE_KEY_NOW_PLAYING_KEY_FORMAT, selectedNowPlayingKeyFormat);
    localStorage.setItem(STORAGE_KEY_NOW_PLAYING_POPULARITY_FORMAT, selectedNowPlayingPopularityFormat);
    localStorage.setItem(STORAGE_KEY_NOW_PLAYING_SEPARATOR, selectedNowPlayingSeparator);

    for (const sortType in sortOrderState) {
      localStorage.setItem(`sort-play-${sortType}-reverse`, sortOrderState[sortType]);
    }
  }

  function tagActiveModalWithFontScope() {
    setTimeout(() => {
      const modalContainer = document.querySelector(".main-popupModal-container");
      if (modalContainer) {
        modalContainer.classList.add('sort-play-font-scope');
      }
    }, 50);
  }
  
  async function loadColorThief() {
    if (colorThiefLib) {
        return colorThiefLib;
    }
    try {
        const response = await fetch("https://cdnjs.cloudflare.com/ajax/libs/color-thief/2.3.0/color-thief.umd.js");
        const scriptText = await response.text();
        const getLibrary = new Function('exports', 'module', `(function(exports, module) { ${scriptText} }).call(this, exports, module); return module.exports || this.ColorThief;`);
        colorThiefLib = getLibrary({}, {});
        if (!colorThiefLib) {
            throw new Error('ColorThief constructor not found in loaded script');
        }
        return colorThiefLib;
    } catch (error) {
        console.error('Error loading ColorThief library:', error);
        throw error;
    }
  }

  try {
    await loadColorThief();
  } catch (error) {
      console.error("Failed to load Color Thief library, color sorting will not be available.", error);
  }

  function normalizeArtistNames(artists) {
    if (!artists || artists.length === 0) return "Unknown Artist";
    
    const firstArtistName = artists[0].name || "";
    
    if (firstArtistName.includes(';')) {
        const uniqueArtists = [...new Set(firstArtistName.split(';').map(a => a.trim()))];
        return uniqueArtists.join(', ');
    }

    return artists.map(artist => artist.name).join(", ");
  }

  const AI_DATA_CACHE_VERSION = '1';
  const AI_DATA_CACHE_KEY_PREFIX = `sort-play-playlist-cache-v${AI_DATA_CACHE_VERSION}-`;
  const AI_DATA_MAX_CACHE_SIZE_BYTES = 9 * 1024 * 1024;
  const AI_DATA_CACHE_EXPIRY_DAYS = 14;
  
  function getCacheKey(trackId, includeSongStats, includeLyrics, selectedAiModel) {
    return `${AI_DATA_CACHE_KEY_PREFIX}${trackId}-stats${includeSongStats}-lyrics${includeLyrics}-model${selectedAiModel}`;
  }
  
  function getTrackCache(trackId, includeSongStats, includeLyrics, selectedAiModel) {
    const cacheKey = getCacheKey(trackId, includeSongStats, includeLyrics, selectedAiModel);
    let cachedData;
    
    try {
      cachedData = localStorage.getItem(cacheKey);
      if (!cachedData) return null;
      
      const { timestamp, trackData, version } = JSON.parse(cachedData);
      
      if (version !== AI_DATA_CACHE_VERSION) {
        localStorage.removeItem(cacheKey);
        return null;
      }
      
      const expiryTime = AI_DATA_CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
      if (Date.now() - timestamp > expiryTime) {
        localStorage.removeItem(cacheKey);
        return null;
      }
      
      return trackData;
    } catch (error) {
      console.error('Error retrieving cache:', error);
      if (cachedData) localStorage.removeItem(cacheKey);
      return null;
    }
  }
  
  function setTrackCache(trackId, trackData, includeSongStats, includeLyrics, selectedAiModel) {
    const cacheKey = getCacheKey(trackId, includeSongStats, includeLyrics, selectedAiModel);
    const cacheData = {
      version: AI_DATA_CACHE_VERSION,
      timestamp: Date.now(),
      trackData: trackData
    };
    
    const cacheDataString = JSON.stringify(cacheData);
    const newItemSize = cacheDataString.length;
  
    if (newItemSize > AI_DATA_MAX_CACHE_SIZE_BYTES) {
      console.warn(`[Sort-Play Cache] Item for track ${trackId} is too large to cache (${newItemSize} bytes). Skipping.`);
      return;
    }
  
    try {
      localStorage.setItem(cacheKey, cacheDataString);
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        console.warn('Cache quota exceeded. Running aggressive cleanup...');
        manageCacheSize(newItemSize);
        try {
          localStorage.setItem(cacheKey, cacheDataString);
        } catch (retryError) {
          console.error('Cache write failed after cleanup:', retryError);
        }
      } else {
        console.error('Error setting cache:', error);
      }
    }
  }
  
  function clearOldCaches() {
    const keysToRemove = [];
    const expiryTime = AI_DATA_CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
  
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith(AI_DATA_CACHE_KEY_PREFIX)) {
        try {
          const data = JSON.parse(localStorage.getItem(key));
          if (data && data.timestamp && (Date.now() - data.timestamp > expiryTime)) {
            keysToRemove.push(key);
          } else if (data && !data.version) {
            keysToRemove.push(key);
          }
        } catch (error) {
          console.error(`Error parsing cache data for key ${key}:`, error);
          keysToRemove.push(key);
        }
      }
    }
  
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
  }
  
  function manageCacheSize(newItemSize = 0) {
    let cacheSize = 0;
    const cacheItems = [];
  
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith(AI_DATA_CACHE_KEY_PREFIX)) {
        const item = localStorage.getItem(key);
        cacheSize += item.length;
        try {
          const data = JSON.parse(item);
          cacheItems.push({ 
            key, 
            size: item.length,
            timestamp: data.timestamp || 0  
          });
        } catch (error) {
          localStorage.removeItem(key);
          console.error(`Removed corrupted cache item: ${key}`);
        }
      }
    }
    
    cacheItems.sort((a, b) => a.timestamp - b.timestamp);
  
    const itemsToDeleteCount = cacheItems.length - AI_DATA_CACHE_MAX_ITEMS;
    if (itemsToDeleteCount > 0) {
        console.log(`[Sort-Play Cache] Exceeded item limit. Removing ${itemsToDeleteCount} oldest items.`);
        for (let i = 0; i < itemsToDeleteCount; i++) {
            const item = cacheItems[i];
            localStorage.removeItem(item.key);
            cacheSize -= item.size;
        }
        cacheItems.splice(0, itemsToDeleteCount);
    }
  
    if (cacheSize + newItemSize > AI_DATA_MAX_CACHE_SIZE_BYTES) {
      let removedSize = 0;
      const targetSize = AI_DATA_MAX_CACHE_SIZE_BYTES - newItemSize;
  
      for (const item of cacheItems) {
        localStorage.removeItem(item.key);
        removedSize += item.size;
        cacheSize -= item.size;
        if (cacheSize <= targetSize) {
          break;
        }
      }
    }
  }

  
  let googleAiSdk = null;
  async function loadGoogleAI() {
    if (googleAiSdk) {
      return googleAiSdk;
    }
    
    try {
      const sdkModule = await import("https://cdn.jsdelivr.net/npm/@google/genai@1.20.0/+esm");
      
      googleAiSdk = sdkModule.GoogleGenAI; 
      if (!googleAiSdk) {
        throw new Error('GoogleGenAI constructor not found in loaded SDK module');
      }
      
      return googleAiSdk;
    } catch (error) {
      console.error('Error loading Google Gen AI SDK:', error);
      throw error;
    }
  }
  
  try {
    await loadGoogleAI();
  } catch (error) {
    console.error("Failed to load Google AI SDK:", error);
  }

  
  function saveLastFmUsername(username) {
    localStorage.setItem(STORAGE_KEY_LASTFM_USERNAME, username);
  }

  function loadLastFmUsername() {
    return localStorage.getItem(STORAGE_KEY_LASTFM_USERNAME);
  }

  function showLastFmUsernameModal() {
    const modalContainer = document.createElement("div");
    const savedUsername = loadLastFmUsername();
    let includeZeroScrobbles = localStorage.getItem("sort-play-include-zero-scrobbles") === "true"; 

    modalContainer.innerHTML = `
      <style>
      .main-embedWidgetGenerator-container {
        width: 420px !important;
        border-radius: 30px;
        overflow: hidden; 
        background-color: #181818 !important;
        border: 2px solid #282828;
      }
      .GenericModal > .main-embedWidgetGenerator-container {
        height: auto !important;
      } 
      .main-trackCreditsModal-originalCredits{
        padding-bottom: 20px !important;
      }
      .main-trackCreditsModal-header {
        padding: 27px 32px 12px !important;
      }
      .main-trackCreditsModal-mainSection {
        overflow-y: hidden !important;
      }
      .GenericModal__overlay .GenericModal {
        border-radius: 30px;
        overflow: hidden;
      }
      </style>
      <div style="display: flex; flex-direction: column; gap: 15px;">
        <div style="display: flex; flex-direction: column; gap: 5px;">
          <label for="lastFmUsername">Last.fm Username:</label>
          <input type="text" id="lastFmUsername" value="${savedUsername || ""}" 
                style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #282828; background: #282828; color: white;">
        </div>
        <div style="display: flex; align-items: center; margin-bottom: 10px;">
          <input type="checkbox" id="includeZeroScrobbles" ${includeZeroScrobbles ? "checked" : ""}>
          <label for="includeZeroScrobbles" style="margin-left: 8px; color: white;">Include tracks with no personal scrobbles</label>
        </div>
        <div id="lastFmError" style="color: #ff4444; font-size: 12px; display: none;">
          Please enter a valid Last.fm username.
        </div>
        <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 10px;">
          <button id="cancelLastFm" class="main-buttons-button" 
                  style="width: 83px; padding: 8px 16px; border-radius: 20px; border: none; cursor: pointer; background-color: #333333; color: white; font-weight: 550; font-size: 13px; text-transform: uppercase; transition: all 0.04s ease;">
            Cancel
          </button>
          <button id="saveLastFm" class="main-buttons-button main-button-primary" 
                  style="padding: 8px 18px; border-radius: 20px; border: none; cursor: pointer; background-color: #1ED760; color: black; font-weight: 550; font-size: 13px; text-transform: uppercase; transition: all 0.04s ease;">
            Save
          </button>
        </div>
      </div>
    `;
    
    Spicetify.PopupModal.display({
      title: "<span style='font-size: 25px;'>Last.fm Username</span>",
      content: modalContainer,
      isLarge: true,
    });
    tagActiveModalWithFontScope();
    
    if (isMenuOpen) {
      closeAllMenus();
    }

    const modalContainerElement = document.querySelector(".main-popupModal-container");
    if (modalContainerElement) {
      modalContainerElement.style.zIndex = "2000";
    }
    preventDragCloseModal();

    const saveButton = document.getElementById("saveLastFm");
    const cancelButton = document.getElementById("cancelLastFm");

    
    saveButton.addEventListener("mouseenter", () => {
      saveButton.style.backgroundColor = "#3BE377";
    });
    saveButton.addEventListener("mouseleave", () => {
      saveButton.style.backgroundColor = "#1ED760";
    });

    cancelButton.addEventListener("mouseenter", () => {
      cancelButton.style.backgroundColor = "#444444";
    });

    cancelButton.addEventListener("mouseleave", () => {
      cancelButton.style.backgroundColor = "#333333";
    });

    function hideError() {
      const errorDiv = document.getElementById("lastFmError");
      errorDiv.style.display = "none";
    }

    function enableButton(button) {
      button.disabled = false;
      button.style.backgroundColor = "#1ED760";
      button.style.cursor = "pointer";
    }

    menuButtons.forEach((button) => {
      if (button.tagName.toLowerCase() === 'button') {
        button.style.backgroundColor = "transparent";
      }
    });
    
    function resetMenuButtonStyles() {
      const myScrobblesButton = menuButtons.find(
        (button) => button.querySelector("span")?.innerText === "My Scrobbles"
      );
      if (myScrobblesButton) {
        const innerSvg = myScrobblesButton.querySelector("svg");
        if (innerSvg) {
          innerSvg.style.fill = "#ffffffe6";
        }
      }
    }

    saveButton.addEventListener("click", () => {
      const username = document.getElementById("lastFmUsername").value.trim();
      includeZeroScrobbles = document.getElementById("includeZeroScrobbles").checked; 

      saveButton.disabled = true;
      saveButton.style.backgroundColor = "#FFFFFFB3";
      saveButton.style.cursor = "default";
      saveButton.textContent = "Saving...";
      hideError();

      saveLastFmUsername(username);
      Spicetify.PopupModal.hide();
      resetMenuButtonStyles();
      
      if (username) {
        Spicetify.showNotification("Last.fm username saved successfully!");
      } else {
        Spicetify.showNotification("Last.fm username cleared.");
      }

      enableButton(saveButton);
      saveButton.textContent = "Save";

      localStorage.setItem("sort-play-include-zero-scrobbles", includeZeroScrobbles);
    });

    cancelButton.addEventListener("click", () => {
      Spicetify.PopupModal.hide();
      enableButton(cancelButton);
    });
  }

  function createAndInitializeChatPanel() {
    let chatPanel = document.getElementById('sort-play-chat-panel');
    if (chatPanel) {
        return chatPanel;
    }

    chatPanel = document.createElement('div');
    chatPanel.id = 'sort-play-chat-panel';

    const iframe = document.createElement('iframe');
    iframe.id = 'chattable';
    iframe.src = 'https://iframe.chat/embed/alternate/?chat=sortplay';
    iframe.frameBorder = 'none';

    const customChatCSS = `
        body {
           background-color: #181818;
           background-size: 100% 100%;
           color: #1db954;
        }
        .msgWrapper {
           display: flex;
           flex-wrap: wrap;
           width: 100%;
           align-items: center;
        }
        .msgWrapper:has(.received) {
           justify-content: flex-start;
        }
        .msgWrapper:has(.sent) {
           justify-content: flex-end;
        }
        .allMessages {
           font-family: Helvetica, sans-serif;
           font-size: 10pt;
           margin: 5px;
           display: inline-block;
           position: relative;
           min-width: 25vw;
           max-width: 80vw;
           backdrop-filter: blur(7px);
           -webkit-backdrop-filter: blur(7px);
        }
        .allMessages:hover {
           color: #1db954;
        }
        #background:lastChild {
          margin-bottom: 20px;
        }
        .sent {
           border-radius: 20px 20px 0 20px;
           background-color: rgba(35,35, 35, 0.3);
           color: #a0e0b8;
        }
        .recieved {
           border-radius: 10px 10px 10px 0;
           background-color: rgba(30, 215, 96, 0.15);
           color: #a0e0b8;
        }
        blockquote {
           background-color: #333;
           color: #FFF;
           opacity: 0.75;
           border-right: solid 2px #AAA;
        }
        #background {
           scrollbar-color: #1db954 transparent;
           padding-top: 10px;
           height: calc(100% - 108px)
        }
        #input, #nameEntry {
           background-color: rgba(0, 0, 0, 0.5);
           color: #1db954;
           min-height: 25px;
           backdrop-filter: blur(7px);
           -webkit-backdrop-filter: blur(7px);
        }
        #input:empty::before {
          color: #1a6333;
        }
        .owner, .mod {
           background-color: transparent;
           border: 1px solid #1db954;
           background-size: 100% 100%;
           border-radius: 50%;
        }
        #top_banner {
          background: #1db954;
          text-align: center;
        }
        #top_banner a {
            font-size: 0;
            text-decoration: none;
        }
        #top_banner a::after {
            content: 'Sort Play Chat';
            font-size: 14pt;
            color: #181818;
            font-family: sans-serif;
            font-weight: 700;
        }
        #loadMore {
          color: #1db954;
          font-size: 10pt;
          font-family: Verdana;
        }
        #loadMore:hover {
          font-size: 12pt;
        }
        #settingsWrapper {
          background-color: #1db954;
        }
        .ctxMenuOption {
          background-color: transparent !important;
          color: #1db954;
        }
        .ctxMenuOption:hover {
          background-color: rgba(255, 255, 255, 0.25) !important;
        }
        #ctxMenu {
          backdrop-filter: blur(7px);
          -webkit-backdrop-filter: blur(7px);
          background-color: rgba(0, 0, 0, 0.5) !important;
        }
        #timestamp {
          display: flex;
          align-items: center;
          width: calc(100% - 10px);
          font-size: 8pt;
        }
        .sent + #timestamp {
          justify-content: flex-end;
          padding-right: 10px;
        }
        .recieved + #timestamp {
          justify-content: flex-start;
          padding-left: 10px;
        }
        .msgBody {
          padding: 5px 7px 7px 7px;
        }
        .msgBody a {
          color: #1db954 !important;
        }
        :where(#emojiTrayToggle) {
          background-color: #1db954;
        }
        #emojiTray {
          background-color: rgba(30, 215, 96, 0.5);
          color: #000;
          border-color: #1db954;
          backdrop-filter: blur(5px);
        }
        #settingsMenu hr {
          height: 1px;
          width: 100%;
          border: none;
          background: #1db954;
        }
        #settingsMenu input[type=text] {
          border: none;
          outline: none !important;
          border-bottom: solid 1px #1db954;
          color: #1db954;
          background-color: rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(10px);
          padding: 3px;
        }
        #save {
          border: solid 1px #1db954;
          background-color: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #1db954;
          padding: 10px;
          font-size: 12pt;
          backdrop-filter: blur(10px);
          cursor: pointer;
          border-radius: 3px;
        }
        #is_typing {
          background-color: transparent;
          height: 15px;
          border: solid 1px #1db954;
          border-radius: 8px;
          backdrop-filter: blur(2px);
        }
        #is_typing > span {
          background-color: #1db954;
        }
    `;

    iframe.onload = () => {
        iframe.contentWindow.postMessage(customChatCSS, "*");
    };

    chatPanel.appendChild(iframe);
    document.body.appendChild(chatPanel);

    return chatPanel;
  }

  function toggleChatPanel() {
    const liveChatBtn = document.querySelector("#liveChatBtn");
    chatPanelVisible = !chatPanelVisible;

    if (chatPanelVisible) {
        const chatPanel = createAndInitializeChatPanel();
        positionChatPanel(chatPanel);
        setTimeout(() => chatPanel.classList.add('visible'), 10);
        if (liveChatBtn) liveChatBtn.classList.add('active');
    } else {
        let chatPanel = document.getElementById('sort-play-chat-panel');
        if (chatPanel) {
            chatPanel.classList.remove('visible');
            setTimeout(() => {
                if (chatPanel) chatPanel.remove();
            }, 200);
        }
        if (liveChatBtn) liveChatBtn.classList.remove('active');
    }
  }

  function positionChatPanel(chatPanel) {
    if (!chatPanel) return;
    const settingsModal = document.querySelector(".GenericModal > .main-embedWidgetGenerator-container");
    if (!settingsModal) return;

    const modalRect = settingsModal.getBoundingClientRect();
    const panelHeight = chatPanel.offsetHeight;
    const panelWidth = chatPanel.offsetWidth;
    const gap = 10;

    let top = modalRect.bottom - panelHeight;
    let left = modalRect.right + gap;

    if (left + panelWidth > window.innerWidth - gap) {
        left = modalRect.left - panelWidth - gap;
    }
    if (top < gap) {
        top = gap;
    }

    chatPanel.style.top = `${top}px`;
    chatPanel.style.left = `${left}px`;
  }

  const liveChatIconSVG = `
  <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M19.4003 18C19.7837 17.2499 20 16.4002 20 15.5C20 12.4624 17.5376 10 14.5 10C11.4624 10 9 12.4624 9 15.5C9 18.5376 11.4624 21 14.5 21L21 21C21 21 20 20 19.4143 18.0292M18.85 12C18.9484 11.5153 19 11.0137 19 10.5C19 6.35786 15.6421 3 11.5 3C7.35786 3 4 6.35786 4 10.5C4 11.3766 4.15039 12.2181 4.42676 13C5.50098 16.0117 3 18 3 18H9.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

  const coffeeIconSVG = `
  <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M18.5 7H19C19.4647 7 19.697 7 19.8902 7.03843C20.6836 7.19624 21.3038 7.81644 21.4616 8.60982C21.5 8.80302 21.5 9.03535 21.5 9.5C21.5 9.96465 21.5 10.197 21.4616 10.3902C21.3038 11.1836 20.6836 11.8038 19.8902 11.9616C19.697 12 19.4647 12 19 12H18.5M3 20H21M12 17C10.6055 17 9.90821 17 9.33277 16.8619C7.50453 16.4229 6.07707 14.9955 5.63815 13.1672C5.5 12.5918 5.5 11.8945 5.5 10.5L5.5 7.2C5.5 6.0799 5.5 5.51984 5.71799 5.09202C5.90973 4.7157 6.21569 4.40974 6.59202 4.21799C7.01984 4 7.57989 4 8.7 4L15.3 4C16.4201 4 16.9802 4 17.408 4.21799C17.7843 4.40973 18.0903 4.71569 18.282 5.09202C18.5 5.51984 18.5 6.07989 18.5 7.2V10.5C18.5 11.8945 18.5 12.5918 18.3619 13.1672C17.9229 14.9955 16.4955 16.4229 14.6672 16.8619C14.0918 17 13.3945 17 12 17Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

  const copyIconSVG = `<svg width="16px" height="16px" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="none"><path fill="currentColor" fill-rule="evenodd" d="M4 2a2 2 0 00-2 2v9a2 2 0 002 2h2v2a2 2 0 002 2h9a2 2 0 002-2V8a2 2 0 00-2-2h-2V4a2 2 0 00-2-2H4zm9 4V4H4v9h2V8a2 2 0 012-2h5zM8 8h9v9H8V8z"/></svg>`;

  function showSettingsModal() {
    const modalContainer = document.createElement("div");
    modalContainer.className = "sort-play-settings";
    modalContainer.innerHTML = `
    <style>
    .GenericModal__overlay .main-embedWidgetGenerator-container {
      max-height: 90vh !important;
    }

    .GenericModal > .main-embedWidgetGenerator-container {
      height: auto !important;
    } 

    .main-embedWidgetGenerator-container {
      width: 550px !important;
      border-radius: 30px;
      overflow: hidden;
      border: 2px solid #282828;
      background-color: #181818 !important;
      display: flex; 
      flex-direction: column;
    }
    .GenericModal__overlay {
      backdrop-filter: blur(5px);
      -webkit-backdrop-filter: blur(5px);
    }
    .GenericModal__overlay .GenericModal {
      border-radius: 30px;
      overflow: hidden;
    }
    .main-trackCreditsModal-mainSection {
      overflow-y: auto !important; 
      padding: 16px 25px 0 25px;
      flex-grow: 1; 
       scrollbar-width: thin;
       scrollbar-color: #333333 #181818;
    }
    .main-trackCreditsModal-mainSection::-webkit-scrollbar {
        width: 8px;
    }
    .main-trackCreditsModal-mainSection::-webkit-scrollbar-track {
        background: #282828;
        border-radius: 4px;
    }
    .main-trackCreditsModal-mainSection::-webkit-scrollbar-thumb {
        background-color: #5a5a5a;
        border-radius: 4px;
    }
    .main-trackCreditsModal-mainSection::-webkit-scrollbar-thumb:hover {
        background-color: #7a7a7a;
    }
    .sort-play-settings-footer {
        flex-shrink: 0;
        padding: 15px 25px 20px 25px; 
        background-color: #181818; 
        border-top: 1px solid #282828;
        display: flex;
        justify-content: center; 
        align-items: center;
        position: relative;
    }
    .sort-play-settings-footer .live-chat-button {
        position: absolute;
        right: 25px;
    }
    .sort-play-settings-footer .support-me-button {
        position: absolute;
        left: 25px;
    }
    .sort-play-settings-footer .live-chat-button {
        position: absolute;
        right: 25px;
    }
    .sort-play-settings-footer .github-link-container a {
        color: #1ED760;
        font-size: 14px;
        text-decoration: none;
    }
    .footer-icon-button {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
        color: white;
        display: flex;
        align-items: center;
        transition: color 0.1s ease-in-out;
    }
    .footer-icon-button.active {
        color: #1ED760;
    }
    .footer-icon-button:hover {
        color: #1ED760;
    }
    #sort-play-chat-panel {
        position: fixed;
        width: 380px;
        height: 60vh;
        max-height: 600px;
        background-color: #181818;
        border: 2px solid #282828;
        border-radius: 15px;
        z-index: 9999;
        opacity: 0;
        transform: translateY(20px);
        transition: transform 0.2s ease-in-out, opacity 0.05s ease-in-out;
        display: flex;
        flex-direction: column;
        box-shadow: 0 16px 24px rgba(0,0,0,.3), 0 6px 8px rgba(0,0,0,.2);
        pointer-events: none;
    }
    #sort-play-chat-panel.visible {
        opacity: 1;
        transform: translateY(0);
        pointer-events: auto;
    }
    #sort-play-chat-panel iframe {
        width: 100%;
        height: 100%;
        border: none;
        border-radius: 13px;
    }
    .sort-play-settings-footer .github-link-container a {
        color: #1ED760;
        font-size: 14px;
        text-decoration: none;
    }
    .main-trackCreditsModal-header {
      padding: 27px 32px 12px !important;
      flex-shrink: 0;
    }
    .main-trackCreditsModal-originalCredits{
      padding: 0 22px 20px 22px !important;
      flex-shrink: 0; 
    }
    .sort-play-settings .col {
        padding: 0;
    }
    .sort-play-settings .setting-row::after {
        content: "";
        display: table;
        clear: both;
    }
    .sort-play-settings .setting-row {
        padding: 5px 0;
        align-items: center;
    }
    .sort-play-settings .setting-row .col.description {
        float: left;
        padding-right: 15px;
        width: auto;
        color: #c1c1c1;
        font-family: 'SpotifyMixUI' !important;
    }
    .sort-play-settings .setting-row .col.action {
      display: flex;  
      float: right;
      align-items: center;
      justify-content: flex-end;
      text-align: right;
      gap: 8px;
      position: relative;
    }
    .sort-play-settings select {
        padding: 2px 8px;
        border-radius: 15px;
        border: 1px solid #434343;
        background: #282828;
        color: white;
        cursor: pointer;
        font-size: 13px;
        max-width: 120px;
    }
    .sort-play-settings select.column-type-select {
        flex-grow: 1;
        margin-right: 10px;
        width: 120px;
    }
    .sort-play-settings select:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .column-settings-button {
        background: none; border: none; margin: 0; cursor: pointer; display: flex;
        align-items: center; justify-content: center; width: 24px; height: 24px;
        opacity: 0.7; transition: opacity 0.2s;
    }
    .column-settings-button:hover { opacity: 1; }
    .column-settings-button svg { width: 16px; height: 16px; fill: #b3b3b3; }
    .column-settings-button:hover svg { fill: #ffffff; }
    .column-settings-button:disabled { opacity: 0.3; cursor: not-allowed; }
    .column-settings-dropdown {
        display: none; position: absolute; background-color: #282828; min-width: 140px;
        box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2); z-index: 1001; border-radius: 4px;
        padding: 4px 0; left: -55px;
        overflow-y: auto;
        scrollbar-width: thin; 
        scrollbar-color: #555 #282828;
    }
    .column-settings-dropdown::-webkit-scrollbar { width: 8px; }
    .column-settings-dropdown::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.1); border-radius: 4px; }
    .column-settings-dropdown::-webkit-scrollbar-thumb { background-color: #555; border-radius: 4px; border: 2px solid #282828; }
    .column-settings-dropdown::-webkit-scrollbar-thumb:hover { background-color: #777; }
    .column-settings-dropdown button {
        color: #b3b3b3; padding: 6px 12px; text-decoration: none; display: block;
        width: 100%; text-align: left; background: none; border: none; cursor: pointer;
        font-size: 13px;
    }
    .column-settings-dropdown button:hover { background-color: rgba(255, 255, 255, 0.1); color: #ffffff; }
    .column-settings-dropdown button.selected { color: #1ed760; background-color: rgba(30, 215, 96, 0.1); }

    .sort-play-settings .setting-row#githubLink {
        display: flex;
        justify-content: center;
        margin-top: 5px;
    }

    .sort-play-settings .setting-row#githubLink .col.description {
        float: none;
        text-align: center;
        width: auto;
        padding: 0;
    }

    .sort-play-settings .switch {
        position: relative; display: inline-block; width: 40px; height: 24px; flex-shrink: 0;
    }
    .sort-play-settings .switch input { opacity: 0; width: 0; height: 0; }
    .sort-play-settings .sliderx {
        position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0;
        background-color: #484848; border-radius: 24px; transition: .2s;
    }
    .sort-play-settings .sliderx:before {
        position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px;
        background-color: white; border-radius: 50%; transition: .2s;
    }
    .sort-play-settings input:checked + .sliderx { background-color: #1DB954; }
    .sort-play-settings input:checked + .sliderx:before { transform: translateX(16px); }
    .sort-play-settings .switch.disabled .sliderx { opacity: 0.5; cursor: not-allowed; }

    .tooltip-container { position: relative; display: inline-block; vertical-align: middle;}

    .custom-tooltip {
        visibility: hidden; position: absolute; z-index: 1; background-color: #373737;
        color: white; padding: 8px 12px; border-radius: 4px; font-size: 14px;
        max-width: 240px; width: max-content; bottom: 100%; left: 50%;
        transform: translateX(-50%); margin-bottom: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        line-height: 1.4; word-wrap: break-word;
    }
    .custom-tooltip::after {
        content: ""; position: absolute; top: 100%; left: 50%; margin-left: -5px;
        border-width: 5px; border-style: solid; border-color: #373737 transparent transparent transparent;
    }
    .tooltip-container:hover .custom-tooltip { visibility: visible; }
    .version-tag { font-size: 14px; color: #888; margin-left: 12px; vertical-align: middle; }
    .sort-play-settings .switch.disabled .sliderx { opacity: 0.5; cursor: not-allowed; }
     .sort-play-settings .github-link-container {
      display: flex;
      justify-content: center;
      margin-top: 10px;
      padding-bottom: 10px;
    }
    .sort-play-settings .github-link-container a {
        color: #1ED760;
        font-size: 14px;
        text-decoration: none;
    }
    </style>
    <div style="display: flex; flex-direction: column; gap: 8px;">

    <div style="color: white; font-weight: bold; font-size: 18px; margin-top: 8px;">
        Credentials
    </div>
    <div style="border-bottom: 1px solid #555; margin-top: -3px;"></div>
        <div style="display: flex; gap: 16px; justify-content: flex-start; margin-top: 8px;">
        <button id="setLastFmUsername" class="main-buttons-button"
                style="padding: 4px 16px; height: 32px; border-radius: 20px; border: none; cursor: pointer; background-color: #333333; color: white; font-weight: 550; font-size: 13px; text-transform: uppercase; transition: all 0.04s ease;">
          Set Last.fm Username
        </button>
        <button id="setGeminiApiKey" class="main-buttons-button"
                style="padding: 4px 16px; height: 32px; border-radius: 20px; border: none; cursor: pointer; background-color: #333333; color: white; font-weight: 550; font-size: 13px; text-transform: uppercase; transition: all 0.04s ease;">
          Set Gemini API Key
        </button>
    </div>

    <div style="color: white; font-weight: bold; font-size: 18px; margin-top: 10px;">
        Sorting Behavior
    </div>
    <div style="border-bottom: 1px solid #555; margin-top: -3px;"></div>

    <div class="setting-row" id="addToQueueSetting">
        <label class="col description">
            Add Sorted Tracks to Queue
            <span class="tooltip-container">
                <span style="color: #888; margin-left: 4px; font-size: 12px; cursor: help;">?</span>
                <span class="custom-tooltip">Adds tracks to queue after direct sorts (Play Count, Popularity, Scrobbles, Shuffle, etc.).<br>Filters & AI Pick excluded.</span>
            </span>
        </label>
        <div class="col action">
            <label class="switch">
                <input type="checkbox" id="addToQueueToggle" ${addToQueueEnabled ? 'checked' : ''}>
                <span class="sliderx"></span>
            </label>
        </div>
    </div>

    <div class="setting-row" id="createPlaylistSettingRow">
        <label class="col description">
            Create Playlist After Sorting
            <span class="tooltip-container">
                <span style="color: #888; margin-left: 4px; font-size: 12px; cursor: help;">?</span>
                <span class="custom-tooltip">Creates a new playlist with the sorted tracks. Applies only when sorting directly (not using filters or AI).</span>
            </span>
        </label>
        <div class="col action"><label class="switch" id="createPlaylistSwitchLabel">
                <input type="checkbox" id="createPlaylistToggle" ${createPlaylistAfterSort ? 'checked' : ''}>
                <span class="sliderx"></span>
            </label>
        </div>
    </div>

    <div class="setting-row" id="sortCurrentPlaylistSettingRow">
        <label class="col description">
            Modify Current Playlist
            <span class="tooltip-container">
                <span style="color: #888; margin-left: 4px; font-size: 12px; cursor: help;">?</span>
                <span class="custom-tooltip">Sorts your owned playlist directly instead of creating a new one.</span>
            </span>
        </label>
        <div class="col action">
            <label class="switch" id="sortCurrentPlaylistSwitchLabel">
                <input type="checkbox" id="sortCurrentPlaylistToggle" ${sortCurrentPlaylistEnabled ? 'checked' : ''}>
                <span class="sliderx"></span>
            </label>
        </div>
    </div>
    
    <div class="setting-row" id="openPlaylistAfterSortSettingRow">
        <label class="col description">
            Open Playlist After Creation
            <span class="tooltip-container">
                <span style="color: #888; margin-left: 4px; font-size: 12px; cursor: help;">?</span>
                <span class="custom-tooltip">Automatically navigates to the newly created or modified playlist.</span>
            </span>
        </label>
        <div class="col action">
            <label class="switch" id="openPlaylistAfterSortSwitchLabel">
                <input type="checkbox" id="openPlaylistAfterSortToggle" ${openPlaylistAfterSortEnabled ? 'checked' : ''}>
                <span class="sliderx"></span>
            </label>
        </div>
    </div>

    <div class="setting-row" id="placePlaylistsInFolderSettingRow">
        <label class="col description">
            Place Playlists in Folder
            <span class="tooltip-container">
                <span style="color: #888; margin-left: 4px; font-size: 12px; cursor: help;">?</span>
                <span class="custom-tooltip">Automatically place all created playlists inside a dedicated folder named "${sortPlayFolderName}".</span>
            </span>
        </label>
        <div class="col action">
            <button id="folderNameSettingsBtn" class="column-settings-button" title="Customize Folder Name">
                ${settingsSvg}
            </button>
            <label class="switch" id="placePlaylistsInFolderSwitchLabel">
                <input type="checkbox" id="placePlaylistsInFolderToggle" ${placePlaylistsInFolder ? 'checked' : ''}>
                <span class="sliderx"></span>
            </label>
        </div>
    </div>

    <div class="setting-row" id="useEnergyWaveShuffleSettingRow">
        <label class="col description">
            Shuffle with Vibe & Flow
            <span class="tooltip-container">
                <span style="color: #888; margin-left: 4px; font-size: 12px; cursor: help;">?</span>
                <span class="custom-tooltip">Creates a dynamic listening journey by arranging shuffled tracks based on their energy and mood.</span>
            </span>
        </label>
        <div class="col action">
            <label class="switch" id="useEnergyWaveShuffleSwitchLabel">
                <input type="checkbox" id="useEnergyWaveShuffleToggle" ${useEnergyWaveShuffle ? 'checked' : ''}>
                <span class="sliderx"></span>
            </label>
        </div>
    </div>

    <div class="setting-row" id="colorSortModeSetting">
        <label class="col description">
            Color Sort Mode
            <span class="tooltip-container">
                <span style="color: #888; margin-left: 4px; font-size: 12px; cursor: help;">?</span>
                <span class="custom-tooltip">"Perceptual" groups black & white albums first.<br>"Hue Gradient" creates a pure rainbow effect.</span>
            </span>
        </label>
        <div class="col action">
            <select id="colorSortModeSelect" style="max-width: 180px;">
                <option value="perceptual" ${colorSortMode === 'perceptual' ? 'selected' : ''}>Perceptual</option>
                <option value="hue_gradient" ${colorSortMode === 'hue_gradient' ? 'selected' : ''}>Hue Gradient</option>
            </select>
        </div>
    </div>

    <div style="color: white; font-weight: bold; font-size: 18px; margin-top: 10px;">
        Column Settings
    </div>
    <div style="border-bottom: 1px solid #555; margin-top: -3px;"></div>

    <div class="setting-row" id="additionalColumnSetting">
        <label class="col description">
          Playlist Extra Column
        </label>
        <div class="col action" style="position: relative;">
            <button id="dateFormatSettingsBtn" class="column-settings-button" title="Release Date Format Settings" style="display: none;">
                ${settingsSvg}
            </button>
            <button id="myScrobblesSettingsBtn" class="column-settings-button" title="My Scrobbles Display Settings" style="display: none;">
                ${settingsSvg}
            </button>
            <select id="columnTypeSelect" class="column-type-select" ${!showAdditionalColumn ? 'disabled' : ''}>
                <option value="playCount" ${selectedColumnType === 'playCount' ? 'selected' : ''}>Play Count</option>
                <option value="popularity" ${selectedColumnType === 'popularity' ? 'selected' : ''}>Popularity</option>
                <option value="releaseDate" ${selectedColumnType === 'releaseDate' ? 'selected' : ''}>Release Date</option>
                <option value="scrobbles" ${selectedColumnType === 'scrobbles' ? 'selected' : ''}>Scrobbles</option>
                <option value="personalScrobbles" ${selectedColumnType === 'personalScrobbles' ? 'selected' : ''}>My Scrobbles</option>
                <option value="djInfo" ${selectedColumnType === 'djInfo' ? 'selected' : ''}>DJ Info</option>
                <option value="key" ${selectedColumnType === 'key' ? 'selected' : ''}>Key</option>
                <option value="tempo" ${selectedColumnType === 'tempo' ? 'selected' : ''}>Tempo (BPM)</option>
                <option value="energy" ${selectedColumnType === 'energy' ? 'selected' : ''}>Energy</option>
                <option value="danceability" ${selectedColumnType === 'danceability' ? 'selected' : ''}>Danceability</option>
                <option value="valence" ${selectedColumnType === 'valence' ? 'selected' : ''}>Valence</option>
            </select>
            <label class="switch">
                <input type="checkbox" id="showAdditionalColumnToggle" ${showAdditionalColumn ? 'checked' : ''}>
                <span class="sliderx"></span>
            </label>
            <div id="dateFormatDropdownContainer" class="column-settings-dropdown">
                <button data-format="YYYY-MM-DD" class="${releaseDateFormat === 'YYYY-MM-DD' ? 'selected' : ''}">YYYY-MM-DD</button>
                <button data-format="MM-DD-YYYY" class="${releaseDateFormat === 'MM-DD-YYYY' ? 'selected' : ''}">MM-DD-YYYY</button>
                <button data-format="DD-MM-YYYY" class="${releaseDateFormat === 'DD-MM-YYYY' ? 'selected' : ''}">DD-MM-YYYY</button>
                <button data-format="MMM D, YYYY" class="${releaseDateFormat === 'MMM D, YYYY' ? 'selected' : ''}">Month D, YYYY</button>
                <button data-format="D MMM, YYYY" class="${releaseDateFormat === 'D MMM, YYYY' ? 'selected' : ''}">D Month, YYYY</button>
                <button data-format="YYYY, MMM D" class="${releaseDateFormat === 'YYYY, MMM D' ? 'selected' : ''}">YYYY, Month D</button>
                <button data-format="YYYY-MM" class="${releaseDateFormat === 'YYYY-MM' ? 'selected' : ''}">YYYY-MM</button>
                <button data-format="MM-YYYY" class="${releaseDateFormat === 'MM-YYYY' ? 'selected' : ''}">MM-YYYY</button>
                <button data-format="YYYY" class="${releaseDateFormat === 'YYYY' ? 'selected' : ''}">YYYY</button>
            </div>
            <div id="myScrobblesDropdownContainer" class="column-settings-dropdown">
                <button data-mode="number" class="${myScrobblesDisplayMode === 'number' ? 'selected' : ''}">Number Mode</button>
                <button data-mode="sign" class="${myScrobblesDisplayMode === 'sign' ? 'selected' : ''}">Sign Mode</button>
            </div>
        </div>
    </div>
    
    <div class="setting-row" id="secondAdditionalColumnSetting">
        <label class="col description">
          Playlist Second Extra Column
        </label>
        <div class="col action" style="position: relative;">
            <button id="secondDateFormatSettingsBtn" class="column-settings-button" title="Release Date Format Settings" style="display: none;">
                ${settingsSvg}
            </button>
            <button id="secondMyScrobblesSettingsBtn" class="column-settings-button" title="My Scrobbles Display Settings" style="display: none;">
                ${settingsSvg}
            </button>
            <select id="secondColumnTypeSelect" class="column-type-select" ${!showSecondAdditionalColumn ? 'disabled' : ''}>
                <option value="playCount" ${selectedSecondColumnType === 'playCount' ? 'selected' : ''}>Play Count</option>
                <option value="popularity" ${selectedSecondColumnType === 'popularity' ? 'selected' : ''}>Popularity</option>
                <option value="releaseDate" ${selectedSecondColumnType === 'releaseDate' ? 'selected' : ''}>Release Date</option>
                <option value="scrobbles" ${selectedSecondColumnType === 'scrobbles' ? 'selected' : ''}>Scrobbles</option>
                <option value="personalScrobbles" ${selectedSecondColumnType === 'personalScrobbles' ? 'selected' : ''}>My Scrobbles</option>
                <option value="djInfo" ${selectedSecondColumnType === 'djInfo' ? 'selected' : ''}>DJ Info</option>
                <option value="key" ${selectedSecondColumnType === 'key' ? 'selected' : ''}>Key</option>
                <option value="tempo" ${selectedSecondColumnType === 'tempo' ? 'selected' : ''}>Tempo (BPM)</option>
                <option value="energy" ${selectedSecondColumnType === 'energy' ? 'selected' : ''}>Energy</option>
                <option value="danceability" ${selectedSecondColumnType === 'danceability' ? 'selected' : ''}>Danceability</option>
                <option value="valence" ${selectedSecondColumnType === 'valence' ? 'selected' : ''}>Valence</option>
            </select>
            <label class="switch">
                <input type="checkbox" id="showSecondAdditionalColumnToggle" ${showSecondAdditionalColumn ? 'checked' : ''}>
                <span class="sliderx"></span>
            </label>
            <div id="secondDateFormatDropdownContainer" class="column-settings-dropdown">
                <button data-format="YYYY-MM-DD" class="${releaseDateFormat === 'YYYY-MM-DD' ? 'selected' : ''}">YYYY-MM-DD</button>
                <button data-format="MM-DD-YYYY" class="${releaseDateFormat === 'MM-DD-YYYY' ? 'selected' : ''}">MM-DD-YYYY</button>
                <button data-format="DD-MM-YYYY" class="${releaseDateFormat === 'DD-MM-YYYY' ? 'selected' : ''}">DD-MM-YYYY</button>
                <button data-format="MMM D, YYYY" class="${releaseDateFormat === 'MMM D, YYYY' ? 'selected' : ''}">Month D, YYYY</button>
                <button data-format="D MMM, YYYY" class="${releaseDateFormat === 'D MMM, YYYY' ? 'selected' : ''}">D Month, YYYY</button>
                <button data-format="YYYY, MMM D" class="${releaseDateFormat === 'YYYY, MMM D' ? 'selected' : ''}">YYYY, Month D</button>
                <button data-format="YYYY-MM" class="${releaseDateFormat === 'YYYY-MM' ? 'selected' : ''}">YYYY-MM</button>
                <button data-format="MM-YYYY" class="${releaseDateFormat === 'MM-YYYY' ? 'selected' : ''}">MM-YYYY</button>
                <button data-format="YYYY" class="${releaseDateFormat === 'YYYY' ? 'selected' : ''}">YYYY</button>
            </div>
            <div id="secondMyScrobblesDropdownContainer" class="column-settings-dropdown">
                <button data-mode="number" class="${myScrobblesDisplayMode === 'number' ? 'selected' : ''}">Number Mode</button>
                <button data-mode="sign" class="${myScrobblesDisplayMode === 'sign' ? 'selected' : ''}">Sign Mode</button>
            </div>
        </div>
    </div>

    <div class="setting-row" id="albumColumnSetting">
        <label class="col description">
            Album Extra Column
        </label>
        <div class="col action">
            <button id="albumDateFormatSettingsBtn" class="column-settings-button" title="Release Date Format Settings" style="display: none;">
                ${settingsSvg}
            </button>
            <button id="albumMyScrobblesSettingsBtn" class="column-settings-button" title="My Scrobbles Display Settings" style="display: none;">
                ${settingsSvg}
            </button>
            <select id="albumColumnTypeSelect" class="column-type-select" ${!showAlbumColumn ? 'disabled' : ''}>
                <option value="releaseDate" ${selectedAlbumColumnType === 'releaseDate' ? 'selected' : ''}>Release Date</option>
                <option value="popularity" ${selectedAlbumColumnType === 'popularity' ? 'selected' : ''}>Popularity</option>
                <option value="scrobbles" ${selectedAlbumColumnType === 'scrobbles' ? 'selected' : ''}>Scrobbles</option>
                <option value="personalScrobbles" ${selectedAlbumColumnType === 'personalScrobbles' ? 'selected' : ''}>My Scrobbles</option>
                <option value="djInfo" ${selectedAlbumColumnType === 'djInfo' ? 'selected' : ''}>DJ Info</option>
                <option value="key" ${selectedAlbumColumnType === 'key' ? 'selected' : ''}>Key</option>
                <option value="tempo" ${selectedAlbumColumnType === 'tempo' ? 'selected' : ''}>Tempo (BPM)</option>
                <option value="energy" ${selectedAlbumColumnType === 'energy' ? 'selected' : ''}>Energy</option>
                <option value="danceability" ${selectedAlbumColumnType === 'danceability' ? 'selected' : ''}>Danceability</option>
                <option value="valence" ${selectedAlbumColumnType === 'valence' ? 'selected' : ''}>Valence</option>
            </select>
            <label class="switch">
                <input type="checkbox" id="showAlbumColumnToggle" ${showAlbumColumn ? 'checked' : ''}>
                <span class="sliderx"></span>
            </label>
            <div id="albumDateFormatDropdownContainer" class="column-settings-dropdown">
                <button data-format="YYYY-MM-DD" class="${releaseDateFormat === 'YYYY-MM-DD' ? 'selected' : ''}">YYYY-MM-DD</button>
                <button data-format="MM-DD-YYYY" class="${releaseDateFormat === 'MM-DD-YYYY' ? 'selected' : ''}">MM-DD-YYYY</button>
                <button data-format="DD-MM-YYYY" class="${releaseDateFormat === 'DD-MM-YYYY' ? 'selected' : ''}">DD-MM-YYYY</button>
                <button data-format="MMM D, YYYY" class="${releaseDateFormat === 'MMM D, YYYY' ? 'selected' : ''}">Month D, YYYY</button>
                <button data-format="D MMM, YYYY" class="${releaseDateFormat === 'D MMM, YYYY' ? 'selected' : ''}">D Month, YYYY</button>
                <button data-format="YYYY, MMM D" class="${releaseDateFormat === 'YYYY, MMM D' ? 'selected' : ''}">YYYY, Month D</button>
                <button data-format="YYYY-MM" class="${releaseDateFormat === 'YYYY-MM' ? 'selected' : ''}">YYYY-MM</button>
                <button data-format="MM-YYYY" class="${releaseDateFormat === 'MM-YYYY' ? 'selected' : ''}">MM-YYYY</button>
                <button data-format="YYYY" class="${releaseDateFormat === 'YYYY' ? 'selected' : ''}">YYYY</button>
            </div>
            <div id="albumMyScrobblesDropdownContainer" class="column-settings-dropdown">
                <button data-mode="number" class="${myScrobblesDisplayMode === 'number' ? 'selected' : ''}">Number Mode</button>
                <button data-mode="sign" class="${myScrobblesDisplayMode === 'sign' ? 'selected' : ''}">Sign Mode</button>
            </div>
        </div>
    </div>

    <div class="setting-row" id="artistColumnSetting">
        <label class="col description">
            Artist Extra Column
        </label>
        <div class="col action">
            <button id="artistDateFormatSettingsBtn" class="column-settings-button" title="Release Date Format Settings" style="display: none;">
                ${settingsSvg}
            </button>
            <button id="artistMyScrobblesSettingsBtn" class="column-settings-button" title="My Scrobbles Display Settings" style="display: none;">
                ${settingsSvg}
            </button>
            <select id="artistColumnTypeSelect" class="column-type-select" ${!showArtistColumn ? 'disabled' : ''}>
                <option value="releaseDate" ${selectedArtistColumnType === 'releaseDate' ? 'selected' : ''}>Release Date</option>
                <option value="popularity" ${selectedArtistColumnType === 'popularity' ? 'selected' : ''}>Popularity</option>
                <option value="scrobbles" ${selectedArtistColumnType === 'scrobbles' ? 'selected' : ''}>Scrobbles</option>
                <option value="personalScrobbles" ${selectedArtistColumnType === 'personalScrobbles' ? 'selected' : ''}>My Scrobbles</option>
                <option value="djInfo" ${selectedArtistColumnType === 'djInfo' ? 'selected' : ''}>DJ Info</option>
                <option value="key" ${selectedArtistColumnType === 'key' ? 'selected' : ''}>Key</option>
                <option value="tempo" ${selectedArtistColumnType === 'tempo' ? 'selected' : ''}>Tempo (BPM)</option>
                <option value="energy" ${selectedArtistColumnType === 'energy' ? 'selected' : ''}>Energy</option>
                <option value="danceability" ${selectedArtistColumnType === 'danceability' ? 'selected' : ''}>Danceability</option>
                <option value="valence" ${selectedArtistColumnType === 'valence' ? 'selected' : ''}>Valence</option>
            </select>
            <label class="switch">
                <input type="checkbox" id="showArtistColumnToggle" ${showArtistColumn ? 'checked' : ''}>
                <span class="sliderx"></span>
            </label>
            <div id="artistDateFormatDropdownContainer" class="column-settings-dropdown">
                <button data-format="YYYY-MM-DD" class="${releaseDateFormat === 'YYYY-MM-DD' ? 'selected' : ''}">YYYY-MM-DD</button>
                <button data-format="MM-DD-YYYY" class="${releaseDateFormat === 'MM-DD-YYYY' ? 'selected' : ''}">MM-DD-YYYY</button>
                <button data-format="DD-MM-YYYY" class="${releaseDateFormat === 'DD-MM-YYYY' ? 'selected' : ''}">DD-MM-YYYY</button>
                <button data-format="MMM D, YYYY" class="${releaseDateFormat === 'MMM D, YYYY' ? 'selected' : ''}">Month D, YYYY</button>
                <button data-format="D MMM, YYYY" class="${releaseDateFormat === 'D MMM, YYYY' ? 'selected' : ''}">D Month, YYYY</button>
                <button data-format="YYYY, MMM D" class="${releaseDateFormat === 'YYYY, MMM D' ? 'selected' : ''}">YYYY, Month D</button>
                <button data-format="YYYY-MM" class="${releaseDateFormat === 'YYYY-MM' ? 'selected' : ''}">YYYY-MM</button>
                <button data-format="MM-YYYY" class="${releaseDateFormat === 'MM-YYYY' ? 'selected' : ''}">MM-YYYY</button>
                <button data-format="YYYY" class="${releaseDateFormat === 'YYYY' ? 'selected' : ''}">YYYY</button>
            </div>
            <div id="artistMyScrobblesDropdownContainer" class="column-settings-dropdown">
                <button data-mode="number" class="${myScrobblesDisplayMode === 'number' ? 'selected' : ''}">Number Mode</button>
                <button data-mode="sign" class="${myScrobblesDisplayMode === 'sign' ? 'selected' : ''}">Sign Mode</button>
            </div>
        </div>
    </div>
    
    <div class="setting-row" id="removeDateAdded">
        <label class="col description">Remove Playlist "Date Added" Column</label>
        <div class="col action">
            <label class="switch">
                <input type="checkbox" ${removeDateAdded ? 'checked' : ''} ${!showAdditionalColumn ? 'disabled' : ''}>
                <span class="sliderx"></span>
            </label>
        </div>
    </div>

    <div style="color: white; font-weight: bold; font-size: 18px; margin-top: 10px;">
        UI Enhancements
    </div>
    <div style="border-bottom: 1px solid #555; margin-top: -3px;"></div>

    <div class="setting-row" id="showLikeButtonSetting">
        <label class="col description">
            Show Old Like Button
            <span class="tooltip-container">
                <span style="color: #888; margin-left: 4px; font-size: 12px; cursor: help;">?</span>
                <span class="custom-tooltip">Adds a heart button to track rows, the play bar, and the Now Playing view.</span>
            </span>
        </label>
        <div class="col action">
            <label class="switch">
                <input type="checkbox" id="showLikeButtonToggle" ${showLikeButton ? 'checked' : ''}>
                <span class="sliderx"></span>
            </label>
        </div>
    </div>

    <div class="setting-row" id="showNowPlayingDataSetting">
        <label class="col description">
            Now Playing Extra Data
            <span class="tooltip-container">
                <span style="color: #888; margin-left: 4px; font-size: 12px; cursor: help;">?</span>
                <span class="custom-tooltip">Shows extra data like Release Date next to the title or artist in the Now Playing bar.</span>
            </span>
        </label>
        <div class="col action">
            <button id="nowPlayingSettingsBtn" class="column-settings-button" title="Now Playing Data Settings">
                ${settingsSvg}
            </button>
            <select id="nowPlayingDataTypeSelect" class="column-type-select" ${!showNowPlayingData ? 'disabled' : ''}>
                <option value="releaseDate" ${selectedNowPlayingDataType === 'releaseDate' ? 'selected' : ''}>Release Date</option>
                <option value="playCount" ${selectedNowPlayingDataType === 'playCount' ? 'selected' : ''}>Play Count</option>
                <option value="popularity" ${selectedNowPlayingDataType === 'popularity' ? 'selected' : ''}>Popularity</option>
                <option value="tempo" ${selectedNowPlayingDataType === 'tempo' ? 'selected' : ''}>Tempo (BPM)</option>
                <option value="energy" ${selectedNowPlayingDataType === 'energy' ? 'selected' : ''}>Energy</option>
                <option value="danceability" ${selectedNowPlayingDataType === 'danceability' ? 'selected' : ''}>Danceability</option>
                <option value="valence" ${selectedNowPlayingDataType === 'valence' ? 'selected' : ''}>Valence</option>
                <option value="key" ${selectedNowPlayingDataType === 'key' ? 'selected' : ''}>Key</option>
            </select>
            <label class="switch">
                <input type="checkbox" id="showNowPlayingDataToggle" ${showNowPlayingData ? 'checked' : ''}>
                <span class="sliderx"></span>
            </label>
        </div>
    </div>

    <div style="color: white; font-weight: bold; font-size: 18px; margin-top: 10px;">
        Playlist Attributes
    </div>
    <div style="border-bottom: 1px solid #555; margin-top: -3px;"></div>

    
    <div class="setting-row" id="createPlaylistPrivateSettingRow">
        <label class="col description">
            Make Created Playlists Private
        </label>
        <div class="col action">
            <label class="switch">
                <input type="checkbox" id="createPlaylistPrivateToggle" ${createPlaylistPrivate ? 'checked' : ''}>
                <span class="sliderx"></span>
            </label>
        </div>
    </div>
    
    <div class="setting-row" id="changeTitleOnCreateSettingRow">
        <label class="col description">
            Update Title When Creating
            <span class="tooltip-container">
                <span style="color: #888; margin-left: 4px; font-size: 12px; cursor: help;">?</span>
                <span class="custom-tooltip">Appends a sort tag like (PlayCount) to new playlists created via direct sorting.</span>
            </span>
        </label>
        <div class="col action">
            <label class="switch" id="changeTitleOnCreateSwitchLabel">
                <input type="checkbox" id="changeTitleOnCreateToggle" ${changeTitleOnCreate ? 'checked' : ''}>
                <span class="sliderx"></span>
            </label>
        </div>
    </div>

    <div class="setting-row" id="changeTitleOnModifySettingRow">
        <label class="col description">
            Update Title When Modifying
            <span class="tooltip-container">
                <span style="color: #888; margin-left: 4px; font-size: 12px; cursor: help;">?</span>
                <span class="custom-tooltip">Appends a sort tag like (PlayCount) to the playlist title after modifying it.</span>
            </span>
        </label>
        <div class="col action">
            <label class="switch" id="changeTitleOnModifySwitchLabel">
                <input type="checkbox" id="changeTitleOnModifyToggle" ${changeTitleOnModify ? 'checked' : ''}>
                <span class="sliderx"></span>
            </label>
        </div>
    </div>
    
    <div style="color: white; font-weight: bold; font-size: 18px; margin-top: 10px;">
        Duplicate Removal
    </div>
    <div style="border-bottom: 1px solid #555; margin-top: -3px;"></div>

    <div class="setting-row" id="playlistDeduplicate">
        <label class="col description">
            Remove Duplicate Tracks While Sorting
            <span class="tooltip-container">
                <span style="color: #888; margin-left: 4px; font-size: 12px; cursor: help;">?</span>
                <span class="custom-tooltip">Setting won't affect artist pages or tracks with identical URLs</span>
            </span>
        </label>
        <div class="col action">
            <label class="switch">
                <input type="checkbox" ${playlistDeduplicate ? 'checked' : ''}>
                <span class="sliderx"></span>
            </label>
        </div>
    </div>
    <div class="setting-row" id="showRemovedDuplicates">
        <label class="col description">Show Removed Duplicates</label>
        <div class="col action">
            <label class="switch">
                <input type="checkbox" ${showRemovedDuplicates ? 'checked' : ''}>
                <span class="sliderx"></span>
            </label>
        </div>
    </div>

    <div style="color: white; font-weight: bold; font-size: 18px; margin-top: 10px;">
        Dedicated Playlist Creation
    </div>
    <div style="border-bottom: 1px solid #555; margin-top: -3px;"></div>

    <div class="setting-row" id="setDedicatedCoversSettingRow">
        <label class="col description">
            Set Custom Playlist Covers
        </label>
        <div class="col action">
            <label class="switch">
                <input type="checkbox" id="setDedicatedCoversToggle" ${setDedicatedPlaylistCovers ? 'checked' : ''}>
                <span class="sliderx"></span>
            </label>
        </div>
    </div>

    <div class="setting-row" id="topTracksLimitSetting">
        <label class="col description">
            Top Tracks Playlist Size
        </label>
        <div class="col action">
            <select id="topTracksLimitSelect" style="width: 65px;">
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="150">150</option>
                <option value="200">200</option>
                <option value="250">250</option>
                <option value="500">500</option>
                <option value="1000">1000</option>
            </select>
        </div>
    </div>

    <div class="setting-row" id="discoveryPlaylistSizeSetting">
        <label class="col description">
            Discovery Playlist Size
        </label>
        <div class="col action">
            <select id="discoveryPlaylistSizeSelect" style="width: 65px;">
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="75">75</option>
                <option value="100">100</option>
            </select>
        </div>
    </div>

    <div class="setting-row" id="newReleasesLimitSetting">
        <label class="col description">
            New Releases Time Window
            <span class="tooltip-container">
                <span style="color: #888; margin-left: 4px; font-size: 12px; cursor: help;">?</span>
                <span class="custom-tooltip">Set the lookback period for New Releases playlists, anchored to the music industry's Friday release schedule.</span>
            </span>
        </label>
        <div class="col action">
            <select id="newReleasesLimitSelect" style="max-width: 180px;">
                <option value="7">This Release Week</option>
                <option value="14">Last 2 Release Weeks</option>
                <option value="21">Last 3 Release Weeks</option>
                <option value="30">Last 5 Release Weeks</option>
                <option value="60">Last 9 Release Weeks</option>
            </select>
        </div>
    </div>

    <div class="setting-row" id="followedReleasesLimitSetting">
        <label class="col description">
            Followed Artist (Full) Tracks Per Album
            <span class="tooltip-container">
                <span style="color: #888; margin-left: 4px; font-size: 12px; cursor: help;">?</span>
                <span class="custom-tooltip">Limit the number of tracks added from each album in the "Followed Artist (Full)" playlist.</span>
            </span>
        </label>
        <div class="col action">
            <select id="followedReleasesLimitSelect" style="max-width: 120px;">
                <option value="1">1 Track</option>
                <option value="2">2 Tracks</option>
                <option value="3">3 Tracks</option>
                <option value="5">5 Tracks</option>
                <option value="all">All Tracks</option>
            </select>
        </div>
    </div>
    `;

    Spicetify.PopupModal.display({
        title: `<span style='font-size: 30px; color: white;'>Sort-Play Settings <span class='version-tag'>v${SORT_PLAY_VERSION}</span></span>`,
        content: modalContainer,
        isLarge: true,
    });
    tagActiveModalWithFontScope();

    const modalRootElement = document.querySelector(".main-embedWidgetGenerator-container");
    if (modalRootElement) {
        const existingFooter = modalRootElement.querySelector(".sort-play-settings-footer");
        if (existingFooter) {
            existingFooter.remove();
        }
        const footerElement = document.createElement("div");
        footerElement.className = "sort-play-settings-footer";
        footerElement.innerHTML = `
            <button id="supportMeBtn" class="footer-icon-button support-me-button" title="Support Sort-Play">
                ${coffeeIconSVG}
            </button>
            <div class="github-link-container">
                <a href="https://github.com/hoeci/sort-play" target="_blank">Star on GitHub, report bugs, and suggest features!</a>
            </div>
            <button id="liveChatBtn" class="footer-icon-button live-chat-button" title="Live Chat">
                ${liveChatIconSVG}
            </button>
        `;
        modalRootElement.appendChild(footerElement);

        const liveChatBtn = footerElement.querySelector("#liveChatBtn");
        const supportMeBtn = footerElement.querySelector("#supportMeBtn");

        supportMeBtn.addEventListener("click", () => {
            showSupportModal();
        });

        if (chatPanelVisible) {
            const chatPanel = createAndInitializeChatPanel();
            positionChatPanel(chatPanel);
            setTimeout(() => {
                const panel = document.getElementById('sort-play-chat-panel');
                if (panel) panel.classList.add('visible');
            }, 10);
            liveChatBtn.classList.add('active');
        }

        liveChatBtn.addEventListener("click", () => {
            toggleChatPanel();
        });
    }

    if (isMenuOpen) {
      closeAllMenus();
    }

    const modalContainerElement = document.querySelector(".main-popupModal-container");
    if (modalContainerElement) {
        modalContainerElement.style.zIndex = "2000";
    }
    
    preventDragCloseModal();

    const showAdditionalColumnToggle = modalContainer.querySelector("#showAdditionalColumnToggle");
    const showAlbumColumnToggle = modalContainer.querySelector("#showAlbumColumnToggle");
    const showArtistColumnToggle = modalContainer.querySelector("#showArtistColumnToggle");
    const columnTypeSelect = modalContainer.querySelector("#columnTypeSelect");
    const albumColumnTypeSelect = modalContainer.querySelector("#albumColumnTypeSelect");
    const artistColumnTypeSelect = modalContainer.querySelector("#artistColumnTypeSelect");
    const dateFormatSettingsBtn = modalContainer.querySelector("#dateFormatSettingsBtn");
    const myScrobblesSettingsBtn = modalContainer.querySelector("#myScrobblesSettingsBtn");
    const albumDateFormatSettingsBtn = modalContainer.querySelector("#albumDateFormatSettingsBtn");
    const albumMyScrobblesSettingsBtn = modalContainer.querySelector("#albumMyScrobblesSettingsBtn");
    const artistDateFormatSettingsBtn = modalContainer.querySelector("#artistDateFormatSettingsBtn");
    const artistMyScrobblesSettingsBtn = modalContainer.querySelector("#artistMyScrobblesSettingsBtn");
    const dateFormatDropdownContainer = modalContainer.querySelector("#dateFormatDropdownContainer");
    const myScrobblesDropdownContainer = modalContainer.querySelector("#myScrobblesDropdownContainer");
    const albumDateFormatDropdownContainer = modalContainer.querySelector("#albumDateFormatDropdownContainer");
    const albumMyScrobblesDropdownContainer = modalContainer.querySelector("#albumMyScrobblesDropdownContainer");
    const artistDateFormatDropdownContainer = modalContainer.querySelector("#artistDateFormatDropdownContainer");
    const artistMyScrobblesDropdownContainer = modalContainer.querySelector("#artistMyScrobblesDropdownContainer");
    const removeDateAddedToggle = modalContainer.querySelector("#removeDateAdded input");
    const playlistDeduplicateToggle = modalContainer.querySelector("#playlistDeduplicate input");
    const showRemovedDuplicatesToggle = modalContainer.querySelector("#showRemovedDuplicates input");
    const setGeminiApiKeyButton = modalContainer.querySelector("#setGeminiApiKey");
    const setLastFmUsernameButton = modalContainer.querySelector("#setLastFmUsername");
    const addToQueueToggle = modalContainer.querySelector("#addToQueueToggle");
    const createPlaylistToggle = modalContainer.querySelector("#createPlaylistToggle");
    const createPlaylistSwitchLabel = modalContainer.querySelector("#createPlaylistSwitchLabel");
    const createPlaylistSettingRow = modalContainer.querySelector("#createPlaylistSettingRow");
    const sortCurrentPlaylistToggle = modalContainer.querySelector("#sortCurrentPlaylistToggle");
    const sortCurrentPlaylistSwitchLabel = modalContainer.querySelector("#sortCurrentPlaylistSwitchLabel");
    const sortCurrentPlaylistSettingRow = modalContainer.querySelector("#sortCurrentPlaylistSettingRow");
    const openPlaylistAfterSortToggle = modalContainer.querySelector("#openPlaylistAfterSortToggle");
    const createPlaylistPrivateToggle = modalContainer.querySelector("#createPlaylistPrivateToggle");
    const openPlaylistAfterSortSwitchLabel = modalContainer.querySelector("#openPlaylistAfterSortSwitchLabel");
    const openPlaylistAfterSortSettingRow = modalContainer.querySelector("#openPlaylistAfterSortSettingRow");
    const colorSortModeSelect = modalContainer.querySelector("#colorSortModeSelect");
    const topTracksLimitSelect = modalContainer.querySelector("#topTracksLimitSelect");
    const newReleasesLimitSelect = modalContainer.querySelector("#newReleasesLimitSelect");
    const followedReleasesLimitSelect = modalContainer.querySelector("#followedReleasesLimitSelect");
    const discoveryPlaylistSizeSelect = modalContainer.querySelector("#discoveryPlaylistSizeSelect");
    const placePlaylistsInFolderToggle = modalContainer.querySelector("#placePlaylistsInFolderToggle");
    const folderNameSettingsBtn = modalContainer.querySelector("#folderNameSettingsBtn");
    const changeTitleOnCreateToggle = modalContainer.querySelector("#changeTitleOnCreateToggle");
    const changeTitleOnModifyToggle = modalContainer.querySelector("#changeTitleOnModifyToggle");
    const setDedicatedCoversToggle = modalContainer.querySelector("#setDedicatedCoversToggle");
    const showSecondAdditionalColumnToggle = modalContainer.querySelector("#showSecondAdditionalColumnToggle");
    const secondColumnTypeSelect = modalContainer.querySelector("#secondColumnTypeSelect");
    const secondDateFormatSettingsBtn = modalContainer.querySelector("#secondDateFormatSettingsBtn");
    const secondMyScrobblesSettingsBtn = modalContainer.querySelector("#secondMyScrobblesSettingsBtn");
    const secondDateFormatDropdownContainer = modalContainer.querySelector("#secondDateFormatDropdownContainer");
    const secondMyScrobblesDropdownContainer = modalContainer.querySelector("#secondMyScrobblesDropdownContainer");
    const showLikeButtonToggle = modalContainer.querySelector("#showLikeButtonToggle");
    const useEnergyWaveShuffleToggle = modalContainer.querySelector("#useEnergyWaveShuffleToggle");
    const showNowPlayingDataToggle = modalContainer.querySelector("#showNowPlayingDataToggle");
    const nowPlayingDataTypeSelect = modalContainer.querySelector("#nowPlayingDataTypeSelect");
    const nowPlayingSettingsBtn = modalContainer.querySelector("#nowPlayingSettingsBtn");

    showLikeButtonToggle.addEventListener("change", () => {
        showLikeButton = showLikeButtonToggle.checked;
        saveSettings();

        const actionContainer = showLikeButtonToggle.closest('.col.action');
        const toggleLabel = actionContainer.querySelector('.switch');

        if (actionContainer && toggleLabel && !actionContainer.querySelector('.reload-button')) {
            const reloadButton = document.createElement('button');
            reloadButton.textContent = 'Reload';
            reloadButton.className = 'main-buttons-button reload-button';
            reloadButton.title = 'Reload Spotify to apply';
            reloadButton.style.cssText = `
                margin-right: 10px;
                padding: 2px 12px;
                height: 24px;
                border-radius: 12px;
                border: 1px solid #878787;
                cursor: pointer;
                background-color: transparent;
                color: white;
                font-weight: 500;
                font-size: 12px;
                transition: background-color 0.2s ease;
            `;
            reloadButton.addEventListener('click', () => {
                location.reload();
            });
            reloadButton.addEventListener('mouseenter', () => reloadButton.style.backgroundColor = '#ffffff1a');
            reloadButton.addEventListener('mouseleave', () => reloadButton.style.backgroundColor = 'transparent');
            actionContainer.insertBefore(reloadButton, toggleLabel);
        }
    });

    nowPlayingSettingsBtn.disabled = !showNowPlayingDataToggle.checked;

    showNowPlayingDataToggle.addEventListener("change", () => {
        showNowPlayingData = showNowPlayingDataToggle.checked;
        nowPlayingDataTypeSelect.disabled = !showNowPlayingData;
        nowPlayingSettingsBtn.disabled = !showNowPlayingData;
        saveSettings();
        displayNowPlayingData();
    });

    nowPlayingDataTypeSelect.addEventListener("change", () => {
        selectedNowPlayingDataType = nowPlayingDataTypeSelect.value;
        saveSettings();
        displayNowPlayingData();
    });

    nowPlayingSettingsBtn.addEventListener("click", () => {
        if (!nowPlayingSettingsBtn.disabled) {
            showNowPlayingSettingsModal(true);
        }
    });

    function updateOpenPlaylistAfterSortToggleState() {
      const isCreatePlaylistOn = createPlaylistToggle.checked;
      const isModifyCurrentPlaylistActive = sortCurrentPlaylistToggle.checked && !sortCurrentPlaylistToggle.disabled;
      const shouldBeEnabled = (isCreatePlaylistOn && !isModifyCurrentPlaylistActive) || isModifyCurrentPlaylistActive;
      openPlaylistAfterSortToggle.disabled = !shouldBeEnabled;
      openPlaylistAfterSortSwitchLabel.classList.toggle("disabled", !shouldBeEnabled);
      openPlaylistAfterSortSettingRow.classList.toggle("dependent-disabled", !shouldBeEnabled);
      openPlaylistAfterSortToggle.checked = openPlaylistAfterSortEnabled;
    }

    function updateChangeTitleToggleState() {
        changeTitleOnModifyToggle.disabled = false;
        document.getElementById('changeTitleOnModifySwitchLabel').classList.remove("disabled");
        document.getElementById('changeTitleOnModifySettingRow').classList.remove("dependent-disabled");
        changeTitleOnModifyToggle.checked = changeTitleOnModify;
    }

    function updateSortCurrentPlaylistToggleState() {
        const isCreatePlaylistOn = createPlaylistToggle.checked;
        sortCurrentPlaylistToggle.disabled = !isCreatePlaylistOn;
        sortCurrentPlaylistSwitchLabel.classList.toggle("disabled", !isCreatePlaylistOn);
        sortCurrentPlaylistSettingRow.classList.toggle("dependent-disabled", !isCreatePlaylistOn);

        placePlaylistsInFolderToggle.disabled = false;
        document.getElementById('placePlaylistsInFolderSwitchLabel').classList.remove("disabled");
        document.getElementById('placePlaylistsInFolderSettingRow').classList.remove("dependent-disabled");
    
        folderNameSettingsBtn.disabled = !placePlaylistsInFolderToggle.checked;
    
        if (!isCreatePlaylistOn) {
            sortCurrentPlaylistToggle.checked = false;
        } else {
            sortCurrentPlaylistToggle.checked = sortCurrentPlaylistEnabled;
        }
        updateOpenPlaylistAfterSortToggleState();
        updateChangeTitleToggleState();
    }

    function updateCreatePlaylistToggleState() {
      const isAddToQueueOn = addToQueueToggle.checked;
      if (!isAddToQueueOn) {
        createPlaylistToggle.checked = true;
        createPlaylistToggle.disabled = true;
        createPlaylistSwitchLabel.classList.add("disabled");
        createPlaylistSettingRow.classList.add("forced");
        if (!createPlaylistAfterSort) {
             createPlaylistAfterSort = true;
             saveSettings();
        }
      } else {
        createPlaylistToggle.disabled = false;
        createPlaylistSwitchLabel.classList.remove("disabled");
        createPlaylistSettingRow.classList.remove("forced");
        createPlaylistToggle.checked = createPlaylistAfterSort;
      }
      updateSortCurrentPlaylistToggleState();
    }

    setDedicatedCoversToggle.addEventListener("change", () => {
        setDedicatedPlaylistCovers = setDedicatedCoversToggle.checked;
        saveSettings();
    });

    colorSortModeSelect.addEventListener("change", () => {
        colorSortMode = colorSortModeSelect.value;
        saveSettings();
    });

    topTracksLimitSelect.value = topTracksLimit;
    topTracksLimitSelect.addEventListener("change", () => {
        topTracksLimit = parseInt(topTracksLimitSelect.value, 10);
        saveSettings();
    });

    let currentNewReleasesLimit = newReleasesDaysLimit;
    if ([1, 3].includes(currentNewReleasesLimit)) {
        currentNewReleasesLimit = 7;
    }
    
    newReleasesLimitSelect.value = currentNewReleasesLimit;
    newReleasesLimitSelect.addEventListener("change", () => {
        newReleasesDaysLimit = parseInt(newReleasesLimitSelect.value, 10);
        saveSettings();
    });
    
    followedReleasesLimitSelect.value = followedReleasesAlbumLimit;
    followedReleasesLimitSelect.addEventListener("change", () => {
        followedReleasesAlbumLimit = followedReleasesLimitSelect.value;
        saveSettings();
    });
    
    discoveryPlaylistSizeSelect.value = discoveryPlaylistSize;
    discoveryPlaylistSizeSelect.addEventListener("change", () => {
        discoveryPlaylistSize = parseInt(discoveryPlaylistSizeSelect.value, 10);
        saveSettings();
    });

    setGeminiApiKeyButton.addEventListener("click", () => {
        Spicetify.PopupModal.hide();
        setTimeout(() => {
            showGeminiApiKeyModal();
        }, 200);
    });
    
    setLastFmUsernameButton.addEventListener("click", () => {
        Spicetify.PopupModal.hide();
        setTimeout(() => {
            showLastFmUsernameModal();
        }, 200);
    });

    setGeminiApiKeyButton.addEventListener("mouseenter", () => {
        setGeminiApiKeyButton.style.backgroundColor = "#444444";
    });
    setGeminiApiKeyButton.addEventListener("mouseleave", () => {
        setGeminiApiKeyButton.style.backgroundColor = "#333333";
    });
    setLastFmUsernameButton.addEventListener("mouseenter", () => {
        setLastFmUsernameButton.style.backgroundColor = "#444444";
    });
    setLastFmUsernameButton.addEventListener("mouseleave", () => {
        setLastFmUsernameButton.style.backgroundColor = "#333333";
    });

    addToQueueToggle.addEventListener("change", () => {
        addToQueueEnabled = addToQueueToggle.checked;
        updateCreatePlaylistToggleState();
        saveSettings();
    });

    createPlaylistToggle.addEventListener("change", () => {
        if (!createPlaylistToggle.disabled) {
            createPlaylistAfterSort = createPlaylistToggle.checked;
            updateSortCurrentPlaylistToggleState();
            saveSettings();
        }
    });

    useEnergyWaveShuffleToggle.addEventListener("change", () => {
        useEnergyWaveShuffle = useEnergyWaveShuffleToggle.checked;
        saveSettings();
    });
    
    sortCurrentPlaylistToggle.addEventListener("change", () => {
        if (!sortCurrentPlaylistToggle.disabled) {
            sortCurrentPlaylistEnabled = sortCurrentPlaylistToggle.checked;
            updateOpenPlaylistAfterSortToggleState();
            updateChangeTitleToggleState();
            saveSettings();
        }
    });

    changeTitleOnCreateToggle.addEventListener("change", () => {
        if (!changeTitleOnCreateToggle.disabled) {
            changeTitleOnCreate = changeTitleOnCreateToggle.checked;
            saveSettings();
        }
    });
    
    changeTitleOnModifyToggle.addEventListener("change", () => {
        if (!changeTitleOnModifyToggle.disabled) {
            changeTitleOnModify = changeTitleOnModifyToggle.checked;
            saveSettings();
        }
    });

    openPlaylistAfterSortToggle.addEventListener("change", () => {
        if (!openPlaylistAfterSortToggle.disabled) {
            openPlaylistAfterSortEnabled = openPlaylistAfterSortToggle.checked;
            saveSettings();
        }
    });

    createPlaylistPrivateToggle.addEventListener("change", () => {
        createPlaylistPrivate = createPlaylistPrivateToggle.checked;
        saveSettings();
    });

    updateCreatePlaylistToggleState();

    folderNameSettingsBtn.disabled = !placePlaylistsInFolderToggle.checked || placePlaylistsInFolderToggle.disabled;

    placePlaylistsInFolderToggle.addEventListener("change", () => {
        if (!placePlaylistsInFolderToggle.disabled) {
            placePlaylistsInFolder = placePlaylistsInFolderToggle.checked;
            folderNameSettingsBtn.disabled = !placePlaylistsInFolder;
            saveSettings();
            const tooltip = document.querySelector("#placePlaylistsInFolderSettingRow .custom-tooltip");
            if (tooltip) {
                tooltip.textContent = `Automatically place all created playlists inside a dedicated folder named "${sortPlayFolderName}".`;
            }
        }
    });

    folderNameSettingsBtn.addEventListener("click", () => {
        if (!folderNameSettingsBtn.disabled) {
            showFolderNameModal();
        }
    });

    removeDateAddedToggle.disabled = !showAdditionalColumn && !showSecondAdditionalColumn;
    removeDateAddedToggle.parentElement.classList.toggle("disabled", !showAdditionalColumn && !showSecondAdditionalColumn);
    columnTypeSelect.disabled = !showAdditionalColumn;
    secondColumnTypeSelect.disabled = !showSecondAdditionalColumn;
    albumColumnTypeSelect.disabled = !showAlbumColumn;
    artistColumnTypeSelect.disabled = !showArtistColumn;

    setTimeout(() => {
        const sliderxs = modalContainer.querySelectorAll('.sliderx');
        sliderxs.forEach(sliderx => {
            sliderx.style.transition = '.3s';
        });
    }, 50);

    const updatePlaylistColumnSettingsVisibility = () => {
        const showDateSettings = showAdditionalColumn && selectedColumnType === 'releaseDate';
        dateFormatSettingsBtn.style.display = showDateSettings ? 'flex' : 'none';
        dateFormatSettingsBtn.disabled = !showDateSettings;
        if (!showDateSettings) dateFormatDropdownContainer.style.display = 'none';
        const showScrobbleSettings = showAdditionalColumn && selectedColumnType === 'personalScrobbles';
        myScrobblesSettingsBtn.style.display = showScrobbleSettings ? 'flex' : 'none';
        myScrobblesSettingsBtn.disabled = !showScrobbleSettings;
        if (!showScrobbleSettings) myScrobblesDropdownContainer.style.display = 'none';
    };

    const updateSecondPlaylistColumnSettingsVisibility = () => {
        const showDateSettings = showSecondAdditionalColumn && selectedSecondColumnType === 'releaseDate';
        secondDateFormatSettingsBtn.style.display = showDateSettings ? 'flex' : 'none';
        secondDateFormatSettingsBtn.disabled = !showDateSettings;
        if (!showDateSettings) secondDateFormatDropdownContainer.style.display = 'none';
        const showScrobbleSettings = showSecondAdditionalColumn && selectedSecondColumnType === 'personalScrobbles';
        secondMyScrobblesSettingsBtn.style.display = showScrobbleSettings ? 'flex' : 'none';
        secondMyScrobblesSettingsBtn.disabled = !showScrobbleSettings;
        if (!showScrobbleSettings) secondMyScrobblesDropdownContainer.style.display = 'none';
    };

    const updateAlbumColumnSettingsVisibility = () => {
        const showDateSettings = showAlbumColumn && selectedAlbumColumnType === 'releaseDate';
        albumDateFormatSettingsBtn.style.display = showDateSettings ? 'flex' : 'none';
        albumDateFormatSettingsBtn.disabled = !showDateSettings;
        if (!showDateSettings) albumDateFormatDropdownContainer.style.display = 'none';
        const showScrobbleSettings = showAlbumColumn && selectedAlbumColumnType === 'personalScrobbles';
        albumMyScrobblesSettingsBtn.style.display = showScrobbleSettings ? 'flex' : 'none';
        albumMyScrobblesSettingsBtn.disabled = !showScrobbleSettings;
        if (!showScrobbleSettings) albumMyScrobblesDropdownContainer.style.display = 'none';
    };

    const updateArtistColumnSettingsVisibility = () => {
        const showDateSettings = showArtistColumn && selectedArtistColumnType === 'releaseDate';
        artistDateFormatSettingsBtn.style.display = showDateSettings ? 'flex' : 'none';
        artistDateFormatSettingsBtn.disabled = !showDateSettings;
        if (!showDateSettings) artistDateFormatDropdownContainer.style.display = 'none';
        const showScrobbleSettings = showArtistColumn && selectedArtistColumnType === 'personalScrobbles';
        artistMyScrobblesSettingsBtn.style.display = showScrobbleSettings ? 'flex' : 'none';
        artistMyScrobblesSettingsBtn.disabled = !showScrobbleSettings;
        if (!showScrobbleSettings) artistMyScrobblesDropdownContainer.style.display = 'none';
    };

    updatePlaylistColumnSettingsVisibility();
    updateSecondPlaylistColumnSettingsVisibility();
    updateAlbumColumnSettingsVisibility();
    updateArtistColumnSettingsVisibility();

    const allDropdownsForScroll = [
        dateFormatDropdownContainer, myScrobblesDropdownContainer,
        albumDateFormatDropdownContainer, albumMyScrobblesDropdownContainer,
        artistDateFormatDropdownContainer, artistMyScrobblesDropdownContainer,
        secondDateFormatDropdownContainer, secondMyScrobblesDropdownContainer
    ];
    
    allDropdownsForScroll.forEach(dropdown => {
        if (dropdown) {
            dropdown.addEventListener('wheel', (event) => {
                const { scrollTop, clientHeight, scrollHeight } = dropdown;
                if (event.deltaY < 0 && scrollTop === 0) {
                    event.preventDefault();
                }
                else if (event.deltaY > 0 && Math.abs(scrollHeight - clientHeight - scrollTop) < 1) {
                    event.preventDefault();
                }
            }, { passive: false });
        }
    });

    showAdditionalColumnToggle.addEventListener("change", () => {
        showAdditionalColumn = showAdditionalColumnToggle.checked;
        columnTypeSelect.disabled = !showAdditionalColumn;
        removeDateAddedToggle.disabled = !showAdditionalColumn && !showSecondAdditionalColumn;
        removeDateAddedToggle.parentElement.classList.toggle("disabled", !showAdditionalColumn && !showSecondAdditionalColumn);
        if (!showAdditionalColumn && !showSecondAdditionalColumn) {
            removeDateAdded = false;
            removeDateAddedToggle.checked = false;
        }
        updatePlaylistColumnSettingsVisibility();
        saveSettings();
        updateTracklist();
    });

    showSecondAdditionalColumnToggle.addEventListener("change", () => {
        showSecondAdditionalColumn = showSecondAdditionalColumnToggle.checked;
        secondColumnTypeSelect.disabled = !showSecondAdditionalColumn;
        removeDateAddedToggle.disabled = !showAdditionalColumn && !showSecondAdditionalColumn;
        removeDateAddedToggle.parentElement.classList.toggle("disabled", !showAdditionalColumn && !showSecondAdditionalColumn);
        if (!showAdditionalColumn && !showSecondAdditionalColumn) {
            removeDateAdded = false;
            removeDateAddedToggle.checked = false;
        }
        updateSecondPlaylistColumnSettingsVisibility();
        saveSettings();
        updateTracklist();
    });

    secondColumnTypeSelect.addEventListener("change", () => {
        selectedSecondColumnType = secondColumnTypeSelect.value;
        updateSecondPlaylistColumnSettingsVisibility();
        saveSettings();
        updateTracklist();
    });

    showAlbumColumnToggle.addEventListener("change", () => {
        showAlbumColumn = showAlbumColumnToggle.checked;
        albumColumnTypeSelect.disabled = !showAlbumColumn;
        updateAlbumColumnSettingsVisibility();
        saveSettings();
        onPageChange();
    });

    showArtistColumnToggle.addEventListener("change", () => {
        showArtistColumn = showArtistColumnToggle.checked;
        artistColumnTypeSelect.disabled = !showArtistColumn;
        updateArtistColumnSettingsVisibility();
        saveSettings();
        onPageChange();
    });

    removeDateAddedToggle.addEventListener("change", () => {
        if (showAdditionalColumn) {
            removeDateAdded = removeDateAddedToggle.checked;
            saveSettings();
            updateTracklist();
        }
    });

    columnTypeSelect.addEventListener("change", () => {
        selectedColumnType = columnTypeSelect.value;
        updatePlaylistColumnSettingsVisibility();
        saveSettings();
        updateTracklist();
    });

    albumColumnTypeSelect.addEventListener("change", () => {
        selectedAlbumColumnType = albumColumnTypeSelect.value;
        updateAlbumColumnSettingsVisibility();
        saveSettings();
        onPageChange();
    });

    artistColumnTypeSelect.addEventListener("change", () => {
        selectedArtistColumnType = artistColumnTypeSelect.value;
        updateArtistColumnSettingsVisibility();
        saveSettings();
        onPageChange();
    });

    const allDateFormatContainers = [dateFormatDropdownContainer, albumDateFormatDropdownContainer, artistDateFormatDropdownContainer, secondDateFormatDropdownContainer];
    const allScrobbleContainers = [myScrobblesDropdownContainer, albumMyScrobblesDropdownContainer, artistMyScrobblesDropdownContainer, secondMyScrobblesDropdownContainer];

    const setupGlobalSettingListeners = (containers, settingKey, updateFunc) => {
        containers.forEach(container => {
            container.querySelectorAll("button").forEach(button => {
                button.addEventListener("click", (event) => {
                    event.stopPropagation();
                    const newValue = button.getAttribute(`data-${settingKey}`);
                    updateFunc(newValue);
                    containers.forEach(c => {
                        c.querySelectorAll("button").forEach(btn => btn.classList.remove("selected"));
                        const matchingButton = c.querySelector(`[data-${settingKey}="${newValue}"]`);
                        if (matchingButton) matchingButton.classList.add("selected");
                    });
                    allDateFormatContainers.forEach(c => c.style.display = 'none');
                    allScrobbleContainers.forEach(c => c.style.display = 'none');
                    saveSettings();
                    onPageChange();
                });
            });
        });
    };

    setupGlobalSettingListeners(allDateFormatContainers, 'format', (value) => {
        releaseDateFormat = value;
    });
    setupGlobalSettingListeners(allScrobbleContainers, 'mode', (value) => {
        myScrobblesDisplayMode = value;
    });

    const setupSettingsButtonToggle = (button, dropdown, otherDropdowns) => {
        button.addEventListener("click", (event) => {
            event.stopPropagation();
            const isCurrentlyVisible = dropdown.style.display === 'block';

            otherDropdowns.forEach(d => d.style.display = 'none');
            if (isCurrentlyVisible) {
                dropdown.style.display = 'none';
                return;
            }

            dropdown.style.top = 'auto';
            dropdown.style.bottom = 'auto';
            dropdown.style.marginTop = 'auto';
            dropdown.style.marginBottom = 'auto';
            dropdown.style.maxHeight = '';
            dropdown.style.overflowY = '';

            dropdown.style.visibility = 'hidden';
            dropdown.style.display = 'block';
            const dropdownRect = dropdown.getBoundingClientRect();
            dropdown.style.display = 'none';
            dropdown.style.visibility = 'visible';

            const buttonRect = button.getBoundingClientRect();
            const modal = button.closest(".main-embedWidgetGenerator-container");
            const scrollContainer = modal.querySelector(".main-trackCreditsModal-mainSection");
            const scrollContainerRect = scrollContainer.getBoundingClientRect();

            const dropdownHeight = dropdownRect.height;
            const margin = 9;
            const boundaryMargin = 20;

            const spaceBelow = scrollContainerRect.bottom - buttonRect.bottom;
            const spaceAbove = buttonRect.top - scrollContainerRect.top;

            if (spaceBelow >= dropdownHeight + margin + boundaryMargin) {
                dropdown.style.top = '100%';
                dropdown.style.marginTop = `${margin}px`;
            } else if (spaceAbove >= dropdownHeight + margin + boundaryMargin) {
                dropdown.style.bottom = '100%';
                dropdown.style.marginBottom = `${margin}px`;
            } else {
                if (spaceAbove > spaceBelow) {
                    dropdown.style.bottom = '100%';
                    dropdown.style.marginBottom = `${margin}px`;
                    dropdown.style.maxHeight = `${spaceAbove - margin - boundaryMargin}px`;
                    dropdown.style.overflowY = 'auto';
                } else {
                    dropdown.style.top = '100%';
                    dropdown.style.marginTop = `${margin}px`;
                    dropdown.style.maxHeight = `${spaceBelow - margin - boundaryMargin}px`;
                    dropdown.style.overflowY = 'auto';
                }
            }

            dropdown.style.display = 'block';
        });
    };

    const allDropdowns = [...allDateFormatContainers, ...allScrobbleContainers];
    setupSettingsButtonToggle(dateFormatSettingsBtn, dateFormatDropdownContainer, allDropdowns.filter(d => d !== dateFormatDropdownContainer));
    setupSettingsButtonToggle(myScrobblesSettingsBtn, myScrobblesDropdownContainer, allDropdowns.filter(d => d !== myScrobblesDropdownContainer));
    setupSettingsButtonToggle(albumDateFormatSettingsBtn, albumDateFormatDropdownContainer, allDropdowns.filter(d => d !== albumDateFormatDropdownContainer));
    setupSettingsButtonToggle(albumMyScrobblesSettingsBtn, albumMyScrobblesDropdownContainer, allDropdowns.filter(d => d !== albumMyScrobblesDropdownContainer));
    setupSettingsButtonToggle(artistDateFormatSettingsBtn, artistDateFormatDropdownContainer, allDropdowns.filter(d => d !== artistDateFormatDropdownContainer));
    setupSettingsButtonToggle(artistMyScrobblesSettingsBtn, artistMyScrobblesDropdownContainer, allDropdowns.filter(d => d !== artistMyScrobblesDropdownContainer));
    setupSettingsButtonToggle(secondDateFormatSettingsBtn, secondDateFormatDropdownContainer, allDropdowns.filter(d => d !== secondDateFormatDropdownContainer));
    setupSettingsButtonToggle(secondMyScrobblesSettingsBtn, secondMyScrobblesDropdownContainer, allDropdowns.filter(d => d !== secondMyScrobblesDropdownContainer));

    document.addEventListener('click', (event) => {
        allDropdowns.forEach(d => d.style.display = 'none');
    });

    playlistDeduplicateToggle.addEventListener("change", () => {
        playlistDeduplicate = playlistDeduplicateToggle.checked;
        saveSettings();
    });

    showRemovedDuplicatesToggle.addEventListener("change", () => {
        showRemovedDuplicates = showRemovedDuplicatesToggle.checked;
        saveSettings();
    });
  }

  function showFolderNameModal() {
    const overlay = document.createElement("div");
    overlay.id = "sort-play-folder-name-overlay";
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background-color: rgba(0, 0, 0, 0.7); z-index: 2002;
        display: flex; justify-content: center; align-items: center;
    `;

    const modalContainer = document.createElement("div");
    modalContainer.className = "main-embedWidgetGenerator-container sort-play-font-scope";
    modalContainer.style.zIndex = "2003";
    modalContainer.innerHTML = `
      <div class="main-trackCreditsModal-header">
          <h1 class="main-trackCreditsModal-title"><span style='font-size: 25px;'>Customize Folder Name</span></h1>
      </div>
      <div class="main-trackCreditsModal-originalCredits" style="padding: 20px 32px 20px !important;">
          <div style="display: flex; flex-direction: column; gap: 15px;">
              <div style="display: flex; flex-direction: column; gap: 5px;">
                  <label for="sortPlayFolderNameInput">Folder Name:</label>
                  <input type="text" id="sortPlayFolderNameInput" value="${sortPlayFolderName}" 
                        style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #282828; background: #282828; color: white;">
              </div>
              <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 10px;">
                  <button id="cancelFolderName" class="main-buttons-button" style="width: 83px; padding: 8px 16px; border-radius: 20px; border: none; cursor: pointer; background-color: #333333; color: white; font-weight: 550; font-size: 13px; text-transform: uppercase;">Cancel</button>
                  <button id="saveFolderName" class="main-buttons-button main-button-primary" style="padding: 8px 18px; border-radius: 20px; border: none; cursor: pointer; background-color: #1ED760; color: black; font-weight: 550; font-size: 13px; text-transform: uppercase;">Save</button>
              </div>
          </div>
      </div>
    `;
    
    document.body.appendChild(overlay);
    overlay.appendChild(modalContainer);
    document.getElementById("sortPlayFolderNameInput").focus();

    const closeModal = () => overlay.remove();

    document.getElementById("saveFolderName").addEventListener("click", () => {
      const newName = document.getElementById("sortPlayFolderNameInput").value.trim();
      if (newName) {
        sortPlayFolderName = newName;
        saveSettings();
        const tooltip = document.querySelector("#placePlaylistsInFolderSettingRow .custom-tooltip");
        if (tooltip) {
            tooltip.textContent = `Automatically place all created playlists inside a dedicated folder named "${sortPlayFolderName}".`;
        }
        closeModal();
      }
    });

    document.getElementById("cancelFolderName").addEventListener("click", closeModal);
    overlay.addEventListener("click", (e) => { if (e.target === overlay) closeModal(); });
  }

  function showNowPlayingSettingsModal(fromSettings = false) {
    const overlay = document.createElement("div");
    overlay.id = "sort-play-np-settings-overlay";
    const overlayBackgroundColor = fromSettings ? 'rgba(0, 0, 0, 0.7)' : 'transparent';
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background-color: ${overlayBackgroundColor}; z-index: 2002;
        display: flex; justify-content: center; align-items: center;
    `;

    const modalContainer = document.createElement("div");
    modalContainer.className = "main-embedWidgetGenerator-container sort-play-font-scope";
    modalContainer.style.cssText = `
        z-index: 2003;
        width: 600px !important;
    `;
    modalContainer.innerHTML = `
      <style>
        .np-settings-layout { display: flex; gap: 16px; }
        .np-settings-card { flex: 1; background-color: #282828; border-radius: 8px; padding: 16px; display: flex; flex-direction: column; gap: 16px; }
        .np-setting-row { display: flex; flex-direction: column; gap: 8px; }
        .np-setting-row label { color: #c1c1c1; font-weight: 500; }
        .np-setting-row select {
            padding: 6px 12px; border-radius: 4px; border: 1px solid #434343;
            background: #3e3e3e; color: white; cursor: pointer; font-size: 14px;
            width: 100%; text-align: left;
            height: 35px;
            box-sizing: border-box;
        }
        #np-dynamic-settings { margin-top: 8px; }
        #np-release-date-settings, #np-play-count-settings, #np-tempo-settings, #np-energy-settings, #np-danceability-settings, #np-valence-settings, #np-key-settings, #np-popularity-settings { display: none; }
        
        .custom-select-wrapper { position: relative; width: 100%; }
        .custom-select-trigger {
            width: 100%;
            padding: 6px 12px;
            border-radius: 4px;
            border: 1px solid #434343;
            background: #3e3e3e;
            color: white;
            cursor: pointer;
            font-size: 14px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            text-align: left;
            height: 35px;
            box-sizing: border-box;
        }
        #npSeparatorDisplay {
            display: flex;
            align-items: center;
            height: 100%;
        }
        .custom-select-trigger svg {
            width: 16px;
            height: 16px;
            transition: transform 0.2s ease;
        }
        .custom-select-trigger.open svg {
            transform: rotate(180deg);
        }
        #npSeparatorDropdown {
            display: none;
            position: absolute;
            bottom: calc(100% + 4px);
            left: 0;
            width: 100%;
            background-color: #282828;
            border: 1px solid #434343;
            border-radius: 4px;
            z-index: 10;
            padding: 8px;
            box-sizing: border-box;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        }
        .separator-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 8px;
        }
        .separator-option {
            background-color: #3e3e3e;
            border: 1px solid #434343;
            color: white;
            padding: 8px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            text-align: center;
            transition: background-color 0.2s ease;
        }
        .separator-option:hover {
            background-color: #555;
        }
        .separator-option.selected {
            background-color: #1ED760;
            color: black;
            border-color: #1ED760;
        }
      </style>
      <div class="main-trackCreditsModal-header">
          <h1 class="main-trackCreditsModal-title"><span style='font-size: 25px;'>Now Playing Data Settings</span></h1>
      </div>
      <div class="main-trackCreditsModal-originalCredits" style="padding: 20px 32px !important;">
          <div class="np-settings-layout">
              <div class="np-settings-card">
                  <div class="np-setting-row">
                      <label for="npDataType">Data to Display</label>
                      <select id="npDataType">
                          <option value="releaseDate" ${selectedNowPlayingDataType === 'releaseDate' ? 'selected' : ''}>Release Date</option>
                          <option value="playCount" ${selectedNowPlayingDataType === 'playCount' ? 'selected' : ''}>Play Count</option>
                          <option value="popularity" ${selectedNowPlayingDataType === 'popularity' ? 'selected' : ''}>Popularity</option>
                          <option value="tempo" ${selectedNowPlayingDataType === 'tempo' ? 'selected' : ''}>Tempo (BPM)</option>
                          <option value="energy" ${selectedNowPlayingDataType === 'energy' ? 'selected' : ''}>Energy</option>
                          <option value="danceability" ${selectedNowPlayingDataType === 'danceability' ? 'selected' : ''}>Danceability</option>
                          <option value="valence" ${selectedNowPlayingDataType === 'valence' ? 'selected' : ''}>Valence</option>
                          <option value="key" ${selectedNowPlayingDataType === 'key' ? 'selected' : ''}>Key</option>
                      </select>
                  </div>
                  <div id="np-dynamic-settings">
                      <div id="np-release-date-settings">
                          <div class="np-setting-row">
                              <label for="npDateFormatSelect">Release Date Style</label>
                              <select id="npDateFormatSelect">
                                  <option value="YYYY">YYYY</option>
                                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                  <option value="MM-DD-YYYY">MM-DD-YYYY</option>
                                  <option value="DD-MM-YYYY">DD-MM-YYYY</option>
                                  <option value="MMM D, YYYY">Month D, YYYY</option>
                                  <option value="D MMM, YYYY">D Month, YYYY</option>
                                  <option value="YYYY, MMM D">YYYY, Month D</option>
                                  <option value="YYYY-MM">YYYY-MM</option>
                                  <option value="MM-YYYY">MM-YYYY</option>
                              </select>
                          </div>
                      </div>
                      <div id="np-play-count-settings">
                          <div class="np-setting-row">
                              <label for="npPlayCountFormatSelect">Play Count Style</label>
                              <select id="npPlayCountFormatSelect">
                                  <option value="raw">Full (1,234,567)</option>
                                  <option value="abbreviated">Short (1.2M)</option>
                                  <option value="rounded_abbreviated">Simple (1M)</option>
                              </select>
                          </div>
                      </div>
                      <div id="np-popularity-settings">
                          <div class="np-setting-row">
                              <label for="npPopularityFormatSelect">Popularity Style</label>
                              <select id="npPopularityFormatSelect">
                                  <option value="raw">Raw Number (e.g., 75)</option>
                                  <option value="with_label">With Label (e.g., Pop: 75)</option>
                                  <option value="percentage">Percentage (e.g., 75%)</option>
                                  <option value="tier">Tier (e.g., Popular)</option>
                              </select>
                          </div>
                      </div>
                      <div id="np-tempo-settings">
                          <div class="np-setting-row">
                              <label for="npTempoFormatSelect">Tempo Style</label>
                              <select id="npTempoFormatSelect">
                                  <option value="with_unit">With Unit (120 BPM)</option>
                                  <option value="raw">Raw Number (120)</option>
                              </select>
                          </div>
                      </div>
                      <div id="np-energy-settings">
                          <div class="np-setting-row">
                              <label for="npEnergyFormatSelect">Energy Style</label>
                              <select id="npEnergyFormatSelect">
                                  <option value="percentage">Percentage (50%)</option>
                                  <option value="with_unit">With Unit (50 Energy)</option>
                                  <option value="raw">Raw (50)</option>
                                  <option value="decimal">Decimal (0.50)</option>
                                  <option value="tier">Tier (Medium)</option>
                              </select>
                          </div>
                      </div>
                      <div id="np-danceability-settings">
                          <div class="np-setting-row">
                              <label for="npDanceabilityFormatSelect">Danceability Style</label>
                              <select id="npDanceabilityFormatSelect">
                                  <option value="percentage">Percentage (50%)</option>
                                  <option value="with_unit">With Unit (50 Dance)</option>
                                  <option value="raw">Raw (50)</option>
                                  <option value="decimal">Decimal (0.50)</option>
                                  <option value="tier">Tier (Medium)</option>
                              </select>
                          </div>
                      </div>
                      <div id="np-valence-settings">
                          <div class="np-setting-row">
                              <label for="npValenceFormatSelect">Valence Style</label>
                              <select id="npValenceFormatSelect">
                                  <option value="percentage">Percentage (50%)</option>
                                  <option value="with_unit">With Unit (50 Valence)</option>
                                  <option value="raw">Raw (50)</option>
                                  <option value="decimal">Decimal (0.50)</option>
                                  <option value="tier">Tier (Medium)</option>
                              </select>
                          </div>
                      </div>
                      <div id="np-key-settings">
                          <div class="np-setting-row">
                              <label for="npKeyFormatSelect">Key Style</label>
                              <select id="npKeyFormatSelect">
                                  <option value="standard">Standard (e.g., C\u266F/D\u266D)</option>
                                  <option value="full_name">Full Name (e.g., C\u266F Minor)</option>
                                  <option value="camelot">Camelot (e.g., 12A)</option>
                                  <option value="openkey">Open Key (e.g., 5m)</option>
                              </select>
                          </div>
                      </div>
                  </div>
              </div>
              <div class="np-settings-card">
                  <div class="np-setting-row">
                      <label for="npDataPosition">Display Position</label>
                      <select id="npDataPosition">
                          <option value=".main-trackInfo-name" ${selectedNowPlayingDataPosition === '.main-trackInfo-name' ? 'selected' : ''}>Next to Title</option>
                          <option value=".main-trackInfo-artists" ${selectedNowPlayingDataPosition === '.main-trackInfo-artists' ? 'selected' : ''}>Next to Artist</option>
                      </select>
                  </div>
                  <div style="margin-top: 8px;">
                      <div class="np-setting-row">
                          <label>Separator Style</label>
                          <div class="custom-select-wrapper">
                              <button id="npSeparatorTrigger" class="custom-select-trigger">
                                  <span id="npSeparatorDisplay"></span>
                                  <svg fill="currentColor" viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"></path></svg>
                              </button>
                              <div id="npSeparatorDropdown">
                                  <div class="separator-grid">
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          <div style="display: flex; justify-content: flex-end; margin-top: 24px;">
              <button id="doneNowPlayingSettings" class="main-buttons-button main-button-primary" style="padding: 8px 18px; border-radius: 20px; border: none; cursor: pointer; background-color: #1ED760; color: black; font-weight: 550; font-size: 13px; text-transform: uppercase;">Done</button>
          </div>
      </div>
    `;
    
    document.body.appendChild(overlay);
    overlay.appendChild(modalContainer);

    const dataTypeSelect = modalContainer.querySelector("#npDataType");
    const dataPositionSelect = modalContainer.querySelector("#npDataPosition");
    const doneButton = modalContainer.querySelector("#doneNowPlayingSettings");
    
    const releaseDateSettings = modalContainer.querySelector("#np-release-date-settings");
    const dateFormatSelect = modalContainer.querySelector("#npDateFormatSelect");
    const playCountSettings = modalContainer.querySelector("#np-play-count-settings");
    const playCountFormatSelect = modalContainer.querySelector("#npPlayCountFormatSelect");
    const popularitySettings = modalContainer.querySelector("#np-popularity-settings");
    const popularityFormatSelect = modalContainer.querySelector("#npPopularityFormatSelect");
    const tempoSettings = modalContainer.querySelector("#np-tempo-settings");
    const tempoFormatSelect = modalContainer.querySelector("#npTempoFormatSelect");
    const energySettings = modalContainer.querySelector("#np-energy-settings");
    const energyFormatSelect = modalContainer.querySelector("#npEnergyFormatSelect");
    const danceabilitySettings = modalContainer.querySelector("#np-danceability-settings");
    const danceabilityFormatSelect = modalContainer.querySelector("#npDanceabilityFormatSelect");
    const valenceSettings = modalContainer.querySelector("#np-valence-settings");
    const valenceFormatSelect = modalContainer.querySelector("#npValenceFormatSelect");
    const keySettings = modalContainer.querySelector("#np-key-settings");
    const keyFormatSelect = modalContainer.querySelector("#npKeyFormatSelect");
    const separatorTrigger = modalContainer.querySelector("#npSeparatorTrigger");
    const separatorDisplay = modalContainer.querySelector("#npSeparatorDisplay");
    const separatorDropdown = modalContainer.querySelector("#npSeparatorDropdown");
    const separatorGrid = modalContainer.querySelector(".separator-grid");

    const separatorOptions = [
        { value: '•', text: '•' }, { value: '●', text: '●' }, { value: '▪', text: '▪' }, { value: '■', text: '■' },
        { value: '▢', text: '▢' }, { value: '|', text: '|' }, { value: '❚', text: '❚' }, { value: '-', text: '-' },
        { value: '–', text: '–' }, { value: '—', text: '—' }, { value: '/', text: '/' }, { value: '//', text: '//' },
        { value: '〢', text: '〢' }, { value: '::', text: '::' }, { value: '≡', text: '≡' }, { value: '►', text: '►' },
        { value: '▸', text: '▸' }, { value: '➔', text: '➔' }, { value: '◆', text: '◆' }, { value: '✦', text: '✦' },
        { value: '★', text: '★' }, { value: '✶', text: '✶' }, { value: '✵', text: '✵' }, { value: '✳', text: '✳' },
        { value: '♪', text: '♪' }, { value: '✕', text: '✕' }, { value: '╳', text: '╳' }, { value: ' ', text: 'ㅤ' }
    ];

    const initialOption = separatorOptions.find(opt => opt.value === selectedNowPlayingSeparator);
    separatorDisplay.textContent = initialOption ? initialOption.text : selectedNowPlayingSeparator;

    separatorOptions.forEach(option => {
        const optionButton = document.createElement('button');
        optionButton.className = 'separator-option';
        optionButton.textContent = option.text;
        optionButton.dataset.value = option.value;
        if (option.value === selectedNowPlayingSeparator) {
            optionButton.classList.add('selected');
        }
        optionButton.addEventListener('click', (e) => {
            e.stopPropagation();
            selectedNowPlayingSeparator = option.value;
            separatorDisplay.textContent = option.text;
            
            separatorGrid.querySelectorAll('.separator-option').forEach(btn => btn.classList.remove('selected'));
            optionButton.classList.add('selected');
            
            saveSettings();
            displayNowPlayingData();
        });
        separatorGrid.appendChild(optionButton);
    });

    separatorTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = separatorDropdown.style.display === 'block';
        separatorDropdown.style.display = isOpen ? 'none' : 'block';
        separatorTrigger.classList.toggle('open', !isOpen);
    });

    const closeDropdownHandler = (e) => {
        if (!separatorDropdown.contains(e.target) && e.target !== separatorTrigger && !separatorTrigger.contains(e.target)) {
            separatorDropdown.style.display = 'none';
            separatorTrigger.classList.remove('open');
        }
    };
    document.addEventListener('click', closeDropdownHandler, true);

    const closeModal = () => {
        document.removeEventListener('click', closeDropdownHandler, true);
        overlay.remove();
    };

    function updateDynamicSettingsVisibility() {
        const selectedType = dataTypeSelect.value;
        releaseDateSettings.style.display = selectedType === 'releaseDate' ? 'block' : 'none';
        playCountSettings.style.display = selectedType === 'playCount' ? 'block' : 'none';
        popularitySettings.style.display = selectedType === 'popularity' ? 'block' : 'none';
        tempoSettings.style.display = selectedType === 'tempo' ? 'block' : 'none';
        energySettings.style.display = selectedType === 'energy' ? 'block' : 'none';
        danceabilitySettings.style.display = selectedType === 'danceability' ? 'block' : 'none';
        valenceSettings.style.display = selectedType === 'valence' ? 'block' : 'none';
        keySettings.style.display = selectedType === 'key' ? 'block' : 'none';
    }

    dataTypeSelect.addEventListener("change", () => {
        selectedNowPlayingDataType = dataTypeSelect.value;
        const mainSettingsSelect = document.querySelector("#nowPlayingDataTypeSelect");
        if (mainSettingsSelect) mainSettingsSelect.value = selectedNowPlayingDataType;
        saveSettings();
        displayNowPlayingData();
        updateDynamicSettingsVisibility();
    });

    dataPositionSelect.addEventListener("change", () => {
        selectedNowPlayingDataPosition = dataPositionSelect.value;
        saveSettings();
        displayNowPlayingData();
    });

    dateFormatSelect.value = selectedNowPlayingDateFormat;
    dateFormatSelect.addEventListener("change", () => {
        selectedNowPlayingDateFormat = dateFormatSelect.value;
        saveSettings();
        displayNowPlayingData();
    });

    playCountFormatSelect.value = selectedNowPlayingPlayCountFormat;
    playCountFormatSelect.addEventListener("change", () => {
        selectedNowPlayingPlayCountFormat = playCountFormatSelect.value;
        saveSettings();
        displayNowPlayingData();
    });

    popularityFormatSelect.value = selectedNowPlayingPopularityFormat;
    popularityFormatSelect.addEventListener("change", () => {
        selectedNowPlayingPopularityFormat = popularityFormatSelect.value;
        saveSettings();
        displayNowPlayingData();
    });

    tempoFormatSelect.value = selectedNowPlayingTempoFormat;
    tempoFormatSelect.addEventListener("change", () => {
        selectedNowPlayingTempoFormat = tempoFormatSelect.value;
        saveSettings();
        displayNowPlayingData();
    });

    energyFormatSelect.value = selectedNowPlayingEnergyFormat;
    energyFormatSelect.addEventListener("change", () => {
        selectedNowPlayingEnergyFormat = energyFormatSelect.value;
        saveSettings();
        displayNowPlayingData();
    });

    danceabilityFormatSelect.value = selectedNowPlayingDanceabilityFormat;
    danceabilityFormatSelect.addEventListener("change", () => {
        selectedNowPlayingDanceabilityFormat = danceabilityFormatSelect.value;
        saveSettings();
        displayNowPlayingData();
    });

    valenceFormatSelect.value = selectedNowPlayingValenceFormat;
    valenceFormatSelect.addEventListener("change", () => {
        selectedNowPlayingValenceFormat = valenceFormatSelect.value;
        saveSettings();
        displayNowPlayingData();
    });

    keyFormatSelect.value = selectedNowPlayingKeyFormat;
    keyFormatSelect.addEventListener("change", () => {
        selectedNowPlayingKeyFormat = keyFormatSelect.value;
        saveSettings();
        displayNowPlayingData();
    });

    doneButton.addEventListener("click", closeModal);
    overlay.addEventListener("click", (e) => { if (e.target === overlay) closeModal(); });

    updateDynamicSettingsVisibility();
  }

  function showSupportModal() {
    const overlay = document.createElement("div");
    overlay.id = "sort-play-support-overlay";
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        z-index: 2002;
        display: flex; justify-content: center; align-items: center;
    `;

    const modalContainer = document.createElement("div");
    modalContainer.className = "main-embedWidgetGenerator-container sort-play-font-scope";
    modalContainer.style.cssText = `
        z-index: 2003;
        width: 500px !important;
        display: flex;
        flex-direction: column;
    `;

    const wallets = [
        { name: 'USDT (TRC20) / TRON', address: 'TU3tiVV3NLmFetXrsAZnuE9qu8JVSHDuAH' },
        { name: 'TON', address: 'UQAFHn9aGKqTn1Vku5xSuPCkkvVbnfnN20B1RwijthZ8a2OE' },
        { name: 'Bitcoin (BTC)', address: 'bc1q0vvhyffnk8s0g9hnf4k2c7z6ys3r2d7x6fjnvv' },
    ];

    let walletsHtml = wallets.map(wallet => `
        <div class="wallet-entry">
            <label class="wallet-label">${wallet.name}</label>
            <div class="wallet-address-container">
                <input type="text" class="wallet-address" value="${wallet.address}" readonly>
                <button class="copy-button" data-address="${wallet.address}" title="Copy Address">
                    ${copyIconSVG}
                </button>
            </div>
        </div>
    `).join('');

    modalContainer.innerHTML = `
      <style>
        .support-modal-content { display: flex; flex-direction: column; gap: 16px; }
        .wallet-entry { display: flex; flex-direction: column; gap: 6px; }
        .wallet-label { color: #c1c1c1; font-size: 14px; font-weight: 500; }
        .wallet-address-container { display: flex; align-items: center; gap: 8px; }
        .wallet-address { 
            flex-grow: 1; 
            background-color: #121212; 
            border: 1px solid #333; 
            border-radius: 4px; 
            padding: 8px 12px; 
            color: #fff; 
            font-family: monospace; 
            font-size: 11px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .copy-button { 
            flex-shrink: 0;
            background-color: #333; 
            border: 1px solid #555;
            color: #fff; 
            padding: 6px 6px; 
            border-radius: 4px; 
            cursor: pointer; 
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background-color 0.2s ease;
            width: 32px;
            height: 32px;
        }
        .copy-button:hover { background-color: #444; }
        .copy-button.copied {
            background-color: #1ED760;
            color: black;
        }
        .copy-button.copied:hover {
            background-color: #1ED760;
        }
        .copy-button svg { width: 16px; height: 16px; }
      </style>
      <div class="main-trackCreditsModal-header">
          <h1 class="main-trackCreditsModal-title"><span style='font-size: 25px;'>Support Sort-Play</span></h1>
      </div>
      <div class="main-trackCreditsModal-mainSection" style="padding: 22px 47px 20px !important; max-height: 60vh; flex-grow: 1;">
        <p style="color: #c1c1c1; font-size: 16px; margin-bottom: 25px;">If you enjoy using Sort-Play, please consider supporting its development. Thank you!</p>
        <div class="support-modal-content">
            ${walletsHtml}
        </div>
      </div>
      <div class="main-trackCreditsModal-originalCredits" style="padding: 15px 24px !important; border-top: 1px solid #282828; flex-shrink: 0;">
        <div style="display: flex; justify-content: flex-end;">
            <button id="closeSupportModal" class="main-buttons-button main-button-primary" 
                    style="background-color: #1ED760; color: black; padding: 8px 18px; border-radius: 20px; font-weight: 550; font-size: 13px; text-transform: uppercase; border: none; cursor: pointer;">
                Done
            </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(overlay);
    overlay.appendChild(modalContainer);

    modalContainer.querySelectorAll('.copy-button').forEach(button => {
        button.addEventListener('click', () => {
            const address = button.dataset.address;
            navigator.clipboard.writeText(address).then(() => {
                Spicetify.showNotification('Address copied to clipboard!');
                button.classList.add('copied');
                setTimeout(() => {
                    button.classList.remove('copied');
                }, 1000);
            }, (err) => {
                Spicetify.showNotification('Failed to copy address.', true);
                console.error('Could not copy text: ', err);
            });
        });
    });

    const closeModal = () => overlay.remove();
    
    const doneButton = modalContainer.querySelector("#closeSupportModal");
    if (doneButton) {
        doneButton.addEventListener("click", closeModal);
        
        doneButton.addEventListener("mouseenter", () => {
            doneButton.style.backgroundColor = "#3BE377";
        });
        doneButton.addEventListener("mouseleave", () => {
            doneButton.style.backgroundColor = "#1ED760";
        });
    }

    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
            closeModal();
        }
    });
  }

  function showCreatePlaylistModal() {
    const overlay = document.createElement("div");
    overlay.id = "sort-play-create-playlist-overlay";
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        z-index: 2002;
        display: flex; justify-content: center; align-items: center;
    `;

    
    const modalContainer = document.createElement("div");
    modalContainer.className = "main-embedWidgetGenerator-container sort-play-font-scope";
    modalContainer.style.cssText = `
        z-index: 2003;
        width: 1050px !important;
        background-color: #181818 !important;
        border: 1px solid #282828;
        display: flex;
        flex-direction: column;
        border-radius: 30px;
    `;

    const STORAGE_KEY_CREATE_PLAYLIST_COLLAPSE_STATE = "sort-play-create-playlist-collapse-state";
    let collapseState = JSON.parse(localStorage.getItem(STORAGE_KEY_CREATE_PLAYLIST_COLLAPSE_STATE) || '{}');
    let dedicatedPlaylistBehavior = JSON.parse(localStorage.getItem(STORAGE_KEY_DEDICATED_PLAYLIST_BEHAVIOR) || '{}');
    const jobs = getDedicatedJobs();
    const customSchedules = getCustomSchedules();

    jobs.forEach(job => {
        if (job.dedicatedType && dedicatedJobRunners[job.dedicatedType]) {
            dedicatedPlaylistBehavior[job.dedicatedType] = 'autoUpdate';
        }
    });
    Object.keys(dedicatedPlaylistBehavior).forEach(cardId => {
        if (dedicatedPlaylistBehavior[cardId] === 'autoUpdate' && !jobs.some(job => job.dedicatedType === cardId)) {
            delete dedicatedPlaylistBehavior[cardId];
        }
    });
    localStorage.setItem(STORAGE_KEY_DEDICATED_PLAYLIST_BEHAVIOR, JSON.stringify(dedicatedPlaylistBehavior));

    const scheduleToTextMap = {
        10800000: 'Every 3 Hours', 21600000: 'Every 6 Hours', 43200000: 'Every 12 Hours',
        86400000: 'Daily', 172800000: 'Every 2 Days', 604800000: 'Weekly', 2592000000: 'Monthly',
        'release-weekly': 'Weekly (on Friday)',
        'release-every-two-weeks': 'Every Two Weeks (Fri)',
        'release-monthly': 'Monthly (on a Friday)'
    };
    
    const scheduleToShortTextMap = {
        'release-every-two-weeks': 'Every 2 Weeks (Fri)',
        'release-monthly': 'Monthly (Fri)'
    };
    
    customSchedules.forEach(s => { scheduleToTextMap[s.value] = s.text; });

    let contentHtml = '';
    playlistCardsData.forEach(section => {
        const isCollapsed = collapseState[section.title] || false;
        
        contentHtml += `
            <div class="collapsible-section-header" data-section-title="${section.title}" role="button" tabindex="0">
                <h2 class="create-playlist-section-title">${section.title}</h2>
                <svg class="chevron-icon ${isCollapsed ? 'collapsed' : ''}" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg>
            </div>
        `;
        contentHtml += `<div class="create-playlist-grid ${isCollapsed ? 'collapsed' : ''}">`;
        section.cards.forEach(card => {
            const behavior = dedicatedPlaylistBehavior[card.id] || 'createOnce';
            let autoUpdateOptionText = "Create & Auto-Update";

            if (behavior === 'autoUpdate') {
                const job = jobs.find(j => j.dedicatedType === card.id);
                if (job && job.schedule) {
                    const shortText = scheduleToShortTextMap[job.schedule];
                    const fullText = scheduleToTextMap[job.schedule];
                    if (shortText) {
                        autoUpdateOptionText = `Update ${shortText}`;
                    } else if (fullText) {
                        autoUpdateOptionText = `Update ${fullText}`;
                    }
                }
            }

            let settingsHtml = '';
            if (card.id !== 'genreTreeExplorer') {
                settingsHtml = `
                    <div class="card-settings">
                        <span class="card-settings-title">Create Mode:</span>
                        <div class="card-settings-controls">
                            <button class="card-settings-btn" data-id="${card.id}" data-name="${card.name}" title="Configure Auto-Update" style="display: ${behavior === 'autoUpdate' ? 'flex' : 'none'};">
                            ${settingsSvg.replace('<svg', '<svg fill="#ffffff"')}
                            </button>
                            <select class="card-behavior-select" data-id="${card.id}">
                                <option value="createOnce" ${behavior === 'createOnce' ? 'selected' : ''}>Create Once</option>
                                <option value="replace" ${behavior === 'replace' ? 'selected' : ''}>Create & Replace</option>
                                <option value="autoUpdate" ${behavior === 'autoUpdate' ? 'selected' : ''}>${autoUpdateOptionText}</option>
                            </select>
                        </div>
                    </div>
                `;
            } else {
                 settingsHtml = `<div class="card-settings" style="height: 41px;"></div>`;
            }

            contentHtml += `
                <div class="playlist-card-wrapper">
                    <div class="playlist-card" data-id="${card.id}" role="button" tabindex="0">
                        <div class="card-thumbnail-container">
                            <img src="${card.thumbnailUrl}" alt="${card.name}" class="card-thumbnail">
                        </div>
                        <div class="card-content">
                            <h3 class="card-title">${card.name}</h3>
                            <p class="card-description">${card.description}</p>
                        </div>
                    </div>
                    ${settingsHtml}
                </div>
            `;
        });
        contentHtml += `</div>`;
    });

    modalContainer.innerHTML = `
      <style>
        .create-playlist-modal { display: flex; flex-direction: column; gap: 10px; }
        .collapsible-section-header { display: flex; justify-content: space-between; align-items: center; cursor: pointer; margin: 7px 0; }
        .create-playlist-section-title { color: white; font-weight: 700; font-size: 1.4rem; margin: 0; }
        .chevron-icon { color: #b3b3b3; transition: transform 0.2s ease-in-out; }
        .chevron-icon.collapsed { transform: rotate(-90deg); }
        .create-playlist-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; overflow: hidden; max-height: 1000px; transition: all 0.2s ease-in-out; margin-top: 0; opacity: 1; }
        .create-playlist-grid.collapsed { max-height: 0; margin-top: -10px; opacity: 0; }
        .playlist-card-wrapper { background-color: #212121; border: 1px solid transparent; border-radius: 8px; display: flex; flex-direction: column; overflow: hidden; }
        .playlist-card:hover { background-color: #282828; }
        .playlist-card { padding: 10px; display: flex; flex-direction: row; align-items: center; gap: 16px; cursor: pointer; flex-grow: 1; transition: background-color 0.2s ease; }
        .card-thumbnail-container { width: 60px; height: 60px; flex-shrink: 0; border-radius: 6px; overflow: hidden; background-color: #333; }
        .card-thumbnail { width: 100%; height: 100%; object-fit: cover; }
        .card-content { flex-grow: 1; min-width: 0; }
        .card-title { font-size: 0.9rem; font-weight: 700; color: #fff; margin: 0 0 2px 0; }
        .card-description { font-size: 0.85rem; color: #b3b3b3; margin: 0; line-height: 1.4; }
        .card-settings { display: flex; align-items: center; justify-content: space-between; padding: 8px 10px; border-top: 1px solid #333;}
        .card-settings-title { font-size: 0.8rem; font-weight: 500; color: #b3b3b3; }
        .card-settings-controls { display: flex; align-items: center; gap: 8px; }
        .card-settings-btn { background: none; border: none; cursor: pointer; padding: 4px; color: #b3b3b3; display: flex; align-items: center; justify-content: center; }
        .card-settings-btn:hover { color: white; }
        .card-settings-btn svg { width: 16px; height: 16px; }
        .card-behavior-select { background: #212121; color: white; border: 1px solid #444; border-radius: 4px; padding: 3px 8px; font-size: 12px; cursor: pointer; }
        .main-trackCreditsModal-closeBtn { background: transparent; border: 0; padding: 0; color: #b3b3b3; cursor: pointer; transition: color 0.2s ease; }
        .main-trackCreditsModal-closeBtn:hover { color: #ffffff; }
      </style>
      <div class="main-trackCreditsModal-header" style="border-bottom: 1px solid #282828; display: flex; justify-content: space-between; align-items: center;">
          <h1 class="main-trackCreditsModal-title"><span style='font-size: 25px; font-weight: 700;'>Dedicated Playlist Creation</span></h1>
          <button id="closeCreatePlaylistModal" aria-label="Close" class="main-trackCreditsModal-closeBtn">
            <svg width="18" height="18" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M31.098 29.794L16.955 15.65 31.097 1.51 29.683.093 15.54 14.237 1.4.094-.016 1.508 14.126 15.65-.016 29.795l1.414 1.414L15.54 17.065l14.144 14.143" fill="currentColor" fill-rule="evenodd"></path></svg>
          </button>
      </div>
      <div class="main-trackCreditsModal-mainSection" style="padding: 24px 32px 38px !important; max-height: 80vh; flex-grow: 1; overflow-y: auto;">
        <div class="create-playlist-modal">${contentHtml}</div>
      </div>
    `;
    
    document.body.appendChild(overlay);
    overlay.appendChild(modalContainer);

    const closeModal = () => overlay.remove();

    modalContainer.querySelectorAll('.playlist-card').forEach(card => {
        card.addEventListener('click', () => {
            const sortType = card.getAttribute('data-id');
            const behavior = dedicatedPlaylistBehavior[sortType] || 'createOnce';
            
            if (behavior === 'autoUpdate') {
                const jobs = getDedicatedJobs();
                const job = jobs.find(j => j.dedicatedType === sortType);
                if (job) {
                    job.lastRun = Date.now();
                    updateDedicatedJob(job);
                }
            }

            closeModal();
            if (sortType === 'genreTreeExplorer') {
                showGenreTreeExplorerModal();
            } else if (sortType === 'randomGenreExplorer') {
                generateRandomGenrePlaylist();
            } else {
                handleSortAndCreatePlaylist(sortType);
            }
        });
    });

    modalContainer.querySelectorAll('.card-behavior-select').forEach(select => {
        select.addEventListener('change', async (e) => {
            const cardId = e.target.dataset.id;
            const newBehavior = e.target.value;
            const oldBehavior = dedicatedPlaylistBehavior[cardId] || 'createOnce';
            dedicatedPlaylistBehavior[cardId] = newBehavior;
            localStorage.setItem(STORAGE_KEY_DEDICATED_PLAYLIST_BEHAVIOR, JSON.stringify(dedicatedPlaylistBehavior));

            const settingsBtn = modalContainer.querySelector(`.card-settings-btn[data-id="${cardId}"]`);
            if (settingsBtn) {
                settingsBtn.style.display = newBehavior === 'autoUpdate' ? 'flex' : 'none';
            }

            if (newBehavior === 'autoUpdate' && oldBehavior !== 'autoUpdate') {
                const cardName = modalContainer.querySelector(`.playlist-card[data-id="${cardId}"] .card-title`).textContent;
                
                const newScheduleText = await showDedicatedScheduleModal(cardId, cardName);

                if (newScheduleText) {
                    const autoUpdateOption = select.querySelector('option[value="autoUpdate"]');
                    if (autoUpdateOption) {
                        autoUpdateOption.textContent = newScheduleText;
                        select.value = 'autoUpdate';
                    }
                } else {
                    select.value = oldBehavior;
                    dedicatedPlaylistBehavior[cardId] = oldBehavior;
                    localStorage.setItem(STORAGE_KEY_DEDICATED_PLAYLIST_BEHAVIOR, JSON.stringify(dedicatedPlaylistBehavior));
                    if (settingsBtn) {
                        settingsBtn.style.display = oldBehavior === 'autoUpdate' ? 'flex' : 'none';
                    }
                }
            } else if (newBehavior !== 'autoUpdate' && oldBehavior === 'autoUpdate') {
                const jobs = getDedicatedJobs();
                const job = jobs.find(j => j.dedicatedType === cardId);
                if (job) {
                    deleteDedicatedJob(job.id);
                    Spicetify.showNotification(`Auto-update disabled for "${job.targetPlaylistName || cardId}".`);
                }
                const autoUpdateOption = select.querySelector('option[value="autoUpdate"]');
                if (autoUpdateOption) {
                    autoUpdateOption.textContent = "Create & Auto-Update";
                }
            }
        });
    });

    modalContainer.querySelectorAll('.card-settings-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const cardId = e.currentTarget.dataset.id;
            const cardName = e.currentTarget.dataset.name;
            const selectElement = e.currentTarget.closest('.card-settings-controls').querySelector('.card-behavior-select');

            const newScheduleText = await showDedicatedScheduleModal(cardId, cardName);

            if (newScheduleText) {
                const autoUpdateOption = selectElement.querySelector('option[value="autoUpdate"]');
                if (autoUpdateOption) {
                    autoUpdateOption.textContent = newScheduleText;
                    selectElement.value = 'autoUpdate';
                }
            }
        });
    });

    modalContainer.querySelectorAll('.collapsible-section-header').forEach(header => {
        header.addEventListener('click', () => {
            const sectionTitle = header.dataset.sectionTitle;
            const grid = header.nextElementSibling;
            const chevron = header.querySelector('.chevron-icon');
            const isNowCollapsed = !grid.classList.contains('collapsed');
            grid.classList.toggle('collapsed', isNowCollapsed);
            chevron.classList.toggle('collapsed', isNowCollapsed);
            collapseState[sectionTitle] = isNowCollapsed;
            localStorage.setItem(STORAGE_KEY_CREATE_PLAYLIST_COLLAPSE_STATE, JSON.stringify(collapseState));
        });
    });

    modalContainer.querySelector("#closeCreatePlaylistModal").addEventListener("click", closeModal);
    overlay.addEventListener("click", (e) => { if (e.target === overlay) closeModal(); });
  }

  function showDedicatedScheduleModal(cardId, cardName) {
    return new Promise((resolve) => {
        const overlay = document.createElement("div");
        overlay.id = "sort-play-dedicated-schedule-overlay";
        overlay.className = "sort-play-font-scope";
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background-color: rgba(0, 0, 0, 0.7); z-index: 2004;
            display: flex; justify-content: center; align-items: center;
        `;

        const modalContainer = document.createElement("div");
        modalContainer.className = "main-embedWidgetGenerator-container";
        modalContainer.style.zIndex = "2005";
        modalContainer.style.width = "500px";
        modalContainer.style.borderRadius = "20px";
        
        
        const scheduleToShortTextMap = {
            'release-every-two-weeks': 'Every 2 Weeks (Fri)',
            'release-monthly': 'Monthly (Fri)'
        };
        
        const jobs = getDedicatedJobs();
        const job = jobs.find(j => j.dedicatedType === cardId);
        const currentSchedule = job ? job.schedule : '86400000';

        const customSchedules = getCustomSchedules();
        const customScheduleOptions = customSchedules.map(s => `<option value="${s.value}" ${String(currentSchedule) === String(s.value) ? 'selected' : ''}>${s.text}</option>`).join('');

        let clearAndSeparatorHtml = '';
        if (customSchedules.length > 0) {
            clearAndSeparatorHtml = `
                <option value="clear-custom" style="color: #f15e6c; font-style: italic;">Clear Custom Schedules...</option>
            `;
        }

        modalContainer.innerHTML = `
          <style>
            .form-select {
                width: 100%; background: #282828; color: white; border: 1px solid #666;
                border-radius: 15px; padding: 8px 12px; padding-right: 32px; font-size: 13px; cursor: pointer;
                -webkit-appearance: none; -moz-appearance: none; appearance: none;
                background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
                background-repeat: no-repeat; background-position: right 12px center; background-size: 16px;
            }
            .custom-schedule-container { display: none; align-items: center; gap: 8px; margin-top: 16px; padding: 10px; background-color: #3e3e3e; border-radius: 8px; }
            .custom-schedule-container.visible { display: flex; }
            .custom-schedule-container input[type="number"] { width: 60px; padding: 6px; border-radius: 4px; border: 1px solid #666; background-color: #282828; color: white; text-align: center; }
            .custom-schedule-container label { font-size: 12px; color: #b3b3b3; }
            .custom-schedule-ok-btn { padding: 6px 12px; border-radius: 15px; border: none; background-color: #1ed760; color: black; font-weight: bold; cursor: pointer; }
            .main-buttons-button.main-button-primary { background-color: #1ED760; color: black; transition: background-color 0.1s ease;}
            .main-buttons-button.main-button-primary:hover { background-color: #3BE377; }
            .main-buttons-button.main-button-secondary { background-color: #333333; color: white; transition: background-color 0.1s ease; }
            .main-buttons-button.main-button-secondary:hover { background-color: #444444; }
          </style>
          <div class="main-trackCreditsModal-header">
              <h1 class="main-trackCreditsModal-title"><span style='font-size: 25px;'>Auto-Update Schedule</span></h1>
          </div>
          <div class="main-trackCreditsModal-originalCredits" style="padding: 20px 32px !important;">
              <p style="color: #c1c1c1; font-size: 16px; margin-bottom: 20px;">Set the update frequency for "${cardName}":</p>
              <select id="dedicated-schedule-select" class="form-select" style="width: 100%; margin-bottom: 10px;">
                  <option value="10800000" ${String(currentSchedule) === '10800000' ? 'selected' : ''}>Every 3 Hours</option>
                  <option value="21600000" ${String(currentSchedule) === '21600000' ? 'selected' : ''}>Every 6 Hours</option>
                  <option value="43200000" ${String(currentSchedule) === '43200000' ? 'selected' : ''}>Every 12 Hours</option>
                  <option value="86400000" ${String(currentSchedule) === '86400000' ? 'selected' : ''}>Daily</option>
                  <option value="172800000" ${String(currentSchedule) === '172800000' ? 'selected' : ''}>Every 2 Days</option>
                  <option value="604800000" ${String(currentSchedule) === '604800000' ? 'selected' : ''}>Weekly</option>
                  <option value="2592000000" ${String(currentSchedule) === '2592000000' ? 'selected' : ''}>Monthly</option>
                  <option disabled>- Release Day Schedules -</option>
                  <option value="release-weekly" ${currentSchedule === 'release-weekly' ? 'selected' : ''}>Weekly (on Friday)</option>
                  <option value="release-every-two-weeks" ${currentSchedule === 'release-every-two-weeks' ? 'selected' : ''}>Every Two Weeks (on Friday)</option>
                  <option value="release-monthly" ${currentSchedule === 'release-monthly' ? 'selected' : ''}>Monthly (on a Friday)</option>
                  <option disabled>- Custom Schedules -</option>
                  ${customScheduleOptions}
                  <option value="custom">+ Custom</option>
                  ${clearAndSeparatorHtml}
              </select>
              <div id="custom-schedule-container" class="custom-schedule-container">
                  <input type="number" id="days" min="0" value="0"><label for="days">d</label>
                  <input type="number" id="hours" min="0" max="23" value="0"><label for="hours">h</label>
                  <input type="number" id="minutes" min="0" max="59" value="0"><label for="minutes">m</label>
                  <button id="set-custom-schedule-btn" class="custom-schedule-ok-btn">Set</button>
              </div>
              <div id="custom-schedule-error" style="color: #f15e6c; font-size: 12px; text-align: right; margin-top: 4px; display: none;"></div>
              <label id="custom-schedule-min-label" style="font-size: 12px; color: #b3b3b3; text-align: right; display: none; margin-top: 4px;">Minimum: ${SCHEDULER_INTERVAL_MINUTES} minutes</label>
              <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;">
                  <button id="cancel-schedule" class="main-buttons-button main-button-secondary" style="padding: 8px 18px; border-radius: 20px; font-weight: 550; font-size: 13px; text-transform: uppercase; cursor: pointer; border: none;">Cancel</button>
                  <button id="save-schedule" class="main-buttons-button main-button-primary" style="padding: 8px 18px; border-radius: 20px; font-weight: 550; font-size: 13px; text-transform: uppercase; cursor: pointer; border: none;">Save</button>
              </div>
          </div>
        `;
        
        document.body.appendChild(overlay);
        overlay.appendChild(modalContainer);

        const closeModal = () => overlay.remove();

        const scheduleSelect = modalContainer.querySelector('#dedicated-schedule-select');
        const customScheduleContainer = modalContainer.querySelector('#custom-schedule-container');
        const minLabel = modalContainer.querySelector('#custom-schedule-min-label');
        let previousScheduleValue = scheduleSelect.value;

        scheduleSelect.addEventListener('change', async (e) => {
            const selectedValue = e.target.value;

            if (selectedValue === 'clear-custom') {
                e.target.value = previousScheduleValue;
                const confirmed = await showConfirmationModal({
                    title: "Clear Custom Schedules?",
                    description: "This will permanently remove all of your saved custom schedules. This action cannot be undone.",
                    confirmText: "Clear All",
                    cancelText: "Cancel",
                });
                if (confirmed === 'confirm') {
                    saveCustomSchedules([]);
                    Spicetify.showNotification("All custom schedules have been cleared.");
                    closeModal();
                    resolve(await showDedicatedScheduleModal(cardId, cardName));
                }
            } else {
                const isCustom = selectedValue === 'custom';
                customScheduleContainer.classList.toggle('visible', isCustom);
                minLabel.style.display = isCustom ? 'block' : 'none';
                if (!isCustom) {
                    previousScheduleValue = selectedValue;
                }
            }
        });

        modalContainer.querySelector('#set-custom-schedule-btn').addEventListener('click', () => {
            const errorDiv = modalContainer.querySelector('#custom-schedule-error');
            errorDiv.style.display = 'none';

            const days = parseInt(modalContainer.querySelector('#days').value) || 0;
            const hours = parseInt(modalContainer.querySelector('#hours').value) || 0;
            const minutes = parseInt(modalContainer.querySelector('#minutes').value) || 0;
            
            const totalMs = (days * 86400000) + (hours * 3600000) + (minutes * 60000);
            const minMs = SCHEDULER_INTERVAL_MINUTES * 60 * 1000;

            if (totalMs < minMs) {
                errorDiv.textContent = `Schedule must be at least ${SCHEDULER_INTERVAL_MINUTES} minutes.`;
                errorDiv.style.display = 'block';
                return;
            }

            let text = 'Every ';
            if (days > 0) text += `${days}d `;
            if (hours > 0) text += `${hours}h `;
            if (minutes > 0) text += `${minutes}m`;
            text = text.trim();

            const customSchedules = getCustomSchedules();
            if (!customSchedules.some(s => s.value === totalMs)) {
                customSchedules.push({ value: totalMs, text });
                saveCustomSchedules(customSchedules);
            }

            const customOption = document.createElement('option');
            customOption.value = totalMs;
            customOption.textContent = text;
            scheduleSelect.insertBefore(customOption, scheduleSelect.querySelector('option[value="custom"]'));
            scheduleSelect.value = totalMs;
            previousScheduleValue = totalMs;
            customScheduleContainer.classList.remove('visible');
            minLabel.style.display = 'none';
        });

        document.getElementById("save-schedule").addEventListener("click", () => {
            const errorDiv = modalContainer.querySelector('#custom-schedule-error');
            errorDiv.style.display = 'none';

            if (scheduleSelect.value === 'custom') {
                errorDiv.textContent = "Please 'Set' your custom schedule or choose another option before saving.";
                errorDiv.style.display = 'block';
                return;
            }

            const newSchedule = scheduleSelect.value;
            const newScheduleValue = isNaN(parseInt(newSchedule)) ? newSchedule : parseInt(newSchedule);

            const jobs = getDedicatedJobs();
            let job = jobs.find(j => j.dedicatedType === cardId);

            if (job) {
                job.schedule = newScheduleValue;
                updateDedicatedJob(job);
            } else {
                const newJob = {
                    id: crypto.randomUUID(),
                    dedicatedType: cardId,
                    targetPlaylistName: cardName,
                    schedule: newScheduleValue,
                    createdAt: Date.now(),
                    lastRun: null,
                };
                addDedicatedJob(newJob);
            }
            
            Spicetify.showNotification("Auto-update schedule saved!");
            
            const fullScheduleText = scheduleSelect.options[scheduleSelect.selectedIndex].text;
            const shortScheduleText = scheduleToShortTextMap[newScheduleValue];
            const finalScheduleText = shortScheduleText || fullScheduleText;

            closeModal();
            resolve(`Update ${finalScheduleText}`);
        });

        document.getElementById("cancel-schedule").addEventListener("click", () => {
            closeModal();
            resolve(null);
        });

        overlay.addEventListener("click", (e) => { 
            if (e.target === overlay) {
                closeModal();
                resolve(null);
            }
        });
    });
  }

  async function showConfirmationModal({ title, description, confirmText, cancelText, neutralText }) {
    return new Promise((resolve) => {
      const overlay = document.createElement("div");
      overlay.id = "sort-play-confirmation-overlay";
      overlay.style.cssText = `
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background-color: rgba(0, 0, 0, 0.7);
          z-index: 2002;
          display: flex; justify-content: center; align-items: center;
      `;

      const modalContainer = document.createElement("div");
      modalContainer.className = "main-embedWidgetGenerator-container sort-play-font-scope";
      modalContainer.style.cssText = `
          z-index: 2003;
          width: 420px !important;
          background-color: #181818 !important;
          border: 1px solid #282828;
          display: flex;
          flex-direction: column;
          border-radius: 30px;
      `;
      
      const neutralButtonHtml = neutralText
        ? `<button id="neutralAction" class="sp-confirm-btn sp-confirm-btn-secondary">${neutralText}</button>`
        : '';

      modalContainer.innerHTML = `
        <style>
            .sp-confirm-btn {
                width: auto;
                padding: 8px 18px;
                border-radius: 20px;
                border: none;
                cursor: pointer;
                font-weight: 550;
                font-size: 13px;
                text-transform: uppercase;
                transition: background-color 0.2s ease;
            }
            .sp-confirm-btn-primary {
                background-color: #1ED760;
                color: black;
            }
            .sp-confirm-btn-primary:hover {
                background-color: #3BE377;
            }
            .sp-confirm-btn-secondary {
                background-color: #333333;
                color: white;
                 padding: 8px 16px;
            }
            .sp-confirm-btn-secondary:hover {
                background-color: #444444;
            }
        </style>
        <div class="main-trackCreditsModal-header" style="padding: 27px 32px 12px !important;">
            <h1 class="main-trackCreditsModal-title"><span style='font-size: 25px;'>${title}</span></h1>
        </div>
        <div class="main-trackCreditsModal-mainSection" style="padding: 16px 32px 9px 32px;">
            <p style="color: #c1c1c1; font-size: 16px; margin-bottom: 25px; line-height: 1.5;">${description}</p>
        </div>
        <div class="main-trackCreditsModal-originalCredits" style="padding: 15px 24px !important; border-top: 1px solid #282828; flex-shrink: 0;">
            <div style="display: flex; justify-content: flex-end; gap: 10px;">
                <button id="cancelConfirm" class="sp-confirm-btn sp-confirm-btn-secondary">${cancelText}</button>
                ${neutralButtonHtml}
                <button id="confirmAction" class="sp-confirm-btn sp-confirm-btn-primary">${confirmText}</button>
            </div>
        </div>
      `;

      document.body.appendChild(overlay);
      overlay.appendChild(modalContainer);

      const closeModal = (result) => {
          overlay.remove();
          resolve(result);
      };

      modalContainer.querySelector("#confirmAction").addEventListener("click", () => closeModal('confirm'));
      modalContainer.querySelector("#cancelConfirm").addEventListener("click", () => closeModal('cancel'));
      if (neutralText) {
        modalContainer.querySelector("#neutralAction").addEventListener("click", () => closeModal('neutral'));
      }
      overlay.addEventListener("click", (e) => {
          if (e.target === overlay) {
              e.preventDefault();
              e.stopPropagation();
          }
      });
    });
  }
  
  function showDetailedError(error, context) {
    let location = "unknown location";
    if (error.stack) {
        const stackLines = error.stack.split('\n');
        if (stackLines.length > 1) {
            location = stackLines[1].trim();
        }
    }
    const errorMessage = `${context}: ${error.message}\n${location}`;
    Spicetify.showNotification(errorMessage, true, 8000);
    console.error(`[Sort-Play] ${context}:`, error);
  }

  function formatPlayCount(count, format) {
    if (count === null || count === undefined || isNaN(count) || count === "N/A") {
        return '_';
    }

    const num = Number(count);

    if (format === 'abbreviated') {
        if (num >= 1_000_000_000) {
            return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
        }
        if (num >= 1_000_000) {
            return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
        }
        if (num >= 1_000) {
            return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
        }
        return num.toString();
    } else if (format === 'rounded_abbreviated') {
        if (num >= 1_000_000_000) {
            return Math.round(num / 1_000_000_000) + 'B';
        }
        if (num >= 1_000_000) {
            return Math.round(num / 1_000_000) + 'M';
        }
        if (num >= 1_000) {
            return Math.round(num / 1_000) + 'K';
        }
        return num.toString();
    }

    return new Intl.NumberFormat('en-US').format(num);
  }

  function formatTempo(value, format) {
    if (value === null || isNaN(value)) return '_';
    const rounded = Math.round(value);
    if (format === 'raw') {
        return rounded.toString();
    }
    return `${rounded} BPM`;
  }

  function formatAudioFeature(value, format, unitName = '') {
    if (value === null || isNaN(value)) return '_';
    
    const roundedValue = Math.round(value);

    if (format === 'raw') {
        return roundedValue.toString();
    } else if (format === 'decimal') {
        return (value / 100).toFixed(2);
    } else if (format === 'tier') {
        if (value <= 20) return 'Very Low';
        if (value <= 40) return 'Low';
        if (value <= 60) return 'Medium';
        if (value <= 80) return 'High';
        return 'Very High';
    } else if (format === 'with_unit') {
        return `${roundedValue} ${unitName}`;
    }
    return `${roundedValue}%`;
  }

  function formatKey(key, mode, format) {
    if (key === null || key === -1 || isNaN(key) || mode === null || isNaN(mode)) return '_';

    const pitchClasses = ["C", "C♯/D♭", "D", "D♯/E♭", "E", "F", "F♯/G♭", "G", "G♯/A♭", "A", "A♯/B♭", "B"];
    
    const camelotMap = [
        { major: '8B', minor: '5A' }, { major: '3B', minor: '12A' }, { major: '10B', minor: '7A' },
        { major: '5B', minor: '2A' }, { major: '12B', minor: '9A' }, { major: '7B', minor: '4A' },
        { major: '2B', minor: '11A' }, { major: '9B', minor: '6A' }, { major: '4B', minor: '1A' },
        { major: '11B', minor: '8A' }, { major: '6B', minor: '3A' }, { major: '1B', minor: '10A' }
    ];

    const openKeyMap = [
        { major: '1d', minor: '10m' }, { major: '8d', minor: '5m' }, { major: '3d', minor: '12m' },
        { major: '10d', minor: '7m' }, { major: '5d', minor: '2m' }, { major: '12d', minor: '9m' },
        { major: '7d', minor: '4m' }, { major: '2d', minor: '11m' }, { major: '9d', minor: '6m' },
        { major: '4d', minor: '1m' }, { major: '11d', minor: '8m' }, { major: '6d', minor: '3m' }
    ];

    switch (format) {
        case 'camelot':
            return mode === 1 ? camelotMap[key].major : camelotMap[key].minor;
        case 'openkey':
            return mode === 1 ? openKeyMap[key].major : openKeyMap[key].minor;
        case 'full_name':
            return `${pitchClasses[key]} ${mode === 1 ? 'Major' : 'Minor'}`;
        case 'standard':
        default:
            return pitchClasses[key];
    }
  }

  function formatPopularity(value, format) {
    if (value === null || isNaN(value)) return '_';
    const num = Math.round(value);

    switch (format) {
        case 'with_label':
            return `Pop: ${num}`;
        case 'percentage':
            return `${num}%`;
        case 'tier':
            if (num >= 90) return 'Global Hit';
            if (num >= 75) return 'Major Hit';
            if (num >= 55) return 'Popular';
            if (num >= 30) return 'Niche';
            return 'Underground';
        case 'raw':
        default:
            return num.toString();
    }
  }
  
  async function displayNowPlayingData() {
    const MAX_RETRIES = 10;
    let retryDelay = 250;

    const existingElement = document.getElementById('sort-play-now-playing-data');
    if (existingElement) {
        const parent = existingElement.parentElement;
        if (parent) {
            parent.style.display = '';
            parent.style.alignItems = '';
        }
        existingElement.remove();
    }

    if (!showNowPlayingData) {
        return;
    }

    await new Promise(resolve => setTimeout(resolve, 50));

    for (let i = 0; i < MAX_RETRIES; i++) {
        const track = Spicetify.Player.data?.item;
        if (!track?.uri) {
            return;
        }

        if (Spicetify.URI.isLocalTrack(track.uri)) {
            return;
        }

        const targetContainer = document.querySelector(selectedNowPlayingDataPosition);
        if (!targetContainer) {
            await new Promise(resolve => setTimeout(resolve, retryDelay));
            retryDelay = Math.min(retryDelay * 2, 3000);
            continue;
        }

        try {
            const trackId = track.uri.split(":")[2];
            let dataValue;

            if (selectedNowPlayingDataType === 'releaseDate') {
                const releaseDateData = await getTrackDetailsWithReleaseDate({
                    uri: track.uri,
                    albumUri: track.album.uri,
                    name: track.name
                });
                dataValue = releaseDateData ? formatReleaseDate(releaseDateData.releaseDate, selectedNowPlayingDateFormat) : '_';
            } else if (selectedNowPlayingDataType === 'popularity') {
                const trackDetails = await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/tracks/${trackId}`);
                const rawPopularity = trackDetails.popularity !== null ? trackDetails.popularity : null;
                dataValue = formatPopularity(rawPopularity, selectedNowPlayingPopularityFormat);
            } else if (selectedNowPlayingDataType === 'playCount') {
                const playCountData = await getTrackDetailsWithPlayCount({
                    track: {
                        id: trackId,
                        album: { id: track.album.uri.split(":")[2] }
                    },
                    name: track.name
                });
                const rawPlayCount = (playCountData && playCountData.playCount !== "N/A") ? playCountData.playCount : '_';
                dataValue = formatPlayCount(rawPlayCount, selectedNowPlayingPlayCountFormat);
            } else {
                const audioFeatureTypes = ['tempo', 'energy', 'danceability', 'valence', 'key'];
                if (audioFeatureTypes.includes(selectedNowPlayingDataType)) {
                    const allStats = await getBatchTrackStats([trackId]);
                    const stats = allStats[trackId];
                    let value = stats ? stats[selectedNowPlayingDataType] : null;

                    if (value !== null && value !== "Undefined") {
                        switch (selectedNowPlayingDataType) {
                            case 'tempo':
                                dataValue = formatTempo(value, selectedNowPlayingTempoFormat);
                                break;
                            case 'energy':
                                dataValue = formatAudioFeature(value, selectedNowPlayingEnergyFormat, 'Energy');
                                break;
                            case 'danceability':
                                dataValue = formatAudioFeature(value, selectedNowPlayingDanceabilityFormat, 'Dance');
                                break;
                            case 'valence':
                                dataValue = formatAudioFeature(value, selectedNowPlayingValenceFormat, 'Valence');
                                break;
                            case 'key':
                                dataValue = formatKey(stats.key_raw, stats.mode, selectedNowPlayingKeyFormat);
                                break;
                            default:
                                dataValue = String(value);
                        }
                    } else {
                        dataValue = '_';
                    }
                }
            }

            if (dataValue === '_') return;

            const duplicateCheck = document.getElementById('sort-play-now-playing-data');
            if (duplicateCheck) {
                duplicateCheck.remove();
            }

            let overlayElement = null;
            let checkAttempts = 0;
            const maxCheckAttempts = 20;
            
            while (checkAttempts < maxCheckAttempts) {
                overlayElement = targetContainer.querySelector('.main-trackInfo-overlay');
                
                if (overlayElement) {
                    const textElement = overlayElement.querySelector('[data-encore-id="text"]');
                    const linkElement = overlayElement.querySelector('a');
                    
                    if (textElement && linkElement && linkElement.textContent.trim() !== '') {
                        break;
                    }
                }
                
                await new Promise(resolve => setTimeout(resolve, 50));
                checkAttempts++;
            }
            
            if (!overlayElement || checkAttempts >= maxCheckAttempts) {
                await new Promise(resolve => setTimeout(resolve, retryDelay));
                retryDelay = Math.min(retryDelay * 2, 3000);
                continue;
            }

            targetContainer.style.display = 'flex';
            targetContainer.style.alignItems = 'center';

            const dataElement = document.createElement("div");
            dataElement.id = 'sort-play-now-playing-data';
            dataElement.style.display = 'flex';
            dataElement.style.alignItems = 'center';
            dataElement.style.flexShrink = '0';
            dataElement.style.whiteSpace = 'nowrap';
            dataElement.dataset.renderedForUri = track.uri;
            dataElement.dataset.renderedValue = dataValue;

            dataElement.addEventListener('click', (event) => {
                event.stopPropagation();
                event.preventDefault();
                showNowPlayingSettingsModal(false);
            });

            const separatorElement = document.createElement("p");
            separatorElement.textContent = selectedNowPlayingSeparator;
            separatorElement.style.color = "var(--text-subdued)";
            separatorElement.style.margin = selectedNowPlayingSeparator === ' ' ? "0" : "0 4px";

            const valueElement = document.createElement("p");
            valueElement.className = 'sort-play-np-value';
            valueElement.textContent = dataValue;
            valueElement.style.color = "var(--text-subdued)";
            valueElement.style.margin = "0";
            valueElement.style.marginLeft = "5px";

            const nativeTextElement = targetContainer.querySelector('[data-encore-id="text"]');
            if (nativeTextElement) {
                const styles = window.getComputedStyle(nativeTextElement);
                const fontStyles = {
                    fontSize: styles.fontSize,
                    fontWeight: styles.fontWeight,
                    lineHeight: styles.lineHeight,
                    letterSpacing: styles.letterSpacing,
                    textTransform: styles.textTransform,
                };
                Object.assign(valueElement.style, fontStyles);
                Object.assign(separatorElement.style, fontStyles);
            }

            dataElement.appendChild(separatorElement);
            dataElement.appendChild(valueElement);

            if (overlayElement.nextSibling) {
                targetContainer.insertBefore(dataElement, overlayElement.nextSibling);
            } else {
                targetContainer.appendChild(dataElement);
            }
            
            return;

        } catch (error) {
            console.error('[Sort-Play] Error displaying Now Playing data:', error);
            return;
        }
    }

    console.error(`[Sort-Play] Failed to mount Now Playing data after ${MAX_RETRIES} retries.`);
  }

  function preventDragCloseModal() {
    let mouseDownInsideModal = false;
    let dragStarted = false;
    
    const modal = document.querySelector('.GenericModal');
    const modalOverlay = document.querySelector('.GenericModal__overlay');
    
    if (!modal || !modalOverlay) return;
    
    document.addEventListener('mousedown', (e) => {
      if (modal.contains(e.target)) {
        mouseDownInsideModal = true;
      } else {
        mouseDownInsideModal = false;
      }
    }, true);
    
    document.addEventListener('mousemove', (e) => {
      if (mouseDownInsideModal) {
        dragStarted = true;
      }
    }, true);
    
    modalOverlay.addEventListener('mouseup', (e) => {
      if (mouseDownInsideModal || dragStarted) {
        e.stopImmediatePropagation();
        e.preventDefault();
        setTimeout(() => { dragStarted = false; }, 10);
        return false;
      }
    }, true);
    
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay && (mouseDownInsideModal || dragStarted)) {
        e.stopImmediatePropagation();
        e.preventDefault();
        return false;
      }
      if (e.target === modalOverlay && !mouseDownInsideModal && !dragStarted) {
        Spicetify.PopupModal.hide();
      }
    }, true);
    
    document.addEventListener('mouseup', (e) => {
      setTimeout(() => {
        mouseDownInsideModal = false;
        setTimeout(() => { dragStarted = false; }, 10);
      }, 0);
    }, true);
    
    const closeButton = document.querySelector('.main-trackCreditsModal-closeBtn');
    if (closeButton) {
      closeButton.addEventListener('click', (e) => {
        Spicetify.PopupModal.hide();
      });
    }
  }

  async function setQueueFromTracks(tracks, contextUri, source = 'default') {
    const { PlayerAPI } = Spicetify.Platform;

    if (!PlayerAPI || !PlayerAPI._queue || !PlayerAPI._queue._client || !PlayerAPI._state || !Spicetify.Player) {
        Spicetify.showNotification("Player API components missing for queue operation.", true);
        console.error("Player API components missing for queue operation.");
        return;
    }

    const currentTrackUri = PlayerAPI._state?.item?.uri;
    let tracksToPlay = [...tracks];

    if (source === 'shuffle') {
        if (currentTrackUri && tracksToPlay.length > 1 && tracksToPlay[0].uri === currentTrackUri) {
            const currentTrack = tracksToPlay.shift();
            tracksToPlay.push(currentTrack);
        }
    } else {
        if (currentTrackUri) {
            tracksToPlay = tracksToPlay.filter(t => t.uri !== currentTrackUri);
        }
    }

    if (!tracksToPlay || !tracksToPlay.length) {
        Spicetify.showNotification("No tracks to add to the queue.", false, 3000);
        return;
    }

    try {
        const expectedNextUri = tracksToPlay[0]?.uri;
        const trackUris = tracksToPlay.map(t => t.uri);
        trackUris.push("spotify:delimiter");

        const { _queue, _client } = PlayerAPI._queue;
        const { queueRevision } = _queue;

        const nextTracks = trackUris.map((uri) => ({
            contextTrack: { uri, uid: "", metadata: { is_queued: "false" } },
            removed: [], blocked: [], provider: "context",
        }));

        const setQueuePromise = _client.setQueue({ nextTracks, prevTracks: [], queueRevision });
        const updateContextPromise = (contextUri && PlayerAPI._state?.sessionId)
            ? PlayerAPI.updateContext(PlayerAPI._state.sessionId, { uri: contextUri, url: "context://" + contextUri })
            : Promise.resolve();

        await Promise.all([setQueuePromise, updateContextPromise]);

        const waitForQueueUpdate = async (expectedUri, timeout = 15000) => {
            const startTime = Date.now();
            while (Date.now() - startTime < timeout) {
                const currentFirstTrack = PlayerAPI._queue?._queue?.nextTracks?.[0];
                if (currentFirstTrack?.contextTrack?.uri === expectedUri) return true;
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            return false;
        };

        const queueUpdated = await waitForQueueUpdate(expectedNextUri);
        if (!queueUpdated) {
            console.warn("[Sort-Play] Timed out waiting for queue to update. Playback may not start automatically.");
        }

        Spicetify.Player.next();

        const count = tracksToPlay.length;
        const trackWord = count === 1 ? 'track' : 'tracks';
        const message = source === 'shuffle' 
            ? `Shuffled ${count} ${trackWord} and added to queue.`
            : `Sorted tracks added to queue.`;
        Spicetify.showNotification(message, false, 3000);

    } catch (error) {
        console.error("Error setting queue with internal method:", error);
        Spicetify.showNotification("Failed to set the playback queue.", true);
        throw error;
    }
  }


function isDirectSortType(sortType) {
      const directSortTypes = [
          "playCount",
          "popularity",
          "releaseDate",
          "scrobbles",
          "personalScrobbles",
          "lastScrobbled",
          "shuffle",
          "averageColor",
          "deduplicateOnly",
          "energyWave",
          "tempo",
          "energy",
          "danceability",
          "valence",
          "acousticness",
          "instrumentalness"
      ];
      return directSortTypes.includes(sortType);
  }

  let userSystemInstruction;
  
  async function showAiPickModal(tracks) {
    const modalContainer = document.createElement("div");
    modalContainer.className = "ai-pick-modal";
    modalContainer.innerHTML = `
      <style>
        .main-popupModal-container .main-embedWidgetGenerator-container,
        .ai-pick-modal .main-embedWidgetGenerator-container,
        div.main-embedWidgetGenerator-container {
          width: 620px !important;
          max-width: 620px !important;
          border-radius: 30px;
          overflow: hidden; 
          background-color: #181818 !important;
          border: 2px solid #282828;
        }
        .GenericModal > .main-embedWidgetGenerator-container {
          height: auto !important;
        }        
        .GenericModal__overlay .GenericModal {
          border-radius: 30px;
          overflow: hidden;
        }
        .main-trackCreditsModal-mainSection {
          overflow-y: hidden !important;
          padding: 16px 32px 9px 32px;
        }
        .main-trackCreditsModal-header {
          padding: 27px 32px 12px !important;
        }
        .main-trackCreditsModal-originalCredits{
          padding-bottom: 20px !important;
        }
        .ai-pick-modal .setting-row::after {
          content: "";
          display: table;
          clear: both;
        }
        .ai-pick-modal .setting-row {
          display: flex;
          padding: 5px 0;
          align-items: center;
        }
        .ai-pick-modal .setting-row .col.description {
          float: left;
          padding-right: 15px;
          width: auto;
          color: white;
        }
        .ai-pick-modal .setting-row .col.action {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          text-align: right;
        }
        .ai-pick-modal .main-popupModal-content {
          overflow-y: auto;
        }
        .ai-pick-modal textarea {
          width: 100%;
          height: 150px;
          border-radius: 4px;
          border: 1px solid #282828;
          background: #282828;
          color: white;
        }
        .ai-pick-modal button {
          padding: 8px 18px;
          border-radius: 20px;
          border: none;
          cursor: pointer;
          background-color: #1ED760;
          color: black;
          font-weight: 600;
          font-size: 14px;
          transition: all 0.04s ease;
        }

        .ai-pick-modal .secondary-button {
          background-color: #282828;
          color: white;
          padding: 7px 35px;
          border: 1px solid #666;
          font-weight: 500;
          white-space: nowrap;
          min-width: 160px;
          text-align: center;
        }

        .ai-pick-modal .secondary-button:hover {
          border: 1px solid #939393;
        }

        .ai-pick-modal .secondary-button:disabled {
          color: #666;
          border-color: #666;
          cursor: not-allowed;
        }
        
        .ai-pick-modal .secondary-button:disabled:hover {
          border-color: #666;
        }
        .ai-pick-modal .switch {
          position: relative;
          display: inline-block;
          width: 40px;
          height: 24px;
        }
        .ai-pick-modal .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        .ai-pick-modal .sliderx {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #484848;
          border-radius: 24px;
          transition: .2s;
        }
        .ai-pick-modal .sliderx:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          border-radius: 50%;
          transition: .2s;
        }
        .ai-pick-modal input:checked + .sliderx {
          background-color: #1DB954;
        }
        .ai-pick-modal input:checked + .sliderx:before {
          transform: translateX(16px);
        }
        .ai-pick-modal select {
          padding: 8px;
          border-radius: 4px;
          border: 1px solid #666;
          background: #282828;
          color: white;
          width: 217px;
          cursor: pointer;
        }
        .ai-pick-modal select:hover {
          border: 1px solid #939393;
        }
        .ai-pick-modal select:focus {
          outline: none;
          border-color: #c7c7c7;
        }
        .ai-pick-modal .model-row {
          margin-bottom: 5px;
        }
        .ai-pick-modal .system-instruction {
          display: none;
        }
        .ai-pick-modal .system-instruction.visible {
          display: block;
        }
        .ai-pick-modal .system-instruction textarea {
          height: 150px; 
          font-size: 14px;  
          white-space: pre-wrap;
          word-wrap: break-word;
          overflow-wrap: break-word;
          max-width: 100%;
          padding: 15px;
          border-radius: 20px;
        }
        .ai-pick-modal .system-instruction textarea:focus {
          background: #323232;
        }
        .ai-pick-modal .button-row {
          display: flex;
          gap: 10px;
          margin-top: 16px;
        }
        .loader {
          border: 2px solid #f3f3f3;
          border-top: 2px solid #3498db;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .ai-pick-modal .system-instruction textarea.fixed {
          background-color: #1a1a1a;
          color: #888;
          cursor: not-allowed;
          height: 87px; 
          font-size: 13px; 
        }
        
        .ai-pick-modal .system-instruction .instruction-label {
          color: white;
          display: block;
          margin-bottom: 12px;
          margin-top: 15px;
          font-weight: bold;
        }
        .ai-pick-modal .prompt-wrapper {
          display: flex;
          align-items: flex-start;
          border: 1px solid #282828;
          border-radius: 40px;
          padding: 5px;
          margin-bottom: 0px;
          background-color: #282828;
          align-items: center;
        }
        .ai-pick-modal .prompt-wrapper .textarea-container {
          flex-grow: 1;
          margin-right: 6px; 
          padding: 3px;
          display: flex;
          align-items: center; 
        }
        .ai-pick-modal .prompt-wrapper textarea {
          width: 100%;
          height: 20px;
          max-height: 136px;
          overflow-y: hidden;
          padding-left: 10px;   
          padding-top: 0px;   
          padding-bottom: 0px; 
          padding-right: 10px;
          line-height: 20px;
          border-radius: 20px;
          resize: none;
          font-size: 15px;
          background-color: #282828;
          color: white;
          display: flex;
          align-items: center;
          border: none;
          margin-bottom: 0px;
        }

        .ai-pick-modal .prompt-wrapper textarea:focus {
          outline: none;
          background-color: #323232;
        }
        
        .ai-pick-modal .prompt-wrapper:has(textarea:focus) {
          background-color: #323232;
        }

        .ai-pick-modal .prompt-wrapper .button-container {
          white-space: nowrap;  
          padding: 5px;
        }
        .ai-pick-modal .prompt-wrapper button {
        }
        .ai-pick-modal .prompt-wrapper textarea:focus {
          outline: none;
        }
        .ai-pick-modal .prompt-wrapper textarea::-webkit-scrollbar {
          width: 6px;
        }
        .ai-pick-modal .prompt-wrapper textarea::-webkit-scrollbar-track {
          background: #282828;
          border-radius: 20px;
        }
        .ai-pick-modal .prompt-wrapper textarea::-webkit-scrollbar-thumb {
          background-color: #1DB954;
          border-radius: 20px;
          border: 2px solid #282828;
        }

        .ai-pick-modal .settings-container {
          display: flex;
          gap: 15px; 
          flex-direction: row-reverse;
        }
      
        .ai-pick-modal .settings-right-wrapper,
        .ai-pick-modal .settings-left-wrapper {
          flex: 1;
          background-color: #282828;
          border-radius: 20px;
          padding: 25px;
          height: 170px;
        }
      
        .ai-pick-modal .settings-right-wrapper {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
      
        .ai-pick-modal .settings-left-wrapper {
          display: flex;
          flex-direction: column;
          gap: 0px;
        }
      
        .ai-pick-modal .settings-title {
          color: white;
          font-weight: bold;
          font-size: 14px;
          margin-bottom: 3px;
        }

        .ai-pick-modal .setting-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 5px 0;
          width: auto; 
        }
      
        .ai-pick-modal .setting-row .description {
          color: white;
          width: auto;
          flex-grow: 1; 
          font-size: 15px;
        }
      
        .ai-pick-modal .setting-row .action {
          flex-shrink: 0;
        }
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.25);
          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(5px);
          z-index: 999;
        }

        .GenericModal {
          position: relative;
          z-index: 1000;
        }
        .tooltip-container {
          position: relative; 
          display: inline-block;
        }
        .custom-tooltip {
          visibility: hidden;
          position: absolute;
          z-index: 1;
          background-color: #373737;
          color: white;
          padding: 8px 12px;
          border-radius: 4px;
          font-size: 14px;
          max-width: 240px;
          width: max-content;
          bottom: 100%;   
          left: 50%;       
          transform: translateX(-50%);  
          margin-bottom: 5px;   
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          line-height: 1.4;
          word-wrap: break-word;
      }
      .custom-tooltip::after {
          content: "";
          position: absolute;
          top: 100%;
          left: 50%;
          margin-left: -5px;
          border-width: 5px;
          border-style: solid;
          border-color: #373737 transparent transparent transparent;
      }
      
      .tooltip-container:hover .custom-tooltip {
          visibility: visible;
      }
      </style>

      <div style="display: flex; flex-direction: column; gap: 15px;">
        <div style="color: white; font-weight: 500; font-size: 16px;">
          Ask AI to pick tracks from this playlist
        </div>
        
        <div class="prompt-wrapper">
          <div class="textarea-container">
              <textarea id="aiPrompt" class="sort-play-ai-prompt" placeholder="Enter your request for the AI..."></textarea>
          </div>
          <div class="button-container">
            <button id="sendAiRequest">Send</button>
          </div>
        </div>
      
        <div class="settings-container">
          <div class="settings-right-wrapper">
            <div class="settings-title">Include in AI Analysis:</div>
            <div class="setting-row" id="includeSongStats">
            <label class="description">
            Song Statistics
            <span class="tooltip-container">
                <span style="color: #888; margin-left: 4px; font-size: 12px; cursor: help;">?</span>
                <span class="custom-tooltip">Includes popularity, play count, release date, danceability, energy, valence, tempo, key, loudness, speechiness, acousticness, liveness, and instrumentalness.</span>
            </span>
        </label>
              <div class="action">
                <label class="switch">
                  <input type="checkbox" ${includeSongStats ? 'checked' : ''}>
                  <span class="sliderx"></span>
                </label>
              </div>
            </div>
            
            <div class="setting-row" id="includeLyrics">
              <label class="description">Song Lyrics</label>
              <div class="action">
                <label class="switch">
                  <input type="checkbox" ${includeLyrics ? 'checked' : ''}>
                  <span class="sliderx"></span>
                </label>
              </div>
            </div>
          </div>
      
          <div class="settings-left-wrapper">
            <div class="model-row">
              <label style="color: white; display: block; margin-bottom: 9px; font-weight: bold; font-size: 14px;">AI Model:<span class="tooltip-container">
                <span style="color: #888; margin-left: 4px; font-size: 12px; cursor: help;">?</span>
                <span class="custom-tooltip">Added Gemini 2.5 models</span></label>
              <select id="aiModel">
                <option value="gemini-2.5-pro" ${selectedAiModel === "gemini-2.5-pro" ? "selected" : ""}>Gemini 2.5 Pro</option>
                <option value="gemini-flash-latest" ${selectedAiModel === "gemini-flash-latest" ? "selected" : ""}>Gemini 2.5 Flash</option>
                <option value="gemini-flash-lite-latest" ${selectedAiModel === "gemini-flash-lite-latest" ? "selected" : ""}>Gemini 2.5 Flash-Lite</option>
              </select>
            </div>
            <div class="button-row">
              <button id="editSystemInstruction" class="secondary-button">Edit System Instruction</button>
            </div>
          </div>
        </div>
        
        <div class="system-instruction" id="systemInstructionEditor">
          <label class="instruction-label">User System Instruction:</label>
          <textarea id="systemInstructionText">${userSystemInstruction}</textarea>
          
          <label class="instruction-label">Fixed System Instruction (Not Editable):</label>
          <textarea class="fixed" readonly>${FIXED_SYSTEM_INSTRUCTION}</textarea>
          
          <div class="button-row">
            <button id="saveSystemInstruction">Save</button>
            <button id="resetSystemInstruction" class="secondary-button">Reset to Default</button>
            <button id="cancelSystemInstruction" class="secondary-button">Cancel</button>
          </div>
        </div>
      </div>
    `;
  
    Spicetify.PopupModal.display({
      title: "<span style='font-size: 30px;'>AI Pick</span>",
      content: modalContainer,
      isLarge: true,
    });

    tagActiveModalWithFontScope();

    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
  
    const genericModalOverlay = document.querySelector(".GenericModal__overlay");
  
    if (genericModalOverlay) {
      genericModalOverlay.appendChild(overlay);
    }
  
    if (overlay) {
      overlay.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
    }
  
    const modalContainerElement = document.querySelector(".main-popupModal-container");
    if (modalContainerElement) {
      modalContainerElement.style.zIndex = "2000";
    }

    preventDragCloseModal();


    const songStatsToggle = modalContainer.querySelector("#includeSongStats input");
    const lyricsToggle = modalContainer.querySelector("#includeLyrics input");
    const modelSelect = modalContainer.querySelector("#aiModel");
    
    const editButton = modalContainer.querySelector("#editSystemInstruction");
    const resetButton = modalContainer.querySelector("#resetSystemInstruction");
    const saveButton = modalContainer.querySelector("#saveSystemInstruction");
    const cancelButton = modalContainer.querySelector("#cancelSystemInstruction");
    const editorDiv = modalContainer.querySelector("#systemInstructionEditor");
    const textArea = modalContainer.querySelector("#systemInstructionText");
  
    const aiPromptTextarea = modalContainer.querySelector("#aiPrompt");
    aiPromptTextarea.addEventListener("input", function() {
      this.style.height = '20px';
      
      const scrollHeight = this.scrollHeight;
      
      if (scrollHeight > 20) {
        const newHeight = Math.min(scrollHeight, 136);
        this.style.height = newHeight + 'px';
      }
      
      this.style.overflowY = scrollHeight > 136 ? 'auto' : 'hidden';
    });
    
    aiPromptTextarea.dispatchEvent(new Event('input'));

    songStatsToggle.addEventListener("change", () => {
      includeSongStats = songStatsToggle.checked;
      saveSettings();
    });
  
    lyricsToggle.addEventListener("change", () => {
      includeLyrics = lyricsToggle.checked;
      saveSettings();
    });
  
    modelSelect.addEventListener("change", () => {
      selectedAiModel = modelSelect.value;
      saveSettings();
    });
  
    editButton.addEventListener("click", () => {
      editorDiv.classList.add("visible");
      editButton.disabled = true;
    });
  
    resetButton.addEventListener("click", () => {
      if (confirm("Are you sure you want to reset the system instruction to default?")) {
        userSystemInstruction = DEFAULT_USER_SYSTEM_INSTRUCTION_v2;
        textArea.value = DEFAULT_USER_SYSTEM_INSTRUCTION_v2;
        saveSettings();
        Spicetify.showNotification("System instruction reset to default");
      }
    });
  
    saveButton.addEventListener("click", () => {
      const newInstruction = textArea.value.trim();
      if (!newInstruction) {
        Spicetify.showNotification("System instruction cannot be empty", true);
        return;
      }
      userSystemInstruction = newInstruction;
      saveSettings();
      editorDiv.classList.remove("visible");
      editButton.disabled = false;
    });
    
    cancelButton.addEventListener("click", () => {
      textArea.value = userSystemInstruction;
      editorDiv.classList.remove("visible");
      editButton.disabled = false;
    });
  
    const sendButton = document.getElementById("sendAiRequest");
    sendButton.addEventListener("click", async () => {
      const userPrompt = document.getElementById("aiPrompt").value;
      if (!userPrompt) {
        Spicetify.showNotification("Please enter a request.", true);
        return;
      }
  
      Spicetify.PopupModal.hide();
  
      setButtonProcessing(true);
      mainButton.style.backgroundColor = buttonStyles.main.disabledBackgroundColor;
      mainButton.style.color = buttonStyles.main.disabledColor;
      mainButton.style.cursor = "default";
      svgElement.style.fill = buttonStyles.main.disabledColor;
      menuButtons.forEach((button) => (button.disabled = true));
  
      mainButton.innerHTML = '<div class="loader"></div>';
  
      try {
        const userApiKey = localStorage.getItem("sort-play-gemini-api-key") || Ge_mini_Key();
  
        selectedAiModel = modelSelect.value; 
  
        const aiResponse = await queryGeminiWithPlaylistTracks(
          tracks,
          userPrompt,
          userApiKey,
          undefined,
          undefined,
          includeSongStats,
          includeLyrics,
          selectedAiModel  
        );
  
        if (!aiResponse || aiResponse.length === 0) {
          Spicetify.showNotification("AI did not return any track URIs. Try a different prompt or model.", true);
          resetButtons();
          return;
        }

        mainButton.innerText = "Verifying...";
        const trackIds = aiResponse.map(uri => uri.split(':')[2]);
        const verifiedTracks = [];
        const batchSize = 50;

        for (let i = 0; i < trackIds.length; i += batchSize) {
            const batch = trackIds.slice(i, i + batchSize);
            try {
                const response = await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/tracks?ids=${batch.join(',')}`);
                if (response && response.tracks) {
                    const availableTracks = await Promise.all(response.tracks.map(async track => {
                        if (track && await isTrackAvailable(track)) {
                            return track.uri;
                        }
                        return null;
                    }));
                    verifiedTracks.push(...availableTracks.filter(Boolean));
                }
            } catch (error) {
                console.warn("Sort-Play: Error during AI track verification batch.", error);
            }
        }

        if (verifiedTracks.length === 0) {
            Spicetify.showNotification("AI returned invalid or unavailable tracks. Please try again.", true);
            resetButtons();
            return;
        }
  
        const sourceUri = getCurrentUri();
        const isArtistPage = URI.isArtist(sourceUri); 
        const isAlbumPage = URI.isAlbum(sourceUri);
        let sourceName;
        
        if (URI.isArtist(sourceUri)) {
            sourceName = await Spicetify.CosmosAsync.get(
                `https://api.spotify.com/v1/artists/${sourceUri.split(":")[2]}`
            ).then((r) => r.name);
        } else if (isLikedSongsPage(sourceUri)) {
            sourceName = "Liked Songs";
        } else if (isAlbumPage) {
            sourceName = await Spicetify.CosmosAsync.get(
                `https://api.spotify.com/v1/albums/${sourceUri.split(":")[2]}`
            ).then((r) => r.name);
        } else {
            sourceName = await Spicetify.CosmosAsync.get(
                `https://api.spotify.com/v1/playlists/${sourceUri.split(":")[2]}`
            ).then((r) => r.name);
        }

        let suffixPattern = new RegExp(
          `\\s*(${possibleSuffixes.join("|")})\\s*`
        );
        while (suffixPattern.test(sourceName)) {
          sourceName = sourceName.replace(suffixPattern, "");
        }

        let playlistDescription;
        if (isArtistPage) {
          playlistDescription = `Tracks by ${sourceName}, picked by AI using Sort-Play for request: "${userPrompt}"`;
        } else if (isAlbumPage) {
          const albumDetails = await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/albums/${sourceUri.split(":")[2]}`);
          const artistName = albumDetails.artists[0].name;
          playlistDescription = `Tracks from ${sourceName} by ${artistName}, picked by AI using Sort-Play for request: "${userPrompt}"`;
        } else {
          playlistDescription = `Tracks picked by AI using Sort-Play for request: "${userPrompt}"`;
        }

        const newPlaylist = await createPlaylist(
          `${sourceName} (AI Pick)`,
          playlistDescription 
        );

        await new Promise(resolve => setTimeout(resolve, 1250));
        await addTracksToPlaylist(newPlaylist.id, verifiedTracks);
        
        await addPlaylistToLibrary(newPlaylist.uri);

        Spicetify.showNotification(`AI Pick playlist created with ${verifiedTracks.length} tracks!`);
        
        await navigateToPlaylist(newPlaylist);

      } catch (error) {
        console.error("Error handling AI pick:", error);
        Spicetify.showNotification(
          "An error occurred while processing the AI request.",
          true
        );
      } finally {
        resetButtons();
      }
    });
  }

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  async function processBatchWithRateLimit(items, batchSize, delayMs, processItem) {
    const results = [];
    
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(async (item) => {
          try {
            return await processItem(item);
          } catch (error) {
            console.warn(`Error processing item in batch: ${error.message}`);
            return null;
          }
        })
      );
      
      results.push(...batchResults.filter(result => result !== null));
      
      if (i + batchSize < items.length) {
        await delay(delayMs);
      }
    }
    
    return results;
  }

  async function fetchLyricsFromLrclib(track) {
    const trackName = track.songTitle || track.name || track.title;
    const artistName = track.artistName || track.artist;
    const albumName = track.albumName || track.track?.album?.name;
    const durationMs = track.durationMs || track.track?.duration_ms;

    if (!trackName || !artistName || !albumName || !durationMs) {
        console.warn("[Sort-Play] Missing required data for LRCLIB lookup:", { trackName, artistName, albumName, durationMs });
        return { error: "Missing track data for lyrics lookup" };
    }

    const durationSec = Math.round(durationMs / 1000);

    const params = new URLSearchParams({
        track_name: trackName,
        artist_name: artistName,
        album_name: albumName,
        duration: durationSec,
    });
    const url = `https://lrclib.net/api/get?${params.toString()}`;

    try {
        const gatewayUrl = `${GATEWAY_URL}${encodeURIComponent(url)}`;
        const response = await fetch(gatewayUrl);

        if (response.status === 404) {
            return { error: "No lyrics found on LRCLIB" };
        }

        if (!response.ok) {
            throw new Error(`LRCLIB API request failed with status ${response.status}`);
        }

        const data = await response.json();

        if (data && data.plainLyrics) {
            return {
                unsynced: data.plainLyrics.split('\n').map(line => ({ text: line })),
                provider: "LRCLIB",
            };
        } else {
            return { error: "No lyrics found in LRCLIB response" };
        }
    } catch (error) {
        console.error(`[Sort-Play] Error fetching lyrics from LRCLIB for "${trackName}":`, error);
        return { error: "LRCLIB request failed" };
    }
  }

  function pruneTracksForApiLimit(tracks, userSystemInstruction, userRequestPayload, maxSize) {
    const getPromptSize = (trackData) => {
        const payload = `Playlist Tracks:\n${JSON.stringify(trackData, null, 2)}`;
        return new Blob([userSystemInstruction, payload, userRequestPayload]).size;
    };

    let currentSize = getPromptSize(tracks);
    if (currentSize <= maxSize) {
        return { prunedTracks: tracks, notification: null };
    }

    console.warn(`[Sort-Play AI] Prompt size (${currentSize} bytes) exceeds limit. Pruning data...`);

    let lyricsRemovedCount = 0;
    let statsRemovedCount = 0;
    const prunedTracks = JSON.parse(JSON.stringify(tracks));

    const tracksWithLyricsIndices = prunedTracks.map((t, i) => (t.lyrics && t.lyrics !== "Not included") ? i : -1).filter(i => i !== -1);
    const shuffledLyricsIndices = shuffleArray(tracksWithLyricsIndices);

    for (const index of shuffledLyricsIndices) {
        delete prunedTracks[index].lyrics;
        lyricsRemovedCount++;
        currentSize = getPromptSize(prunedTracks);
        if (currentSize <= maxSize) break;
    }

    if (currentSize > maxSize) {
        const tracksWithStatsIndices = prunedTracks.map((t, i) => t.stats ? i : -1).filter(i => i !== -1);
        const shuffledStatsIndices = shuffleArray(tracksWithStatsIndices);

        for (const index of shuffledStatsIndices) {
            delete prunedTracks[index].stats;
            statsRemovedCount++;
            currentSize = getPromptSize(prunedTracks);
            if (currentSize <= maxSize) break;
        }
    }
    
    let messageParts = [];
    if (lyricsRemovedCount > 0) messageParts.push(`lyrics from ${lyricsRemovedCount} songs`);
    if (statsRemovedCount > 0) messageParts.push(`stats from ${statsRemovedCount} songs`);
    
    const notification = messageParts.length > 0 ? `Removed ${messageParts.join(' and ')} to fit API limits.` : null;

    if (currentSize > maxSize) {
        console.error("[Sort-Play AI] Could not reduce prompt size enough even after removing all lyrics and stats.");
        throw new Error("Playlist is too large to process, even after removing extra data.");
    }

    return { prunedTracks, notification };
  }

  async function queryGeminiWithPlaylistTracks(tracks, userPrompt, apiKey, maxRetries = 3, initialDelay = 1000, includeSongStats = true, includeLyrics = true, modelName) {
    clearOldCaches();
    let enrichedTracksCache = [];
    let tracksToProcess = [];
    let tracksNeedingLyrics = [];

    for (const track of tracks) {
        const trackId = track.uri.split(":")[2];
        const cachedTrack = getTrackCache(trackId, includeSongStats, false, modelName);
        
        if (cachedTrack) {
            if (includeLyrics && (!cachedTrack.lyrics || cachedTrack.lyrics === "Not included")) {
                tracksNeedingLyrics.push({ ...track, cachedData: cachedTrack });
            } else {
                enrichedTracksCache.push(cachedTrack);
            }
        } else {
            tracksToProcess.push(track);
        }
    }

    let fullPrompt;

    try {
        if (tracksToProcess.length > 0) {
            let allBatchStats = {};
            if (includeSongStats) {
                const trackIdsToFetch = tracksToProcess.map(t => t.uri.split(":")[2]);
                allBatchStats = await getBatchTrackStats(trackIdsToFetch);
            }

            const processedTracks = await processBatchWithRateLimit(
                tracksToProcess, 20, 700,
                async track => {
                    const trackId = track.uri.split(":")[2];
                    let stats = includeSongStats ? allBatchStats[trackId] : null;
                    stats = stats || { danceability: null, energy: null, key: "Undefined", loudness: null, speechiness: null, acousticness: null, instrumentalness: null, liveness: null, valence: null, tempo: null, popularity: null, releaseDate: null };
                    
                    let playCount = "N/A";
                    if (includeSongStats) {
                        try {
                            const albumId = track.albumId || track.track?.album?.id;
                            if (albumId) {
                                const albumTracksWithPlayCounts = await getPlayCountsForAlbum(albumId);
                                const foundTrack = albumTracksWithPlayCounts.find(t => t.uri === track.uri);
                                playCount = foundTrack ? foundTrack.playcount : "N/A";
                            }
                        } catch (error) { playCount = "N/A"; }
                    }
                    
                    let lyrics = "Not included";
                    if (includeLyrics) {
                        const lyricsData = await fetchLyricsFromLrclib(track);
                        lyrics = lyricsData?.unsynced ? lyricsData.unsynced.map(line => line.text).join('\n') : "Not included";
                    }
                    
                    const enrichedTrack = {
                        song_title: track.songTitle || track.name || track.title,
                        artist: track.artistName || track.artist,
                        album: track.albumName,
                        uri: track.uri
                    };
        
                    if (includeSongStats) {
                        enrichedTrack.stats = { popularity: stats.popularity, playCount: playCount, releaseDate: stats.releaseDate, danceability: stats.danceability, energy: stats.energy, valence: stats.valence, tempo: stats.tempo, key: stats.key, loudness: stats.loudness, speechiness: stats.speechiness, acousticness: stats.acousticness, liveness: stats.liveness, instrumentalness: stats.instrumentalness };
                    }
        
                    const trackDataForCache = { ...enrichedTrack };
                    if (includeLyrics) {
                        enrichedTrack.lyrics = lyrics;
                    }
                    
                    setTrackCache(trackId, trackDataForCache, includeSongStats, false, modelName);
                    return enrichedTrack;
                }
            );
            enrichedTracksCache.push(...processedTracks);
        }

        if (tracksNeedingLyrics.length > 0) {
            const processedLyrics = await processBatchWithRateLimit(
                tracksNeedingLyrics, 20, 100,
                async track => {
                    const enrichedTrack = { ...track.cachedData };
                    const lyricsData = await fetchLyricsFromLrclib(track);
                    enrichedTrack.lyrics = lyricsData?.unsynced ? lyricsData.unsynced.map(line => line.text).join('\n') : "Not included";
                    return enrichedTrack;
                }
            );
            enrichedTracksCache.push(...processedLyrics);
        }

        manageCacheSize();
        
        const tracksWithStats = enrichedTracksCache.filter(track => track !== null);
        const userSystemInstruction = localStorage.getItem(STORAGE_KEY_USER_SYSTEM_INSTRUCTION_v2) || DEFAULT_USER_SYSTEM_INSTRUCTION_v2;
        const combinedSystemInstruction = `${userSystemInstruction}\n${FIXED_SYSTEM_INSTRUCTION}`;
        const userRequestPayload = `\n\nUser Request: ${userPrompt}\n\nGIVE PICKED TRACK URI's`;

        const maxPromptSizeBytes = modelName.includes('pro')
            ? 285 * 1024
            : 585 * 1024;

        const { prunedTracks, notification } = pruneTracksForApiLimit(tracksWithStats, combinedSystemInstruction, userRequestPayload, maxPromptSizeBytes);
        if (notification) {
            Spicetify.showNotification(notification);
        }
        
        const trackDataPayload = `Playlist Tracks:\n${JSON.stringify(prunedTracks, null, 2)}`;
        fullPrompt = `${combinedSystemInstruction}\n\n${trackDataPayload}\n\n${userRequestPayload}`;
        console.log({ message: "[Sort-Play AI Prompt]", prompt: fullPrompt });

    } catch (dataPrepError) {
        console.error("A critical error occurred during the data preparation phase:", dataPrepError);
        throw dataPrepError;
    }

    let retries = 0;
    let delay = initialDelay;
    let currentApiKey = apiKey;
    const usedKeys = new Set([currentApiKey]);

    while (retries < maxRetries) {
        try {
            const GoogleGenAI = await loadGoogleAI();
            if (!GoogleGenAI) throw new Error('Failed to load Google AI SDK');
            const ai = new GoogleGenAI({ apiKey: currentApiKey });

            const result = await ai.models.generateContent({
                model: modelName,
                contents: fullPrompt,
                safetySettings: [
                    { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
                    { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
                    { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
                    { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
                    { category: "HARM_CATEGORY_CIVIC_INTEGRITY", threshold: "BLOCK_NONE" }
                ]
            });

            if (result?.promptFeedback?.blockReason) {
                throw new Error(`Blocked for ${result.promptFeedback.blockReason}`);
            }

            const responseText = result.text;
            const uriRegex = /spotify:track:[a-zA-Z0-9]{22}/g;
            let matches = responseText.match(uriRegex);

            if (!matches) {
                console.log("No Spotify track URIs found in AI response.");
                return [];
            }
            
            return [...new Set(matches)];

        } catch (error) {
            console.error(`Error during Gemini request (Attempt ${retries + 1}):`, error);

            if (error.toString().includes('429')) {
                console.log('[Sort-Play AI] Quota exceeded. Rotating to a new API key...');
                let newKey;
                if (usedKeys.size < Ge_mini_Key_Pool.length) {
                    do { newKey = Ge_mini_Key(); } while (usedKeys.has(newKey));
                } else {
                    console.warn('[Sort-Play AI] All keys in the pool have been tried. Re-using a random key.');
                    newKey = Ge_mini_Key(); 
                }
                currentApiKey = newKey;
                usedKeys.add(currentApiKey);
                console.log(`[Sort-Play AI] Retrying with new key: ...${currentApiKey.slice(-4)}`);
            }

            if (retries === maxRetries - 1) {
                throw new Error(`Failed to get a valid response from Gemini after ${maxRetries} retries.`);
            }
            retries++;
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2;
        }
    }
  }

  function showGeminiApiKeyModal() {
    const modalContainer = document.createElement("div");
    const savedApiKey = localStorage.getItem("sort-play-gemini-api-key");

    modalContainer.innerHTML = `
      <style>
      .main-embedWidgetGenerator-container {
        width: 420px !important;
        border-radius: 30px;
        overflow: hidden; 
        background-color: #181818 !important;
        border: 2px solid #282828;
      }
      .GenericModal__overlay .GenericModal {
        border-radius: 30px;
        overflow: hidden;
      }
      .GenericModal > .main-embedWidgetGenerator-container {
        height: auto !important;
      } 
      .main-trackCreditsModal-mainSection {
        overflow-y: hidden !important;
      }
      .main-trackCreditsModal-header {
        padding: 27px 32px 12px !important;
      }
      .main-trackCreditsModal-originalCredits{
        padding-bottom: 20px !important;
      }
      .main-trackCreditsModal-originalCredits{
        padding-bottom: 20px !important;
      }
      </style>
      <div style="display: flex; flex-direction: column; gap: 15px;">
        <div style="display: flex; flex-direction: column; gap: 5px;">
          <label for="geminiApiKey">Gemini API Key:</label>
          <input type="text" id="geminiApiKey" value="${savedApiKey || ""}" placeholder="Enter your API key (optional)"
                style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #282828; background: #282828; color: white;">
          <a href="https://aistudio.google.com/apikey" target="_blank" style="color: #1ED760; font-size: 14px; margin-left: 2px; margin-top: 4px; text-decoration: none;">Get the free API key from here</a>
        </div>
        <div id="geminiApiError" style="color: #ff4444; font-size: 12px; display: none;">
          Invalid API key.
        </div>
        <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 10px;">
          <button id="cancelGeminiApi" class="main-buttons-button" 
                  style="width: 83px; padding: 8px 16px; border-radius: 20px; border: none; cursor: pointer; background-color: #333333; color: white; font-weight: 550; font-size: 13px; text-transform: uppercase; transition: all 0.04s ease;">
            Cancel
          </button>
          <button id="saveGeminiApi" class="main-buttons-button main-button-primary" 
                  style="padding: 8px 18px; border-radius: 20px; border: none; cursor: pointer; background-color: #1ED760; color: black; font-weight: 550; font-size: 13px; text-transform: uppercase; transition: all 0.04s ease;">
            Save
          </button>
        </div>
      </div>
    `;

    Spicetify.PopupModal.display({
      title: "<span style='font-size: 25px;'>Gemini API Key</span>",
      content: modalContainer,
      isLarge: true,
    });
    tagActiveModalWithFontScope();

    if (isMenuOpen) {
      closeAllMenus();
    }

    const modalContainerElement = document.querySelector(".main-popupModal-container");
    if (modalContainerElement) {
      modalContainerElement.style.zIndex = "2000";
    }
    preventDragCloseModal();

    const saveButton = document.getElementById("saveGeminiApi");
    const cancelButton = document.getElementById("cancelGeminiApi");

    saveButton.addEventListener("mouseenter", () => {
      saveButton.style.backgroundColor = "#3BE377";
    });
    saveButton.addEventListener("mouseleave", () => {
      saveButton.style.backgroundColor = "#1ED760";
    });

    cancelButton.addEventListener("mouseenter", () => {
      cancelButton.style.backgroundColor = "#444444";
    });

    cancelButton.addEventListener("mouseleave", () => {
      cancelButton.style.backgroundColor = "#333333";
    });

  function enableButton(button) {
    button.disabled = false;
    button.style.backgroundColor = "#1ED760";
    button.style.cursor = "pointer";
  }

  saveButton.addEventListener("click", async () => {
    const apiKey = document.getElementById("geminiApiKey").value.trim();

    saveButton.disabled = true;
    saveButton.style.backgroundColor = "#FFFFFFB3";
    saveButton.style.cursor = "default";
    saveButton.textContent = "Saving...";

    if (apiKey) {
      localStorage.setItem("sort-play-gemini-api-key", apiKey);
      Spicetify.showNotification("Gemini API key saved successfully!");
    } else {
      localStorage.removeItem("sort-play-gemini-api-key");
      Spicetify.showNotification("Gemini API key cleared.");
    }

    Spicetify.PopupModal.hide();
    enableButton(saveButton);
    saveButton.textContent = "Save";
  });

    cancelButton.addEventListener("click", () => {
      Spicetify.PopupModal.hide();
      enableButton(cancelButton);
    });
  }

  function rgbToHsl(r, g, b) {
    r /= 255, g /= 255, b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return { h: h * 360, s, l };
  }


  async function loadImageDirectly(imageUrl) {
      return new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = 'Anonymous';
          img.onload = () => resolve(img);
          img.onerror = (err) => {
              const error = new Error(`Failed to load image directly from ${imageUrl}`);
              reject(error);
          };
          img.src = imageUrl;
      });
  }


  async function getPaletteAnalysis(imageUrl) {
      if (!colorThiefLib) {
          throw new Error("ColorThief library not loaded.");
      }

      try {
          const img = await loadImageDirectly(imageUrl);
          const colorThief = new colorThiefLib();
          const paletteRgb = colorThief.getPalette(img, 5);

          if (!paletteRgb || paletteRgb.length === 0) {
              throw new Error("ColorThief could not extract a palette.");
          }

          const paletteHsl = paletteRgb.map(rgb => rgbToHsl(...rgb));
          const dominantHsl = paletteHsl[0];

          const MONOCHROME_SATURATION_THRESHOLD = 0.10;
          const isMonochrome = paletteHsl.every(color => color.s < MONOCHROME_SATURATION_THRESHOLD);

          return {
              isMonochrome: isMonochrome,
              dominantHsl: dominantHsl
          };
      } catch (error) {
          console.error("Failed to get palette analysis:", error);
          throw error;
      }
  }

  const PALETTE_ANALYSIS_CACHE_KEY = 'sort-play-palette-cache-v1';
  const PALETTE_ANALYSIS_CACHE_TIMESTAMP_KEY = 'sort-play-palette-cache-timestamp-v1';
  const PALETTE_ANALYSIS_CACHE_EXPIRY_DAYS = 7;

  function initializePaletteAnalysisCache() {
      const timestamp = localStorage.getItem(PALETTE_ANALYSIS_CACHE_TIMESTAMP_KEY);
      if (!timestamp || (Date.now() - parseInt(timestamp)) / (1000 * 60 * 60 * 24) > PALETTE_ANALYSIS_CACHE_EXPIRY_DAYS) {
          localStorage.setItem(PALETTE_ANALYSIS_CACHE_TIMESTAMP_KEY, Date.now().toString());
          localStorage.setItem(PALETTE_ANALYSIS_CACHE_KEY, JSON.stringify({}));
      }
  }

  function getCachedPaletteAnalysis(albumId) {
      try {
          const cache = JSON.parse(localStorage.getItem(PALETTE_ANALYSIS_CACHE_KEY) || '{}');
          return cache[albumId] || null;
      } catch (error) {
          return null;
      }
  }

  function setCachedPaletteAnalysis(albumId, analysisData) {
      try {
          const cache = JSON.parse(localStorage.getItem(PALETTE_ANALYSIS_CACHE_KEY) || '{}');
          cache[albumId] = analysisData;
          localStorage.setItem(PALETTE_ANALYSIS_CACHE_KEY, JSON.stringify(cache));
      } catch (error) {
          console.error('Error writing to palette analysis cache:', error);
      }
  }

  async function getAlbumColorAnalysis(albumId) {
      const cachedAnalysis = getCachedPaletteAnalysis(albumId);
      if (cachedAnalysis) {
          return cachedAnalysis;
      }

      try {
          const albumDetails = await withRetry(
            () => Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/albums/${albumId}`),
            CONFIG.spotify.retryAttempts,
            CONFIG.spotify.retryDelay
          );

          const images = albumDetails?.images;
          if (!images || images.length === 0) {
              throw new Error(`No images found for album ${albumId}`);
          }

          const imageUrl = images[images.length - 1].url;
          const analysisData = await getPaletteAnalysis(imageUrl);

          setCachedPaletteAnalysis(albumId, analysisData);
          return analysisData;
      } catch (error) {
          console.warn(`Could not get palette analysis for album ${albumId}:`, error);
          setCachedPaletteAnalysis(albumId, null);
          return null;
      }
  }

  async function getTrackDetailsWithPaletteAnalysis(track) {
      const albumId = track.albumId || track.track?.album?.id;
      if (!albumId) {
          console.warn(`Could not determine album ID for track ${track.songTitle}`);
          return { ...track, averageColor: null };
      }
      
      const analysisData = await getAlbumColorAnalysis(albumId);
      
      return { ...track, averageColor: analysisData };
  }

  async function getTrackDetailsWithReleaseDateForFilter(track) {
    const trackWithStandardReleaseDate = await getTrackDetailsWithReleaseDate(track);
    
    if (trackWithStandardReleaseDate.releaseDate) {
      return trackWithStandardReleaseDate;
    }

    let albumId;
    
    if (track.albumId) {
      albumId = track.albumId;
    } else if (track.albumUri) {
      albumId = track.albumUri.split(":")[2];
    } else {
      console.warn(`Could not determine album ID for track ${track.name}`);
      return trackWithStandardReleaseDate;
    }
    
    try {
      const result = await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/tracks/${track.uri.split(":")[2]}`);
      
      if (result && result.album && result.album.release_date) {
        return {
          ...trackWithStandardReleaseDate,
          releaseDate: result.album.release_date
        };
      }
      
      const albumResult = await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/albums/${albumId}`);
      
      if (albumResult && albumResult.release_date) {
        return {
          ...trackWithStandardReleaseDate,
          releaseDate: albumResult.release_date
        };
      }
      
      return trackWithStandardReleaseDate;
      
    } catch (error) {
      console.error(`Error getting single release date for track ${track.name}:`, error);
      return trackWithStandardReleaseDate;
    }
  }

  
  async function handleCustomFilter() {
    menuButtons.forEach((btn) => {
      if (btn.tagName.toLowerCase() === 'button' && !btn.disabled) {
        btn.style.backgroundColor = "transparent";
      }
    });
    setButtonProcessing(true);
    mainButton.style.backgroundColor = buttonStyles.main.disabledBackgroundColor;
    mainButton.style.color = buttonStyles.main.disabledColor;
    mainButton.style.cursor = "default";
    svgElement.style.fill = buttonStyles.main.disabledColor;
    menuButtons.forEach((button) => (button.disabled = true));
    
    toggleMenu();
    closeAllMenus();

    try {
        const currentUri = getCurrentUri();
        if (!currentUri) {
            resetButtons();
            Spicetify.showNotification("Please select a playlist or artist first");
            return;
        }

        let tracks;
        if (URI.isPlaylistV1OrV2(currentUri)) {
            const playlistId = currentUri.split(":")[2];
            tracks = await getPlaylistTracks(playlistId);
        } else if (URI.isArtist(currentUri)) {
            tracks = await getArtistTracks(currentUri);
        } else if (isLikedSongsPage(currentUri)) {
            tracks = await getLikedSongs();
        } else if (URI.isAlbum(currentUri)) {
            const albumId = currentUri.split(":")[2];
            tracks = await getAlbumTracks(albumId);
        } else {
            throw new Error('Invalid playlist or artist page');
        }

        if (!tracks || tracks.length === 0) {
            throw new Error('No tracks found');
        }

        mainButton.innerText = "0%";


        const tracksWithPlayCounts = await enrichTracksWithPlayCounts(
            tracks,
            (progress) => {
                mainButton.innerText = `${Math.floor(progress * 0.25)}%`;
            }
        );

        const tracksWithIds = await processBatchesWithDelay(
          tracksWithPlayCounts,
          50,
          500,
          (progress) => {
            mainButton.innerText = `${25 + Math.floor(progress * 0.25)}%`; 
          },
          collectTrackIdsForPopularity 
        );
        const tracksWithPopularity = await fetchPopularityForMultipleTracks(
            tracksWithIds,
            (progress) => {
              mainButton.innerText = `${50 + Math.floor(progress * 0.25)}%`; 
            }
        );
        const tracksWithReleaseDates = await processBatchesWithDelay(
            tracksWithPopularity,
            50,
            500,
            (progress) => {
                mainButton.innerText = `${75 + Math.floor(progress * 0.25)}%`;
            },
            getTrackDetailsWithReleaseDateForFilter 
        );

        mainButton.innerText = "Analyzing...";
        const trackIdsToFetch = tracksWithReleaseDates
            .map(track => track.uri.split(":")[2])
            .filter(trackId => !getTrackCache(trackId, true, false, selectedAiModel));

        if (trackIdsToFetch.length > 0) {
            const batchStats = await getBatchTrackStats(trackIdsToFetch);
            Object.entries(batchStats).forEach(([trackId, stats]) => {
                setTrackCache(trackId, { stats }, true, false, selectedAiModel);
            });
        }

        const tracksWithFeatures = tracksWithReleaseDates.map(track => {
            const trackId = track.uri.split(":")[2];
            const cachedData = getTrackCache(trackId, true, false, selectedAiModel);
            return { ...track, features: cachedData ? cachedData.stats : {} };
        });

        showCustomFilterModal(tracksWithFeatures);

    } catch (error) {
        console.error("Error in custom filter:", error);
        Spicetify.showNotification(
            "An error occurred while preparing the custom filter.",
            true
        );
    } finally {
        resetButtons();
    }
  }

  function debounce(func, delay) {
      let timeout;
      return function(...args) {
          const context = this;
          clearTimeout(timeout);
          timeout = setTimeout(() => func.apply(context, args), delay);
      };
  }

  function formatDuration(ms) {
    if (ms === null || ms === undefined || isNaN(ms)) {
        return "N/A";
    }
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  }

  const removeIconSVG = `<svg class="remove-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M982.032787 847.737705L637.901639 503.606557l327.344263-327.344262c33.57377-33.57377 33.57377-83.934426 0-117.508197s-83.934426-33.57377-117.508197 0L520.393443 386.098361 176.262295 50.360656C142.688525 16.786885 92.327869 16.786885 58.754098 50.360656 25.180328 83.934426 25.180328 134.295082 58.754098 167.868852l344.131148 335.737705-335.737705 335.737705c-33.57377 33.57377-33.57377 83.934426 0 117.508197 16.786885 16.786885 41.967213 25.180328 58.754098 25.180328s41.967213-8.393443 58.754099-25.180328l335.737705-335.737705 344.131147 344.131148c16.786885 16.786885 33.57377 25.180328 58.754099 25.180328 25.180328 0 41.967213-8.393443 58.754098-25.180328 33.57377-33.57377 33.57377-83.934426 0-117.508197z"/></svg>`;
  const restoreIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="5.9844 5.9844 36 36.0312" width="14px" height="14px" preserveAspectRatio="none" class="remove-icon"><path d="M 24 42 C 23.211 42 22.462 41.934 21.752 41.846 C 20.221 41.685 19.438 39.926 20.343 38.681 C 20.78 38.08 21.513 37.77 22.248 37.877 C 22.852 37.952 23.431 38 24 38 C 31.756 38 38 31.756 38 24 C 38 16.244 31.756 10 24 10 C 16.244 10 10 16.244 10 24 C 10 26.635 10.739 29.081 12 31.178 L 12 31 C 11.978 29.46 13.631 28.475 14.976 29.226 C 15.617 29.584 16.01 30.265 16 31 L 16 36.488 L 16 37 C 16 38.105 15.105 39 14 39 L 8 39 C 6.46 39.022 5.475 37.369 6.226 36.024 C 6.584 35.383 7.265 34.99 8 35 L 9.77 35 C 7.412 31.956 6 28.138 6 24 C 6 14.082 14.082 6 24 6 C 33.918 6 42 14.082 42 24 C 42 33.918 33.918 42 24 42 Z" style="transform-origin: 23.9844px 24px;" transform="matrix(0, 1, -1, 0, -0.000001907349, 0.00000100024)" id="object-0"/></svg>`;
  const saveIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" fill="#ffffff" viewBox="0 0 24 24"><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>`;  const loadIconSVG = `<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g id="File / Folder">
  <path id="Vector" d="M3 6V16.8C3 17.9201 3 18.4798 3.21799 18.9076C3.40973 19.2839 3.71547 19.5905 4.0918 19.7822C4.5192 20 5.07899 20 6.19691 20H17.8031C18.921 20 19.48 20 19.9074 19.7822C20.2837 19.5905 20.5905 19.2841 20.7822 18.9078C21.0002 18.48 21.0002 17.9199 21.0002 16.7998L21.0002 9.19978C21.0002 8.07967 21.0002 7.51962 20.7822 7.0918C20.5905 6.71547 20.2839 6.40973 19.9076 6.21799C19.4798 6 18.9201 6 17.8 6H12M3 6H12M3 6C3 4.89543 3.89543 4 5 4H8.67452C9.1637 4 9.40886 4 9.63904 4.05526C9.84311 4.10425 10.0379 4.18526 10.2168 4.29492C10.4186 4.41857 10.5918 4.59182 10.9375 4.9375L12 6" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  </svg>`;
  const clearIconSVG = `<svg viewBox="16 15 43 43" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" baseProfile="full" enable-background="new 0 0 76.00 76.00" xml:space="preserve">
    <path fill="#ffffff" fill-opacity="1" stroke-width="0.2" stroke-linejoin="round" d="M 18.0147,41.5355C 16.0621,39.5829 16.0621,36.4171 18.0147,34.4645L 26.9646,25.5149C 28.0683,24.4113 29,24 31,24L 52,24C 54.7614,24 57,26.2386 57,29L 57,47C 57,49.7614 54.7614,52 52,52L 31,52C 29,52 28.0683,51.589 26.9646,50.4854L 18.0147,41.5355 Z M 47.5281,42.9497L 42.5784,37.9999L 47.5281,33.0502L 44.9497,30.4717L 40,35.4215L 35.0502,30.4717L 32.4718,33.0502L 37.4215,37.9999L 32.4718,42.9497L 35.0502,45.5281L 40,40.5783L 44.9497,45.5281L 47.5281,42.9497 Z "/>
  </svg>`;

function createKeywordTag(keyword, container, keywordSet, onUpdateCallback = () => {}) {
        const tag = document.createElement("span");
        tag.className = "keyword-tag";
        tag.innerHTML = `
            ${keyword}
            <span class="keyword-tag-remove">×</span>
        `;

        tag.querySelector(".keyword-tag-remove").addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            tag.remove();
            keywordSet.delete(keyword);
            onUpdateCallback();
        });

        tag.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
        });

        const tagsContainer = container.querySelector(".keyword-tags-container");
        tagsContainer.appendChild(tag);
        tagsContainer.scrollTop = tagsContainer.scrollHeight;
    }

    function setupKeywordInput(container, keywordSet, onUpdateCallback = () => {}) {
      if(!container) return;
      const input = container.querySelector(".keyword-input");
      const clearButton = container.querySelector(".keyword-remove-all-button");
      const saveButton = container.querySelector(".keyword-save-button");
      const loadButton = container.querySelector(".keyword-load-button");
      
      if(!input) return;

      input.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
      });

      input.addEventListener("keydown", (e) => {
          e.stopPropagation();
          if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              const keyword = input.value.trim().toLowerCase();
              if (keyword && !keywordSet.has(keyword)) {
                  keywordSet.add(keyword);
                  createKeywordTag(keyword, container, keywordSet, onUpdateCallback);
                  input.value = "";
                  onUpdateCallback();
              }
          }
      });

      if (clearButton) {
        clearButton.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            const tagsContainer = container.querySelector(".keyword-tags-container");
            tagsContainer.innerHTML = "";
            keywordSet.clear();
            onUpdateCallback();
        });
      }

      input.addEventListener("blur", () => {
          const keyword = input.value.trim().toLowerCase();
          if (keyword && !keywordSet.has(keyword)) {
              keywordSet.add(keyword);
              createKeywordTag(keyword, container, keywordSet, onUpdateCallback);
              input.value = "";
          }
          if (keyword) {
              onUpdateCallback();
          }
      });

      if (saveButton) {
        saveButton.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (keywordSet.size === 0) {
                Spicetify.showNotification("No keywords to save.");
                return;
            }

            const saveModal = document.createElement("div");
            saveModal.className = "save-keywords-modal";
            saveModal.innerHTML = `
                <style>
                .save-keywords-modal {
                    background-color: #282828;
                    border-radius: 8px;
                    padding: 16px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    z-index: 1001;
                    width: 300px;
                }
                .save-keywords-title {
                    color: #fff;
                    font-size: 14px;
                    font-weight: bold;
                    margin-bottom: 12px;
                }
                .save-keywords-input {
                    width: 100%;
                    padding: 8px;
                    border-radius: 4px;
                    border: 1px solid #434343;
                    background: #121212;
                    color: white;
                    margin-bottom: 12px;
                    box-sizing: border-box;
                }
                .save-keywords-button {
                    background-color: #1db954;
                    border: none;
                    color: black;
                    padding: 8px 16px;
                    border-radius: 20px;
                    font-weight: bold;
                    cursor: pointer;
                    display: block;
                    width: auto;
                    margin: 0 auto;
                }

                .save-keywords-button:hover {
                    background-color: #1ed760;
                }

                .save-keywords-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0, 0, 0, 0.5);
                    z-index: 1000;
                }
                </style>
                <div class="save-keywords-title">Enter Keywords Group Name</div>
                <input type="text" class="save-keywords-input" placeholder="Group Name">
                <button class="save-keywords-button">Save</button>
            `;
            const overlay = document.createElement("div");
            overlay.className = "save-keywords-overlay";

            document.body.appendChild(overlay);
            document.body.appendChild(saveModal);

            const saveInput = saveModal.querySelector(".save-keywords-input");
            const saveBtn = saveModal.querySelector(".save-keywords-button");

            const closeModal = () => {
                saveModal.remove();
                overlay.remove();
            };

            saveBtn.addEventListener("click", () => {
                const groupName = saveInput.value.trim();
                if (groupName) {
                    let savedKeywordGroups = JSON.parse(localStorage.getItem("sort-play-keyword-groups") || "{}");
                    savedKeywordGroups[groupName] = [...keywordSet];
                    localStorage.setItem("sort-play-keyword-groups", JSON.stringify(savedKeywordGroups));
                    Spicetify.showNotification(`Keywords saved as "${groupName}"`);
                    closeModal();
                } else {
                    Spicetify.showNotification("Please enter a group name.");
                }
            });
            overlay.addEventListener("click", closeModal);
        });
      }

      if (loadButton) {
        loadButton.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();

            let savedKeywordGroups = JSON.parse(localStorage.getItem("sort-play-keyword-groups") || "{}");
            const groupNames = Object.keys(savedKeywordGroups).reverse();

            if (groupNames.length === 0) {
                Spicetify.showNotification("No saved keyword groups.");
                return;
            }

            const dropdown = document.createElement("div");
            dropdown.className = "load-keywords-dropdown";
            dropdown.innerHTML = `
                <style>
                .load-keywords-dropdown {
                    background-color: #282828;
                    border-radius: 4px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
                    position: absolute;
                    right: 0;
                    z-index: 1002;
                    min-width: 180px;
                    max-width: 250px;
                    max-height: 200px;
                    overflow-y: auto;
                }
                .load-keywords-option {
                    color: #fff;
                    padding-top: 8px;
                    padding-right: 5px;
                    padding-bottom: 8px;
                    padding-left: 12px;
                    cursor: pointer;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .load-keywords-option:hover {
                    background-color: #383838;
                }
                .load-keywords-option:active, .load-keywords-option.selected {
                    background-color: #1db954;
                    color: black;
                }
                .load-keywords-option .remove-button {
                    opacity: 0;
                    transition: opacity 0.2s;
                    cursor: pointer;
                    padding: 4px;
                    display: flex;
                    align-items: center;
                    max-width: 30px;
                }
                .load-keywords-option:hover .remove-button {
                    opacity: 1;
                }
                .remove-icon {
                    width: 12px;
                    height: 12px;
                    fill: currentColor;
                }
                .load-keywords-option-text {
                    flex-grow: 1;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    font-size: 14px;
                }
                .load-keywords-dropdown::-webkit-scrollbar {
                    width: 8px;
                }
                .load-keywords-dropdown::-webkit-scrollbar-track {
                    background: transparent;
                }
                .load-keywords-dropdown::-webkit-scrollbar-thumb {
                    background-color: #4d4d4d;
                    border-radius: 4px;
                }
                </style>
            `;

            let selectedOption = null;

            groupNames.forEach(groupName => {
                const option = document.createElement("div");
                option.className = "load-keywords-option";

                const optionContent = document.createElement("span");
                optionContent.className = "load-keywords-option-text";
                optionContent.textContent = groupName.length > 30 ? groupName.substring(0, 30) + "..." : groupName;
                optionContent.dataset.fullName = groupName;

                const removeButton = document.createElement("div");
                removeButton.className = "remove-button";
                removeButton.innerHTML = removeIconSVG;

                option.appendChild(optionContent);
                option.appendChild(removeButton);

                optionContent.addEventListener("click", (e) => {
                    const tagsContainer = container.querySelector(".keyword-tags-container");
                    tagsContainer.innerHTML = "";
                    keywordSet.clear();

                    savedKeywordGroups[groupName].forEach(keyword => {
                        keywordSet.add(keyword);
                        createKeywordTag(keyword, container, keywordSet, onUpdateCallback);
                    });

                    onUpdateCallback();
                    Spicetify.showNotification(`Keywords loaded from "${groupName}"`);

                    if (selectedOption) {
                        selectedOption.classList.remove("selected");
                    }
                    option.classList.add("selected");
                    selectedOption = option;

                    dropdown.remove();
                });

                removeButton.addEventListener("click", (e) => {
                    e.stopPropagation();

                    let savedKeywordGroups = JSON.parse(localStorage.getItem("sort-play-keyword-groups") || "{}");
                    delete savedKeywordGroups[groupName];
                    localStorage.setItem("sort-play-keyword-groups", JSON.stringify(savedKeywordGroups));

                    option.remove();
                    Spicetify.showNotification(`Removed keyword group "${groupName}"`);

                    if (Object.keys(savedKeywordGroups).length === 0) {
                        dropdown.remove();
                        Spicetify.showNotification("No more saved keyword groups.");
                    }
                });

                dropdown.appendChild(option);
            });

            loadButton.parentNode.appendChild(dropdown);

            const buttonRect = loadButton.getBoundingClientRect();
            dropdown.style.bottom = `${buttonRect.height + 4}px`;
            dropdown.style.right = `-50px`;

            const removeDropdown = (event) => {
                if (!dropdown.contains(event.target)) {
                    dropdown.remove();
                    document.removeEventListener('click', removeDropdown);
                }
            };
            setTimeout(() => {
                document.addEventListener('click', removeDropdown);
            }, 0);
        });
      }

      container.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
      });
  }

    function saveKeywords(titleAlbumKeywords, artistKeywords) {
        localStorage.setItem("sort-play-title-album-keywords", JSON.stringify([...titleAlbumKeywords]));
        localStorage.setItem("sort-play-artist-keywords", JSON.stringify([...artistKeywords]));
    }

     function loadKeywords() {
      const savedTitleAlbumKeywords = localStorage.getItem("sort-play-title-album-keywords");
      const savedArtistKeywords = localStorage.getItem("sort-play-artist-keywords");

      const titleAlbumKeywords = savedTitleAlbumKeywords ? new Set(JSON.parse(savedTitleAlbumKeywords)) : new Set();
      const artistKeywords = savedArtistKeywords ? new Set(JSON.parse(savedArtistKeywords)) : new Set();
    
      return { titleAlbumKeywords, artistKeywords };
    }

  async function showCustomFilterModal(tracks) {
    const modalContainer = document.createElement("div");
    modalContainer.className = "custom-filter-modal";
    const originalTracks = [...tracks];
    let displayedTracks = [];
    let startIndex = 0;
    let pageSize;
    const paginationThreshold = 20;
    let isFirstLoad = true;
    let isLastLoad = false;
    let matchWholeWord = false;
    let activeRangeFilter = localStorage.getItem("sort-play-active-range-filter") || "releaseDate";
    let handleTrackMove = null;

    tracks.forEach(track => {
        track.isRemovedByRange = false;
        track.isRemovedByKeyword = false;
        track.isRemoved = false;
    });

    let tableHeaders = `
        <th class="sticky-col index-col" data-sort-key="index">#</th>
        <th class="sticky-col title-col" data-sort-key="songTitle">Title</th>
        <th class="sticky-col artist-col" data-sort-key="allArtists">Artist</th>
        <th data-sort-key="albumName">Album</th>
        <th data-sort-key="releaseDate">Rel-Date</th>
        <th data-sort-key="durationMs">Duration</th>
        <th data-sort-key="playCount">Plays</th>
        <th data-sort-key="popularity">Popularity</th>
        <th data-sort-key="features.energy">Energy</th>
        <th data-sort-key="features.danceability">Danceability</th>
        <th data-sort-key="features.valence">Valence</th>
        <th data-sort-key="features.tempo">Tempo</th>
        <th data-sort-key="features.key">Key</th>
        <th data-sort-key="features.loudness">Loudness</th>
        <th data-sort-key="features.acousticness">Acousticness</th>
        <th data-sort-key="features.instrumentalness">Instrumentalness</th>
        <th data-sort-key="features.liveness">Liveness</th>
        <th class="sticky-col actions-col">Filter</th>
    `;

    let observer = null;
    let titleAlbumKeywords = new Set();
    let artistKeywords = new Set();
    let keepMatchingMode = false;
    let filterModeRadios;
    let titleToggle;
    let albumToggle;
    let artistToggle;
    let matchWholeWordToggle;
    let maxRowsSelect;
    let rangeFilterTypeSelect;
    let rangeFilterToggle;
    let keywordFilterToggle;
    let settingsLeftWrapper;

    function calculateTotalDuration(trackList) {
        let totalDurationMs = 0;
        trackList.forEach(track => {
            totalDurationMs += track.durationMs;
        });
        return totalDurationMs;
    }

    function formatTotalDuration(totalMs) {
        const totalSeconds = Math.floor(totalMs / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        if(hours > 0)
            return `${hours}h ${minutes}m`;
        else
            return `${minutes}m ${seconds}s`;

    }


    function updatePlaylistStats() {
        if (!modalContainer) return;

        const totalTracks = tracks.length;
        const displayedTracksCount = tracks.filter(track => !track.isRemoved).length;
        const totalDuration = calculateTotalDuration(tracks);
        const displayedDuration = calculateTotalDuration(tracks.filter(track => !track.isRemoved));

        const statsContainer = modalContainer.querySelector(".playlist-stats-container");
        if (statsContainer) {
            statsContainer.innerHTML = `
                <span>${displayedTracksCount}/${totalTracks} tracks</span>
                <span>${formatTotalDuration(displayedDuration)}/${formatTotalDuration(totalDuration)}</span>
            `;
        }
    }

    function loadAlbumArt(track, imgElement, maxRetries = 3, baseDelay = 200) {
        if (imgElement.style.opacity === '1') {
            return;
        }
    
        let attempt = 0;
        let retryTimer;
    
        const clearRetryTimer = () => {
            if (retryTimer) {
                clearTimeout(retryTimer);
                retryTimer = null;
            }
        };
    
        const attemptLoad = async () => {
            try {
                const trackDetails = await Spicetify.GraphQL.Request(
                    Spicetify.GraphQL.Definitions.decorateContextTracks,
                    { uris: [track.uri] }
                );
    
                if (trackDetails?.data?.tracks?.[0]?.response?.status === 429) {
                    attempt++;
                    const waitTime = baseDelay * Math.pow(2, attempt - 1);
                    console.warn(`Rate limit hit for track ${track.uri}, retrying in ${waitTime}ms (attempt ${attempt}/${maxRetries})`);
                    retryTimer = setTimeout(attemptLoad, waitTime);
                    return;
                }
    
                const sources = trackDetails?.data?.tracks?.[0]?.albumOfTrack?.coverArt?.sources;
    
                if (sources?.length > 0) {
                    let bestSource = null;
                    for (const source of sources) {
                        if (source.width >= 40 && source.height >= 40) {
                            if (!bestSource || source.width < bestSource.width) {
                                bestSource = source;
                            }
                        }
                    }
                    const albumArtSrc = bestSource ? bestSource.url : sources[sources.length - 1].url;
    
                    const tempImage = new Image();
                    tempImage.onload = () => {
                        imgElement.src = albumArtSrc;
                        imgElement.style.opacity = '1';
                        clearRetryTimer();
                    };
                    tempImage.onerror = () => {
                        attempt++;
                        if (attempt <= maxRetries) {
                            console.warn(`Failed to load image for track ${track.uri}, retrying (${attempt}/${maxRetries})`);
                            const waitTime = baseDelay * Math.pow(2, attempt - 1);
                            retryTimer = setTimeout(attemptLoad, waitTime);
                        }
                    };
                    tempImage.src = albumArtSrc;
                } else {
                    console.warn(`No image sources found for track ${track.uri}`);
                }
            } catch (error) {
                attempt++;
                if (attempt <= maxRetries) {
                    const waitTime = baseDelay * Math.pow(2, attempt - 1);
                    retryTimer = setTimeout(attemptLoad, waitTime);
                }
            }
        };
    
        attemptLoad();
    }


    function generateTableRows(tracksToDisplay) {
        return tracksToDisplay.map((track, index) => {
            const displayedIndex = startIndex + index;
            const originalIndex = originalTracks.findIndex(t => t.uri === track.uri);

            let row = `
          <tr data-track-uri="${track.uri}" data-row-index="${originalIndex}" class="${track.isRemoved ? 'removed' : ''}">
              <td class="sticky-col index-col">${displayedIndex + 1}</td>
              <td class="sticky-col title-col">
                  <div class="song-info">
                      <div class="main-image-container">
                          <img
                              aria-hidden="false"
                              draggable="false"
                              loading="eager"
                              src="/api/placeholder/40/40"
                              alt=""
                              class="main-image-image2 main-trackList-rowImage"
                              width="40"
                              height="40"
                              style="border-radius: 4px; opacity: 0;"
                              data-track-uri="${track.uri}"
                          />
                      </div>
                      <span class="song-title text-overflow" title="${track.songTitle || track.name}">${track.songTitle || track.name}</span>
                  </div>
              </td>
              <td class="sticky-col artist-col">
                  <span class="text-overflow" title="${track.allArtists}">${track.allArtists}</span> 
              </td>
              <td>
                  <span class="text-overflow" title="${track.albumName}">${track.albumName}</span>
              </td>
              <td>${track.releaseDate ? new Date(track.releaseDate).toLocaleDateString() : "N/A"}</td>
              <td>${formatDuration(track.durationMs)}</td> 
              <td>${Number(track.playCount).toLocaleString()}</td>
              <td>${track.popularity !== null ? track.popularity : "N/A"}</td>
          `;

            row += `
                  <td>${track.features?.energy !== null ? track.features.energy : "N/A"}</td>
                  <td>${track.features?.danceability !== null ? track.features.danceability : "N/A"}</td>
                  <td>${track.features?.valence !== null ? track.features.valence : "N/A"}</td>
                  <td>${track.features?.tempo !== null ? track.features.tempo : "N/A"}</td>
                  <td>${track.features?.key !== null ? track.features.key : "N/A"}</td>
                  <td>${track.features?.loudness !== null ? track.features.loudness : "N/A"}</td>
                  <td>${track.features?.acousticness !== null ? track.features.acousticness : "N/A"}</td>
                  <td>${track.features?.instrumentalness !== null ? track.features.instrumentalness : "N/A"}</td>
                  <td>${track.features?.liveness !== null ? track.features.liveness : "N/A"}</td>
            `;
            row += `
          <td class="sticky-col actions-col">
              <button class="remove-button" data-track-uri="${track.uri}">
                  ${track.isRemoved ? restoreIconSVG : removeIconSVG}
              </button>
          </td>
          </tr>`;
            return row;
        }).join('');
    }


    function loadMore(direction) {
        if (direction === 'down' && !isLastLoad) {
            startIndex += pageSize;
            if (startIndex + pageSize >= tracks.length) {
                isLastLoad = true;
            }
            isFirstLoad = false;
        } else if (direction === 'up' && !isFirstLoad) {
            startIndex -= pageSize;
            if (startIndex <= 0) {
                startIndex = 0;
                isFirstLoad = true;
            }
            isLastLoad = false;
        }

        displayedTracks = tracks.slice(startIndex, startIndex + pageSize);

        if (tracks.length <= startIndex + pageSize + paginationThreshold) {
            isLastLoad = true;
            displayedTracks = tracks.slice(startIndex, tracks.length);
        }

        updateTable(displayedTracks);

        const playlistWrapper = modalContainer.querySelector(".playlist-wrapper");
        if (playlistWrapper) {
            if (direction === 'down') {
                playlistWrapper.scrollTop = 0;
            } else if (direction === 'up') {
                playlistWrapper.scrollTop = playlistWrapper.scrollHeight;
            }
        }
    }

    function generateLoadMoreRow(direction) {
        const row = document.createElement("tr");
        row.className = `load-more-row load-more-row-${direction}`;
        row.innerHTML = `<td colspan="100%" class="load-more-cell">. . . Load More . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .  . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .  . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . Load More . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .  . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .  . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . Load More . . .</td>`;

        row.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            loadMore(direction);
        });

        return row;
    }

    function sortTracks(tracksToSort, sortKey, direction) {
        let sortedTracks = [...tracksToSort];

        if (!sortKey || direction === 'none') return sortedTracks;

        sortedTracks.sort((a, b) => {
            let valueA = sortKey.includes('.') ? sortKey.split('.').reduce((o, k) => (o || {})[k], a) : a[sortKey];
            let valueB = sortKey.includes('.') ? sortKey.split('.').reduce((o, k) => (o || {})[k], b) : b[sortKey];

            if (valueA === null) valueA = -Infinity;
            if (valueB === null) valueB = -Infinity;

            if (valueA === "N/A") valueA = -Infinity;
            if (valueB === "N/A") valueB = -Infinity;

            if (sortKey === 'releaseDate') {
                valueA = valueA ? new Date(valueA).getTime() : (direction === 'ascending' ? Infinity : -Infinity);
                valueB = valueB ? new Date(valueB).getTime() : (direction === 'ascending' ? Infinity : -Infinity);
            }

            if (typeof valueA === 'string' && typeof valueB === 'string') {
                return direction === 'ascending' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
            }
            return direction === 'ascending' ? valueA - valueB : valueB - valueA;
        });
        return sortedTracks;
    }

    let tableBody;

    function setupIntersectionObserver() {
        if (observer) {
            observer.disconnect();
        }
    
        const observerCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const row = entry.target;
                    const img = row.querySelector('img[data-track-uri]');
                    if (!img) return;
    
                    const trackUri = img.dataset.trackUri;
                    const track = originalTracks.find(t => t.uri === trackUri);
                    if (track) {
                        loadAlbumArt(track, img);
                    }
                }
            });
        };
    
        observer = new IntersectionObserver(observerCallback, {
            root: modalContainer.querySelector('.playlist-wrapper'),
            rootMargin: '1200px 0px',
            threshold: 0.1
        });
        
        if(tableBody) {
            const allRows = tableBody.querySelectorAll('tr[data-track-uri]');
            allRows.forEach(row => {
                observer.observe(row);
            });
            
            const visibleImages = tableBody.querySelectorAll('img[data-track-uri][style="opacity: 0;"]');
            visibleImages.forEach(img => {
                const trackUri = img.dataset.trackUri;
                const track = originalTracks.find(t => t.uri === trackUri);
                if (track) {
                    loadAlbumArt(track, img);
                }
            });
        }
    }

    function updateTable(updatedTracks) {
        if(!tableBody) return;
        tableBody.innerHTML = generateTableRows(updatedTracks);
        setupIntersectionObserver();

        const existingTopRow = document.querySelector(".load-more-row-up");
        const existingBottomRow = document.querySelector(".load-more-row-down");
        if (existingTopRow) existingTopRow.remove();
        if (existingBottomRow) existingBottomRow.remove();

        const styleElement = document.querySelector(".custom-filter-load-more-style") || document.createElement("style");
        styleElement.className = "custom-filter-load-more-style";

        if (!isFirstLoad) {
            const topLoadMoreRow = generateLoadMoreRow("up");
            const firstRow = tableBody.firstChild;
            if (firstRow) {
                tableBody.insertBefore(topLoadMoreRow, firstRow);
            } else {
                tableBody.appendChild(topLoadMoreRow);
            }
        }

        if (!isLastLoad) {
            const bottomLoadMoreRow = generateLoadMoreRow("down");
            tableBody.appendChild(bottomLoadMoreRow);
        }
      updatePlaylistStats();
    }

    function calculateMinMax(tracks, filterType) {
        if (tracks.length === 0) {
            return { min: 0, max: 0 };
        }
    
        let min, max;
    
        if (filterType === 'releaseDate') {
            const tracksWithDates = tracks.filter(track => track.releaseDate);
    
            if (tracksWithDates.length === 0) {
                const now = new Date();
                return {
                    min: new Date(now.getFullYear() - 5, 0, 1).getTime(),
                    max: now.getTime()
                };
            }
    
            const timestamps = tracksWithDates.map(track => {
                const date = new Date(track.releaseDate);
                return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
            });
            min = Math.min(...timestamps);
            max = Math.max(...timestamps);
    
        } else if (filterType === 'durationMs') {
            min = Math.min(...tracks.map(track => track.durationMs));
            max = Math.max(...tracks.map(track => track.durationMs));
    
        } else {
            const values = tracks.map(track => {
                if (filterType === 'playCount') {
                    return (parseInt(track.playCount) || 0);
                } else if (filterType === 'popularity') {
                    return (track.popularity || 0);
                } else if (filterType === 'features.energy') { 
                    return (track.features?.energy ?? 0);
                }
                else if (filterType === 'features.danceability') {
                    return (track.features?.danceability ?? 0);
                }
                else if (filterType === 'features.valence') {
                    return (track.features?.valence ?? 0);
                }
                else if (filterType === 'features.tempo') {
                    return (track.features?.tempo ?? 0);
                }
                return 0;
            });
            min = Math.min(...values);
            max = Math.max(...values);
        }

        return { min, max };
    }

    function formatNumber(number, isMin, filterType) {
        if (isNaN(number)) {
            return "";
        }
    
        if (filterType === 'releaseDate') {
            const date = new Date(number);
            const month = date.getMonth() + 1; 
            const day = date.getDate().toString().padStart(2, '0');
            const year = date.getFullYear();
            return `${month}/${day}/${year}`;
        } else if (filterType === 'playCount') {
            if (number >= 1000000000) {
                return (isMin ? Math.floor(number / 10000000) / 100 : Math.ceil(number / 10000000) / 100) + "B";
            } else if (number >= 1000000) {
                return (isMin ? Math.floor(number / 10000) / 100 : Math.ceil(number / 10000) / 100) + "M";
            } else if (number >= 1000) {
                return (isMin ? Math.floor(number / 10) / 100 : Math.ceil(number / 10) / 100) + "k";
            }
            return number.toString();
        } else if (filterType === 'durationMs') {
            return formatDuration(number);
        }
        
        return number.toString(); 
    }
    

    function parseFormattedNumber(formattedNumber) {
        if (!formattedNumber) {
            return 0;
        }

        formattedNumber = formattedNumber.trim();

        const dateMatch = formattedNumber.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
        if (dateMatch) {
            const month = parseInt(dateMatch[1]) - 1;
            const day = parseInt(dateMatch[2]);
            const year = parseInt(dateMatch[3]);
            const date = new Date(year, month, day);
            if (isNaN(date.getTime())) {  
                return 0; 
            }
            return date.getTime();
        }

        const durationMatch = formattedNumber.match(/^(\d+):(\d+)$/);
        if (durationMatch) {
            const minutes = parseInt(durationMatch[1]);
            const seconds = parseInt(durationMatch[2]);
            return minutes * 60000 + seconds * 1000;
        }

        const match = formattedNumber.match(/^([0-9.]+)([BMK])?$/i);
        if (!match) return 0;

        const numberPart = parseFloat(match[1]);
        const suffix = match[2];

        if (isNaN(numberPart)) return 0;

        switch (suffix) {
            case "B":
                return numberPart * 1000000000;
            case "M":
                return numberPart * 1000000;
            case "K":
                return numberPart * 1000;
            default:
                return numberPart;
        }
    }

    function updateTrackFilters() {
        saveKeywords(titleAlbumKeywords, artistKeywords);
        const keywordFilterEnabled = keywordFilterToggle.checked;
        const keepMatching = keepMatchingMode;
        const filterTitle = titleToggle.checked;
        const filterAlbum = albumToggle.checked;
        const filterArtist = artistToggle.checked;
        const rangeFilterEnabled = rangeFilterToggle.checked;
    
        const minRange = parseFormattedNumber(modalContainer.querySelector("#rangeMin").value) || minRangeValue;
        const maxRange = parseFormattedNumber(modalContainer.querySelector("#rangeMax").value) || maxRangeValue;
    
        localStorage.setItem("sort-play-filter-title", filterTitle);
        localStorage.setItem("sort-play-filter-album", filterAlbum);
        localStorage.setItem("sort-play-filter-artist", filterArtist);
        localStorage.setItem("sort-play-match-whole-word", matchWholeWord);
        localStorage.setItem("sort-play-active-range-filter", activeRangeFilter);
    
        tracks.forEach((track) => {
            if (rangeFilterEnabled) {
                let trackValue;
    
                if (activeRangeFilter === 'releaseDate') {
                    if (!track.releaseDate) {
                        track.isRemovedByRange = true;
                    } else {
                        const trackDate = new Date(track.releaseDate);
                        const trackDateNormalized = new Date(
                            trackDate.getFullYear(),
                            trackDate.getMonth(),
                            trackDate.getDate()
                        ).getTime();
        
                        const minDate = new Date(minRange);
                        const maxDate = new Date(maxRange);
        
                        const minDateNormalized = new Date(
                            minDate.getFullYear(),
                            minDate.getMonth(),
                            minDate.getDate()
                        ).getTime();
        
                        const maxDateNormalized = new Date(
                            maxDate.getFullYear(),
                            maxDate.getMonth(),
                            maxDate.getDate(),
                            23, 59, 59, 999
                        ).getTime();
        
                        track.isRemovedByRange = trackDateNormalized < minDateNormalized || trackDateNormalized > maxDateNormalized;
                    }
                } else if (activeRangeFilter === 'durationMs') {
                    trackValue = track.durationMs;
                    track.isRemovedByRange = trackValue < minRange || trackValue > maxRange;
                } else if (activeRangeFilter === 'playCount') {
                    trackValue = parseInt(track.playCount, 10) || 0;
                    track.isRemovedByRange = trackValue < minRange || trackValue > maxRange;
                } else if (activeRangeFilter === 'popularity') {
                    trackValue = track.popularity || 0;
                    track.isRemovedByRange = trackValue < minRange || trackValue > maxRange;
                } else if (activeRangeFilter.startsWith("features.")) {
                    if (activeRangeFilter === 'features.energy') {
                        trackValue = track.features?.energy ?? 0;
                    } else if (activeRangeFilter === 'features.danceability') {
                        trackValue = track.features?.danceability ?? 0;
                    } else if (activeRangeFilter === 'features.valence') {
                        trackValue = track.features?.valence ?? 0;
                    } else if (activeRangeFilter === 'features.tempo') {
                        trackValue = track.features?.tempo ?? 0;
                    }
                    track.isRemovedByRange = trackValue < minRange || trackValue > maxRange;
                }
            } else {
                track.isRemovedByRange = false;
            }
    
            if (keywordFilterEnabled && !track.isRemovedByRange) {
                if (titleAlbumKeywords.size === 0 && artistKeywords.size === 0) {
                    track.isRemovedByKeyword = false;
                } else {
                    const titleAlbumMatch =
                        titleAlbumKeywords.size === 0
                            ? null
                            : [...titleAlbumKeywords].some((keyword) => {
                                const regex = matchWholeWord
                                    ? new RegExp(`\\b${keyword}\\b`, "i")
                                    : new RegExp(keyword, "i");
                                return (
                                    (filterTitle && regex.test(track.songTitle)) ||
                                    (filterAlbum && regex.test(track.albumName))
                                );
                            });
    
                    const artistMatch =
                        artistKeywords.size === 0
                            ? null
                            : [...artistKeywords].some((keyword) => {
                                const regex = matchWholeWord
                                    ? new RegExp(`\\b${keyword}\\b`, "i")
                                    : new RegExp(keyword, "i");
                                return filterArtist && regex.test(track.allArtists);
                            });
    
                    if (keepMatching) {
                        track.isRemovedByKeyword = !(
                            (titleAlbumMatch === true || titleAlbumMatch === null) &&
                            (artistMatch === true || artistMatch === null)
                        );
                    } else {
                        track.isRemovedByKeyword =
                            titleAlbumMatch === true || artistMatch === true;
                    }
                }
            } else {
                track.isRemovedByKeyword = false;
            }
    
            const shouldRemove = track.isRemovedByRange || track.isRemovedByKeyword;
    
            if (track.isRemoved !== shouldRemove) {
                track.isRemoved = shouldRemove;
            }
        });
    
        startIndex = 0;
        isFirstLoad = true;
        isLastLoad = tracks.length <= pageSize + paginationThreshold;
        displayedTracks = tracks.slice(startIndex, isLastLoad ? tracks.length : pageSize);
        updateTable(displayedTracks);
        updatePlaylistStats();
    }

    function setupDualRangesliderx(sliderxContainerId, minInputId, maxInputId) {
        const sliderxContainer = modalContainer.querySelector(`#${sliderxContainerId}`);
        const sliderx1 = sliderxContainer.querySelector(`#${sliderxContainerId}-1`);
        const sliderx2 = sliderxContainer.querySelector(`#${sliderxContainerId}-2`);
        const minInput = modalContainer.querySelector(`#${minInputId}`);
        const maxInput = modalContainer.querySelector(`#${maxInputId}`);
        const sliderxTrack = sliderxContainer.querySelector(".sliderx-track");

        if(!sliderxContainer         || !sliderx1 || !sliderx2 || !minInput || !maxInput || !sliderxTrack) return;

        let minGap = 0;
        let isDragging = false;

        function slideOne() {
            if (parseInt(sliderx2.value) - parseInt(sliderx1.value) <= minGap) {
                sliderx1.value = parseInt(sliderx2.value) - minGap;
            }
            updateInputs();
            fillColor();
            debouncedUpdateTrackFilters();
        }

        function slideTwo() {
            if (parseInt(sliderx2.value) - parseInt(sliderx1.value) <= minGap) {
                sliderx2.value = parseInt(sliderx1.value) + minGap;
            }
            updateInputs();
            fillColor();
            debouncedUpdateTrackFilters(); 
        }

        function fillColor() {
            const sliderxMaxValue = parseInt(sliderx1.max);
            const sliderxMinValue = parseInt(sliderx1.min);
            const totalRange = sliderxMaxValue - sliderxMinValue;
    
            const value1 = parseInt(sliderx1.value);
            const value2 = parseInt(sliderx2.value);
    
            const percent1 = totalRange === 0 ? 0 : ((value1 - sliderxMinValue) / totalRange) * 100;
            const percent2 = totalRange === 0 ? 100 : ((value2 - sliderxMinValue) / totalRange) * 100;
    
    
            sliderxTrack.style.background = `linear-gradient(to right, #4d4d4d ${percent1}% , #1ed760 ${percent1}% , #1ed760 ${percent2}%, #4d4d4d ${percent2}%)`;
        }

        function updateInputs() {
            minInput.value = formatNumber(parseInt(sliderx1.value), true, activeRangeFilter);
            maxInput.value = formatNumber(parseInt(sliderx2.value), false, activeRangeFilter);
        }

        const debouncedUpdatesliderxs = debounce(updatesliderxs, 800);

        function updatesliderxs() {
            let minValue = parseFormattedNumber(minInput.value);
            let maxValue = parseFormattedNumber(maxInput.value);

            if (minValue === 0) minValue = parseInt(sliderx1.value);
            if (maxValue === 0) maxValue = parseInt(sliderx2.value);

            minValue = Math.max(minRangeValue, Math.min(minValue, maxRangeValue));
            maxValue = Math.max(minRangeValue, Math.min(maxRangeValue, maxValue));

            maxValue = Math.max(minValue, maxValue);

            minInput.value = formatNumber(minValue, true, activeRangeFilter);
            maxInput.value = formatNumber(maxValue, false, activeRangeFilter);

            sliderx1.value = minValue;
            sliderx2.value = maxValue;

            fillColor();
        }

        function handleTrackClick(event) {
            const rect = sliderxTrack.getBoundingClientRect();
            const clickX = event.clientX - rect.left;
            const trackWidth = rect.width;
            const percent = clickX / trackWidth;
            const range = maxRangeValue - minRangeValue;
            const newValue = minRangeValue + (percent * range);

            const diff1 = Math.abs(newValue - parseInt(sliderx1.value));
            const diff2 = Math.abs(newValue - parseInt(sliderx2.value));

            if (diff1 <= diff2) {
                sliderx1.value = newValue;
                slideOne();
            } else {
                sliderx2.value = newValue;
                slideTwo();
            }
        }

        handleTrackMove = function(event) {
            if (!isDragging) {
                return;
            }
            handleTrackClick(event);
        }

        sliderx1.addEventListener("input", slideOne);
        sliderx2.addEventListener("input", slideTwo);
        minInput.addEventListener("input", debouncedUpdatesliderxs);
        maxInput.addEventListener("input", debouncedUpdatesliderxs);
        minInput.addEventListener("blur", updatesliderxs);
        maxInput.addEventListener("blur", updatesliderxs);

        sliderxTrack.addEventListener("mousedown", (e) => {
            isDragging = true;
            handleTrackClick(e);
        });
        document.addEventListener("mousemove", handleTrackMove);

        document.addEventListener("mouseup", () => {
            isDragging = false;
        });

        updateInputs();
        fillColor();

        sliderx1.addEventListener("input", debouncedUpdateTrackFilters);
        sliderx2.addEventListener("input", debouncedUpdateTrackFilters);
        minInput.addEventListener("input", debouncedUpdateTrackFilters);
        maxInput.addEventListener("input", debouncedUpdateTrackFilters);
    }

    function updateRangeUI(filterType) {
        if(!modalContainer) return;

        if (filterType === "features.energy") {
            minRangeValue = 0;
            maxRangeValue = 1;
        }
        else if (filterType === "features.danceability") {
            minRangeValue = 0;
            maxRangeValue = 1;
        }
        else if (filterType === "features.valence") {
            minRangeValue = 0;
            maxRangeValue = 1;
        }

        const range = calculateMinMax(tracks, filterType);
        minRangeValue = range.min;
        maxRangeValue = range.max;

        const sliderx1 = modalContainer.querySelector("#rangesliderx-1");
        const sliderx2 = modalContainer.querySelector("#rangesliderx-2");
        const minInput = modalContainer.querySelector("#rangeMin");
        const maxInput = modalContainer.querySelector("#rangeMax");
        if(!sliderx1 || !sliderx2 || !minInput || !maxInput) return;

        sliderx1.min = minRangeValue;
        sliderx1.max = maxRangeValue;
        sliderx1.value = minRangeValue;
        sliderx2.min = minRangeValue;
        sliderx2.max = maxRangeValue;
        sliderx2.value = maxRangeValue;

        minInput.value = formatNumber(minRangeValue, true, filterType);
        maxInput.value = formatNumber(maxRangeValue, false, filterType);
        
        if (filterType === "releaseDate") {
            minInput.placeholder = "From Date";
            maxInput.placeholder = "To Date";
            minInput.type = "text"; 
            maxInput.type = "text";
        } else {
            minInput.type = "text";
            maxInput.type = "text";
            minInput.placeholder = filterType === "playCount" ? "Min Plays" : 
                                  filterType === "popularity" ? "Min" : "Min Duration";
            maxInput.placeholder = filterType === "playCount" ? "Max Plays" : 
                                  filterType === "popularity" ? "Max" : "Max Duration";
        }

        const sliderxTrack = modalContainer.querySelector(".sliderx-track");
        if (sliderxTrack) {
            const sliderxMaxValue = parseInt(sliderx1.max);
            const sliderxMinValue = parseInt(sliderx1.min);
            const totalRange = sliderxMaxValue - sliderxMinValue;

            const value1 = parseInt(sliderx1.value);
            const value2 = parseInt(sliderx2.value);

            let percent1 = totalRange === 0 ? 0 : ((value1 - sliderxMinValue) / totalRange) * 100;
            let percent2 = totalRange === 0 ? 100 : ((value2 - sliderxMinValue) / totalRange) * 100;

            percent1 = Math.max(0, Math.min(100, percent1));
            percent2 = Math.max(0, Math.min(100, percent2));
            sliderxTrack.style.background = `linear-gradient(to right, #4d4d4d ${percent1}% , #1ed760 ${percent1}% , #1ed760 ${percent2}%, #4d4d4d ${percent2}%)`;
        }
    }

    const debouncedUpdateTrackFilters = debounce(() => {
        updateTrackFilters();
        setTimeout(() => {
            setupIntersectionObserver();
        }, 100);
        updatePlaylistStats();
    }, 800);



    let initialRange = calculateMinMax(tracks, activeRangeFilter);
    let minRangeValue = initialRange.min;
    let maxRangeValue = initialRange.max;

    modalContainer.innerHTML = `
    <style>
    .custom-filter-modal {
        width: 100%;
        max-width: 1200px;
        color: #fff;
    }
    .tracklist-table .actions-col {
        box-shadow: 2px 0 2px #121212;
    }
    .GenericModal__overlay .GenericModal {
        border-radius: 30px;
        overflow: hidden;
    }
    .GenericModal > .main-embedWidgetGenerator-container {
      height: auto !important;
    } 
    .main-trackCreditsModal-originalCredits{
      padding-bottom: 20px !important;
    }
    .text-overflow {
        position: relative;
    }

    .playlist-player-wrapper {
        background-color: #1c1c1c;
        border-radius: 20px;
        position: relative;
        display: flex;
        flex-direction: column;
        margin-bottom: 15px;
        border: 4px solid #1c1c1c;
    }

    .playlist-wrapper {
        max-height: 30vh;
        background-color: #121212;
        overflow: auto;
        padding: 0 0px;
        scrollbar-width: thin;
        scrollbar-color: #232323 transparent;
        position: relative;
    }

    .playlist-wrapper::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }

    .playlist-wrapper::-webkit-scrollbar-thumb {
        background-color: #ffffff40;
        border-radius: 4px;
    }

    .playlist-wrapper::-webkit-scrollbar-track {
        background: transparent;
    }

    .tracklist-table {
        width: 100%;
        border-collapse: separate;
        color: #b3b3b3;
        font-size: 14px;
        table-layout: fixed;
    }

    .tracklist-table th {
        text-align: left;
        padding: 8px;
        border-bottom: 1px solid #282828;
        font-weight: 400;
        font-family: 'SpotifyMixUI' !important;
        color: #b3b3b3;
        position: sticky;
        top: 0;
        background: #121212;
        z-index: 2;
        height: 45px;
        vertical-align: middle;
        white-space: nowrap;
    }
    .tracklist-table th:hover {
        color: #ffffff;
    }

    .tracklist-table th.sorted {
        color: #1ED760;
    }
    .tracklist-table .index-col {
        width: 52px;
    }

    .tracklist-table th.index-col {
        text-align: center;
    }

    .tracklist-table .title-col {
        width: 340px;
        padding-right: 16px;
    }

    .tracklist-table .artist-col {
        width: 200px;
    }

    .tracklist-table th:nth-child(4) {
        width: 200px;
    }
    .tracklist-table th:nth-child(6) {
        width: 85px;
        text-align: center;
    }

    .tracklist-table th:nth-child(8) {
        width: 90px;
        text-align: center;
    }


    .tracklist-table th:nth-child(7) {
        width: 120px;
        text-align: center;
    }

    .tracklist-table th:nth-child(5) {
        width: 100px;
        text-align: center;
        white-space: normal;
    }

    .tracklist-table th:nth-child(n+9) {
        text-align: center;
    }

    .tracklist-table th:nth-child(9) {
        width: 70px;
    }

    .tracklist-table th:nth-child(10) {
        width: 110px;
    }

    .tracklist-table th:nth-child(11) {
        width: 80px;
    }

    .tracklist-table th:nth-child(12) {
        width: 80px;
    }

    .tracklist-table th:nth-child(13) {
        width: 80px;
    }

    .tracklist-table th:nth-child(14) {
        width: 100px;
    }

    .tracklist-table th:nth-child(15) {
        width: 110px;
    }

    .tracklist-table th:nth-child(16) {
        width: 140px;
    }

    .tracklist-table th:nth-child(17) {
        width: 90px;
    }

    .sticky-col {
        position: sticky;
        background: #121212;
        z-index: 1;
    }

    .index-col {
        left: 0;
        text-align: center;
    }

    .title-col {
        left: 52px;
    }

    .artist-col {
        left: 392px;
        width: 200px;
    }

    .tracklist-table td:nth-child(n+6) {
        text-align: center;
    }

    .tracklist-table td:nth-child(4) {
        width: 200px;
    }
    .tracklist-table td:nth-child(5) {
        width: 100px;
        text-align: center;
    }

    .tracklist-table .actions-col {
        width: 60px;
        right: 0;
        text-align: center;
        vertical-align: middle;
        box-shadow: 2px 0 2px #121212;
    }

    .actions-col {
        right: 0;
        padding: 0 !important;
    }

    .actions-col::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 1px;
        background: #282828;
        pointer-events: none;
    }

    .tracklist-table td:nth-child(n+6):not(:last-child) {
        text-align: center;
    }

    .tracklist-table tr.removed {
        background-color: #4a1515 !important;
    }

    .tracklist-table tr.removed:hover {
        background-color: #5a1919 !important;
    }

    .tracklist-table tr.removed .sticky-col {
        background-color: #4a1515 !important;
    }

    .tracklist-table tr.removed:hover .sticky-col {
        background-color: #5a1919 !important;
    }

    .tracklist-table tr.removed.active {
        background-color: #6a1d1d !important;
    }

    .tracklist-table tr.removed.active .sticky-col {
        background-color: #6a1d1d !important;
    }

    .custom-filter-modal .sort-type-select {
      padding: 7px;
      border-radius: 4px;
      border: 1px solid #434343;
      background: #282828;
      color: white;
      width: 170px;
      cursor: pointer;
      margin-right: 100px;
    }

    #customFilterCreatePlaylist {
        margin: 0;
        padding: 8px 32px;
        border-radius: 500px;
        border: none;
        background: #1db954;
        color: black;
        font-size: 14px;
        font-weight: 700;
        cursor: pointer;
        transition: background-color 0.2s ease;
    }

    #customFilterCreatePlaylist:hover {
        background: #1ed760;
    }

    .remove-button {
        background: none;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto;
        width: 100%;
        height: 100%;
        padding: 0;
    }

    .remove-icon {
        width: 14px;
        height: 14px;
        fill: #b3b3b3;
        transition: fill 0.2s ease;
    }

    .remove-button:hover .remove-icon {
        fill: #ffffff;
    }
    .text-overflow {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: block;
        width: 100%;
    }

    th.sticky-col {
        z-index: 3;
    }

    .artist-col::after {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        height: 100%;
        width: 1px;
        background: #282828;
        pointer-events: none;
    }

    .tracklist-table tr {
        height: 35px;
    }

    .tracklist-table tr:hover {
        background-color: #282828;
    }
     .tracklist-table tr.active {
        background-color: #5A5A5A !important;
    }

    .tracklist-table tbody tr {
        height: 35px;
    }

    .tracklist-table tbody tr:hover {
        background-color: #282828;
    }
     .tracklist-table tr.active .sticky-col {
        background-color: #5A5A5A !important;
    }


    .tracklist-table tbody tr:hover .sticky-col {
        background-color: #282828;
    }

    .tracklist-table thead tr .sticky-col {
        background-color: #121212;
    }

    .tracklist-table td {
        padding: 8px;
        border: none;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        vertical-align: middle;
        height: 35px;
    }

    .main-image-container {
        width: 33px;
        height: 33px;
        min-width: 33px;
        min-height: 33px;
        border-radius: 4px;
        background-color: #282828;
        position: relative;
        aspect-ratio: 1 / 1;
        flex-shrink: 0;
    }

    .main-image-image2 {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        transition: opacity 0.3s ease;
        object-fit: cover;
    }

    .song-info {
        display: flex;
        align-items: center;
        gap: 12px;
        height: 100%;
        min-width: 0;
        padding-right: 16px;
    }

    .song-info img {
        width: 33px;
        height: 33px;
        border-radius: 4px;
        object-fit: cover;
    }

    .song-title {
        color: #fff;
        font-weight: 400;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: block;
    }


    .main-embedWidgetGenerator-container {
        width: 1200px !important;
        max-width: 1500px !important;
        max-height: 90vh !important;
        border-radius: 30px;
        overflow: hidden;
        background-color: #121212 !important;
        border: 2px solid #282828;
    }

    .GenericModal__overlay .GenericModal {
        border-radius: 30px;
        overflow: hidden;
    }

    .main-trackCreditsModal-mainSection {
        overflow-y: hidden !important;
        padding: 16px 32px 9px 32px;
    }

    .main-trackCreditsModal-header {
        padding: 16px 32px 12px !important;
    }

    .custom-filter-modal .main-popupModal-content {
        overflow-y: auto;
    }
    .GenericModal {
        position: relative;
        z-index: 1000;
    }

    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.25);
        backdrop-filter: blur(5px);
        -webkit-backdrop-filter: blur(5px);
        z-index: 999;
    }
    .playlist-title-container {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding: 14px 20px;
    }

    .playlist-stats-container {
        display: flex;
        gap: 12px;
        color: #b3b3b3;
        font-size: 14px;
        margin-left: auto;
    }
    .player-controls2 {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 12px 20px;
    }

    .control-button2 {
        background-color: transparent;
        border: 0;
        color: #ffffff;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: color 0.2s ease;
    }

    .progress-bar2-container {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        align-items: center;
        gap: 8px;
        color: #b3b3b3;
        font-size: 12px;
        width: 450px;
        max-width: 450px;
    }

    #currentTime, #duration {
        min-width: 45px;
        text-align: center;
        font-variant-numeric: tabular-nums;
    }
    #currentTime {
        text-align: right;
    }

    #duration {
        text-align: left;
    }
    .progress-bar2 {
        flex: 1;
        height: 4px;
        background-color: #4d4d4d;
        border-radius: 2px;
        cursor: pointer;
        position: relative;
        min-width: 0;
    }

    .progress-bar2-inner {
        position: absolute;
        height: 100%;
        background-color: #ffffff;
        border-radius: 2px;
        transition: width 0.1s linear;
    }

    .progress-bar2:hover .progress-bar2-inner {
        background-color: #1db954;
    }


    .track-info-container {
        display: flex;
        align-items: center;
        gap: 12px;
        max-width: 300px;
        min-width: 200px;
    }

    .track-info-text {
        display: flex;
        flex-direction: column;
        min-width: 0;
    }

    .track-title {
        color: #fff;
        font-size: 14px;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .track-artist {
        color: #b3b3b3;
        font-size: 12px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .track-album-art {
        width: 40px;
        height: 40px;
        border-radius: 4px;
        background-color: #282828;
        flex-shrink: 0;
    }


    .max-rows-container {
        display: flex;
        align-items: center;
        gap: 8px;
        white-space: nowrap;
    }

    .max-rows-label {
        color: #b3b3b3;
        font-size: 12px;
    }

    .max-rows-select {
        padding: 3px 4px;
        border-radius: 4px;
        border: 1px solid #434343;
        background: #282828;
        color: white;
        cursor: pointer;
    }
    .filter-settings-container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: auto auto;
        gap: 15px;
        margin-bottom: 15px;
    }

    .settings-left-wrapper,
    .settings-right-wrapper {
        background-color: #1c1c1c;
        border-radius: 20px;
        padding: 20px;
        position: relative;
    }

    .settings-left-wrapper {
      grid-column: 1;
      grid-row: 1 / span 2;
      display: flex;
      flex-direction: column;
      gap: 0px;
      position: relative;
    }
    .settings-right-wrapper {
        grid-column: 2;
        grid-row: 1;
        display: flex;
        flex-direction: column;
        gap: 0px;
        position: relative;
    }

    .buttons-wrapper {
        grid-column: 2;
        grid-row: 2;
        background-color: #1c1c1c;
        border-radius: 20px;
        padding: 15px 20px;
         display: flex;
        align-items: center;
        justify-content: space-between;
    }


    .settings-left-wrapper.disabled > *:not(.settings-title-wrapper) {
        opacity: 0.5;
        pointer-events: none;
    }

    .settings-left-wrapper.disabled .settings-title-wrapper {
        opacity: 1;
        pointer-events: all;
    }

    .settings-left-wrapper.disabled #keywordFilterToggle {
        pointer-events: all;
    }

    .settings-left-wrapper.disabled .settings-title {
        opacity: 1;
    }

    .settings-title {
        color: white;
        font-weight: bold;
        font-size: 15px;
        margin-bottom: 5px;
    }
    .settings-title-wrapper {
      display: flex;
      justify-content: space-between;
      width: 100%;
      margin-bottom: 8px;
    }

    #rangeFilterType {
        padding: 6px;
        border-radius: 4px;
        border: 1px solid #434343;
        background: #282828;
        color: white;
        width: 150px;
        cursor: pointer;
    }

    .range-filter-container {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .range-filter-title-wrapper {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: 12px;
        margin-bottom: 15px;
    }

    .range-filter-label {
        color: #fff;
        font-size: 13px;
        font-weight: 500;
        white-space: nowrap;
    }

    .range-filter-title {
        color: #fff;
        font-size: 13px;
        font-weight: 500;
    }

    .range-input-container {
        display: flex;
        align-items: center;
        gap: 15px;
    }

    .range-input {
        width: 85px;
        padding: 4px;
        border-radius: 4px;
        border: 1px solid #434343;
        background: #282828;
        color: white;
        text-align: center;
    }
    .dual-range-sliderx-container {
        position: relative;
        width: 100%;
        height: 20px;
        flex: 1;
    }

    .dual-range-sliderx-container input[type="range"] {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        width: 100%;
        outline: none;
        position: absolute;
        margin: auto;
        top: 0;
        bottom: 0;
        background-color: transparent;
        pointer-events: none;
    }

    .sliderx-track {
        width: 100%;
        height: 5px;
        position: absolute;
        margin: auto;
        top: 0;
        bottom: 0;
        border-radius: 5px;
        background-color: #4d4d4d;
    }

    .dual-range-sliderx-container input[type="range"]::-webkit-sliderx-runnable-track {
        -webkit-appearance: none;
        height: 5px;
    }

    .dual-range-sliderx-container input[type="range"]::-moz-range-track {
        -moz-appearance: none;
        height: 5px;
    }

    .dual-range-sliderx-container input[type="range"]::-ms-track {
        appearance: none;
        height: 5px;
    }

    .dual-range-sliderx-container input[type="range"]::-webkit-sliderx-thumb {
        -webkit-appearance: none;
        height: 16px;
        width: 16px;
        background-color: #fff;
        cursor: pointer;
        margin-top: -6px;
        pointer-events: auto;
        border-radius: 50%;
        border: 1px solid #434343;
    }
    .dual-range-sliderx-container input[type="range"]::-webkit-sliderx-thumb:hover {
        border: 1px solid #b3b3b3;
    }

    .dual-range-sliderx-container input[type="range"]::-moz-range-thumb {
        -webkit-appearance: none;
        height: 16px;
        width: 16px;
        cursor: pointer;
        border-radius: 50%;
        background-color: #fff;
        pointer-events: auto;
        border: 1px solid #434343;
    }

    .dual-range-sliderx-container input[type="range"]::-ms-thumb {
        appearance: none;
        height: 16px;
        width: 16px;
        cursor: pointer;
        border-radius: 50%;
        background-color: #fff;
        pointer-events: auto;
          border: 1px solid #434343;
    }
    .range-filters-items {
        max-height: 170px;
        overflow-y: auto;
        padding-top: 9px;
        scrollbar-width: thin;
        scrollbar-color: #ffffff40 transparent;
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
    .range-filters-items::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }

    .range-filters-items::-webkit-scrollbar-thumb {
        background-color: #ffffff40;
        border-radius: 4px;
    }

    .range-filters-items::-webkit-scrollbar-track {
        background: transparent;
    }

    .custom-filter-modal .switch {
      position: relative;
      display: inline-block;
      width: 36px;
      height: 20px;
    }

    .custom-filter-modal .switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .custom-filter-modal .sliderx {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #484848;
      border-radius: 24px;
      transition: .2s;
    }

    .custom-filter-modal .sliderx:before {
      position: absolute;
      content: "";
      height: 14px;
      width: 14px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      border-radius: 50%;
      transition: .2s;
    }

    .custom-filter-modal input:checked + .sliderx {
      background-color: #1DB954;
    }

    .custom-filter-modal input:checked + .sliderx:before {
      transform: translateX(16px);
    }
    .keyword-filter-container {
        display: flex;
        gap: 15px;
        width: 100%;
    }

    .filter-group {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .filter-group-header {
      display: flex;
      align-items: center;
      gap: 8px;
      height: 20px;
      justify-content: space-between;
    }

    .filter-group-title {
        color: #fff;
        font-size: 13px;
        font-weight: 500;
    }

    .toggle-group {
        display: flex;
        gap: 5px;
        align-items: center;
    }

    .filter-mode-toggle-label {
        color: #b3b3b3;
        font-size: 13px;
    }

    .keyword-input-container {
        position: relative;
        display: flex;
        flex-direction: column;
        background: #282828;
        border-radius: 6px;
        min-height: 0px;
        max-height: 96px;
        width: 100%;
    }
    .keyword-tags-container {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        padding: 6px;
        overflow-y: auto;
        min-height: 68px;
        max-height: 68px;
        max-width: 252px;
        scrollbar-width: thin;
        scrollbar-color: #ffffff40 transparent;
    }

    .keyword-input-wrapper {
        position: relative;
        padding: 3px;
        border-top: 1px solid #444;
        background: #313131;
        border-bottom-left-radius: 6px;
        border-bottom-right-radius: 6px;
        display: flex;
        align-items: center;
    }
    .keyword-input {
        background: none;
        border: none;
        color: white;
        padding: 4px;
        width: 100%;
        height: 24px;
        margin: 0;
        flex: 1;
        min-width: 0;
    }

    .keyword-actions-container {
        display: flex;
        margin-left: auto;
        flex-shrink: 0;
    }

    .keyword-action-button {
        background-color: transparent;
        border: none;
        color: white;
        padding: 2px 7px;
        border-radius: 12px;
        font-size: 12px;
        cursor: pointer;
        transition: background-color 0.2s ease;
        height: 24px;
        white-space: nowrap;
    }

    .keyword-action-button:hover {
        background-color: #484848;
    }

    .keyword-action-button svg {
        width: 14px;
        height: 14px;
        fill: #fff;
        display: block;
        margin: 0 auto;
    }
    .keyword-tag {
        display: inline-flex;
        align-items: center;
        background: #383838;
        border-radius: 12px;
        padding: 2px 8px;
        color: white;
        font-size: 12px;
        white-space: nowrap;
        flex-shrink: 0;
        height: 24px;
    }

    .keyword-tag-remove {
        margin-left: 4px;
        cursor: pointer;
        color: #ccc;
        font-size: 14px;
    }

    .keyword-input:focus {
        outline: none;
    }
      .filter-mode-radio-group {
        display: flex;
        align-items: center;
        gap: 16px;
        margin: 10px 0;
    }

    .radio-button-container {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
    }

    .radio-button {
        width: 16px;
        height: 16px;
        border: 2px solid #b3b3b3;
        border-radius: 50%;
        display: flex;
        padding: 2px;
    }

    .radio-button input {
        display: none;
    }

    .radio-button-inner {
        width: 8px;
        height: 8px;
        background-color: #1DB954;
        border-radius: 50%;
        display: none;
    }

    .radio-button input:checked + .radio-button-inner {
        display: block;
    }

    .radio-label {
        color: #b3b3b3;
        font-size: 13px;
    }

    .radio-button-container:hover .radio-button {
        border-color: #ffffff;
    }

    .radio-button-container:hover .radio-label {
        color: #ffffff;
    }
    .load-more-row {
        cursor: pointer;
        background-color: #3e3e3e;
        text-align: center;
        position: sticky;
        left: 0;
        z-index: 1;
    }
    .load-more-cell {
        padding: 10px;
        font-size: 12px;
        text-align: center;
        transition: background-color 0.2s;
    }
    .load-more-row:hover .load-more-cell {
        background-color: #4c4c4c;
    }
     .buttons-container {
        display: flex;
        justify-content: flex-start;
        padding: 16px 32px;
    }
    </style>
    <div class="playlist-player-wrapper">
        <div class="playlist-title-container">
          <span class="playlist-title" style="color: #fff; font-size: 15px; font-weight: bold;">Playlist Name</span>
          <div class="playlist-stats-container">
          </div>
      </div>
      <div class="playlist-wrapper">
          <table class="tracklist-table">
              <thead>
                  <tr>
                      ${tableHeaders}
                  </tr>
              </thead>
              <tbody>
                  ${generateTableRows(displayedTracks)}
              </tbody>
          </table>
      </div>
        <div class="player-controls2">
          <div class="track-info-container">
              <div class="track-album-art">
              </div>
              <div class="track-info-text">
                  <span class="track-title">Track Title</span>
                  <span class="track-artist">Artist Name</span>
              </div>
          </div>
          <div class="progress-bar2-container">
              <button class="control-button2" id="playPauseButton">
                  <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"/>
                  </svg>
              </button>
              <span id="currentTime">0:00</span>
              <div class="progress-bar2" id="progressBar">
                  <div class="progress-bar2-inner" id="progressBarInner"></div>
              </div>
              <span id="duration">0:00</span>
          </div>
          <div class="max-rows-container">
              <span class="max-rows-label">Max Rows:</span>
              <select class="max-rows-select">
                  <option value="50">50</option>
                  <option value="100">100</option>
                  <option value="200">200</option>
                  <option value="300">300</option>
                  <option value="500">500</option>
                  <option value="700">800</option>
                  <option value="1000">1000</option>
                  <option value="all">All</option>
              </select>
          </div>
      </div>
    </div>
    <div class="filter-settings-container">
      <div class="settings-left-wrapper">
          <div class="settings-title-wrapper">
              <div class="settings-title">Keyword Filters</div>
              <label class="switch">
                  <input type="checkbox" id="keywordFilterToggle">
                  <span class="sliderx"></span>
              </label>
          </div>
          <div class="filter-mode-container" style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 10px;">
            <div class="filter-mode-radio-group" style="display: flex; align-items: center; gap: 16px;">
              <div class="filter-mode-title" style="color: #fff; font-size: 13px; font-weight: 500; margin-right: 8px;">Filter Mode:</div>
              <label class="radio-button-container">
                <span class="radio-button">
                  <input type="radio" name="filterMode" value="exclude">
                  <span class="radio-button-inner"></span>
                </span>
                <span class="radio-label">Exclude</span>
              </label>
              <label class="radio-button-container">
                <span class="radio-button">
                  <input type="radio" name="filterMode" value="keep">
                  <span class="radio-button-inner"></span>
                </span>
                <span class="radio-label">Keep</span>
              </label>
              <span class="filter-mode-title" style="color: #fff; font-size: 13px; font-weight: 500; margin-left: 14px;">Match Whole Word:</span>
            </div>

            <label class="switch">
              <input type="checkbox" id="matchWholeWordToggle">
              <span class="sliderx"></span>
            </label>
          </div>
          <div class="keyword-filter-container">
              <div class="filter-group">
                  <div class="filter-group-header">
                      <span class="filter-group-title">Titles/Albums</span>
                      <div class="toggle-group">
                          <span class="filter-mode-toggle-label">Title</span>
                          <label class="switch">
                              <input type="checkbox" id="titleToggle" checked>
                              <span class="sliderx"></span>
                          </label>
                          <span class="filter-mode-toggle-label">Album</span>
                          <label class="switch">
                          <input type="checkbox" id="albumToggle" checked>
                          <span class="sliderx"></span>
                      </label>
                      </div>
                  </div>
                  <div class="keyword-input-container" id="titleAlbumKeywords">
                      <div class="keyword-tags-container">
                      </div>
                      <div class="keyword-input-wrapper">
                        <input type="text" class="keyword-input" placeholder="Add keywords...">
                          <div class="keyword-actions-container">
                              <button class="keyword-action-button keyword-save-button" title="Save Keywords">${saveIconSVG}</button>
                              <button class="keyword-action-button keyword-load-button" title="Load Keywords">${loadIconSVG}</button>
                              <button class="keyword-action-button keyword-remove-all-button" title="Clear Keywords">${clearIconSVG}</button>
                          </div>
                      </div>
                  </div>
              </div>

              <div class="filter-group">
                <div class="filter-group-header">
                  <span class="filter-group-title">Artists</span>
                    <div class="toggle-group">
                      <label class="switch">
                        <input type="checkbox" id="artistToggle" checked>
                        <span class="sliderx"></span>
                      </label>
                    </div>
                  </div>
                  <div class="keyword-input-container" id="artistKeywords">
                      <div class="keyword-tags-container">
                      </div>
                      <div class="keyword-input-wrapper">
                          <input type="text" class="keyword-input" placeholder="Add keywords...">
                      </div>
                  </div>
              </div>
            </div>
      </div>
      <div class="settings-right-wrapper">
            <div class="settings-title-wrapper">
                <div class="settings-title">Range Filters</div>
                  <label class="switch">
                    <input type="checkbox" id="rangeFilterToggle" checked>
                  <span class="sliderx"></span>
              </label>
            </div>
            <div class="range-filters-items">
                <div class="range-filter-container">
                  <div class="range-filter-title-wrapper">
                      <span class="range-filter-label">Filter by:</span>
                          <div class="range-filter-title">
                              <select id="rangeFilterType">
                                <option value="releaseDate" ${activeRangeFilter === 'releaseDate' ? 'selected' : ''}>Release Date</option>
                                <option value="durationMs" ${activeRangeFilter === 'durationMs' ? 'selected' : ''}>Duration</option>
                                <option value="playCount" ${activeRangeFilter === 'playCount' ? 'selected' : ''}>Plays</option>
                                <option value="popularity" ${activeRangeFilter === 'popularity' ? 'selected' : ''}>Popularity</option>
                                <option value="features.energy" ${activeRangeFilter === 'features.energy' ? 'selected' : ''}>Energy</option>
                                <option value="features.danceability" ${activeRangeFilter === 'features.danceability' ? 'selected' : ''}>Danceability</option>
                                <option value="features.valence" ${activeRangeFilter === 'features.valence' ? 'selected' : ''}>Valence</option>
                                <option value="features.tempo" ${activeRangeFilter === 'features.tempo' ? 'selected' : ''}>Tempo</option>
                              </select>
                          </div>
                    </div>
                    <div class="range-input-container">
                        <input type="text" class="range-input" id="rangeMin" placeholder="Min">
                        <div class="dual-range-sliderx-container" id="rangesliderx">
                            <div class="sliderx-track"></div>
                            <input type="range"  id="rangesliderx-1">
                            <input type="range"  id="rangesliderx-2">
                        </div>
                        <input type="text" class="range-input" id="rangeMax" placeholder="Max">
                    </div>
                </div>
            </div>
      </div>
      <div class="buttons-wrapper">
          <label for="sort-type-select" style="color: #fff; font-size: 13px; margin-right: 8px;">Sort Type:</label>
            <select class="sort-type-select" id="sort-type-select">
                <option value="default">Original Order</option>
                <option value="current">Current Order</option>
                <option value="playCount">Play Count</option>
                <option value="popularity">Popularity</option>
                <option value="releaseDate">Release Date</option>
                <option value="shuffle">Shuffle</option>
            </select>
            <button id="customFilterCreatePlaylist">Create Playlist</button>
      </div>
  </div>
    `;

    Spicetify.PopupModal.display({
        title: "<span style='font-size: 24px; font-weight: 700;'>Custom Filter</span>",
        content: modalContainer,
        isLarge: true,
    });
    tagActiveModalWithFontScope();
    
    const playlistTitleElement = modalContainer.querySelector(".playlist-title");
    updatePlaylistStats();
    const currentUri = getCurrentUri();
    if (URI.isPlaylistV1OrV2(currentUri)) {
        const playlistId = currentUri.split(":")[2];
        Spicetify.CosmosAsync.get(
            `https://api.spotify.com/v1/playlists/${playlistId}`
        ).then((r) => {
            playlistTitleElement.textContent = r.name;
            playlistTitleElement.title = r.name;
        });
    } else if (URI.isArtist(currentUri)) {
        Spicetify.CosmosAsync.get(
            `https://api.spotify.com/v1/artists/${currentUri.split(":")[2]}`
        ).then((r) => {
            playlistTitleElement.textContent = `All tracks by ${r.name}`;
            playlistTitleElement.title = `All tracks by ${r.name}`;

        });
    } else if (isLikedSongsPage(currentUri)) {
        playlistTitleElement.textContent = "Liked Songs";
        playlistTitleElement.title = "Liked Songs";
    } else if (URI.isAlbum(currentUri)) {
        const albumId = currentUri.split(":")[2];
        Spicetify.CosmosAsync.get(
            `https://api.spotify.com/v1/albums/${albumId}`
        ).then((r) => {
            playlistTitleElement.textContent = r.name;
            playlistTitleElement.title = r.name;
        });
    }

    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    const genericModalOverlay = document.querySelector(".GenericModal__overlay");

    if (genericModalOverlay) {
        genericModalOverlay.appendChild(overlay);
    }

    if (overlay) {
        overlay.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
    }

    const modalContainerElement = document.querySelector(".main-popupModal-container");
    if (modalContainerElement) {
        modalContainerElement.style.zIndex = "2000";
    }

    tableBody = modalContainer.querySelector(".tracklist-table tbody");
    let activeRow = null;
    setupTableEventListeners(tableBody, originalTracks);

    settingsLeftWrapper = modalContainer.querySelector('.settings-left-wrapper');
    keywordFilterToggle = modalContainer.querySelector("#keywordFilterToggle");
    rangeFilterToggle = modalContainer.querySelector("#rangeFilterToggle");
    rangeFilterTypeSelect = modalContainer.querySelector("#rangeFilterType");
    filterModeRadios = modalContainer.querySelectorAll('input[name="filterMode"]');
    titleToggle = modalContainer.querySelector("#titleToggle");
    albumToggle = modalContainer.querySelector("#albumToggle");
    const titleAlbumContainer = modalContainer.querySelector("#titleAlbumKeywords");
    const artistContainer = modalContainer.querySelector("#artistKeywords");
    matchWholeWordToggle = modalContainer.querySelector("#matchWholeWordToggle");
    artistToggle = modalContainer.querySelector("#artistToggle");
    maxRowsSelect = modalContainer.querySelector(".max-rows-select");

    keepMatchingMode = false;
    titleToggle.checked = localStorage.getItem("sort-play-filter-title") !== "false";
    albumToggle.checked = localStorage.getItem("sort-play-filter-album") !== "false";
    artistToggle.checked = localStorage.getItem("sort-play-filter-artist") !== "false";
    matchWholeWord = localStorage.getItem("sort-play-match-whole-word") === "true";
    const savedPageSize = localStorage.getItem("sort-play-page-size");
    maxRowsSelect.value = savedPageSize || "100";
    matchWholeWordToggle.checked = matchWholeWord;


    pageSize = maxRowsSelect.value === "all" ? tracks.length : parseInt(maxRowsSelect.value);


    maxRowsSelect.addEventListener("change", () => {
        const selectedValue = maxRowsSelect.value;

        if (selectedValue === "all") {
            pageSize = tracks.length;
        } else {
            pageSize = parseInt(selectedValue);
        }

        localStorage.setItem("sort-play-page-size", selectedValue);

        startIndex = 0;
        isFirstLoad = true;
        isLastLoad = tracks.length <= pageSize + paginationThreshold;
        displayedTracks = tracks.slice(startIndex, isLastLoad ? tracks.length : pageSize);
        updateTable(displayedTracks);

        const playlistWrapper = modalContainer.querySelector(".playlist-wrapper");
        if (playlistWrapper) {
            playlistWrapper.scrollTop = 0;
        }
    });

    startIndex = 0;
    isFirstLoad = true;
    isLastLoad = tracks.length <= pageSize + paginationThreshold;

    displayedTracks = tracks.slice(startIndex, isLastLoad ? tracks.length : pageSize);
    updateTable(displayedTracks);
    const loadedKeywords = loadKeywords();
    titleAlbumKeywords = loadedKeywords.titleAlbumKeywords;
    artistKeywords = loadedKeywords.artistKeywords;
    
    titleAlbumKeywords.forEach(keyword => createKeywordTag(keyword, titleAlbumContainer, titleAlbumKeywords, updateTrackFilters));
    artistKeywords.forEach(keyword => createKeywordTag(keyword, artistContainer, artistKeywords, updateTrackFilters));

    setupKeywordInput(titleAlbumContainer, titleAlbumKeywords, updateTrackFilters);
    setupKeywordInput(artistContainer, artistKeywords, updateTrackFilters);

    tableBody.addEventListener("click", (event) => {
        const row = event.target.closest("tr");
        if (!row) return;

        if (event.target.closest(".actions-col")) {
            return;
        }

        if (activeRow) {
            activeRow.classList.remove("active");
        }

        row.classList.add("active");
        activeRow = row;
    });

    function updateTrackInfo(track) {
        const trackTitleElement = modalContainer.querySelector(".track-title");
        const trackArtistElement = modalContainer.querySelector(".track-artist");
        const trackAlbumArtElement = modalContainer.querySelector(".track-album-art");

        trackTitleElement.textContent = track.songTitle || track.name;
        trackTitleElement.title = track.songTitle || track.name;
        trackArtistElement.textContent = track.allArtists;
        trackArtistElement.title = track.allArtists;

        trackAlbumArtElement.innerHTML = '';

        const newAlbumArt = document.createElement("img");
        newAlbumArt.src = "/api/placeholder/40/40";
        newAlbumArt.alt = "";
        newAlbumArt.className = "player-album-art";
        newAlbumArt.width = 40;
        newAlbumArt.height = 40;
        newAlbumArt.style.borderRadius = "4px";
        newAlbumArt.dataset.trackUri = track.uri;

        trackAlbumArtElement.appendChild(newAlbumArt);
        trackAlbumArtElement.title = `${track.songTitle || track.name} - ${track.allArtists}`;
        loadAlbumArt(track, newAlbumArt);
    }

    tableBody.addEventListener("dblclick", async (event) => {
        const row = event.target.closest("tr");
        if (!row) return;

        const trackUri = row.dataset.trackUri;
        if (trackUri) {

            if (activeRow && activeRow !== row) {
                activeRow.classList.remove("active");
            }

            row.classList.add("active");
            activeRow = row;
            await Spicetify.Player.playUri(trackUri);

            const track = originalTracks.find(t => t.uri === trackUri);
            if (track) {
                updateTrackInfo(track);
            }
        }
    });

    tableBody.addEventListener("click", (event) => {
        if (event.target.tagName === "svg" || event.target.tagName === "path") {
            event.stopPropagation();
        }

        const removeButton = event.target.closest(".remove-button");
        if (!removeButton) return;

        const row = removeButton.closest("tr");
        const trackUri = row.dataset.trackUri;
        const track = originalTracks.find(t => t.uri === trackUri);

        if (track) {
            track.isRemoved = !track.isRemoved;
            row.classList.toggle("removed");
            const svgIcon = removeButton.querySelector("svg");
            svgIcon.outerHTML = track.isRemoved ? restoreIconSVG : removeIconSVG;
            updatePlaylistStats();
        }
    });

    let isRemoveDragging = false;
    let lastRemovedState = null;

    tableBody.addEventListener("mousedown", (event) => {
        const removeButton = event.target.closest(".remove-button");
        if (!removeButton) return;

        isRemoveDragging = true;
        const row = removeButton.closest("tr");
        const trackUri = row.dataset.trackUri;
        const track = originalTracks.find(t => t.uri === trackUri);

        if (track) {
            track.isRemoved = !track.isRemoved;
            lastRemovedState = track.isRemoved;
            row.classList.toggle("removed");

            const svgIcon = removeButton.querySelector("svg");
            svgIcon.outerHTML = track.isRemoved ? restoreIconSVG : removeIconSVG;
        }

        event.preventDefault();
    });

    tableBody.addEventListener("mouseover", (event) => {
        if (!isRemoveDragging) return;

        const removeButton = event.target.closest(".remove-button");
        if (!removeButton) return;

        const row = removeButton.closest("tr");
        const trackUri = row.dataset.trackUri;
        const track = originalTracks.find(t => t.uri === trackUri);

        if (track && track.isRemoved !== lastRemovedState) {
            track.isRemoved = lastRemovedState;
            row.classList.toggle("removed", lastRemovedState);

            const svgIcon = removeButton.querySelector("svg");
            svgIcon.outerHTML = lastRemovedState ? restoreIconSVG : removeIconSVG;
        }
    });

    document.addEventListener("mouseup", () => {
        isRemoveDragging = false;
        lastRemovedState = null;
    });

    tableBody.addEventListener("click", (event) => {
        if (event.target.tagName === "svg" || event.target.tagName === "path") {
            event.stopPropagation();
        }

        const removeButton = event.target.closest(".remove-button");
        if (!removeButton) return;

        const row = removeButton.closest("tr");
        const trackUri = row.dataset.trackUri;
        const track = originalTracks.find(t => t.uri === trackUri);

        if (track) {
            track.isRemoved = !track.isRemoved;
            row.classList.toggle("removed");

            const svgIcon = removeButton.querySelector("svg");
            svgIcon.outerHTML = track.isRemoved ? restoreIconSVG : removeIconSVG;
            updatePlaylistStats();
        }
    });

    let currentSort = { key: null, direction: 'none' };
    function updateHeaderText(header, direction) {
        const sortKey = header.dataset.sortKey;
        const baseText = header.textContent.split(' ')[0];

        if (direction === 'none') {
            header.textContent = baseText;
            header.classList.remove('sorted');
        } else {
            const arrow = direction === 'ascending' ? ' ▲' : ' ▼';
            header.textContent = baseText + arrow;
            header.classList.toggle("sorted", direction !== 'none');
            header.classList.add('sorted');
        }
    }


    updateTable(displayedTracks);


    modalContainer.querySelectorAll(".tracklist-table th[data-sort-key]").forEach(header => {
        header.addEventListener('click', () => {
            const sortKey = header.dataset.sortKey;

            modalContainer.querySelectorAll(".tracklist-table th[data-sort-key]").forEach(h => {
                if (h !== header) {
                    updateHeaderText(h, 'none');
                }
            });

            if (currentSort.key === sortKey) {
                currentSort.direction = currentSort.direction === 'ascending' ? 'descending' :
                    (currentSort.direction === 'descending' ? 'none' : 'ascending');
            } else {
                currentSort.key = sortKey;
                currentSort.direction = 'ascending';
            }

            updateHeaderText(header, currentSort.direction);

            let sortedTracks;
            if (currentSort.direction === 'none') {
                sortedTracks = [...originalTracks];
            } else {
                sortedTracks = sortTracks(tracks, currentSort.key, currentSort.direction);
            }
            tracks = sortedTracks;
            startIndex = 0;
            isFirstLoad = true;
            isLastLoad = tracks.length <= pageSize + paginationThreshold;
            displayedTracks = tracks.slice(startIndex, isLastLoad ? tracks.length : pageSize);
            updateTable(displayedTracks);
        });
    });


    const playPauseButton = modalContainer.querySelector('#playPauseButton');
    const progressBar = modalContainer.querySelector('#progressBar');
    const progressBarInner = modalContainer.querySelector('#progressBarInner');
    const currentTimeElement = modalContainer.querySelector('#currentTime');
    const durationElement = modalContainer.querySelector('#duration');

    let isDragging = false;

    function updatePlayButton(isPlaying) {
        playPauseButton.innerHTML = isPlaying
            ? '<svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor"><path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z"/></svg>'
            : '<svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor"><path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"/></svg>';
    }

    updatePlayButton(Spicetify.Player.isPlaying());

    playPauseButton.addEventListener('click', () => {
        Spicetify.Player.togglePlay();
    });

    progressBar.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        isDragging = true;
        const rect = progressBar.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        const duration = Spicetify.Player.getDuration();
        Spicetify.Player.seek(pos * duration);
    });


    progressBar.addEventListener('mousemove', (e) => {
        e.stopPropagation();
        if (!isDragging) return;
        const rect = progressBar.getBoundingClientRect();
        const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        progressBarInner.style.width = `${pos * 100}%`;
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    function updateProgress() {
        if (!isDragging) {
            const progress = Spicetify.Player.getProgress();
            const duration = Spicetify.Player.getDuration();
            const progressPercent = (progress / duration) * 100;
            progressBarInner.style.width = `${progressPercent}%`;
            currentTimeElement.textContent = Spicetify.Player.formatTime(progress);
            durationElement.textContent = Spicetify.Player.formatTime(duration);
        }
    }

    const playerStateHandler = ({ data: { isPaused } }) => {
        updatePlayButton(!isPaused);
    };

    Spicetify.Player.addEventListener('onplaypause', playerStateHandler);

    const progressInterval = setInterval(updateProgress, 100);

    const cleanup = () => {
        if (observer) {
            observer.disconnect();
        }
        clearInterval(progressInterval);
        Spicetify.Player.removeEventListener('onplaypause', playerStateHandler);
        if (closeButton) {
            closeButton.removeEventListener("click", cleanup);
        }


        document.removeEventListener("mousemove", handleTrackMove);
        activeRow = null;

        Spicetify.PopupModal.hide();

    };
    const closeButton = document.querySelector('.main-trackCreditsModal-closeBtn');
    if (closeButton) {
        closeButton.addEventListener("click", cleanup);
    }


    const modalContainerElementForMutation = document.querySelector('.main-popupModal-container');
    if (modalContainerElementForMutation) {
        const mutationObserver = new MutationObserver((mutations) => {
            const closeButton = modalContainerElementForMutation.querySelector('.main-trackCreditsModal-closeBtn');
            if (closeButton && !closeButton.hasAttribute('data-cleanup-attached')) {
                closeButton.setAttribute('data-cleanup-attached', 'true');
                closeButton.addEventListener("click", cleanup);
            }
        });

        mutationObserver.observe(modalContainerElementForMutation, {
            childList: true,
            subtree: true
        });
    }
    setupDualRangesliderx("rangesliderx", "rangeMin", "rangeMax");
    updateRangeUI(activeRangeFilter);

    rangeFilterTypeSelect.addEventListener("change", (e) => {
        activeRangeFilter = e.target.value;
        localStorage.setItem("sort-play-active-range-filter", activeRangeFilter);
        updateRangeUI(activeRangeFilter);
        debouncedUpdateTrackFilters();
    });

    rangeFilterToggle.addEventListener("change", () => {
        updateTrackFilters();
    });

    matchWholeWordToggle.addEventListener("change", (e) => {
        matchWholeWord = e.target.checked;
        updateTrackFilters();
    });


    settingsLeftWrapper.classList.toggle('disabled', !keywordFilterToggle.checked);

    keywordFilterToggle.addEventListener("change", (e) => {
        settingsLeftWrapper.classList.toggle('disabled', !e.target.checked);

        if (!e.target.checked) {
            tracks.forEach(track => {
                track.isRemovedByKeyword = false;
            });
        }
        updateTrackFilters();
    });

    filterModeRadios.forEach(radio => {
        if ((keepMatchingMode && radio.value === "keep") || (!keepMatchingMode && radio.value === "exclude")) {
            radio.checked = true;
        }
    });

    filterModeRadios.forEach(radio => {
        radio.addEventListener("change", (e) => {
            keepMatchingMode = e.target.value === "keep";
            updateTrackFilters();
        });
    });

    matchWholeWordToggle.addEventListener("change", (e) => {
        matchWholeWord = e.target.checked;
        updateTrackFilters();
    });


    titleToggle.addEventListener("change", updateTrackFilters);
    albumToggle.addEventListener("change", updateTrackFilters);
    artistToggle.addEventListener("change", updateTrackFilters);

    const createPlaylistButton = modalContainer.querySelector("#customFilterCreatePlaylist");
    const sortTypeSelect = modalContainer.querySelector(".sort-type-select");
    let selectedSortType = "default";

    sortTypeSelect.addEventListener("change", () => {
        selectedSortType = sortTypeSelect.value;
    });

    function setupTableEventListeners(tableBody, originalTracks) {
      if (!tableBody) return;

      let isRemoveDragging = false;
      let lastRemovedState = null;
      let activeRow = null;

      tableBody.addEventListener("mousedown", (event) => {
          const removeButton = event.target.closest(".remove-button");
          if (!removeButton) return;

          isRemoveDragging = true;
          const row = removeButton.closest("tr");
          const trackUri = row.dataset.trackUri;
          const track = originalTracks.find(t => t.uri === trackUri);

          if (track) {
              track.isRemoved = !track.isRemoved;
              lastRemovedState = track.isRemoved;
              row.classList.toggle("removed");

              const svgIcon = removeButton.querySelector("svg");
              svgIcon.outerHTML = track.isRemoved ? restoreIconSVG : removeIconSVG;
              updatePlaylistStats(); 
          }

          event.preventDefault();
      });

      tableBody.addEventListener("mouseover", (event) => {
          if (!isRemoveDragging) return;

          const removeButton = event.target.closest(".remove-button");
          if (!removeButton) return;

          const row = removeButton.closest("tr");
          const trackUri = row.dataset.trackUri;
          const track = originalTracks.find(t => t.uri === trackUri);

          if (track && track.isRemoved !== lastRemovedState) {
              track.isRemoved = lastRemovedState;
              row.classList.toggle("removed", lastRemovedState);

              const svgIcon = removeButton.querySelector("svg");
              svgIcon.outerHTML = lastRemovedState ? restoreIconSVG : removeIconSVG;
              updatePlaylistStats(); 
          }
      });

      document.addEventListener("mouseup", () => {
          isRemoveDragging = false;
          lastRemovedState = null;
          updatePlaylistStats();
      });

      tableBody.addEventListener("click", async (event) => {
        const row = event.target.closest("tr");
        if (!row) return;

        const removeButton = event.target.closest(".remove-button");
        if (removeButton) {
            const trackUri = row.dataset.trackUri;
            const track = originalTracks.find(t => t.uri === trackUri);

            if (track) {
                track.isRemoved = !track.isRemoved;
                row.classList.toggle("removed", track.isRemoved);
                const svgIcon = removeButton.querySelector("svg");
                svgIcon.outerHTML = track.isRemoved ? restoreIconSVG : removeIconSVG;
            }
            return; 
        }

        if (!event.target.closest(".actions-col")) {
          if (activeRow) {
            activeRow.classList.remove("active");
          }
          row.classList.add("active");
          activeRow = row;
        }
      });

      tableBody.addEventListener("dblclick", async (event) => {
        const row = event.target.closest("tr");
        if (!row) return;

        const trackUri = row.dataset.trackUri;
        if (trackUri) {
          if (activeRow && activeRow !== row) {
            activeRow.classList.remove("active");
          }
          row.classList.add("active");
          activeRow = row;
          await Spicetify.Player.playUri(trackUri);

          const track = originalTracks.find(t => t.uri === trackUri);
          if (track) {
            updateTrackInfo(track);
          }
        }
      });
    }
      
    createPlaylistButton.addEventListener("click", async () => {
        const filteredTracks = tracks.filter(track => !track.isRemoved);

        if (filteredTracks.length === 0) {
            Spicetify.showNotification("No tracks selected to create a playlist.");
            return;
        }

        Spicetify.PopupModal.hide();
        setButtonProcessing(true);
        mainButton.style.backgroundColor = buttonStyles.main.disabledBackgroundColor;
        mainButton.style.color = buttonStyles.main.disabledColor;
        mainButton.style.cursor = "default";
        svgElement.style.fill = buttonStyles.main.disabledColor;
        menuButtons.forEach((button) => (button.disabled = true));
        mainButton.innerHTML = "0%";

        try {
            let sortedTracksForPlaylist;
            selectedSortType = sortTypeSelect.value;

            if (selectedSortType === "default") {
                sortedTracksForPlaylist = [...originalTracks].filter(track => !track.isRemoved);

            } else if (selectedSortType === "current") {
                sortedTracksForPlaylist = [...tracks].filter(track => !track.isRemoved);
            } else if (selectedSortType === "shuffle") {
                sortedTracksForPlaylist = shuffleArray(filteredTracks);
            }
            else {
                sortedTracksForPlaylist = sortTracks(filteredTracks, selectedSortType, sortOrderState[selectedSortType] ? "ascending" : "descending");
            }
            mainButton.innerText = "100%";

            const sourceUri = getCurrentUri();
            let sourceName;
            if (URI.isArtist(sourceUri)) {
                sourceName = await Spicetify.CosmosAsync.get(
                    `https://api.spotify.com/v1/artists/${sourceUri.split(":")[2]}`
                ).then((r) => r.name);
            } else if (isLikedSongsPage(sourceUri)) {
                sourceName = "Liked Songs";
            } else if (URI.isAlbum(sourceUri)) {
                sourceName = await Spicetify.CosmosAsync.get(
                    `https://api.spotify.com/v1/albums/${sourceUri.split(":")[2]}`
                ).then((r) => r.name);
            } else {
                sourceName = await Spicetify.CosmosAsync.get(
                    `https://api.spotify.com/v1/playlists/${sourceUri.split(":")[2]}`
                ).then((r) => r.name);
            }

            let suffixPattern = new RegExp(
                `\\s*(${possibleSuffixes.join("|")})\\s*`
            );

            while (suffixPattern.test(sourceName)) {
                sourceName = sourceName.replace(suffixPattern, "");
            }


            let baseDescription = `Filtered using Sort-Play`;
            if (URI.isArtist(sourceUri)) {
                baseDescription = `Tracks by ${sourceName} Filtered using Sort-Play`;
            } else if (URI.isAlbum(sourceUri)) {
                const albumDetails = await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/albums/${sourceUri.split(":")[2]}`);
                const artistName = albumDetails.artists[0].name;
                baseDescription = `Tracks from ${sourceName} by ${artistName} Filtered using Sort-Play`;
            }

            let playlistDescription = baseDescription;

            const playlistName = `${sourceName} (Custom Filter)`;

            try {
                const newPlaylist = await createPlaylist(playlistName, playlistDescription);
                await new Promise(resolve => setTimeout(resolve, 1250));
                mainButton.innerText = "Saving...";
                const trackUris = sortedTracksForPlaylist.map((track) => track.uri);
                await addTracksToPlaylist(newPlaylist.id, trackUris);

                await addPlaylistToLibrary(newPlaylist.uri);

                const sortTypeInfo = {
                    playCount: { fullName: "play count", shortName: "PlayCount" },
                    popularity: { fullName: "popularity", shortName: "Popularity" },
                    releaseDate: { fullName: "release date", shortName: "ReleaseDate" },
                    scrobbles: { fullName: "Last.fm scrobbles", shortName: "Scrobbles" },
                    personalScrobbles: { fullName: "Last.fm personal scrobbles", shortName: "My Scrobbles" },
                    shuffle: { fullName: "shuffle", shortName: "Shuffle" },
                    aiPick: { fullName: "AI pick", shortName: "AI Pick" },
                    averageColor: { fullName: "album color", shortName: "Color" },
                    default: { fullName: "Default", shortName: "Default" },
                    current: { fullName: "Current", shortName: "Current" },

                }[selectedSortType];

                Spicetify.showNotification(
                    `Playlist created with ${sortTypeInfo.fullName} and custom filter!`
                );

                await navigateToPlaylist(newPlaylist);
            } catch (error) {
                console.error("Error creating or updating playlist:", error);
                Spicetify.showNotification(
                    `An error occurred while creating or updating the playlist. Please check your internet connection and try again.`
                );
            }
        }
        finally {
            resetButtons();
        }

    });


    if (isMenuOpen) {
      closeAllMenus();
    }
  }
  
  function getJobs() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_DYNAMIC_PLAYLIST_JOBS) || '[]');
    } catch (e) {
      return [];
    }
  }

  function saveJobs(jobs) {
    localStorage.setItem(STORAGE_KEY_DYNAMIC_PLAYLIST_JOBS, JSON.stringify(jobs));
  }

  function addJob(newJob) {
    const jobs = getJobs();
    jobs.push(newJob);
    saveJobs(jobs);
  }

  function deleteJob(jobId) {
    let jobs = getJobs();
    jobs = jobs.filter(job => job.id !== jobId);
    saveJobs(jobs);
  }

  function updateJob(updatedJob) {
    const jobs = getJobs();
    const index = jobs.findIndex(job => job.id === updatedJob.id);
    if (index !== -1) {
      jobs[index] = updatedJob;
      saveJobs(jobs);
    }
  }

  function getDedicatedJobs() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_DEDICATED_PLAYLIST_JOBS) || '[]');
    } catch (e) {
      return [];
    }
  }

  function saveDedicatedJobs(jobs) {
    localStorage.setItem(STORAGE_KEY_DEDICATED_PLAYLIST_JOBS, JSON.stringify(jobs));
  }

  function addDedicatedJob(newJob) {
    const jobs = getDedicatedJobs();
    jobs.push(newJob);
    saveDedicatedJobs(jobs);
  }

  function deleteDedicatedJob(jobId) {
    let jobs = getDedicatedJobs();
    jobs = jobs.filter(job => job.id !== jobId);
    saveDedicatedJobs(jobs);
  }

  function updateDedicatedJob(updatedJob) {
    const jobs = getDedicatedJobs();
    const index = jobs.findIndex(job => job.id === updatedJob.id);
    if (index !== -1) {
      jobs[index] = updatedJob;
      saveDedicatedJobs(jobs);
    }
  }

  function getCustomSchedules() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_DYNAMIC_PLAYLIST_CUSTOM_SCHEDULES) || '[]');
    } catch (e) {
      return [];
    }
  }

  function saveCustomSchedules(schedules) {
    localStorage.setItem(STORAGE_KEY_DYNAMIC_PLAYLIST_CUSTOM_SCHEDULES, JSON.stringify(schedules));
  }
  
  async function executeSortOperation(config) {
    const { sortType, sources, deduplicate, isHeadless = false, preFetchedTracks = null, limitEnabled = false, additionalTracksToInclude = [], filters = {} } = config;

    let combinedTracks;
    let newUsedUrisBySource = {};

    if (preFetchedTracks) {
        combinedTracks = preFetchedTracks;
    } else {
        if (!sources || sources.length === 0) {
            throw new Error('No sources provided for dynamic playlist');
        }

        const trackFetchPromises = sources.map(async source => {
            const sourceUri = source.uri;
            let sourceTracks;

            if (URI.isPlaylistV1OrV2(sourceUri)) {
                sourceTracks = await getPlaylistTracks(sourceUri.split(":")[2]);
            } else if (URI.isArtist(sourceUri)) {
                sourceTracks = await getArtistTracks(sourceUri, isHeadless);
            } else if (isLikedSongsPage(sourceUri)) {
                sourceTracks = await getLikedSongs();
            } else if (URI.isAlbum(sourceUri)) {
                sourceTracks = await getAlbumTracks(sourceUri.split(":")[2]);
            } else {
                console.warn(`[Sort-Play Dynamic] Unsupported source URI type: ${sourceUri}`);
                return [];
            }

            if (limitEnabled && source.limit > 0) {
                let usedUris = new Set(source.usedTrackURIs || []);
                let availableTracks = sourceTracks.filter(t => !usedUris.has(t.uri));
                let selectedTracks;

                if (availableTracks.length < source.limit && sourceTracks.length > 0) {
                    const shuffledAll = shuffleArray(sourceTracks);
                    selectedTracks = shuffledAll.slice(0, source.limit);
                    newUsedUrisBySource[source.uri] = selectedTracks.map(t => t.uri);
                } else {
                    const shuffledAvailable = shuffleArray(availableTracks);
                    selectedTracks = shuffledAvailable.slice(0, source.limit);
                    const newUris = selectedTracks.map(t => t.uri);
                    newUris.forEach(uri => usedUris.add(uri));
                    newUsedUrisBySource[source.uri] = Array.from(usedUris);
                }
                return selectedTracks;
            }
            return sourceTracks;
        });

        const trackArrays = await Promise.all(trackFetchPromises);
        combinedTracks = trackArrays.flat();
        combinedTracks.push(...additionalTracksToInclude);
    }

    let filteredTracks = combinedTracks;

    if (filters.excludeLiked) {
        if (!isHeadless) mainButton.innerText = "Filtering Liked...";
        const likedSongs = await getLikedSongs();
        const likedSongUris = new Set(likedSongs.map(s => s.uri));
        filteredTracks = filteredTracks.filter(t => !likedSongUris.has(t.uri));
    }

    if (filters.excludeListened) {
        if (!isHeadless) mainButton.innerText = "Filtering Listened...";
        const lastFmUsername = loadLastFmUsername();
        if (lastFmUsername) {
            const tracksWithScrobbles = await processBatchesWithDelay(
                filteredTracks, 50, 1000, () => {}, getTrackDetailsWithPersonalScrobbles
            );
            filteredTracks = tracksWithScrobbles.filter(t => (t.personalScrobbles || 0) === 0);
        } else {
            console.warn("[Sort-Play Dynamic Filter] Cannot exclude listened tracks. Last.fm username not set.");
            if (!isHeadless) Spicetify.showNotification("Last.fm username not set, cannot exclude listened tracks.", true);
        }
    }

    if (filters.maxPlayCount !== undefined && filters.maxPlayCount !== null && filters.maxPlayCount !== '') {
        if (!isHeadless) mainButton.innerText = "Filtering Plays...";
        const maxPlays = parseInt(filters.maxPlayCount, 10);
        if (!isNaN(maxPlays)) {
            const tracksWithPlaycounts = await enrichTracksWithPlayCounts(filteredTracks);
            filteredTracks = tracksWithPlaycounts.filter(t => {
                const playCount = parseInt(t.playCount, 10);
                return isNaN(playCount) || playCount <= maxPlays;
            });
        }
    }

    if (filters.keywordFilterEnabled && (filters.titleAlbumKeywords?.length > 0 || filters.artistKeywords?.length > 0)) {
        if (!isHeadless) mainButton.innerText = "Filtering Keywords...";
    
        const { keepMatchingMode, filterTitle, filterAlbum, filterArtist, matchWholeWord, titleAlbumKeywords = [], artistKeywords = [] } = filters;
        
        filteredTracks = filteredTracks.filter(track => {
            const trackTitle = track.songTitle || track.name || "";
            const trackAlbum = track.albumName || "";
            const trackArtists = track.allArtists || "";
    
            const hasTitleAlbumKeywords = titleAlbumKeywords.length > 0;
            const hasArtistKeywords = artistKeywords.length > 0;
    
            const titleAlbumMatch = hasTitleAlbumKeywords && titleAlbumKeywords.some(keyword => {
                const regex = matchWholeWord ? new RegExp(`\\b${escapeRegExp(keyword)}\\b`, 'i') : new RegExp(escapeRegExp(keyword), 'i');
                return (filterTitle && regex.test(trackTitle)) || (filterAlbum && regex.test(trackAlbum));
            });
    
            const artistMatch = hasArtistKeywords && filterArtist && artistKeywords.some(keyword => {
                const regex = matchWholeWord ? new RegExp(`\\b${escapeRegExp(keyword)}\\b`, 'i') : new RegExp(escapeRegExp(keyword), 'i');
                return regex.test(trackArtists);
            });
    
            if (keepMatchingMode) {
                const titleAlbumCondition = hasTitleAlbumKeywords ? titleAlbumMatch : true;
                const artistCondition = hasArtistKeywords ? artistMatch : true;
                return titleAlbumCondition && artistCondition;
            } else {
                return !(titleAlbumMatch || artistMatch);
            }
        });
    }

    const tracks = Array.from(new Map(filteredTracks.map(track => [track.uri, track])).values());

    if (!tracks || tracks.length === 0) {
        return { trackUris: [], newUsedUrisBySource: {} };
    }

    const tracksWithPlayCounts = await enrichTracksWithPlayCounts(tracks);
    const tracksWithIds = await processBatchesWithDelay(tracksWithPlayCounts, 50, 500, () => {}, collectTrackIdsForPopularity);
    const tracksWithPopularity = await fetchPopularityForMultipleTracks(tracksWithIds, () => {});

    let tracksForProcessing = tracksWithPopularity;
    if (sortType === "releaseDate") {
        tracksForProcessing = await processBatchesWithDelay(tracksWithPopularity, 50, 500, () => {}, getTrackDetailsWithReleaseDate);
    }

    const audioFeatureSortTypes = ['tempo', 'energy', 'danceability', 'valence', 'acousticness', 'instrumentalness'];
    if (audioFeatureSortTypes.includes(sortType)) {
        const trackIds = tracksWithPopularity.map(t => t.trackId || t.uri.split(":")[2]);
        const allStats = await getBatchTrackStats(trackIds);
        tracksForProcessing = tracksWithPopularity.map(track => {
            const stats = allStats[track.trackId || track.uri.split(":")[2]] || {};
            return { ...track, ...stats };
        });
    }

    const { unique: uniqueTracks } = deduplicate ? deduplicateTracks(tracksForProcessing, false, sources.some(s => URI.isArtist(s.uri))) : { unique: tracksForProcessing, removed: [] };

    let sortedTracks;
    switch (sortType) {
        case "playCount":
            sortedTracks = uniqueTracks.filter(t => t.playCount !== "N/A").sort((a, b) => (b.playCount || 0) - (a.playCount || 0));
            break;
        case "popularity":
            sortedTracks = uniqueTracks.filter(t => t.popularity != null).sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
            break;
        case "releaseDate":
            sortedTracks = uniqueTracks.filter(t => t.releaseDate != null).sort((a, b) => (new Date(b.releaseDate).getTime() || 0) - (new Date(a.releaseDate).getTime() || 0));
            break;
        case "scrobbles":
        case "personalScrobbles": {
            const tracksWithScrobbles = await handleScrobblesSorting(uniqueTracks, sortType, () => {});
            if (sortType === 'personalScrobbles') {
                const includeZeroScrobbles = localStorage.getItem("sort-play-include-zero-scrobbles") === "true";
                sortedTracks = tracksWithScrobbles
                    .filter(track => includeZeroScrobbles || (track.personalScrobbles != null && track.personalScrobbles > 0))
                    .sort((a, b) => (b.personalScrobbles ?? 0) - (a.personalScrobbles ?? 0));
            } else {
                sortedTracks = tracksWithScrobbles
                    .filter(track => track.scrobbles != null)
                    .sort((a, b) => (b.scrobbles ?? 0) - (a.scrobbles ?? 0));
            }
            break;
        }
        case 'tempo':
        case 'energy':
        case 'danceability':
        case 'valence':
        case 'acousticness':
        case 'instrumentalness':
            sortedTracks = uniqueTracks
                .filter(track => track[sortType] !== null && track[sortType] !== undefined)
                .sort((a, b) => {
                    const valA = a[sortType] || 0;
                    const valB = b[sortType] || 0;
                    return valB - valA;
                });
            break;
        case "shuffle":
            sortedTracks = shuffleArray(uniqueTracks);
            break;
        default:
            sortedTracks = uniqueTracks;
            break;
    }

    return {
        trackUris: sortedTracks.map(t => t.uri),
        newUsedUrisBySource: newUsedUrisBySource
    };
  }
  
  async function runJob(jobConfig, isInitialRun = false) {
    let job = { ...jobConfig };
    let finalTrackUris;
    let newDescription = null;
    const updateMode = job.updateMode || 'replace';

    if (isInitialRun) {
        const allSortableItems = buttonStyles.menuItems.flatMap(item => {
            if (item.type === 'parent' && item.children) {
                return item.children.flatMap(child => {
                    if (child.type === 'parent' && child.children) {
                        return child.children.filter(c => c && c.sortType && c.text);
                    }
                    if (child.sortType && child.text) {
                        return [child];
                    }
                    return [];
                });
            }
            if (item.sortType && item.text) {
                return [item];
            }
            return [];
        });

        const sortTypeInfo = allSortableItems.find(i => i.sortType === job.sortType);
        const sortTypeText = sortTypeInfo?.text ?? job.sortType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

        const playlistName = job.targetPlaylistName || (job.sources.length > 1 ? "Combined Dynamic Playlist" : `${job.sources[0].name} (Dynamic)`);
        const sourceNames = job.sources.length > 1 ? "multiple sources" : (job.sources[0]?.name || "Unknown Source");
        const playlistDescription = `Dynamically sorted by ${sortTypeText}. Source${job.sources.length > 1 ? 's' : ''}: ${sourceNames}. Managed by Sort-Play.`;
        
        const newPlaylist = await createPlaylist(playlistName, playlistDescription);
        job.targetPlaylistUri = newPlaylist.uri;
        job.targetPlaylistName = playlistName;

        if (job.sources.length === 1) {
            const firstSource = job.sources[0];
            const firstSourceCover = firstSource.coverUrl;
            if (firstSourceCover && !isDefaultMosaicCover(firstSourceCover)) {
                try {
                    let base64Image;
                    if (URI.isArtist(firstSource.uri)) {
                        base64Image = await toBase64(firstSourceCover);
                    } else {
                        base64Image = await imageUrlToBase64(firstSourceCover);
                    }
                    await setPlaylistImage(newPlaylist.id, base64Image);
                    job.coverUrl = firstSourceCover;
                } catch (error) {
                    console.warn(`[Sort-Play Dynamic] Could not apply original source cover for "${job.sources[0].name}":`, error);
                    job.coverUrl = newPlaylist.images?.length ? (newPlaylist.images[newPlaylist.images.length - 1] || newPlaylist.images[0]).url : null;
                }
            } else {
                job.coverUrl = newPlaylist.images?.length ? (newPlaylist.images[newPlaylist.images.length - 1] || newPlaylist.images[0]).url : null;
            }
        } else {
            job.coverUrl = newPlaylist.images?.length ? (newPlaylist.images[newPlaylist.images.length - 1] || newPlaylist.images[0]).url : null;
        }
        
        await addPlaylistToLibrary(newPlaylist.uri);
        
        const result = await executeSortOperation({ ...job, isHeadless: true });
        finalTrackUris = result.trackUris;
        job.sources.forEach(source => {
            const newHistory = result.newUsedUrisBySource[source.uri];
            if (newHistory) {
                source.usedTrackURIs = newHistory;
            }
        });
    } else {
        const playlistId = job.targetPlaylistUri.split(':')[2];
        try {
            const currentPlaylistData = await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/playlists/${playlistId}`);
            const currentDescription = currentPlaylistData.description;

            if (currentDescription && currentDescription.includes("Managed by Sort-Play.")) {
                const allSortableItems = buttonStyles.menuItems.flatMap(item => {
                    if (item.type === 'parent' && item.children) {
                        return item.children.flatMap(child => {
                            if (child.type === 'parent' && child.children) {
                                return child.children.filter(c => c && c.sortType && c.text);
                            }
                            if (child.sortType && child.text) {
                                return [child];
                            }
                            return [];
                        });
                    }
                    if (item.sortType && item.text) {
                        return [item];
                    }
                    return [];
                });

                const sortTypeMap = allSortableItems.reduce((acc, item) => {
                    acc[item.sortType] = item.text;
                    return acc;
                }, {});

                let oldSortTypeText = null;
                for (const type in sortTypeMap) {
                    const regex = new RegExp(`by ${sortTypeMap[type]}\\.`, 'i');
                    if (regex.test(currentDescription)) {
                        oldSortTypeText = sortTypeMap[type];
                        break;
                    }
                }

                const newSortTypeText = sortTypeMap[job.sortType];

                if (oldSortTypeText && newSortTypeText && oldSortTypeText !== newSortTypeText) {
                    newDescription = currentDescription.replace(`by ${oldSortTypeText}`, `by ${newSortTypeText}`);
                }
            }
        } catch (e) {
            console.warn("Sort-Play: Could not fetch current playlist details to update description.", e);
        }

        if (updateMode === 'append') {
            const result = await executeSortOperation({ ...job, isHeadless: true });
            const sampledTrackUris = result.trackUris;

            if (!sampledTrackUris || sampledTrackUris.length === 0) {
                job.lastRun = Date.now();
                return job;
            }
            const targetTracks = await getPlaylistTracks(playlistId);
            const targetTrackUris = new Set(targetTracks.map(t => t.uri));
            const newTrackUris = sampledTrackUris.filter(uri => !targetTrackUris.has(uri));

            if (newTrackUris.length > 0) {
                await Spicetify.Platform.PlaylistAPI.add(job.targetPlaylistUri, newTrackUris, { before: 0 });
            }
            job.sources.forEach(source => {
                const newHistory = result.newUsedUrisBySource[source.uri];
                if (newHistory) {
                    source.usedTrackUris = newHistory;
                }
            });
            job.lastRun = Date.now();
            return job;
        } else if (updateMode === 'merge') {
            const targetTracks = await getPlaylistTracks(playlistId);
            const mergeResult = await executeSortOperation({ ...job, isHeadless: true, additionalTracksToInclude: targetTracks });
            finalTrackUris = mergeResult.trackUris;
            job.sources.forEach(source => {
                const newHistory = mergeResult.newUsedUrisBySource[source.uri];
                if (newHistory) {
                    source.usedTrackURIs = newHistory;
                }
            });
        } else {
            const sourcesForUpdate = job.updateFromSource ? job.sources : [{ uri: job.targetPlaylistUri, totalTracks: 0 }];
            const updateResult = await executeSortOperation({ ...job, sources: sourcesForUpdate, isHeadless: true });
            finalTrackUris = updateResult.trackUris;
            job.sources.forEach(source => {
                const newHistory = updateResult.newUsedUrisBySource[source.uri];
                if (newHistory) {
                    source.usedTrackURIs = newHistory;
                }
            });
        }
    }
    
    if (finalTrackUris && finalTrackUris.length > 0) {
        await replacePlaylistTracks(job.targetPlaylistUri.split(':')[2], finalTrackUris);
    } else {
        console.warn(`[Sort-Play Dynamic] Job for "${job.targetPlaylistName}" resulted in zero tracks. Playlist will not be updated.`);
    }

    if (newDescription) {
        try {
            await Spicetify.CosmosAsync.put(
                `https://api.spotify.com/v1/playlists/${job.targetPlaylistUri.split(':')[2]}`,
                { description: newDescription }
            );
        } catch (e) {
            console.warn("Sort-Play: Failed to update playlist description.", e);
        }
    }

    job.lastRun = Date.now();
    return job;
  }

  async function checkAndRunJobs() {
    const jobs = getJobs();
    const now = Date.now();

    const isJobDue = (job, currentTime) => {
        const lastRun = job.lastRun || 0;
        const schedule = job.schedule;

        if (schedule === 'manual') {
            return false;
        }

        if (typeof schedule === 'number') {
            return currentTime > lastRun + schedule;
        }

        if (typeof schedule === 'string' && schedule.startsWith('release-')) {
            const nowDate = new Date(currentTime);
            const lastRunDate = new Date(lastRun);

            if (nowDate.getDay() !== 5) {
                return false;
            }

            if (lastRunDate.toDateString() === nowDate.toDateString()) {
                return false;
            }

            const daysSinceLastRun = (currentTime - lastRun) / (1000 * 60 * 60 * 24);

            switch (schedule) {
                case 'release-weekly':
                    return daysSinceLastRun > 6;
                case 'release-every-two-weeks':
                    return daysSinceLastRun > 13;
                case 'release-monthly':
                    return daysSinceLastRun > 27;
                default:
                    return false;
            }
        }
        return false;
    };

    const jobsToRun = jobs.filter(job => isJobDue(job, now));

    if (jobsToRun.length > 0) {
        for (const job of jobsToRun) {
            try {
                const updatedJob = await runJob(job);
                updateJob(updatedJob);
                Spicetify.showNotification(`Dynamic playlist "${job.targetPlaylistName}" was updated.`);
            } catch (error) {
                showDetailedError(error, `Failed to run dynamic playlist job for "${job.targetPlaylistName}"`);
                job.lastRun = now;
                updateJob(job);
            }
        }
    }
  }

  function startScheduler() {
    checkAndRunJobs(); 
    checkAndRunDedicatedJobs();
    setInterval(() => {
        checkAndRunJobs();
        checkAndRunDedicatedJobs();
        checkAndClearExpiredPersonalScrobblesCache();
    }, SCHEDULER_INTERVAL_MINUTES * 60 * 1000);
  }


  async function fetchUserLibrary() {
    try {
        const rootlist = await Spicetify.Platform.RootlistAPI.getContents();

        const playlistPromises = rootlist.items
            .filter(item => item.type === 'playlist')
            .map(async (item) => {
                const images = item.images || [];
                if (images.length > 0 || item.imageUrl) {
                    return {
                        uri: item.uri,
                        name: item.name,
                        info: 'Playlist',
                        coverUrl: images.length ? (images[images.length - 1] || images[0]).url : item.imageUrl,
                        type: 'playlist'
                    };
                } else {
                    try {
                        const playlistId = item.uri.split(':')[2];
                        const playlistData = await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/playlists/${playlistId}`);
                        const fetchedImages = playlistData.images || [];
                        return {
                            uri: item.uri,
                            name: item.name,
                            info: 'Playlist',
                            coverUrl: fetchedImages.length ? (fetchedImages[fetchedImages.length - 1] || fetchedImages[0]).url : null,
                            type: 'playlist'
                        };
                    } catch (error) {
                        console.warn(`Sort-Play: Could not fetch full details for playlist ${item.name}`, error);
                        return {
                            uri: item.uri,
                            name: item.name,
                            info: 'Playlist',
                            coverUrl: null,
                            type: 'playlist'
                        };
                    }
                }
            });

        const resolvedPlaylists = await Promise.all(playlistPromises);

        const albumsRes = await Spicetify.CosmosAsync.get('https://api.spotify.com/v1/me/albums?limit=50');
        const resolvedAlbums = [];
        if (albumsRes.items) {
            albumsRes.items.forEach(item => {
                const images = item.album.images || [];
                resolvedAlbums.push({
                    uri: item.album.uri,
                    name: item.album.name,
                    info: `Album by ${item.album.artists.map(a => a.name).join(', ')}`,
                    coverUrl: images.length ? (images[images.length - 1] || images[0]).url : null,
                    type: 'album'
                });
            });
        }
        
        return [...resolvedPlaylists, ...resolvedAlbums];

    } catch (error) {
        console.error("Failed to fetch user library:", error);
        return [];
    }
  }

  async function showChangeSourceModal(title, libraryItemsPromise, onSourceChanged, isMultiSelect = true) {
    const overlay = document.createElement("div");
    overlay.id = "sort-play-change-source-modal";
    overlay.className = "sort-play-font-scope";
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
        z-index: 2003; display: flex; justify-content: center; align-items: center;
    `;

    const modalContainer = document.createElement("div");
    modalContainer.className = "main-embedWidgetGenerator-container";
    modalContainer.style.cssText = `
        width: 450px !important; display: flex; flex-direction: column;
        border-radius: 20px; background-color: #181818 !important; border: 1px solid #282828;
    `;

    let selectedSources = new Set();

    modalContainer.innerHTML = `
        <style>
            #user-library-container {
                margin-top: 16px;
                background-color: #282828;
                border-radius: 6px;
                padding: 8px;
                height: 300px;
                max-height: 300px;
                overflow-y: auto;
                scrollbar-width: thin;
                scrollbar-color: #535353 #282828;
            }
            #user-library-container::-webkit-scrollbar { width: 8px; }
            #user-library-container::-webkit-scrollbar-track { background: #282828; }
            #user-library-container::-webkit-scrollbar-thumb { background-color: #535353; border-radius: 4px; }
            .library-item {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 8px;
                border-radius: 4px;
                cursor: pointer;
                transition: background-color 0.2s ease, border 0.2s ease;
                border: 1px solid transparent;
            }
            .library-item:hover { background-color: #3e3e3e; }
            .library-item.selected {
                background-color: #3a4f3a;
                border: 1px solid #1ed760;
            }
            .library-item-cover { width: 40px; height: 40px; border-radius: 4px; object-fit: cover; flex-shrink: 0; background-color: #3e3e3e; }
            .library-item-text { display: flex; flex-direction: column; overflow: hidden; }
            .library-item-title { color: white; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            .library-item-info { color: #b3b3b3; font-size: 12px; }
            .main-buttons-button.main-button-primary { background-color: #1ED760; color: black; transition: background-color 0.1s ease;}
            .main-buttons-button.main-button-primary:hover { background-color: #3BE377; }
            .main-buttons-button.main-button-secondary { background-color: #333333; color: white; transition: background-color 0.1s ease; }
            .main-buttons-button.main-button-secondary:hover { background-color: #444444; }
            #search-suggestions {
                position: fixed;
                background-color: #282828;
                border: 1px solid #3e3e3e;
                border-radius: 6px;
                z-index: 2005;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                display: flex;
                max-height: 450px;
                overflow: hidden;
            }
            .suggestions-column {
                flex: 1;
                overflow-y: auto;
                padding: 4px;
                scrollbar-width: thin;
                scrollbar-color: #535353 #282828;
            }
            .suggestions-column::-webkit-scrollbar { width: 6px; }
            .suggestions-column::-webkit-scrollbar-track { background: #282828; }
            .suggestions-column::-webkit-scrollbar-thumb { background-color: #535353; border-radius: 3px; }
            .suggestions-column:first-child {
                border-right: 1px solid #3e3e3e;
            }
            .suggestion-item {
                display: flex;
                align-items: center;
                padding: 8px;
                cursor: pointer;
                border-radius: 4px;
            }
            .suggestion-item:hover {
                background-color: #3e3e3e;
            }
            .suggestion-cover {
                width: 32px;
                height: 32px;
                margin-right: 8px;
                border-radius: 4px;
                object-fit: cover;
                flex-shrink: 0;
            }
            .suggestion-text {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-size: 14px;
                color: white;
            }
            .suggestion-header {
                font-size: 12px;
                font-weight: bold;
                color: #b3b3b3;
                padding: 8px 8px 4px;
                text-transform: uppercase;
            }
            #source-clear-btn {
                position: absolute;
                right: 10px;
                top: 50%;
                transform: translateY(-50%);
                background: none;
                border: none;
                color: #b3b3b3;
                cursor: pointer;
                font-size: 20px;
                padding: 0 5px;
                line-height: 1;
                display: none;
            }
            #source-clear-btn:hover { color: white; }
        </style>
        <div class="main-trackCreditsModal-header" style="padding: 20px 24px 10px;">
            <h1 class="main-trackCreditsModal-title" style="font-size: 20px; font-weight: 700; color: white;">${title}</h1>
        </div>
        <div class="main-trackCreditsModal-mainSection" style="padding: 16px 24px; scrollbar-width: none;">
            <p style="color: #b3b3b3; font-size: 14px; margin: 0 0 12px;">Search for source, paste a link, or select from your library.</p>
            <div style="position: relative;">
                <input type="text" id="source-url-input" placeholder="Search or paste link..." style="width: 100%; background-color: #3e3e3e; border: 1px solid #3e3e3e; border-radius: 4px; padding: 8px 30px 8px 12px; color: white; box-sizing: border-box;">
                <button id="source-clear-btn">&times;</button>
            </div>
            <div id="source-change-error" style="color: #f15e6c; font-size: 12px; margin-top: 8px; display: none;"></div>
            <div id="user-library-container">
                <div style="text-align: center; color: #b3b3b3; font-size: 14px; padding: 20px 0;">Loading Library...</div>
            </div>
        </div>
        <div class="main-trackCreditsModal-originalCredits" style="padding: 16px 24px; border-top: 1px solid #282828; display: flex; justify-content: flex-end; gap: 10px;">
            <button id="cancel-change-source" class="main-buttons-button main-button-secondary" style="padding: 8px 18px; border-radius: 20px; font-weight: 550; font-size: 13px; text-transform: uppercase; cursor: pointer; border: none;">Cancel</button>
            <button id="confirm-change-source" class="main-buttons-button main-button-primary" style="padding: 8px 18px; border-radius: 20px; font-weight: 550; font-size: 13px; text-transform: uppercase; cursor: pointer; border: none; color: black;">Confirm</button>
        </div>
    `;
    
    const suggestionsContainer = document.createElement('div');
    suggestionsContainer.id = 'search-suggestions';
    suggestionsContainer.style.display = 'none';
    document.body.appendChild(suggestionsContainer);

    const searchInput = modalContainer.querySelector('#source-url-input');
    const clearButton = modalContainer.querySelector('#source-clear-btn');
    const libraryContainer = modalContainer.querySelector('#user-library-container');

    const positionSuggestionsPanel = () => {
        if (suggestionsContainer.style.display === 'none') return;
        const rect = searchInput.getBoundingClientRect();
        suggestionsContainer.style.top = `${rect.bottom + 4}px`;
        suggestionsContainer.style.left = `${rect.left}px`;
        suggestionsContainer.style.width = `${rect.width}px`;
    };

    const hideSuggestions = () => {
        suggestionsContainer.style.display = 'none';
        suggestionsContainer.innerHTML = '';
    };

    const renderSuggestions = (playlists = [], artists = []) => {
        if (playlists.length === 0 && artists.length === 0) {
            hideSuggestions();
            return;
        }

        suggestionsContainer.innerHTML = `
            <div class="suggestions-column">
                <div class="suggestion-header">Playlists</div>
                ${playlists.map(item => `
                    <div class="suggestion-item" data-uri="${item.uri}" data-url="${item.external_urls.spotify}">
                        <img src="${item.images[0]?.url || ''}" class="suggestion-cover">
                        <span class="suggestion-text" title="${item.name}">${item.name}</span>
                    </div>
                `).join('')}
            </div>
            <div class="suggestions-column">
                <div class="suggestion-header">Artists</div>
                ${artists.map(item => `
                    <div class="suggestion-item" data-uri="${item.uri}" data-url="${item.external_urls.spotify}">
                        <img src="${item.images[0]?.url || ''}" class="suggestion-cover">
                        <span class="suggestion-text" title="${item.name}">${item.name}</span>
                    </div>
                `).join('')}
            </div>
        `;
        suggestionsContainer.style.display = 'flex';
        positionSuggestionsPanel();

        suggestionsContainer.querySelectorAll('.suggestion-item').forEach(itemEl => {
            itemEl.addEventListener('click', () => {
                const uri = itemEl.dataset.uri;
                const url = itemEl.dataset.url;
                searchInput.value = url;
                clearButton.style.display = 'block';
                
                selectedSources.add(uri);
                hideSuggestions();
                
                const libraryItem = libraryContainer.querySelector(`.library-item[data-uri="${uri}"]`);
                if (libraryItem) {
                    libraryItem.classList.add('selected');
                }
            });
        });
    };

    const performSearch = async () => {
        const query = searchInput.value.trim();
        if (query.length < 3 || query.startsWith('http')) {
            hideSuggestions();
            return;
        }
        try {
            const res = await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=playlist,artist&limit=8`);
            renderSuggestions(res.playlists?.items, res.artists?.items);
        } catch (e) {
            console.error("Search failed:", e);
            hideSuggestions();
        }
    };

    const debouncedSearch = debounce(performSearch, 300);
    searchInput.addEventListener('input', () => {
        clearButton.style.display = searchInput.value.length > 0 ? 'block' : 'none';
        debouncedSearch();
    });

    clearButton.addEventListener('click', () => {
        searchInput.value = '';
        clearButton.style.display = 'none';
        hideSuggestions();
        searchInput.focus();
    });

    const outsideClickListener = (event) => {
        if (!modalContainer.contains(event.target) && !suggestionsContainer.contains(event.target)) {
            hideSuggestions();
        }
    };
    document.addEventListener('click', outsideClickListener, true);
    window.addEventListener('resize', positionSuggestionsPanel);
    window.addEventListener('scroll', positionSuggestionsPanel, true);

    const closeModal = () => {
        document.removeEventListener('click', outsideClickListener, true);
        window.removeEventListener('resize', positionSuggestionsPanel);
        window.removeEventListener('scroll', positionSuggestionsPanel, true);
        suggestionsContainer.remove();
        overlay.remove();
    };
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            e.preventDefault();
            e.stopPropagation();
        }
    });
    modalContainer.querySelector('#cancel-change-source').addEventListener('click', closeModal);

    const processUri = async (uri) => {
        const uriObj = Spicetify.URI.fromString(uri);
        const newUri = uriObj.toURI();
        let newSourceData = { uri: newUri };

        if (URI.isPlaylistV1OrV2(newUri)) {
            const data = await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/playlists/${newUri.split(":")[2]}`);
            newSourceData.name = data.name;
            newSourceData.info = `Playlist by ${data.owner.display_name}`;
            newSourceData.coverUrl = data.images?.length ? (data.images[data.images.length - 1] || data.images[0]).url : null;
            newSourceData.isStatic = false;
            newSourceData.totalTracks = 'N/A';
            newSourceData.totalTracks = data.tracks.total;
        } else if (URI.isArtist(newUri)) {
            const data = await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/artists/${newUri.split(":")[2]}`);
            newSourceData.name = data.name;
            newSourceData.info = `Artist Page`;
            newSourceData.coverUrl = data.images?.length ? (data.images[data.images.length - 1] || data.images[0]).url : null;
            newSourceData.isStatic = true;
        } else if (URI.isAlbum(newUri)) {
            const data = await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/albums/${newUri.split(":")[2]}`);
            newSourceData.name = data.name;
            newSourceData.info = `Album by ${data.artists.map(a => a.name).join(', ')}`;
            newSourceData.coverUrl = data.images?.length ? (data.images[data.images.length - 1] || data.images[0]).url : null;
            newSourceData.isStatic = true;
            newSourceData.totalTracks = 'N/A';
            newSourceData.totalTracks = data.tracks.total;
        } else {
            throw new Error("Unsupported link type. Please use a Playlist, Album, or Artist link.");
        }
        return newSourceData;
    };

    modalContainer.querySelector('#confirm-change-source').addEventListener('click', async (e) => {
        const confirmButton = e.currentTarget;
        const errorDiv = modalContainer.querySelector('#source-change-error');
        errorDiv.style.display = 'none';
        
        const url = searchInput.value.trim();
        
        if (url && url.startsWith('http')) {
            try {
                const uriObj = Spicetify.URI.fromString(url);
                selectedSources.add(uriObj.toURI());
            } catch (err) {
                errorDiv.textContent = "Invalid Spotify link pasted.";
                errorDiv.style.display = 'block';
                return;
            }
        }

        if (selectedSources.size === 0) {
            errorDiv.textContent = "Please select an item or paste a link.";
            errorDiv.style.display = 'block';
            return;
        }

        confirmButton.disabled = true;
        confirmButton.textContent = 'Verifying...';

        try {
            const sourcesData = await Promise.all(Array.from(selectedSources).map(uri => processUri(uri)));
            onSourceChanged(sourcesData);
            closeModal();
        } catch (error) {
            errorDiv.textContent = error.message || "Invalid or unsupported Spotify link.";
            errorDiv.style.display = 'block';
            console.error("Error parsing source URL(s):", error);
        } finally {
            confirmButton.disabled = false;
            confirmButton.textContent = 'Confirm';
        }
    });

    document.body.appendChild(overlay);
    overlay.appendChild(modalContainer);

    const container = modalContainer.querySelector('#user-library-container');
    try {
        const libraryItems = await libraryItemsPromise;
        if (libraryItems && libraryItems.length > 0) {
            container.innerHTML = libraryItems.map(item => `
                <div class="library-item" data-uri="${item.uri}">
                    <img src="${item.coverUrl || ''}" class="library-item-cover">
                    <div class="library-item-text">
                        <span class="library-item-title" title="${item.name}">${item.name}</span>
                        <span class="library-item-info">${item.info}</span>
                    </div>
                </div>
            `).join('');

            container.querySelectorAll('.library-item').forEach(itemEl => {
                itemEl.addEventListener('click', async () => {
                    const uri = itemEl.dataset.uri;
                    if (selectedSources.has(uri)) {
                        selectedSources.delete(uri);
                        itemEl.classList.remove('selected');
                    } else {
                        selectedSources.add(uri);
                        itemEl.classList.add('selected');
                    }
                });
            });
            
        } else {
            container.innerHTML = '<div style="text-align: center; color: #b3b3b3; font-size: 14px; padding: 20px 0;">Could not load library.</div>';
        }
    } catch (error) {
        console.error("Failed to load library for modal:", error);
        container.innerHTML = '<div style="text-align: center; color: #f15e6c; font-size: 14px; padding: 20px 0;">Error loading library.</div>';
    }
  }

  async function showDynamicFilterModal(currentFilters) {
    return new Promise((resolve) => {
        const lastFmUsername = loadLastFmUsername();
        const isExcludeListenedDisabled = !lastFmUsername;
        let titleAlbumKeywords = new Set();
        let artistKeywords = new Set();
        let keepMatchingMode, filterTitle, filterAlbum, filterArtist, matchWholeWord;

        const overlay = document.createElement("div");
        overlay.id = "filter-overlay";
        overlay.className = "sort-play-font-scope";
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background-color: rgba(0, 0, 0, 0.7); z-index: 2006;
            display: flex; justify-content: center; align-items: center;
        `;

        const modalContainer = document.createElement("div");
        modalContainer.className = "main-embedWidgetGenerator-container";
        modalContainer.style.zIndex = "2007";
        modalContainer.style.width = "650px";
        modalContainer.style.backgroundColor = "#181818";
        modalContainer.style.borderRadius = "25px";
        modalContainer.style.border = "2px solid #282828";

        modalContainer.innerHTML = `
          <style>
            .main-trackCreditsModal-mainSection { padding: 20px 32px !important; overflow: hidden; }
            #filter-overlay .settings-left-wrapper { background-color: #1c1c1c; border-radius: 20px; padding: 20px; position: relative; margin-top: 20px; }
            #filter-overlay .settings-left-wrapper.disabled > *:not(.settings-title-wrapper) { opacity: 0.5; pointer-events: none; }
            #filter-overlay .settings-left-wrapper.disabled .settings-title-wrapper { opacity: 1; pointer-events: all; }
            #filter-overlay .settings-left-wrapper.disabled #keywordFilterToggle { pointer-events: all; }
            #filter-overlay .settings-title { color: white; font-weight: bold; font-size: 15px; margin-bottom: 5px; }
            #filter-overlay .settings-title-wrapper { display: flex; justify-content: space-between; width: 100%; margin-bottom: 8px; }
            #filter-overlay .filter-mode-radio-group { display: flex; align-items: center; gap: 16px; margin: 10px 0; }
            #filter-overlay .radio-button-container { display: flex; align-items: center; gap: 8px; cursor: pointer; }
            #filter-overlay .radio-button { width: 16px; height: 16px; border: 2px solid #b3b3b3; border-radius: 50%; display: flex; padding: 2px; }
            #filter-overlay .radio-button input { display: none; }
            #filter-overlay .radio-button-inner { width: 8px; height: 8px; background-color: #1DB954; border-radius: 50%; display: none; }
            #filter-overlay .radio-button input:checked + .radio-button-inner { display: block; }
            #filter-overlay .radio-label { color: #b3b3b3; font-size: 13px; }
            #filter-overlay .radio-button-container:hover .radio-button, #filter-overlay .radio-button-container:hover .radio-label { color: #ffffff; border-color: #ffffff; }
            #filter-overlay .keyword-filter-container { display: flex; gap: 15px; width: 100%; }
            #filter-overlay .filter-group { flex: 1; display: flex; flex-direction: column; gap: 12px; }
            #filter-overlay .filter-group-header { display: flex; align-items: center; gap: 8px; height: 20px; justify-content: space-between; }
            #filter-overlay .filter-group-title { color: #fff; font-size: 13px; font-weight: 500; }
            #filter-overlay .toggle-group { display: flex; gap: 5px; align-items: center; }
            #filter-overlay .filter-mode-toggle-label { color: #b3b3b3; font-size: 13px; }
            #filter-overlay .keyword-input-container { position: relative; display: flex; flex-direction: column; background: #282828; border-radius: 6px; min-height: 96px; max-height: 96px; width: 100%; }
            #filter-overlay .keyword-tags-container { display: flex; flex-wrap: wrap; gap: 4px; padding: 6px; overflow-y: auto; flex-grow: 1; scrollbar-width: thin; scrollbar-color: #ffffff40 transparent; }
            #filter-overlay .keyword-input-wrapper { position: relative; padding: 3px; border-top: 1px solid #444; background: #313131; border-bottom-left-radius: 6px; border-bottom-right-radius: 6px; display: flex; align-items: center; }
            #filter-overlay .keyword-input { background: none; border: none; color: white; padding: 4px; width: 100%; height: 24px; margin: 0; flex: 1; min-width: 0; }
            #filter-overlay .keyword-input:focus { outline: none; }
            #filter-overlay .keyword-actions-container { display: flex; margin-left: auto; flex-shrink: 0; }
            #filter-overlay .keyword-action-button { background-color: transparent; border: none; color: white; padding: 2px 7px; border-radius: 12px; font-size: 12px; cursor: pointer; transition: background-color: 0.2s ease; height: 24px; white-space: nowrap; }
            #filter-overlay .keyword-action-button:hover { background-color: #484848; }
            #filter-overlay .keyword-action-button svg { width: 14px; height: 14px; fill: #fff; display: block; margin: 0 auto; }
            #filter-overlay .keyword-tag { display: inline-flex; align-items: center; background: #383838; border-radius: 12px; padding: 2px 8px; color: white; font-size: 12px; white-space: nowrap; flex-shrink: 0; height: 24px; }
            #filter-overlay .keyword-tag-remove { margin-left: 4px; cursor: pointer; color: #ccc; font-size: 14px; }
            #filter-overlay .setting-row { display: flex; justify-content: space-between; align-items: center; padding: 5px 0; }
            #filter-overlay .setting-row .description { color: #c1c1c1; }
            #filter-overlay .setting-row.disabled .description { opacity: 0.5; }
            #filter-overlay .tooltip-container { position: relative; display: inline-block; vertical-align: middle; }
            #filter-overlay .custom-tooltip { visibility: hidden; position: absolute; z-index: 2008; background-color: #373737; color: white; padding: 8px 12px; border-radius: 4px; font-size: 14px; max-width: 280px; width: max-content; bottom: 100%; left: 50%; transform: translateX(-50%); margin-bottom: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.2); line-height: 1.4; word-wrap: break-word; text-align: left; }
            #filter-overlay .custom-tooltip::after { content: ""; position: absolute; top: 100%; left: 50%; margin-left: -5px; border-width: 5px; border-style: solid; border-color: #373737 transparent transparent transparent; }
            #filter-overlay .tooltip-container:hover .custom-tooltip { visibility: visible; }
            #filter-overlay .switch { position: relative; display: inline-block; width: 40px; height: 24px; flex-shrink: 0; }
            #filter-overlay .switch input { opacity: 0; width: 0; height: 0; }
            #filter-overlay .sliderx { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #484848; border-radius: 24px; transition: .2s; }
            #filter-overlay .sliderx:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; border-radius: 50%; transition: .2s; }
            #filter-overlay input:checked + .sliderx { background-color: #1DB954; }
            #filter-overlay input:checked + .sliderx:before { transform: translateX(16px); }
            #filter-overlay .switch.disabled .sliderx, #filter-overlay input:disabled + .sliderx { opacity: 0.5; cursor: not-allowed; }
            #filter-overlay .main-buttons-button.main-button-primary { background-color: #1ED760; color: black; transition: background-color 0.1s ease;}
            #filter-overlay .main-buttons-button.main-button-primary:hover { background-color: #3BE377; }
            #filter-overlay .main-buttons-button.main-button-secondary { background-color: #333333; color: white; transition: background-color 0.1s ease; }
            #filter-overlay .main-buttons-button.main-button-secondary:hover { background-color: #444444; }
          </style>
          <div class="main-trackCreditsModal-header">
              <h1 class="main-trackCreditsModal-title"><span style='font-size: 25px;'>Track Filtering Options</span></h1>
          </div>
          <div class="main-trackCreditsModal-mainSection">
              <div style="display: flex; flex-direction: column; gap: 16px;">
                  <div class="setting-row">
                      <span class="description">Exclude Liked Tracks</span>
                      <label class="switch"><input type="checkbox" id="filter-exclude-liked"><span class="sliderx"></span></label>
                  </div>
                  <div class="setting-row ${isExcludeListenedDisabled ? 'disabled' : ''}">
                      <span class="description">
                          Exclude My Scrobbled Tracks
                          <span class="tooltip-container">
                              <span style="color: #888; margin-left: 4px; font-size: 12px; cursor: help;">?</span>
                              <span class="custom-tooltip">Requires Last.fm. Removes tracks you have scrobbled at least once. ${isExcludeListenedDisabled ? '(Set Last.fm username in settings)' : ''}</span>
                          </span>
                      </span>
                      <label class="switch"><input type="checkbox" id="filter-exclude-listened" ${isExcludeListenedDisabled ? 'disabled' : ''}><span class="sliderx"></span></label>
                  </div>
                  <div class="setting-row">
                      <span class="description">
                          Max Play Count
                          <span class="tooltip-container">
                              <span style="color: #888; margin-left: 4px; font-size: 12px; cursor: help;">?</span>
                              <span class="custom-tooltip">Only include tracks with a play count less than or equal to this value. Leave blank to disable.</span>
                          </span>
                      </span>
                      <input type="number" id="filter-max-playcount" placeholder="e.g., 10000" min="1000" step="1000" style="width: 150px; padding: 6px; border-radius: 4px; border: 1px solid #666; background-color: #282828; color: white; text-align: center;">
                  </div>
              </div>

              <div class="settings-left-wrapper">
                  <div class="settings-title-wrapper">
                      <div class="settings-title">Keyword Filters</div>
                      <label class="switch"><input type="checkbox" id="keywordFilterToggle"><span class="sliderx"></span></label>
                  </div>
                  <div class="filter-mode-container" style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 10px;">
                      <div class="filter-mode-radio-group">
                          <div class="filter-mode-title" style="color: #fff; font-size: 13px; font-weight: 500; margin-right: 8px;">Filter Mode:</div>
                          <label class="radio-button-container"><span class="radio-button"><input type="radio" name="filterMode" value="exclude"><span class="radio-button-inner"></span></span><span class="radio-label">Exclude</span></label>
                          <label class="radio-button-container"><span class="radio-button"><input type="radio" name="filterMode" value="keep"><span class="radio-button-inner"></span></span><span class="radio-label">Keep</span></label>
                          <span class="filter-mode-title" style="color: #fff; font-size: 13px; font-weight: 500; margin-left: 14px;">Match Whole Word:</span>
                      </div>
                      <label class="switch"><input type="checkbox" id="matchWholeWordToggle"><span class="sliderx"></span></label>
                  </div>
                  <div class="keyword-filter-container">
                      <div class="filter-group">
                          <div class="filter-group-header">
                              <span class="filter-group-title">Titles/Albums</span>
                              <div class="toggle-group">
                                  <span class="filter-mode-toggle-label">Title</span>
                                  <label class="switch"><input type="checkbox" id="titleToggle" checked><span class="sliderx"></span></label>
                                  <span class="filter-mode-toggle-label">Album</span>
                                  <label class="switch"><input type="checkbox" id="albumToggle" checked><span class="sliderx"></span></label>
                              </div>
                          </div>
                          <div class="keyword-input-container" id="titleAlbumKeywords">
                              <div class="keyword-tags-container"></div>
                              <div class="keyword-input-wrapper">
                                  <input type="text" class="keyword-input" placeholder="Add keywords...">
                                  <div class="keyword-actions-container">
                                      <button class="keyword-action-button keyword-save-button" title="Save Keywords">${saveIconSVG}</button>
                                      <button class="keyword-action-button keyword-load-button" title="Load Keywords">${loadIconSVG}</button>
                                      <button class="keyword-action-button keyword-remove-all-button" title="Clear Keywords">${clearIconSVG}</button>
                                  </div>
                              </div>
                          </div>
                      </div>
                      <div class="filter-group">
                          <div class="filter-group-header">
                              <span class="filter-group-title">Artists</span>
                              <div class="toggle-group">
                                  <label class="switch"><input type="checkbox" id="artistToggle" checked><span class="sliderx"></span></label>
                              </div>
                          </div>
                          <div class="keyword-input-container" id="artistKeywords">
                              <div class="keyword-tags-container"></div>
                              <div class="keyword-input-wrapper"><input type="text" class="keyword-input" placeholder="Add keywords..."></div>
                          </div>
                      </div>
                  </div>
              </div>
              <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 24px;">
                  <button id="cancel-filters" class="main-buttons-button main-button-secondary" style="padding: 8px 18px; border-radius: 20px; font-weight: 550; font-size: 13px; text-transform: uppercase; cursor: pointer; border: none;">Cancel</button>
                  <button id="save-filters" class="main-buttons-button main-button-primary" style="padding: 8px 18px; border-radius: 20px; font-weight: 550; font-size: 13px; text-transform: uppercase; cursor: pointer; border: none;">Save</button>
              </div>
          </div>
        `;
        
        document.body.appendChild(overlay);
        overlay.appendChild(modalContainer);

        const closeModal = (data) => {
            overlay.remove();
            resolve(data);
        };

        const keywordFilterWrapper = modalContainer.querySelector('.settings-left-wrapper');
        const keywordFilterToggle = modalContainer.querySelector("#keywordFilterToggle");
        const filterModeRadios = modalContainer.querySelectorAll('input[name="filterMode"]');
        const titleToggle = modalContainer.querySelector("#titleToggle");
        const albumToggle = modalContainer.querySelector("#albumToggle");
        const artistToggle = modalContainer.querySelector("#artistToggle");
        const matchWholeWordToggle = modalContainer.querySelector("#matchWholeWordToggle");
        const titleAlbumContainer = modalContainer.querySelector("#titleAlbumKeywords");
        const artistContainer = modalContainer.querySelector("#artistKeywords");

        document.getElementById('filter-exclude-liked').checked = currentFilters.excludeLiked || false;
        document.getElementById('filter-exclude-listened').checked = currentFilters.excludeListened || false;
        document.getElementById('filter-max-playcount').value = currentFilters.maxPlayCount || '';
        keywordFilterToggle.checked = currentFilters.keywordFilterEnabled || false;
        keywordFilterWrapper.classList.toggle('disabled', !keywordFilterToggle.checked);

        keepMatchingMode = currentFilters.keepMatchingMode ?? false;
        filterTitle = currentFilters.filterTitle ?? (localStorage.getItem("sort-play-filter-title") !== "false");
        filterAlbum = currentFilters.filterAlbum ?? (localStorage.getItem("sort-play-filter-album") !== "false");
        filterArtist = currentFilters.filterArtist ?? (localStorage.getItem("sort-play-filter-artist") !== "false");
        matchWholeWord = currentFilters.matchWholeWord ?? (localStorage.getItem("sort-play-match-whole-word") === "true");
        
        filterModeRadios.forEach(radio => radio.checked = (keepMatchingMode && radio.value === "keep") || (!keepMatchingMode && radio.value === "exclude"));
        titleToggle.checked = filterTitle;
        albumToggle.checked = filterAlbum;
        artistToggle.checked = filterArtist;
        matchWholeWordToggle.checked = matchWholeWord;

        const loadedKeywords = loadKeywords();
        titleAlbumKeywords = currentFilters.titleAlbumKeywords ? new Set(currentFilters.titleAlbumKeywords) : loadedKeywords.titleAlbumKeywords;
        artistKeywords = currentFilters.artistKeywords ? new Set(currentFilters.artistKeywords) : loadedKeywords.artistKeywords;
        
        if(titleAlbumContainer) titleAlbumContainer.querySelector(".keyword-tags-container").innerHTML = "";
        if(artistContainer) artistContainer.querySelector(".keyword-tags-container").innerHTML = "";

        titleAlbumKeywords.forEach(keyword => createKeywordTag(keyword, titleAlbumContainer, titleAlbumKeywords));
        artistKeywords.forEach(keyword => createKeywordTag(keyword, artistContainer, artistKeywords));

        setupKeywordInput(titleAlbumContainer, titleAlbumKeywords);
        setupKeywordInput(artistContainer, artistKeywords);

        keywordFilterToggle.addEventListener('change', (e) => keywordFilterWrapper.classList.toggle('disabled', !e.target.checked));
        filterModeRadios.forEach(radio => radio.addEventListener("change", (e) => keepMatchingMode = e.target.value === "keep"));
        titleToggle.addEventListener('change', e => filterTitle = e.target.checked);
        albumToggle.addEventListener('change', e => filterAlbum = e.target.checked);
        artistToggle.addEventListener('change', e => filterArtist = e.target.checked);
        matchWholeWordToggle.addEventListener('change', e => matchWholeWord = e.target.checked);
        
        modalContainer.querySelector('#save-filters').addEventListener('click', () => {
            saveKeywords(titleAlbumKeywords, artistKeywords);
            localStorage.setItem("sort-play-filter-title", filterTitle);
            localStorage.setItem("sort-play-filter-album", filterAlbum);
            localStorage.setItem("sort-play-filter-artist", filterArtist);
            localStorage.setItem("sort-play-match-whole-word", matchWholeWord);

            const newFilters = {
                excludeLiked: modalContainer.querySelector('#filter-exclude-liked').checked,
                excludeListened: modalContainer.querySelector('#filter-exclude-listened').checked,
                maxPlayCount: modalContainer.querySelector('#filter-max-playcount').value,
                keywordFilterEnabled: modalContainer.querySelector('#keywordFilterToggle').checked,
                keepMatchingMode,
                filterTitle,
                filterAlbum,
                filterArtist,
                matchWholeWord,
                titleAlbumKeywords: Array.from(titleAlbumKeywords),
                artistKeywords: Array.from(artistKeywords),
            };
            closeModal(newFilters);
        });

        modalContainer.querySelector('#cancel-filters').addEventListener('click', () => closeModal(null));
        overlay.addEventListener("click", (e) => { 
            if (e.target === overlay) {
                closeModal(null);
            }
        });
    });
  }
  
  function showDynamicPlaylistsWindow() {
    const existingModal = document.getElementById('sort-play-dynamic-playlist-modal');
    if (existingModal) existingModal.remove();

    let userLibraryPromise = null;

    const overlay = document.createElement("div");
    overlay.id = "sort-play-dynamic-playlist-modal";
    overlay.className = "sort-play-font-scope";
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
        z-index: 2002; display: flex; justify-content: center; align-items: center;
    `;

    const modalContainer = document.createElement("div");
    modalContainer.className = "main-embedWidgetGenerator-container";
    modalContainer.style.cssText = `
        width: 900px !important; display: flex; flex-direction: column;
        border-radius: 30px; background-color: #181818 !important; border: 2px solid #282828;
    `;

    const closeModal = () => overlay.remove();
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            e.preventDefault();
            e.stopPropagation();
        }
    });

    const penIconSvg = `<svg width="16px" height="16px" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M2.25,12.9378906 L2.25,15.75 L5.06210943,15.75 L13.3559575,7.45615192 L10.5438481,4.64404249 L2.25,12.9378906 L2.25,12.9378906 L2.25,12.9378906 Z M15.5306555,5.28145396 C15.8231148,4.98899458 15.8231148,4.5165602 15.5306555,4.22410082 L13.7758992,2.46934454 C13.4834398,2.17688515 13.0110054,2.17688515 12.718546,2.46934454 L11.3462366,3.84165394 L14.1583461,6.65376337 L15.5306555,5.28145396 L15.5306555,5.28145396 L15.5306555,5.28145396 Z"></path></svg>`;

    const formatTimeAgo = (timestamp) => {
        if (!timestamp) return 'Never';
        const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return "Just now";
    };

    const renderJobList = () => {
        const jobs = getJobs();
        const scheduleMap = {
            10800000: 'Every 3 Hours', 21600000: 'Every 6 Hours',
            86400000: 'Daily', 604800000: 'Weekly', 2592000000: 'Monthly',
            'release-weekly': 'Weekly (on Friday)',
            'release-every-two-weeks': 'Every Two Weeks (on Friday)',
            'release-monthly': 'Monthly (on a Friday)',
            'manual': 'Manual Only'
        };
        const customSchedules = getCustomSchedules();
        customSchedules.forEach(schedule => {
            scheduleMap[schedule.value] = schedule.text;
        });

        const sortByParent = buttonStyles.menuItems.find(i => i.sortType === 'sortByParent');
        const allSortOptions = sortByParent.children.flatMap(opt => (opt.type === 'parent' && opt.children) ? opt.children : opt);
        const sortTypeMap = allSortOptions.reduce((acc, item) => {
            if (item.sortType) {
                acc[item.sortType] = item.text;
            }
            return acc;
        }, {});

        let jobsHtml = jobs.map(job => `
            <div class="job-item ${job.isDeleted ? 'deleted' : ''}" data-job-id="${job.id}">
            <div class="job-cover-art-container">
                <img 
                    src="${job.coverUrl || ''}" 
                    alt="${job.targetPlaylistName || job.sourceName}" 
                    style="visibility: hidden;" 
                    onerror="this.remove()"
                >
            </div>
                <div class="job-details">
                    <span class="job-source-name" title="${job.targetPlaylistName || job.sourceName}">${job.targetPlaylistName || job.sourceName}</span>
                    <span class="job-info">${sortTypeMap[job.sortType] || 'Unknown Sort'} &bull; ${scheduleMap[job.schedule] || 'Custom'}</span>
                    <div class="job-status-line">
                        <span class="job-last-run">Last run: ${formatTimeAgo(job.lastRun)}</span>
                        <span class="job-deleted-status">${job.isDeleted ? '• Playlist not in library' : ''}</span>
                    </div>
                </div>
                <div class="job-actions">
                    <button class="job-action-btn job-run-btn" data-job-id="${job.id}" title="Run Now" ${runningJobIds.has(job.id) ? 'disabled' : ''}>&#x25B6;</button>
                    <button class="job-action-btn job-edit-btn" data-job-id="${job.id}" title="Edit Job">${penIconSvg}</button>
                    <button class="job-action-btn job-delete-btn" data-job-id="${job.id}" title="Delete Job">
                        <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor"><path d="M.293.293a1 1 0 0 1 1.414 0L8 6.586 14.293.293a1 1 0 1 1 1.414 1.414L9.414 8l6.293 6.293a1 1 0 0 1-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 0 1-1.414-1.414L6.586 8 .293 1.707a1 1 0 0 1 0-1.414z"></path></svg>
                    </button>
                </div>
            </div>
        `).join('');

        if (jobs.length === 0) {
            jobsHtml = `<div class="no-jobs-message">No dynamic playlists scheduled.</div>`;
        }

        modalContainer.innerHTML = `
            <style>
                .dynamic-playlist-modal .main-trackCreditsModal-mainSection { 
                    padding: 24px 32px 38px !important; 
                    max-height: 70vh; 
                    flex-grow: 1; 
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                }
                .dynamic-playlist-modal .job-list-header { 
                    display: flex; 
                    justify-content: flex-end; 
                    align-items: center; 
                    margin-bottom: 20px; 
                    flex-shrink: 0;
                }
                .dynamic-playlist-modal .job-list-container {
                    flex-grow: 1;
                    overflow-y: auto;
                    margin-right: -16px;
                    padding-right: 16px;
                    scrollbar-width: thin;
                    scrollbar-color: #535353 transparent;
                }
                .dynamic-playlist-modal .job-list-container::-webkit-scrollbar { width: 8px; }
                .dynamic-playlist-modal .job-list-container::-webkit-scrollbar-track { background: transparent; }
                .dynamic-playlist-modal .job-list-container::-webkit-scrollbar-thumb { background-color: #535353; border-radius: 4px; }
                .dynamic-playlist-modal .job-list { 
                    display: flex; 
                    flex-direction: column; 
                    gap: 10px; 
                }
                .dynamic-playlist-modal .job-item { 
                    display: flex; 
                    align-items: center; 
                    gap: 16px;
                    background-color: #282828; 
                    padding: 15px; 
                    border-radius: 8px; 
                    transition: background-color 0.2s; 
                }
                .dynamic-playlist-modal .job-item.deleted {
                    background-color: #431919;
                }
                .dynamic-playlist-modal .job-item.deleted:hover {
                    background-color: #5a2e2e;
                }
                .dynamic-playlist-modal .job-cover-art-container {
                    width: 70px;
                    height: 70px;
                    border-radius: 4px;
                    flex-shrink: 0;
                    background-color: #353535;
                    color: #b3b3b3;
                    background-image: ${PLACEHOLDER_SVG_DATA_URI};
                    background-size: 45%;
                    background-position: center;
                    background-repeat: no-repeat;
                }
                .dynamic-playlist-modal .job-cover-art-container img {
                    width: 100%;
                    height: 100%;
                    border-radius: 4px;
                    object-fit: cover;
                }
                .dynamic-playlist-modal .job-item:hover { 
                    background-color: #383838; 
                }
                .dynamic-playlist-modal .job-details { 
                    flex-grow: 1; 
                    display: flex; 
                    flex-direction: column; 
                    gap: 4px; 
                    overflow: hidden; 
                }
                .dynamic-playlist-modal .job-source-name { 
                    color: white; 
                    font-weight: 500; 
                    font-size: 1rem; 
                    white-space: nowrap; 
                    overflow: hidden; 
                    text-overflow: ellipsis; 
                    max-width: 350px; 
                }
                .dynamic-playlist-modal .job-info, .job-last-run { 
                    color: #b3b3b3; 
                    font-size: 0.875rem; 
                }
                .dynamic-playlist-modal .job-status-line {
                    display: flex;
                    align-items: center;
                }
                .dynamic-playlist-modal .job-deleted-status {
                    color: #ff8a8a;
                    font-weight: 500;
                    font-size: 0.875rem;
                    margin-left: 3px;
                }
                .dynamic-playlist-modal .job-actions {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    align-items: center;
                    justify-content: center;
                }
                .dynamic-playlist-modal .job-action-btn {
                    background: none;
                    border: none;
                    color: #b3b3b3;
                    cursor: pointer;
                    padding: 4px;
                    line-height: 1;
                    border-radius: 50%;
                    transition: background-color 0.2s, color 0.2s;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .dynamic-playlist-modal .job-action-btn:hover {
                    background-color: rgba(255,255,255,0.1);
                    color: white;
                }
                .dynamic-playlist-modal .job-action-btn:disabled {
                    opacity: 0.5;
                    color: #666;
                }
                .dynamic-playlist-modal .job-action-btn:disabled:hover {
                    background-color: transparent;
                    color: #666;
                }
                .dynamic-playlist-modal .job-run-btn {
                    font-size: 12px;
                }
                .dynamic-playlist-modal .no-jobs-message { 
                    color: #b3b3b3; 
                    text-align: center; 
                    padding: 20px; 
                }
                .dynamic-playlist-modal .main-trackCreditsModal-closeBtn { 
                    background: transparent; 
                    border: 0; 
                    padding: 0; 
                    color: #b3b3b3; 
                    cursor: pointer; 
                    transition: color 0.2s ease; 
                }
                .dynamic-playlist-modal .main-trackCreditsModal-closeBtn:hover { 
                    color: #ffffff; 
                }
                .dynamic-playlist-modal .main-button-primary {
                    background-color: #1ED760;
                    color: black;
                    padding: 8px 18px;
                    border-radius: 20px;
                    font-weight: 550;
                    font-size: 13px;
                    text-transform: uppercase;
                    border: none;
                    cursor: pointer;
                    transition: background-color 0.1s ease;
                }
                .dynamic-playlist-modal .main-button-primary:hover {
                    background-color: #3BE377;
                }
            </style>
            <div class="dynamic-playlist-modal">
                <div class="main-trackCreditsModal-header" style="border-bottom: 1px solid #282828; display: flex; justify-content: space-between; align-items: center;">
                    <h1 class="main-trackCreditsModal-title" style="font-size: 24px; font-weight: 700; color: white;">Dynamic Playlists (beta)</h1>
                    <button id="closeDynamicPlaylistModal" aria-label="Close" class="main-trackCreditsModal-closeBtn">
                        <svg width="18" height="18" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M31.098 29.794L16.955 15.65 31.097 1.51 29.683.093 15.54 14.237 1.4.094-.016 1.508 14.126 15.65-.016 29.795l1.414 1.414L15.54 17.065l14.144 14.143" fill="currentColor" fill-rule="evenodd"></path></svg>
                    </button>
                </div>
                <div class="main-trackCreditsModal-mainSection">
                    <div class="job-list-header">
                        <button id="create-new-job-btn" class="main-buttons-button main-button-primary">Create New</button>
                    </div>
                    <div class="job-list-container">
                        <div class="job-list">${jobsHtml}</div>
                    </div>
                </div>
            </div>
        `;

        const imageElements = modalContainer.querySelectorAll('.job-cover-art-container img');
        imageElements.forEach(img => {
            const showImage = () => {
                img.style.visibility = 'visible';
            };

            if (img.complete) {
                showImage();
            } else {
                img.addEventListener('load', showImage);
            }
        });

        modalContainer.querySelector('#closeDynamicPlaylistModal').addEventListener('click', closeModal);
        modalContainer.querySelector('#create-new-job-btn').addEventListener('click', () => renderJobForm());
        
        modalContainer.querySelectorAll('.job-run-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const jobId = e.currentTarget.dataset.jobId;
                const job = jobs.find(j => j.id === jobId);
                if (!job) return;
        
                runningJobIds.add(job.id);
                closeModal();
        
                Spicetify.showNotification(`Running job for "${job.targetPlaylistName}"...`);
        
                try {
                    const updatedJob = await runJob(job);
                    updateJob(updatedJob);
                    Spicetify.showNotification(`Dynamic playlist "${job.targetPlaylistName}" was updated.`);
                } catch (error) {
                    showDetailedError(error, `Failed to manually run dynamic playlist job for "${job.targetPlaylistName}"`);
                } finally {
                    runningJobIds.delete(job.id);
                }
            });
        });

        modalContainer.querySelectorAll('.job-edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const jobId = e.currentTarget.dataset.jobId;
                const jobToEdit = jobs.find(j => j.id === jobId);
                if (jobToEdit) {
                    renderJobForm(jobToEdit);
                }
            });
        });

        modalContainer.querySelectorAll('.job-delete-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const jobId = e.currentTarget.dataset.jobId;
                const job = jobs.find(j => j.id === jobId);
                if (!job) return;

                const confirmed = await showConfirmationModal({
                    title: "Delete Dynamic Playlist?",
                    description: `This will stop future updates for "${job.targetPlaylistName || job.sourceName}" but will NOT delete the created playlist. Are you sure?`,
                    confirmText: "Delete",
                    cancelText: "Cancel",
                });

                if (confirmed === 'confirm') {
                    deleteJob(jobId);
                    renderJobList();
                }
            });
        });

        (async () => {
            const rootlist = await Spicetify.Platform.RootlistAPI.getContents();
            
            function getAllPlaylistUris(items) {
                let uris = [];
                for (const item of items) {
                    if (item.type === 'playlist') {
                        uris.push(item.uri);
                    } else if (item.type === 'folder' && Array.isArray(item.items)) {
                        uris.push(...getAllPlaylistUris(item.items));
                    }
                }
                return uris;
            }
        
            const allPlaylistUris = getAllPlaylistUris(rootlist.items);
            const userPlaylistUris = new Set(allPlaylistUris);

            let jobsWereUpdated = false;
            const mutableJobs = JSON.parse(JSON.stringify(jobs)); 

            const updatePromises = mutableJobs.map(async (job) => {
                if (!job.targetPlaylistUri) return;

                const jobItemElement = modalContainer.querySelector(`.job-item[data-job-id="${job.id}"]`);

                if (!userPlaylistUris.has(job.targetPlaylistUri)) {
                    if (!job.isDeleted) {
                        job.isDeleted = true;
                        jobsWereUpdated = true;
                    }
                    if (jobItemElement && !jobItemElement.classList.contains('deleted')) {
                        jobItemElement.classList.add('deleted');
                        const deletedStatusElement = jobItemElement.querySelector('.job-deleted-status');
                        if (deletedStatusElement) {
                            deletedStatusElement.textContent = '• Playlist not in library';
                        }
                    }
                    return;
                }

                try {
                    const playlistId = job.targetPlaylistUri.split(':')[2];
                    const playlistData = await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/playlists/${playlistId}`);
                    
                    if (job.isDeleted) {
                        job.isDeleted = false;
                        jobsWereUpdated = true;
                        if (jobItemElement) {
                            jobItemElement.classList.remove('deleted');
                            const deletedStatusElement = jobItemElement.querySelector('.job-deleted-status');
                            if (deletedStatusElement) {
                                deletedStatusElement.textContent = '';
                            }
                            const lastRunElement = jobItemElement.querySelector('.job-last-run');
                            if (lastRunElement) {
                                lastRunElement.textContent = `Last run: ${formatTimeAgo(job.lastRun)}`;
                            }
                        }
                    }

                    const currentCoverUrl = playlistData.images?.length ? (playlistData.images[playlistData.images.length - 1] || playlistData.images[0]).url : null;
                    if (currentCoverUrl && (!job.coverUrl || currentCoverUrl !== job.coverUrl)) {
                        job.coverUrl = currentCoverUrl;
                        jobsWereUpdated = true;
                        const imgElement = jobItemElement.querySelector('.job-cover-art-container img');
                        if (imgElement) {
                            imgElement.style.visibility = 'hidden'; 
                            imgElement.src = currentCoverUrl;
                        }
                    }

                    const currentName = playlistData.name;
                    if (currentName && currentName !== job.targetPlaylistName) {
                        job.targetPlaylistName = currentName;
                        jobsWereUpdated = true;
                        const nameElement = jobItemElement.querySelector('.job-source-name');
                        if (nameElement) {
                            nameElement.textContent = currentName;
                            nameElement.title = currentName;
                        }
                    }
                } catch (error) {
                    console.warn(`[Sort-Play Dynamic] Could not verify details for "${job.sourceName}".`, error);
                }
            });

            await Promise.all(updatePromises);

            if (jobsWereUpdated) {
                saveJobs(mutableJobs);
                renderJobList();
            }
        })();
    };

    const renderJobForm = async (jobToEdit = null) => {
        if (!userLibraryPromise) {
            userLibraryPromise = fetchUserLibrary();
        }
        
        const isEditing = !!jobToEdit;
        let jobFilters = isEditing ? (jobToEdit.filters || {}) : {};
        let sources = isEditing ? [...jobToEdit.sources] : [];

        let currentDeduplicate = isEditing ? jobToEdit.deduplicate : playlistDeduplicate;
        let currentUpdateFromSource = isEditing ? jobToEdit.updateFromSource : (localStorage.getItem(STORAGE_KEY_DYNAMIC_UPDATE_SOURCE) === null ? true : localStorage.getItem(STORAGE_KEY_DYNAMIC_UPDATE_SOURCE) === 'true');
        
        if (!isEditing && sources.length === 0) {
            let sourceUri = getCurrentUri();
            if (sourceUri) {
                try {
                    let sourceName, sourceInfo, sourceCoverUrl, isStaticSource = false, totalTracks = 'N/A';
                    if (URI.isPlaylistV1OrV2(sourceUri)) {
                        const data = await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/playlists/${sourceUri.split(":")[2]}`);
                        sourceName = data.name; sourceInfo = `Playlist by ${data.owner.display_name}`; sourceCoverUrl = data.images[0]?.url; totalTracks = data.tracks.total;
                    } else if (URI.isArtist(sourceUri)) {
                        const data = await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/artists/${sourceUri.split(":")[2]}`);
                        sourceName = data.name; sourceInfo = `Artist Page`; sourceCoverUrl = data.images[0]?.url; isStaticSource = true; totalTracks = 'N/A';
                    } else if (isLikedSongsPage(sourceUri)) {
                        sourceName = "Liked Songs"; sourceInfo = "Your collection"; sourceCoverUrl = 'https://misc.scdn.co/liked-songs/liked-songs-640.png';
                        const likedSongs = await getLikedSongs();
                        totalTracks = likedSongs.length;
                    } else if (URI.isAlbum(sourceUri)) {
                        const data = await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/albums/${sourceUri.split(":")[2]}`);
                        sourceName = data.name; sourceInfo = `Album by ${data.artists.map(a => a.name).join(', ')}`; sourceCoverUrl = data.images[0]?.url; isStaticSource = true; totalTracks = data.tracks.total;
                    }
                    sources.push({ uri: sourceUri, name: sourceName, info: sourceInfo, coverUrl: sourceCoverUrl, isStatic: isStaticSource, totalTracks: totalTracks });
                } catch (e) { console.error("Could not fetch source details", e); }
            }
        }

        const savedSortType = localStorage.getItem(STORAGE_KEY_DYNAMIC_SORT_TYPE) || 'playCount';
        const savedSchedule = localStorage.getItem(STORAGE_KEY_DYNAMIC_SCHEDULE) || '86400000';

        const sortByParent = buttonStyles.menuItems.find(i => i.sortType === 'sortByParent');
        const shuffleItem = buttonStyles.menuItems.find(i => i.sortType === 'shuffle');
        
        const sortChildren = [...sortByParent.children];
        const releaseDateIndex = sortChildren.findIndex(item => item.sortType === 'releaseDate');
        
        if (releaseDateIndex !== -1) {
            sortChildren.splice(releaseDateIndex + 1, 0, shuffleItem);
        } else {
            sortChildren.push(shuffleItem);
        }

        const sortOptions = sortChildren.flatMap(opt => {
            if (opt.type === 'parent' && opt.children) {
                return opt.children.map(childOpt => 
                    `<option value="${childOpt.sortType}" ${ (isEditing ? jobToEdit.sortType : savedSortType) === childOpt.sortType ? 'selected' : ''}>${childOpt.text}</option>`
                );
            } else if (opt.sortType) {
                return [`<option value="${opt.sortType}" ${ (isEditing ? jobToEdit.sortType : savedSortType) === opt.sortType ? 'selected' : ''}>${opt.text}</option>`];
            }
            return [];
        }).join('');

        const customSchedules = getCustomSchedules();
        const customScheduleOptions = customSchedules.map(s => `<option value="${s.value}" ${ (isEditing ? String(jobToEdit.schedule) : savedSchedule) === String(s.value) ? 'selected' : ''}>${s.text}</option>`).join('');
        
        let clearAndSeparatorHtml = '';
        if (customSchedules.length > 0) {
            clearAndSeparatorHtml = `
                <option value="clear-custom" style="color: #f15e6c; font-style: italic;">Clear Custom Schedules...</option>
            `;
        }
        modalContainer.innerHTML = `
            <style>
                .job-form-modal .main-trackCreditsModal-mainSection { 
                    padding: 24px 32px 38px !important; display: flex; flex-direction: column; scrollbar-width: none;
                }
                .job-form-layout-container {
                    display: flex;
                    gap: 16px;
                }
                .job-form-left-column {
                    flex: 1;
                    min-width: 0;
                }
                .job-form-right-column {
                    flex: 1;
                    min-width: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }
              .job-form-modal .card { background-color: #282828; border-radius: 8px; padding: 16px; }
              .job-form-modal .card-title { font-weight: 700; color: white; margin-bottom: 12px; font-size: 1rem; }
              .job-form-modal #source-list-container { display: flex; flex-direction: column; gap: 8px; max-height: 335px; overflow-y: auto; padding-right: 5px; margin-right: -4px;scrollbar-width: thin; overflow-y: scroll;}
              .job-form-modal .source-item { display: flex; align-items: center; gap: 8px; background-color: #3e3e3e; padding: 8px; border-radius: 6px; }
              .job-form-modal .source-cover-art-small { width: 40px; height: 40px; border-radius: 4px; object-fit: cover; flex-shrink: 0; }
              .job-form-modal .source-text-info { flex-grow: 1; display: flex; flex-direction: column; overflow: hidden; }
              .job-form-modal .source-name { color: white; font-weight: 500; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
              .job-form-modal .source-info { color: #b3b3b3; font-size: 12px; margin-top: 2px; }
              .job-form-modal .source-item-actions { display: flex; align-items: center; gap: 4px; }
              .job-form-modal .remove-source-btn, .job-form-modal .edit-source-btn { 
                  background: none; border: none; color: #b3b3b3; cursor: pointer; 
                  padding: 4px; line-height: 1; border-radius: 50%; 
                  height: 26px; width: 26px; display: flex; align-items: center; justify-content: center;
              }
              .job-form-modal .remove-source-btn { font-size: 20px; }
              .job-form-modal .remove-source-btn:hover, .job-form-modal .edit-source-btn:hover { 
                  color: white; background-color: rgba(255,255,255,0.1); 
              }
              .job-form-modal .source-actions-container { display: flex; gap: 8px; margin-top: 12px; }
              .job-form-modal .source-actions-container button {
                  width: auto;
                  margin-top: 0;
                  background-color: rgba(255,255,255,0.1);
                  border: none;
                  color: white;
                  border-radius: 34px;
                  height: 25px;
                  border: 1px solid #666;
              }
              .job-form-modal .source-actions-container button:hover {
                  background-color: rgba(255,255,255,0.2);
                  cursor: pointer;
                  transition: background-color 0.05s ease;
              }
              .job-form-modal #add-source-btn { flex-grow: 1; }
              .job-form-modal #clear-sources-btn { flex-grow: 0; padding: 0 20px; }
              .job-form-modal .form-select {
                  width: 220px; background: #282828; color: white; border: 1px solid #666;
                  border-radius: 15px; padding: 8px 12px; padding-right: 32px; font-size: 13px; cursor: pointer;
                  -webkit-appearance: none; -moz-appearance: none; appearance: none;
                  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
                  background-repeat: no-repeat; background-position: right 12px center; background-size: 16px;
              }
              .job-form-modal .setting-row { display: flex; justify-content: space-between; align-items: center; }
              .job-form-modal .card .setting-row + .setting-row { margin-top: 12px; }
              .job-form-modal .setting-row .description { color: #c1c1c1; font-size: 1rem; }
              .job-form-modal .setting-row.disabled { opacity: 0.5; pointer-events: none; }
              .job-form-modal .switch { position: relative; display: inline-block; width: 40px; height: 24px; flex-shrink: 0; }
              .job-form-modal .switch input { opacity: 0; width: 0; height: 0; }
              .job-form-modal .sliderx { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #484848; border-radius: 24px; transition: .2s; }
              .job-form-modal .sliderx:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; border-radius: 50%; transition: .2s; }
              .job-form-modal input:checked + .sliderx { background-color: #1DB954; }
              .job-form-modal input:checked + .sliderx:before { transform: translateX(16px); }
              .job-form-modal .form-actions { display: flex; justify-content: flex-end; gap: 10px; }
              .job-form-modal .main-button-secondary { background-color: #333333; color: white; transition: background-color 0.1s ease;}
              .job-form-modal .main-button-secondary:hover { background-color: #444444; }
              .job-form-modal .main-button-primary { background-color: #1ED760; color: black; transition: background-color 0.1s ease;}
              .job-form-modal .main-button-primary:hover { background-color: #3BE377; }
              .job-form-modal #playlist-name-input:focus { border: 1px solid #666 !important; }
              .custom-schedule-container { display: none; align-items: center; gap: 8px; margin-top: 16px; padding: 10px; background-color: #3e3e3e; border-radius: 8px; }
              .custom-schedule-container.visible { display: flex; }
              .custom-schedule-container input[type="number"] { width: 60px; padding: 6px; border-radius: 4px; border: 1px solid #666; background-color: #282828; color: white; text-align: center; }
              .custom-schedule-container label { font-size: 12px; color: #b3b3b3; }
              .custom-schedule-ok-btn { padding: 6px 12px; border-radius: 15px; border: none; background-color: #1ed760; color: black; font-weight: bold; cursor: pointer; }
              .tooltip-container { position: relative; display: inline-block; vertical-align: middle; }
              .custom-tooltip {
                  visibility: hidden; position: absolute; z-index: 2005; background-color: #373737;
                  color: white; padding: 8px 12px; border-radius: 4px; font-size: 14px;
                  max-width: 280px; width: max-content; bottom: 100%; left: 50%;
                  transform: translateX(-50%); margin-bottom: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                  line-height: 1.4; word-wrap: break-word; text-align: left;
              }
              .custom-tooltip::after {
                  content: ""; position: absolute; top: 100%; left: 50%; margin-left: -5px;
                  border-width: 5px; border-style: solid; border-color: #373737 transparent transparent transparent;
              }
              .tooltip-container:hover .custom-tooltip { visibility: visible; }
              .job-form-modal #source-error-message {
                  color: #f15e6c;
                  font-size: 13px;
                  text-align: center;
                  margin-top: 8px;
                  margin-bottom: 4px;
              }
              #configure-filters-btn {
                  background-color: #282828;
              }
              #configure-filters-btn:hover {
                  background-color: #3e3e3e;
                  border-color: #878787;
              }
          </style>
            <div class="job-form-modal">
                <div class="main-trackCreditsModal-header" style="border-bottom: 1px solid #282828; display: flex; justify-content: space-between; align-items: center;">
                    <h1 class="main-trackCreditsModal-title" style="font-size: 24px; font-weight: 700; color: white;">${isEditing ? 'Edit' : 'New'} Dynamic Playlist</h1>
                    <button id="closeDynamicPlaylistModal" aria-label="Close" class="main-trackCreditsModal-closeBtn">
                        <svg width="18" height="18" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M31.098 29.794L16.955 15.65 31.097 1.51 29.683.093 15.54 14.237 1.4.094-.016 1.508 14.126 15.65-.016 29.795l1.414 1.414L15.54 17.065l14.144 14.143" fill="currentColor" fill-rule="evenodd"></path></svg>
                    </button>
                </div>
                <div class="main-trackCreditsModal-mainSection">
                    <div class="job-form-layout-container">
                        <div class="job-form-left-column">
                            <div class="card">
                                <div class="card-title">Sources</div>
                                <div id="source-list-container"></div>
                                <div id="source-error-message" style="display: none;"></div>
                                <div class="source-actions-container">
                                    <button id="add-source-btn" class="main-buttons-button main-button-secondary">+ Add Source</button>
                                    <button id="clear-sources-btn" class="main-buttons-button main-button-secondary">Clear</button>
                                </div>
                                <div style="border-top: 1px solid #3e3e3e; margin: 20px 0 4px;"></div>
                                <div class="setting-row" style="margin-top: 15px;">
                                    <span class="description">
                                        Limit tracks per source
                                        <span class="tooltip-container">
                                            <span style="color: #888; margin-left: 4px; font-size: 12px; cursor: help;">?</span>
                                            <span class="custom-tooltip">Set a limit of random tracks to pull from each source, ensuring fresh content on every update.</span>
                                        </span>
                                    </span>
                                    <label class="switch"><input type="checkbox" id="limit-tracks-toggle" ${isEditing && jobToEdit.limitEnabled ? 'checked' : ''}><span class="sliderx"></span></label>
                                </div>
                                <div style="margin-top: 16px;">
                                    <label for="playlist-name-input" style="display: block; color: #b3b3b3; font-size: 0.875rem; margin-bottom: 8px;">New Playlist Name</label>
                                    <input type="text" id="playlist-name-input" value="" style="width: 100%; background-color: #3e3e3e; border: 1px solid #3e3e3e; border-radius: 4px; padding: 8px 12px; color: white; box-sizing: border-box;">
                                </div>
                            </div>
                        </div>
                        <div class="job-form-right-column">
                        <div class="card">
                            <div class="card-title">Configuration</div>
                            <div class="setting-row">
                                <span class="description">Update Behavior</span>
                                <select id="update-mode-select" class="form-select">
                                    <option value="replace">Replace All Tracks</option>
                                    <option value="merge">Add New Tracks & Re-sort All</option>
                                    <option value="append">Add New Tracks to Top</option>
                                </select>
                            </div>
                            <div class="setting-row" id="sort-type-row">
                                <span class="description">Sort Method</span>
                                <select id="sort-type-select" class="form-select">${sortOptions}</select>
                            </div>
                            <div class="setting-row" style="align-items: start;">
                                <span class="description" style="padding-top: 8px;">Update Schedule</span>
                                <div style="display: flex; flex-direction: column; align-items: flex-end;">
                                    <select id="schedule-select" class="form-select">
                                        <option value="manual" ${ (isEditing ? jobToEdit.schedule : savedSchedule) === 'manual' ? 'selected' : ''}>Manual Only</option>
                                        <option value="10800000" ${ (isEditing ? String(jobToEdit.schedule) : savedSchedule) === '10800000' ? 'selected' : ''}>Every 3 Hours</option>
                                        <option value="21600000" ${ (isEditing ? String(jobToEdit.schedule) : savedSchedule) === '21600000' ? 'selected' : ''}>Every 6 Hours</option>
                                        <option value="43200000" ${ (isEditing ? String(jobToEdit.schedule) : savedSchedule) === '43200000' ? 'selected' : ''}>Every 12 Hours</option>
                                        <option value="86400000" ${ (isEditing ? String(jobToEdit.schedule) : savedSchedule) === '86400000' ? 'selected' : ''}>Daily</option>
                                        <option value="172800000" ${ (isEditing ? String(jobToEdit.schedule) : savedSchedule) === '172800000' ? 'selected' : ''}>Every 2d</option>
                                        <option value="604800000" ${ (isEditing ? String(jobToEdit.schedule) : savedSchedule) === '604800000' ? 'selected' : ''}>Weekly</option>
                                        <option value="2592000000" ${ (isEditing ? String(jobToEdit.schedule) : savedSchedule) === '2592000000' ? 'selected' : ''}>Monthly</option>
                                        <option disabled>- Release Day Schedules -</option>
                                        <option value="release-weekly" ${ (isEditing ? jobToEdit.schedule : savedSchedule) === 'release-weekly' ? 'selected' : ''}>Weekly (on Friday)</option>
                                        <option value="release-every-two-weeks" ${ (isEditing ? jobToEdit.schedule : savedSchedule) === 'release-every-two-weeks' ? 'selected' : ''}>Every Two Weeks (on Friday)</option>
                                        <option value="release-monthly" ${ (isEditing ? jobToEdit.schedule : savedSchedule) === 'release-monthly' ? 'selected' : ''}>Monthly (on a Friday)</option>
                                        <option disabled>- Custom Schedules -</option>
                                        ${customScheduleOptions}
                                        <option value="custom">+ Custom</option>
                                        ${clearAndSeparatorHtml}
                                    </select>
                                    <div id="custom-schedule-container" class="custom-schedule-container">
                                        <input type="number" id="days" min="0" value="0"><label for="days">d</label>
                                        <input type="number" id="hours" min="0" max="23" value="0"><label for="hours">h</label>
                                        <input type="number" id="minutes" min="0" max="59" value="0"><label for="minutes">m</label>
                                        <button id="set-custom-schedule-btn" class="custom-schedule-ok-btn">Set</button>
                                    </div>
                                    <div id="custom-schedule-error" style="color: #f15e6c; font-size: 12px; text-align: right; margin-top: 4px; display: none;"></div>
                                    <label id="custom-schedule-min-label" style="font-size: 12px; color: #b3b3b3; text-align: right; display: none; margin-top: 4px;">Minimum: ${SCHEDULER_INTERVAL_MINUTES} minutes</label>
                                </div>
                            </div>
                        </div>
                        <div class="card">
                            <div class="card-title">Track Filtering</div>
                            <div class="setting-row">
                                <span class="description">
                                    Apply filters to source tracks
                                    <span class="tooltip-container">
                                        <span style="color: #888; margin-left: 4px; font-size: 12px; cursor: help;">?</span>
                                        <span class="custom-tooltip">Configure advanced filters for tracks from your sources.</span>
                                    </span>
                                </span>
                                <button id="configure-filters-btn" class="main-buttons-button main-button-secondary" style="padding: 6px 25px; border-radius: 20px; border: 1px solid #666; cursor: pointer; color: white; font-weight: 500; font-size: 12px; transition: background-color 0.1s ease, border-color 0.1s ease;">Configure</button>
                            </div>
                        </div>
                            <div class="card">
                                <div class="card-title">Settings</div>
                                    <div class="setting-row">
                                    <span class="description">Deduplicate tracks</span>
                                    <label class="switch"><input type="checkbox" id="deduplicate-toggle" ${currentDeduplicate ? 'checked' : ''}><span class="sliderx"></span></label>
                                </div>
                                <div class="setting-row" id="update-source-row">
                                    <span class="description">
                                        Always update from original source
                                        <span class="tooltip-container">
                                            <span style="color: #888; margin-left: 4px; font-size: 12px; cursor: help;">?</span>
                                            <span class="custom-tooltip">Enabled: Fetches fresh tracks from the source(s) for each update.<br><br>Disabled: Only re-sorts the tracks already inside this dynamic playlist.</span>
                                        </span>
                                    </span>
                                    <label class="switch"><input type="checkbox" id="update-source-toggle" ${currentUpdateFromSource ? 'checked' : ''}><span class="sliderx"></span></label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="main-trackCreditsModal-originalCredits" style="padding: 24px 32px !important; border-top: 1px solid #282828;">
                    <div class="form-actions">
                        <button id="cancel-job-btn" class="main-buttons-button main-button-secondary" style="padding: 8px 18px; border-radius: 20px; font-weight: 550; font-size: 13px; text-transform: uppercase; cursor: pointer; border: none;">Cancel</button>
                        <button id="save-job-btn" class="main-buttons-button main-button-primary" style="padding: 8px 18px; border-radius: 20px; font-weight: 550; font-size: 13px; text-transform: uppercase; cursor: pointer; border: none;">${isEditing ? 'Save Changes' : 'Save & Create'}</button>
                    </div>
                </div>
            </div>
        `;
        
        const playlistNameInput = modalContainer.querySelector('#playlist-name-input');
        const updateModeSelect = modalContainer.querySelector('#update-mode-select');
        const sortTypeRow = modalContainer.querySelector('#sort-type-row');
        const sortTypeSelectUI = modalContainer.querySelector('#sort-type-select');
        const updateSourceRow = modalContainer.querySelector('#update-source-row');
        const updateSourceToggle = modalContainer.querySelector('#update-source-toggle');
        const deduplicateToggle = modalContainer.querySelector('#deduplicate-toggle');
        const limitTracksToggle = modalContainer.querySelector('#limit-tracks-toggle');
        const sourceListContainer = modalContainer.querySelector('#source-list-container');
        const configureFiltersBtn = modalContainer.querySelector('#configure-filters-btn');
        
        if (configureFiltersBtn) {
            configureFiltersBtn.addEventListener('click', async () => {
                const newFilters = await showDynamicFilterModal(jobFilters);
                if (newFilters) {
                    jobFilters = newFilters;
                }
            });
        }

        deduplicateToggle.addEventListener('change', (e) => {
            currentDeduplicate = e.target.checked;
        });
        updateSourceToggle.addEventListener('change', (e) => {
            currentUpdateFromSource = e.target.checked;
        });

        const updateFormState = () => {
            if (!isEditing) {
                if (sources.length === 0) {
                    playlistNameInput.value = "Dynamic Playlist";
                } else if (sources.length === 1) {
                    playlistNameInput.value = `${sources[0].name} (Dynamic)`;
                } else {
                    playlistNameInput.value = "Combined Dynamic Playlist";
                }
            } else {
                playlistNameInput.value = jobToEdit.targetPlaylistName;
            }
        
            updateSourceRow.classList.toggle('disabled', false);
            updateSourceToggle.checked = currentUpdateFromSource;
        };

        if (isEditing) {
            updateModeSelect.value = jobToEdit.updateMode || 'replace';
        }

        const handleUpdateModeChange = () => {
            if (updateModeSelect.value === 'append') {
                sortTypeRow.classList.add('disabled');
                sortTypeSelectUI.disabled = true;
            } else {
                sortTypeRow.classList.remove('disabled');
                sortTypeSelectUI.disabled = false;
            }
    
            if (updateModeSelect.value === 'replace') {
                updateSourceRow.classList.remove('disabled');
                updateSourceToggle.disabled = false;
                updateSourceToggle.checked = currentUpdateFromSource; 
            } else {
                updateSourceRow.classList.add('disabled');
                updateSourceToggle.disabled = true;
                updateSourceToggle.checked = true;
            }
        };

        updateModeSelect.addEventListener('change', handleUpdateModeChange);
        handleUpdateModeChange();
        
        const renderSources = () => {
            const container = modalContainer.querySelector('#source-list-container');
            const sourceErrorEl = modalContainer.querySelector('#source-error-message');

            if (sourceErrorEl && sources.length > 0) {
                sourceErrorEl.style.display = 'none';
            }

            if (!container) return;
            container.innerHTML = sources.map((source, index) => `
                <div class="source-item" data-uri="${source.uri}">
                    <img src="${source.coverUrl || 'https://i.imgur.com/33q4t4k.png'}" class="source-cover-art-small">
                    <div class="source-text-info">
                        <div class="source-name" title="${source.name}">${source.name}</div>
                        <div class="source-info">${source.info} • ${source.totalTracks ?? 'N/A'} tracks</div>
                        <div class="source-limit-wrapper" style="display: none; margin-top: 4px; align-items: center; gap: 8px;">
                            <label style="font-size: 12px; color: #b3b3b3;">Limit:</label>
                            <input type="number" class="source-limit-input" data-index="${index}" value="${source.limit || 10}" min="1" max="${source.totalTracks || ''}" style="width: 60px; background-color: #3e3e3e; border: 1px solid #666; border-radius: 4px; color: white; padding: 2px 6px;">
                        </div>
                    </div>
                    <div class="source-item-actions">
                        <button class="edit-source-btn" data-index="${index}" title="Change source">${penIconSvg}</button>
                        <button class="remove-source-btn" data-index="${index}" title="Remove source">&times;</button>
                    </div>
                </div>
            `).join('');

            container.querySelectorAll('.edit-source-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const indexToChange = parseInt(e.currentTarget.dataset.index, 10);
                    showChangeSourceModal(
                        "Change Source",
                        userLibraryPromise,
                        (newSourcesData) => {
                            const existingUris = sources
                                .filter((_, i) => i !== indexToChange)
                                .map(s => s.uri);

                            const uniqueNewSources = newSourcesData.filter(newSource => !existingUris.includes(newSource.uri));

                            if (uniqueNewSources.length < newSourcesData.length) {
                                Spicetify.showNotification("Some selected sources were already in the list and have been ignored.");
                            }

                            if (uniqueNewSources.length > 0) {
                                sources.splice(indexToChange, 1, ...uniqueNewSources);
                            } else {
                                sources.splice(indexToChange, 1);
                            }
                            renderSources();
                        },
                        true 
                    );
                });
            });

            container.querySelectorAll('.remove-source-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const indexToRemove = parseInt(e.currentTarget.dataset.index, 10);
                    sources.splice(indexToRemove, 1);
                    renderSources();
                    updateFormState();
                });
            });
            updateFormState();
        };

        renderSources();

        const toggleLimitInputs = (show) => {
            const wrappers = modalContainer.querySelectorAll('.source-limit-wrapper');
            wrappers.forEach(wrapper => {
                wrapper.style.display = show ? 'flex' : 'none';
            });
        };

        if (limitTracksToggle.checked) {
            toggleLimitInputs(true);
        }

        limitTracksToggle.addEventListener('change', (e) => {
            toggleLimitInputs(e.target.checked);
        });

        sourceListContainer.addEventListener('change', (e) => {
            if (e.target.classList.contains('source-limit-input')) {
                const index = parseInt(e.target.dataset.index, 10);
                let value = parseInt(e.target.value, 10);
                const max = parseInt(e.target.max, 10);

                if (!isNaN(max) && value > max) {
                    value = max;
                    e.target.value = max;
                }

                if (sources[index] && value > 0) {
                    sources[index].limit = value;
                }
            }
        });

        modalContainer.querySelector('#clear-sources-btn').addEventListener('click', () => {
            sources.length = 0;
            renderSources();
            toggleLimitInputs(limitTracksToggle.checked);
            updateFormState();
        });

        modalContainer.querySelector('#add-source-btn').addEventListener('click', () => {
            showChangeSourceModal(
                "Add Source",
                userLibraryPromise,
                (newSourcesData) => {
                    newSourcesData.forEach(newSource => {
                        if (!sources.some(s => s.uri === newSource.uri)) {
                            sources.push(newSource);
                        } else {
                            Spicetify.showNotification(`Source "${newSource.name}" is already in the list.`);
                        }
                    });
                    renderSources();
                    toggleLimitInputs(limitTracksToggle.checked);
                },
                true
            );
        });

        const scheduleSelect = modalContainer.querySelector('#schedule-select');
        const customScheduleContainer = modalContainer.querySelector('#custom-schedule-container');
        
        modalContainer.querySelector('#sort-type-select').addEventListener('change', (e) => localStorage.setItem(STORAGE_KEY_DYNAMIC_SORT_TYPE, e.target.value));
        scheduleSelect.addEventListener('change', (e) => localStorage.setItem(STORAGE_KEY_DYNAMIC_SCHEDULE, e.target.value));
        
        let previousScheduleValue = scheduleSelect.value;
        
        const minLabel = modalContainer.querySelector('#custom-schedule-min-label');

        scheduleSelect.addEventListener('change', async (e) => {
            const selectedValue = e.target.value;

            if (selectedValue === 'clear-custom') {
                e.target.value = previousScheduleValue;

                const customSchedules = getCustomSchedules();
                if (customSchedules.length === 0) {
                    Spicetify.showNotification("No custom schedules to clear.");
                    return;
                }

                const confirmed = await showConfirmationModal({
                    title: "Clear Custom Schedules?",
                    description: "This will permanently remove all of your saved custom schedules. This action cannot be undone. Are you sure?",
                    confirmText: "Clear All",
                    cancelText: "Cancel",
                });

                if (confirmed === 'confirm') {
                    saveCustomSchedules([]);
                    Spicetify.showNotification("All custom schedules have been cleared.");
                    await renderJobForm(jobToEdit);
                }
            } else {
                const isCustom = selectedValue === 'custom';
                customScheduleContainer.classList.toggle('visible', isCustom);
                minLabel.style.display = isCustom ? 'block' : 'none';
                if (!isCustom) {
                    previousScheduleValue = selectedValue;
                    localStorage.setItem(STORAGE_KEY_DYNAMIC_SCHEDULE, selectedValue);
                }
            }
        });

        scheduleSelect.addEventListener('change', () => {
            customScheduleContainer.classList.toggle('visible', scheduleSelect.value === 'custom');
        });

        modalContainer.querySelector('#set-custom-schedule-btn').addEventListener('click', () => {
            const errorDiv = modalContainer.querySelector('#custom-schedule-error');
            errorDiv.style.display = 'none';

            const days = parseInt(modalContainer.querySelector('#days').value) || 0;
            const hours = parseInt(modalContainer.querySelector('#hours').value) || 0;
            const minutes = parseInt(modalContainer.querySelector('#minutes').value) || 0;
            
            const totalMs = (days * 86400000) + (hours * 3600000) + (minutes * 60000);
            const minMs = SCHEDULER_INTERVAL_MINUTES * 60 * 1000;

            if (totalMs < minMs) {
                errorDiv.textContent = `Schedule must be at least ${SCHEDULER_INTERVAL_MINUTES} minutes.`;
                errorDiv.style.display = 'block';
                return;
            }

            let text = 'Every ';
            if (days > 0) text += `${days}d `;
            if (hours > 0) text += `${hours}h `;
            if (minutes > 0) text += `${minutes}m`;
            text = text.trim();

            const customSchedules = getCustomSchedules();
            if (!customSchedules.some(s => s.value === totalMs)) {
                customSchedules.push({ value: totalMs, text });
                saveCustomSchedules(customSchedules);
            }

            const customOption = document.createElement('option');
            customOption.value = totalMs;
            customOption.textContent = text;
            scheduleSelect.insertBefore(customOption, scheduleSelect.querySelector('option[value="custom"]'));
            scheduleSelect.value = totalMs;
            localStorage.setItem(STORAGE_KEY_DYNAMIC_SCHEDULE, totalMs);
            customScheduleContainer.classList.remove('visible');
            minLabel.style.display = 'none';
            renderJobForm(jobToEdit); 
        });

        modalContainer.querySelector('#closeDynamicPlaylistModal').addEventListener('click', renderJobList);
        modalContainer.querySelector('#cancel-job-btn').addEventListener('click', renderJobList);
        
        modalContainer.querySelector('#save-job-btn').addEventListener('click', (e) => {
            const sourceErrorEl = modalContainer.querySelector('#source-error-message');
            sourceErrorEl.style.display = 'none';

            if (sources.length === 0) {
                sourceErrorEl.textContent = "Please add at least one source.";
                sourceErrorEl.style.display = 'block';
                return;
            }

            const limitEnabled = document.getElementById('limit-tracks-toggle').checked;
            if (limitEnabled) {
                modalContainer.querySelectorAll('.source-limit-input').forEach(input => {
                    const index = parseInt(input.dataset.index, 10);
                    const value = parseInt(input.value, 10);
                    if (sources[index] && value > 0) {
                        sources[index].limit = value;
                    }
                });
            }

            const scheduleValue = document.getElementById('schedule-select').value;
            const jobData = {
                sources: sources,
                limitEnabled: limitEnabled,
                targetPlaylistName: document.getElementById('playlist-name-input').value.trim(),
                updateMode: document.getElementById('update-mode-select').value,
                sortType: document.getElementById('sort-type-select').value,
                deduplicate: currentDeduplicate,
                updateFromSource: currentUpdateFromSource,
                schedule: isNaN(parseInt(scheduleValue)) ? scheduleValue : parseInt(scheduleValue),
                filters: jobFilters,
            };
            
            if (isEditing) {
                const updatedJob = { ...jobToEdit, ...jobData };
                updateJob(updatedJob);
                renderJobList();
            } else {
                const newJob = {
                    ...jobData,
                    id: crypto.randomUUID(),
                    createdAt: Date.now(),
                    lastRun: null,
                };
                closeModal();
                runJob(newJob, true)
                .then(completedJob => {
                    addJob(completedJob);
                    Spicetify.showNotification(`Dynamic playlist "${completedJob.targetPlaylistName}" created successfully!`);
                })
                .catch(error => {
                    showDetailedError(error, `Error creating dynamic playlist "${newJob.targetPlaylistName}"`);
                });
            }
        });
    };
    
    renderJobList();
    document.body.appendChild(overlay);
    overlay.appendChild(modalContainer);
  }

  const GENRE_MAPPINGS = {
    "acoustic": ["acoustic", "acoustic's", "acousticmusic", "acoustics"],
    "adult standards": ["adult standards", "crooner", "easy listening", "lounge", "standards", "traditional pop"],
    "afro r&b": ["afro r&b", "afro soul", "afrofuturism", "bongo flava"],
    "afro-funk": ["afro-funk", "highlife", "nigerian hip hop"],
    "afrobeats": ["afro beats", "afrobeats", "afropop", "afroswing", "azonto", "azontobeats", "coupé-décalé", "ghanaian pop", "makossa", "nigerian pop"],
    "alternative": ["alt", "alternative", "alternative's", "alternativemusic", "alternatives"],
    "alternative metal": ["alternative metal", "funk metal", "industrial metal", "nu metal", "rap metal"],
    "alternative rock": ["alternative rock", "britpop", "modern alternative rock", "modern rock", "permanent wave"],
    "amapiano": ["afro house", "afro piano", "amapiano", "gqom", "sgija", "south african house"],
    "ambient": ["ambient", "ambient's", "ambients", "atmospheric"],
    "art pop": ["art pop", "baroque pop", "chamber pop", "experimental pop"],
    "art rock": ["art rock", "experimental rock", "rock in opposition", "zeuhl"],
    "bachata": ["bachata", "bachata dominicana"],
    "bebop": ["bebop", "bop", "post-bop"],
    "black metal": ["atmospheric black metal", "black metal", "blackgaze", "cascadian black metal", "melodic black metal", "metal noir quebecois", "pagan black metal", "raw black metal", "symphonic black metal", "viking metal"],
    "blues": ["blues", "blues'", "bluesier", "bluesiest", "bluesmusic", "bluesy", "punk blues"],
    "blues rock": ["blues rock", "british blues", "electric blues"],
    "bollywood pop": ["bollywood pop", "classic bollywood", "desi pop", "filmi", "kollywood", "modern bollywood", "mollywood", "sandalwood", "tollywood", "bollywood"],
    "bossa nova": ["bossa nova", "bossa nova cover", "bossa nova jazz", "samba-jazz"],
    "breakbeat": ["big beat", "breakbeat", "breaks", "funky breaks", "nu skool breaks"],
    "c-pop": ["c-pop", "cantopop", "chinese pop", "mandopop"],
    "chillwave": ["chillwave", "hypnagogic pop"],
    "christian hip hop": ["christian hip hop", "christian trap", "gospel rap"],
    "christian metal": ["christian death metal", "christian metal", "christian metalcore", "unblack metal"],
    "christian rock": ["christian alternative rock", "christian emo", "christian hardcore", "christian indie", "christian punk", "christian rock"],
    "city pop": ["city pop", "japanese funk", "japanese soul", "shibuya-kei"],
    "classic rock": ["album rock", "classic rock", "soft rock", "southern rock"],
    "classical": ["baroque", "baroque's", "classic", "classical", "classical music", "classical's", "classics", "orchestra", "orchestral", "orchestral music", "orchestras", "symphonic", "symphonies", "symphony"],
    "conscious hip hop": ["chillhop", "conscious hip hop", "political hip hop", "rap conscient", "underground hip hop"],
    "contemporary r&b": ["contemporary r and b", "contemporary r&b", "contemporary rhythm and blues", "contemporary rnb", "modern r&b", "modern rnb"],
    "corridos tumbados": ["corridos alternativos", "corridos belicos", "corridos tumbados", "sad sierreno", "sierreno"],
    "country": ["country", "country & western music", "country music", "country's", "countrymusic"],
    "cumbia": ["cumbia", "cumbia 420", "cumbia andina mexicana", "cumbia boliviana", "cumbia chilena", "cumbia del sureste", "cumbia lagunera", "cumbia peruana", "cumbia pop", "cumbia ranchera", "cumbia salvadorena", "cumbia santafesina", "cumbia sonidera", "cumbia uruguaya", "cumbia villera", "nu-cumbia", "tecnocumbia"],
    "dance": ["dance", "dance's", "dances", "dancey"],
    "dark wave": ["coldwave", "dark wave", "gothic", "gothic americana", "neoclassical darkwave"],
    "death metal": ["brutal death metal", "cavernous death metal", "death 'n' roll", "death metal", "deathgrind", "florida death metal", "gothenburg metal", "melodic death metal", "swedish melodeath", "technical death metal"],
    "dembow": ["dembow", "dembow dominicano"],
    "disco": ["disco", "disco music", "disco's", "discomusic", "discos", "future funk"],
    "doom metal": ["desert rock", "doom metal", "drone metal", "epic doom", "funeral doom", "heavy psych", "psychedelic doom", "sludge metal", "stoner metal", "stoner rock"],
    "dream pop": ["chillgaze", "dream pop", "ethereal wave", "nu gaze", "shoegaze"],
    "drill": ["aussie drill", "bronx drill", "brooklyn drill", "chicago drill", "classical drill", "drill", "drill chileno", "drill espanol", "drill francais", "drill tuga", "florida drill", "german drill", "melodic drill", "ny drill", "uk drill"],
    "drone": ["drone", "drone's", "dronemusic", "drones"],
    "drum and bass": ["d&b", "dnb", "drum & bass", "drum and bass", "drum n bass", "drumandbass"],
    "dubstep": ["brostep", "drumstep", "dub step", "dub-step", "dubstep", "dubstep's", "dubstepmusic"],
    "east coast hip hop": ["boom bap", "east coast hip hop", "hardcore hip hop"],
    "edm": ["edm", "edm music", "edm's", "edmmusic", "electronic dance", "electronic dance music"],
    "electro swing": ["electro swing", "swing house"],
    "electronic": ["electro", "electro's", "electronic", "electronic music", "electronic's", "electronica", "electronicas", "electronico", "electronics", "electronik"],
    "electropop": ["electro pop", "electro-pop", "electronic pop", "electropop"],
    "emo": ["emo", "emo rap", "emo trap", "emocore", "midwest emo", "pop emo"],
    "epic": ["epic", "epic music", "epic's", "epicmusic"],
    "epiccore": ["epic core", "epic-core", "epiccore"],
    "eurodance": ["bubblegum dance", "eurobeat", "eurodance", "hands up", "hi-nrg", "italo dance"],
    "experimental": ["experiment", "experimental", "experimental electronic", "experimental's", "experimentalmusic", "experiments"],
    "folk": ["folk", "folk's", "folk-pop", "folkie", "folkier", "folklore", "folkmusic", "folksy"],
    "forro": ["baiao", "forro", "forro de favela", "forro tradicional", "piseiro", "xote"],
    "french hip hop": ["french hip hop", "pop urbaine", "r&b francais", "rap francais", "rap marseille"],
    "french pop": ["chanson", "french indie pop", "french pop", "french synthpop", "nouvelle chanson francaise", "variete francaise", "yeye"],
    "funk": ["funk", "funk's", "funkier", "funkiest", "funkmusic", "funky"],
    "funk carioca": ["brega funk", "funk 150 bpm", "funk carioca", "funk mandelao", "funk mtg", "funk ostentacao", "funk paulista", "funk viral", "mega funk", "rave funk"],
    "future bass": ["future bass", "future bass's", "futurebass", "futurebassmusic"],
    "gangster rap": ["chicano rap", "crunk", "dirty south rap", "g funk", "gangster rap", "hardcore hip hop", "houston rap", "memphis hip hop", "west coast rap"],
    "garage rock": ["freakbeat", "garage psych", "garage rock", "garage rock revival", "protopunk", "punk blues"],
    "german hip hop": ["frauenrap", "german alternative rap", "german cloud rap", "german hip hop", "german underground rap", "oldschool deutschrap"],
    "german pop": ["deutschrock", "german pop", "neue deutsche welle", "ostrock", "partyschlager", "schlager"],
    "glam rock": ["glam metal", "glam punk", "glam rock", "hard glam", "sleaze rock"],
    "global christian": ["african gospel", "celtic worship", "global christian", "latin christian", "reggae cristao", "tagalog worship", "world worship"],
    "gospel": ["black gospel", "brazilian gospel", "choir", "gospel", "gospel r&b", "gospel soul", "naija worship", "southern gospel", "spirituals"],
    "gothic metal": ["gothic", "gothic metal", "gothic symphonic metal", "metal gotico"],
    "gothic rock": ["dark post-punk", "deathrock", "gothabilly", "gothic", "gothic rock"],
    "grime": ["eskibeat", "grime", "sublow", "uk grime"],
    "grunge": ["grunge", "grungegaze", "post-grunge", "seattle sound"],
    "hard bop": ["bebop", "bop", "hard bop", "post-bop", "soul jazz"],
    "hard rock": ["glam metal", "hard rock", "hard rock music", "hard rock's", "hard-rock", "hardrock", "hardrockmusic"],
    "hardcore punk": ["crust punk", "d-beat", "hardcore punk", "melodic hardcore", "nyhc", "powerviolence", "skate punk", "straight edge", "youth crew"],
    "hardstyle": ["euphoric hardstyle", "gabber", "happy hardcore", "hard dance", "hardcore", "hardstyle", "jumpstyle", "rawstyle", "uptempo hardcore"],
    "heavy metal": ["hard rock", "heavy metal", "nwobhm", "traditional heavy metal"],
    "hip hop": ["hip hop", "hip hop's", "hip-hop", "hip-hop music", "hip-hops", "hiphop"],
    "house": ["deep house", "house", "house music", "house's", "housemusic"],
    "idm": ["ambient idm", "braindance", "drill and bass", "fluxwork", "glitch", "glitch hop", "idm", "intelligent dance music", "wonky"],
    "indie": ["indie", "indie's", "indiemusic", "indies"],
    "indie folk": ["chamber folk", "folk-pop", "freak folk", "indie anthem-folk", "indie folk", "new americana", "stomp and holler"],
    "indie pop": ["alt pop", "bedroom pop", "indie pop", "indie poptimism", "shimmer pop", "twee pop"],
    "indietronica": ["indie psych-pop", "indietronica", "metropopolis"],
    "industrial": ["aggrotech", "ebm", "electro-industrial", "industrial", "industrial rock", "martial industrial", "power noise"],
    "instrumental": ["instrumental", "instrumental's", "instrumentalmusic", "instrumentals", "no vocals"],
    "italian pop": ["classic italian pop", "italian adult pop", "italian indie pop", "italian pop", "italian pop rock", "pop virale italiano"],
    "j-pop": ["anime", "j-division", "j-idol", "j-pop", "j-pop boy group", "j-pop girl group", "j-rap", "japanese teen pop", "kayokyoku", "shibuya-kei", "vocaloid", "japanese electropop"],
    "j-rock": ["j-metal", "j-poprock", "j-rock", "visual kei"],
    "jazz": ["jazz", "jazz's", "jazzier", "jazziest", "jazzmusic", "jazzy"],
    "jazz rap": ["abstract hip hop", "jazz hop", "jazz rap"],
    "jungle": ["jungle", "jungle's", "junglemusic", "jungles"],
    "k-pop": ["korean pop", "kpop"],
    "k-rock": ["k-indie", "k-rock", "korean indie rock"],
    "latin": ["latin", "latin's", "latina", "latinas", "latinmusic", "latino", "latinos"],
    "latin trap": ["trap argentino", "trap boricua", "trap chileno", "trap colombiano", "trap latino", "trap mexicano", "trap venezolano"],
    "lofi": ["chillhop", "lo fi", "lo-fi", "lo-fi beats", "lo-fi chill", "lo-fi cover", "lo-fi jazzhop", "lo-fi sleep", "lo-fi study", "lofi", "sad lo-fi"],
    "medieval": ["early music", "gregorian chant", "medieval", "renaissance"],
    "metal": ["metal", "metal rock", "metal's", "metalhead", "metallic", "metalmusic", "metals"],
    "metalcore": ["chaotic hardcore", "deathcore", "electronicore", "mathcore", "melodic metalcore", "metalcore", "nu-metalcore", "progressive metalcore"],
    "mpb": ["jovem guarda", "mpb", "nova mpb", "pop folk", "tropicalia", "velha guarda", "violao"],
    "new age": ["new age", "new age music", "new-age", "new-age music", "newage", "newagemusic"],
    "new wave": ["neo-synthpop", "new romantic", "new wave", "new wave pop", "sophisti-pop", "synthpop"],
    "nu jazz": ["broken beat", "future jazz", "jazztronica", "nu jazz"],
    "old school hip hop": ["golden age hip hop", "old school hip hop"],
    "opera": ["arias", "libretto", "opera", "operatic"],
    "pagode": ["pagode", "pagode baiano", "pagode novo", "partido alto", "samba de roda"],
    "persian pop": ["farsi pop", "iranian pop", "persian pop"],
    "persian rock": ["iranian metal", "iranian rock", "persian metal", "persian rock"],
    "persian traditional": ["classical persian", "iranian traditional", "persian traditional", "sonati"],
    "phonk": ["aggressive phonk", "cowbell", "drift phonk", "gym phonk", "memphis phonk", "phonk"],
    "piano": ["piano", "piano cover", "piano music", "solo piano"],
    "pop": ["alt pop", "folk-pop", "pop", "pop music", "pop's", "popmusic", "pops"],
    "pop punk": ["anthem emo", "easycore", "neon pop punk", "pop punk", "socal pop punk"],
    "pop rap": ["commercial rap", "mainstream rap", "melodic rap", "pop rap", "radio rap", "rap pop"],
    "pop rock": ["britpop", "pop rock", "pop rock music", "pop rock's", "pop-rock", "poprock", "poprockmusic", "power pop"],
    "post-hardcore": ["post-hardcore", "screamo", "skramz", "swancore"],
    "post-punk": ["dance-punk", "minimal synth", "new rave", "no wave", "post-punk", "uk post-punk"],
    "power metal": ["epic metal", "fantasy metal", "melodic power metal", "power metal"],
    "progressive rock": ["canterbury scene", "crossover prog", "krautrock", "neo-prog", "progressive rock", "symphonic rock"],
    "psychedelic rock": ["acid rock", "neo-psychedelic", "psychedelic pop", "psychedelic rock", "raga rock", "space rock"],
    "punjabi pop": ["bhangra", "desi hip hop", "punjabi pop"],
    "punk": ["punk", "punk's", "punkmusic", "punks", "punky"],
    "r&b": ["neo soul", "r & b", "r and b", "r&b", "r&b's", "rhythm & blues", "rhythm and blues", "rnb", "rnb's", "trap soul"],
    "rap": ["rap", "rapper", "rappers", "raps"],
    "reggae": ["reggae", "reggae music", "reggae's", "reggaemusic"],
    "reggaeton": ["dembow", "neoperreo", "perreo", "pop reggaeton", "reggaeton", "reggaeton chileno", "reggaeton colombiano", "reggaeton flow", "reggaeton mexicano"],
    "regional mexican": ["banda", "banda sinaloense", "corrido", "grupera", "mariachi", "musica mexicana", "norteno", "norteno-sax", "ranchera", "regional mexican", "tejano"],
    "rock": ["power pop", "rock", "rock & roll", "rock and roll", "rock music", "rock n roll", "rock n' roll", "rock's", "rockin", "rockin'", "rockmusic", "rocknroll", "rocks"],
    "salsa": ["boogaloo", "modern salsa", "salsa", "salsa choke", "salsa colombiana", "salsa cubana", "salsa puertorriquena", "salsa urbana", "salsa venezolana", "timba"],
    "samba": ["samba", "samba paulista", "samba-enredo", "samba-rock"],
    "scandinavian pop": ["classic swedish pop", "danish pop", "dansband", "finnish pop", "iskelma", "norwegian pop", "scandipop", "swedish pop"],
    "sertanejo": ["agronejo", "sertanejo", "sertanejo pop", "sertanejo tradicional", "sertanejo universitario"],
    "singer-songwriter": ["acoustic pop", "cantautor", "canzone d'autore", "gen z singer-songwriter", "liedermacher", "lilith", "neo mellow", "singer-songwriter"],
    "soul": ["neo soul", "soul", "soul music", "soul's", "soulful", "soulmusic", "souly"],
    "soundtrack": ["film music", "film score", "game music", "game score", "movie music", "original motion picture soundtrack", "original score", "original soundtrack", "ost", "score", "soundtrack", "theme music", "tv music"],
    "sufi music": ["ghazal", "indian instrumental", "qawwali", "sufi music"],
    "swing": ["big band", "swing"],
    "symphonic metal": ["gothic symphonic metal", "symphonic metal", "symphonic power metal"],
    "synthpop": ["electropop", "synth pop", "synth-pop", "synthpop"],
    "synthwave": ["futuresynth", "outrun", "retrowave", "synth wave", "synth-wave", "synthwave", "synthwave's"],
    "techno": ["tech", "techno", "techno music", "techno's", "technomusic"],
    "trance": ["psytrance", "trance", "trance music", "trance's", "trancemusic", "trancing"],
    "trap": ["atl trap", "cloud rap", "dark trap", "desi trap", "emo trap", "melodic rap", "plugg", "pluggnb", "rage rap", "sad rap", "trap", "trap brasileiro", "trap carioca", "trap queen", "trap soul", "viral rap"],
    "trip hop": ["trip hop", "trip hop's", "trip hops", "triphop", "triphopmusic"],
    "turkish folk": ["turkish folk"],
    "turkish pop": ["arabesk", "turkish pop"],
    "turkish rock": ["anadolu rock", "turkish alternative", "turkish psych", "turkish rock"],
    "uk garage": ["2-step", "bassline", "future garage", "speed garage", "uk garage"],
    "vaporwave": ["broken transmission", "future funk", "mallsoft", "slushwave", "utopian virtual", "vapor trap", "vaporwave"],
    "vgm": ["anime game", "anime score", "chiptune", "gamecore", "indie game soundtrack", "japanese vgm", "nintendocore", "otacore", "rhythm game", "scorecore", "vgm", "vgm remix", "video game music"],
    "vocal jazz": ["crooner", "jazz singing", "lounge music", "vocal jazz"],
    "west coast hip hop": ["g funk", "g-funk", "west coast hip hop", "west coast rap"],
    "worship pop": ["adoracao", "anthem worship", "ccm", "christian music", "christian pop", "deep ccm", "louvor", "pop worship", "praise", "worship pop"]
  };

  const mainGenres = [
    "acoustic",
    "adult standards",
    "afro r&b",
    "afro-funk",
    "afrobeats",
    "alternative",
    "alternative metal",
    "alternative rock",
    "amapiano",
    "ambient",
    "art pop",
    "art rock",
    "bachata",
    "bebop",
    "black metal",
    "blues",
    "blues rock",
    "bollywood pop",
    "bossa nova",
    "breakbeat",
    "c-pop",
    "chillwave",
    "christian hip hop",
    "christian rock & metal",
    "city pop",
    "classic rock",
    "classical",
    "conscious hip hop",
    "contemporary r&b",
    "corridos tumbados",
    "country",
    "cumbia",
    "dance",
    "dark wave",
    "death metal",
    "dembow",
    "disco",
    "doom metal",
    "dream pop",
    "drill",
    "drone",
    "drum and bass",
    "dubstep",
    "east coast hip hop",
    "edm",
    "electro swing",
    "electronic",
    "electropop",
    "emo",
    "epic",
    "epiccore",
    "eurodance",
    "experimental",
    "folk",
    "forro",
    "french hip hop",
    "french pop",
    "funk",
    "funk carioca",
    "future bass",
    "gangster rap",
    "garage rock",
    "german hip hop",
    "german pop",
    "glam rock",
    "global christian",
    "gospel",
    "gothic metal",
    "gothic rock",
    "grime",
    "grunge",
    "hard bop",
    "hard rock",
    "hardcore punk",
    "hardstyle",
    "heavy metal",
    "hip hop",
    "house",
    "idm",
    "indie",
    "indie folk",
    "indie pop",
    "indietronica",
    "industrial",
    "instrumental",
    "italian pop",
    "j-pop",
    "j-rock",
    "jazz",
    "jazz rap",
    "jungle",
    "k-pop",
    "k-rock",
    "latin",
    "latin trap",
    "lofi",
    "medieval",
    "metal",
    "metalcore",
    "mpb",
    "new age",
    "new wave",
    "nu jazz",
    "old school hip hop",
    "opera",
    "pagode",
    "persian pop",
    "persian rock",
    "persian traditional",
    "phonk",
    "piano",
    "pop",
    "pop punk",
    "pop rap",
    "pop rock",
    "post-hardcore",
    "post-punk",
    "power metal",
    "progressive rock",
    "psychedelic rock",
    "punjabi pop",
    "punk",
    "r&b",
    "rap",
    "reggae",
    "reggaeton",
    "regional mexican",
    "rock",
    "salsa",
    "samba",
    "scandinavian pop",
    "sertanejo",
    "singer-songwriter",
    "soul",
    "soundtrack",
    "sufi music",
    "swing",
    "synthpop",
    "synthwave",
    "techno",
    "trance",
    "trap",
    "trip hop",
    "turkish folk",
    "turkish pop",
    "turkish rock",
    "uk garage",
    "urbano latino",
    "vaporwave",
    "vgm",
    "vocal jazz",
    "west coast hip hop",
    "worship pop"
  ];

  async function showGenreFilterModal(tracks, trackGenreMap) {
    const allGenres = new Set();
    trackGenreMap.forEach((genres) => {
      genres.forEach((genre) => allGenres.add(genre.name));
    });

    const genreCounts = new Map();
    trackGenreMap.forEach(genres => {
        const uniqueGenreNamesOnTrack = new Set(genres.map(g => g.name));
        uniqueGenreNamesOnTrack.forEach(name => {
            genreCounts.set(name, (genreCounts.get(name) || 0) + 1);
        });
    });

    const modalContainer = document.createElement("div");
    modalContainer.className = "genre-filter-modal";
    modalContainer.innerHTML = `
    <style>
    .main-embedWidgetGenerator-container {
      width: 620px !important;
      max-width: 620px !important;
      border-radius: 30px;
      overflow: hidden; 
      background-color: #181818 !important;
      border: 2px solid #282828;
    }
    .GenericModal__overlay .GenericModal {
      border-radius: 30px;
      overflow: hidden;
    }
    .GenericModal > .main-embedWidgetGenerator-container {
      height: auto !important;
    } 
    .main-trackCreditsModal-mainSection {
      overflow-y: hidden !important;
      padding: 16px 32px 9px 32px;
    }
    .main-trackCreditsModal-originalCredits{
      padding-bottom: 20px !important;
    }
    .main-trackCreditsModal-header {
      padding: 27px 32px 12px !important;
    }
    .genre-filter-modal .main-popupModal-content {
      overflow-y: auto;
    }
    .genre-filter-modal .genre-button {
      padding: 6px 7px 6px 16px;
      margin: 4px;
      border-radius: 20px;
      border: none;
      cursor: pointer;
      background-color: #343434;
      color: white;
      font-weight: 500;
      font-size: 14px;
      transition: all 0.04s ease;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
    }
    .genre-filter-modal .genre-count-badge {
      background-color: rgba(255, 255, 255, 0.1);
      color: #e0e0e0;
      padding: 1px 8px;
      border-radius: 12px;
      font-size: 13px;
      font-weight: 400;
      min-width: 20px;
      text-align: center;
      line-height: 1.5;
      transition: background-color 0.2s ease, color 0.2s ease;
    }
    .genre-filter-modal .genre-button.selected .genre-count-badge {
      background-color: rgba(0, 0, 0, 0.2);
      color: #000;
    }
    .genre-filter-modal .genre-button.selected {
      background-color: #1ED760;
      color: black;
    }
    .genre-filter-modal .search-bar {
      width: 100%;
      padding-top: 10px;
      padding-right: 35px;
      padding-bottom: 10px;
      padding-left: 15px;
      border-radius: 20px;
      border: 1px solid #282828;
      background: #282828;
      color: white;
    }
    .genre-filter-modal .search-bar-container {
      position: relative;
      width: 77%;
      display: flex;
      align-items: center;
    }
    .genre-filter-modal .clear-search-button {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: #b3b3b3;
      cursor: pointer;
      font-size: 24px;
      padding: 0 5px;
      line-height: 1;
      display: none;
    }
    .genre-filter-modal .clear-search-button:hover {
      color: white;
    }
    .genre-filter-modal .sort-type-select {
      padding: 8px;
      border-radius: 4px;
      border: 1px solid #666;
      background: #282828;
      color: white;
      width: 217px;
      cursor: pointer;
    }
    .genre-filter-modal .create-playlist-button {
      padding: 8px 18px;
      border-radius: 20px;
      border: none;
      cursor: pointer;
      background-color: #1ED760;
      color: black;
      font-weight: 600;
      font-size: 14px;
      transition: all 0.04s ease;
      margin-top: 10px;
    }
    .genre-filter-modal .create-playlist-button:hover {
      background-color: #3BE377;
    }
    .genre-filter-modal .genre-container {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 5px;
      max-height: 20vh;
      overflow-y: auto;
      background-color: #1e1e1e; 
      border-radius: 20px; 
      padding: 15px 10px;
      margin-bottom: -15px; 
      margin-top: 2px; 
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      border-top-left-radius: 20px;
      border-top-right-radius: 20px;
      scrollbar-width: thin;
      scrollbar-color: #3b3b3b transparent;
    }
    .genre-filter-modal .genre-container::-webkit-scrollbar {
      width: 6px;
    }
    .genre-filter-modal .genre-container::-webkit-scrollbar-track {
      background: #282828;
      border-radius: 20px;
    }
    .genre-filter-modal .genre-container::-webkit-scrollbar-thumb {
      background-color: #1DB954;
      border-radius: 20px;
      border: 2px solid #282828;
    }
    .genre-filter-modal .select-all-button {
      padding: 10px 16px;
      border-radius: 20px;
      border: none;
      cursor: pointer;
      background-color: #282828; 
      color: white;
      font-weight: 500;
      font-size: 14px;
      transition: all 0.4s ease;  
      display: flex;  
      align-items: center; 
      gap: 8px;  
    }
    
    .genre-filter-modal .select-all-button:hover {
      filter: brightness(1.2); 
    }
    
    .genre-filter-modal .select-all-button:active {
      background-color: #B3B3B3;
      color: black;
      transition: none;
    }
    .genre-filter-modal .select-all-button svg {
      fill: currentColor; 
    }
    .genre-filter-modal .genre-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.25);
      backdrop-filter: blur(5px);
      -webkit-backdrop-filter: blur(5px);
      z-index: 999;
    }
    .GenericModal {
      position: relative;
      z-index: 1000;
    }
    .genre-filter-modal .setting-row::after {
        content: "";
        display: table;
        clear: both;
    }
    .genre-filter-modal .setting-row {
        padding: 5px 0;
        align-items: center;
    }
    .genre-filter-modal .setting-row .col.description {
        float: left;
        padding-right: 15px;
        width: auto;
        color: #c1c1c1;
    }
    .genre-filter-modal .setting-row .col.action {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      text-align: right;
    }
    .genre-filter-modal .switch {
        position: relative;
        display: inline-block;
        width: 40px;
        height: 24px;
    }
    .genre-filter-modal .switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }
    .genre-filter-modal .sliderx {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #484848;
        border-radius: 24px;
        transition: .2s;
    }
    .genre-filter-modal .sliderx:before {
        position: absolute;
        content: "";
        height: 18px;
        width: 18px;
        left: 3px;
        bottom: 3px;
        background-color: white;
        border-radius: 50%;
        transition: .2s;
    }
    .genre-filter-modal input:checked + .sliderx {
        background-color: #1DB954;
    }
    .genre-filter-modal input:checked + .sliderx:before {
        transform: translateX(16px);
    }
    .genre-filter-modal .settings-container {
      display: flex;
      gap: 15px;
      flex-direction: row-reverse;
    }
    .genre-filter-modal .settings-right-wrapper,
    .genre-filter-modal .settings-left-wrapper {
      flex: 1;
      background-color: #282828;
      border-radius: 20px;
      padding: 25px;
      height: 110px;
    }
    .genre-filter-modal .settings-right-wrapper {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .genre-filter-modal .settings-left-wrapper {
      display: flex;
      flex-direction: column;
      gap: 0px;
    }
    .genre-filter-modal .settings-title {
      color: white;
      font-weight: bold;
      font-size: 14px;
      margin-bottom: 3px;
    }
    .genre-filter-modal .setting-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 5px 0;
      width: auto; 
    }
    .genre-filter-modal .setting-row .description {
      color: white;
      width: auto;
      flex-grow: 1; 
      font-size: 15px;
    }
    .genre-filter-modal .setting-row .action {
      flex-shrink: 0;
    }
    .tooltip-container {
      position: relative; 
      display: inline-block;
    }
    .custom-tooltip {
      visibility: hidden;
      position: absolute;
      z-index: 1;
      background-color: #373737;
      color: white;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 14px;
      max-width: 240px;
      width: max-content;
      bottom: 100%;   
      left: 50%;       
      transform: translateX(-50%);  
      margin-bottom: 5px;   
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      line-height: 1.4;
      word-wrap: break-word;
    }
    .custom-tooltip::after {
        content: "";
        position: absolute;
        top: 100%;
        left: 50%;
        margin-left: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: #373737 transparent transparent transparent;
    }
    
    .tooltip-container:hover .custom-tooltip {
        visibility: visible;
    }
    .genre-filter-modal .genre-stats {
      display: flex;
      justify-content: center; 
      align-items: center;    
      color: #c1c1c1;
      font-size: 14px;
      background-color: #282828;
      padding: 12px 0;
      border-bottom-left-radius: 20px;
      border-bottom-right-radius: 20px;
      margin-bottom: 5px; 
      position: relative;
      z-index: 1; 
    }
    
    .genre-filter-modal .genre-stats span {
      margin: 0 25px;
    }
    .genre-modal-title {
      font-size: 15px;
      font-weight: 400;
      color: white;
    }
    </style>
    <div style="display: flex; flex-direction: column; gap: 15px;">
        <h2 class="genre-modal-title">Genres from Spotify and Last.fm:</h2> 
        <div class="genre-header">
          <div class="search-bar-container">
                  <input type="text" class="search-bar" placeholder="Search genres...">
                  <button class="clear-search-button">&times;</button>
              </div>
            <button class="select-all-button">
                <span>Select All</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18px" height="18px">
                    <path d="M 4 2 C 2.895 2 2 2.895 2 4 L 2 16 C 2 17.105 2.895 18 4 18 L 16 18 C 17.105 18 18 17.105 18 16 L 18 4 C 18 2.895 17.105 2 16 2 L 4 2 z M 4 4 L 16 4 L 16 16 L 4 16 L 4 4 z M 20 6 L 20 20 L 6 20 L 6 22 L 20 22 C 21.105 22 22 21.105 22 20 L 22 6 L 20 6 z M 13.292969 6.2929688 L 9 10.585938 L 6.7070312 8.2929688 L 5.2929688 9.7070312 L 9 13.414062 L 14.707031 7.7070312 L 13.292969 6.2929688 z"/>
                </svg>
            </button>
        </div>
        <div class="genre-container"></div>
        <div class="genre-stats">
            <span id="total-tracks-stat">Total tracks: 0</span>
            <span id="filtered-tracks-stat">Filtered tracks: 0</span>
        </div>
        <div class="settings-container">
            <div class="settings-right-wrapper">
                <div class="settings-title">Filter Settings:</div>
                <div class="setting-row">
                    <label class="description" for="matchAllGenresToggle">
                        Match All Genres
                        <span class="tooltip-container">
                            <span style="color: #888; margin-left: 4px; font-size: 12px; cursor: help;">?</span>
                            <span class="custom-tooltip">Only include tracks matching all selected genres.</span>
                        </span>
                    </label>
                    <div class="action">
                        <label class="switch">
                            <input type="checkbox" id="matchAllGenresToggle" ${matchAllGenres ? 'checked' : ''}>
                            <span class="sliderx"></span>
                        </label>
                    </div>
                </div>
            </div>
            <div class="settings-left-wrapper">
                <div class="settings-title">Sort Type:</div>
                <div class="setting-row">
                    <select class="sort-type-select">
                        <option value="default">Default</option>
                        <option value="playCount">Play Count</option>
                        <option value="popularity">Popularity</option>
                        <option value="releaseDate">Release Date</option>
                        <option value="shuffle">Shuffle</option>
                        <option value="scrobbles">Scrobbles</option>
                        <option value="personalScrobbles">My Scrobbles</option>
                    </select>
                </div>
            </div>
        </div>
        <button class="create-playlist-button">Create Playlist</button>
    </div>
  `;

    Spicetify.PopupModal.display({
      title: "<span style='font-size: 30px;'>Genre Filter</span>",
      content: modalContainer,
      isLarge: true,
    });
    tagActiveModalWithFontScope();

    if (isMenuOpen) {
      closeAllMenus();
    }

    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";

    const genericModalOverlay = document.querySelector(".GenericModal__overlay");

    if (genericModalOverlay) {
      genericModalOverlay.appendChild(overlay);
    }

    if (overlay) {
      overlay.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
    }

    const modalContainerElement = document.querySelector(".main-popupModal-container");
    if (modalContainerElement) {
      modalContainerElement.style.zIndex = "2000";
    }
    preventDragCloseModal();

    const matchAllGenresToggle = modalContainer.querySelector("#matchAllGenresToggle");
    const genreContainer = modalContainer.querySelector(".genre-container");
    const searchBar = modalContainer.querySelector(".search-bar");
    const clearSearchButton = modalContainer.querySelector(".clear-search-button");
    const sortTypeSelect = modalContainer.querySelector(".sort-type-select");
    const createPlaylistButton = modalContainer.querySelector(".create-playlist-button");
    const selectAllButton = modalContainer.querySelector(".select-all-button");

    const totalTracksStat = modalContainer.querySelector("#total-tracks-stat");
    const filteredTracksStat = modalContainer.querySelector("#filtered-tracks-stat");

    const lastSelectedSort = localStorage.getItem(STORAGE_KEY_GENRE_FILTER_SORT) || "default";
    sortTypeSelect.value = lastSelectedSort;

    sortTypeSelect.addEventListener("change", () => {
      localStorage.setItem(STORAGE_KEY_GENRE_FILTER_SORT, sortTypeSelect.value);
    });

    matchAllGenresToggle.addEventListener("change", () => {
      matchAllGenres = matchAllGenresToggle.checked;
      saveSettings();
      updateFilteredTracksCount();
    });
    
    let selectedGenres = [];
    let tracksWithGenresCount = 0;
    trackGenreMap.forEach(genres => {
      if (genres.length > 0) {
        tracksWithGenresCount++;
      }
    });
    totalTracksStat.textContent = `Total tracks: ${tracksWithGenresCount} (${tracks.length})`;
    filteredTracksStat.textContent = `Filtered tracks: 0`;

    function updateFilteredTracksCount() {
      const filteredTracks = filterTracksByGenres(
        tracks,
        selectedGenres,
        trackGenreMap  
      );
      filteredTracksStat.textContent = `Filtered tracks: ${filteredTracks.length}`;
    }

    function updateGenreButtons() {
      genreContainer.innerHTML = "";
      const searchTerm = searchBar.value.toLowerCase();
      const filteredGenres = Array.from(allGenres).filter((genre) =>
        genre.toLowerCase().includes(searchTerm)
      );
    
      const mainGenreWords = new Set();
      mainGenres.forEach(g => {
          g.toLowerCase().split(/[\s-]+/).forEach(word => {
              if (word.length > 1 && word !== 'and') mainGenreWords.add(word.replace(/&/g, ''));
          });
      });
    
      const genreDetails = new Map();
      trackGenreMap.forEach((genresOnTrack) => {
        const uniqueGenreNamesOnTrack = new Set(genresOnTrack.map(g => g.name));
        
        uniqueGenreNamesOnTrack.forEach(genreName => {
            if (filteredGenres.includes(genreName)) {
                const genreData = genresOnTrack.find(g => g.name === genreName);
                if (!genreDetails.has(genreName)) {
                    genreDetails.set(genreName, {
                        name: genreName,
                        isSpotify: false,
                        count: 0
                    });
                }
                const details = genreDetails.get(genreName);
                details.count++;
                if (genreData?.source === 'spotify') {
                    details.isSpotify = true;
                }
            }
        });
      });
    
      const sortedGenres = filteredGenres.sort((a, b) => {
        const detailsA = genreDetails.get(a) || { count: 0, isSpotify: false };
        const detailsB = genreDetails.get(b) || { count: 0, isSpotify: false };

        const lowerA = a.toLowerCase();
        const lowerB = b.toLowerCase();
        const isAMain = mainGenres.some(main => lowerA.includes(main.toLowerCase()));
        const isBMain = mainGenres.some(main => lowerB.includes(main.toLowerCase()));

        if (isAMain && !isBMain) return -1;
        if (!isAMain && isBMain) return 1;

        if (detailsB.count !== detailsA.count) {
            return detailsB.count - detailsA.count;
        }

        if (detailsA.isSpotify && !detailsB.isSpotify) return -1;
        if (!detailsA.isSpotify && detailsB.isSpotify) return 1;

        return a.localeCompare(b);
      });
    
      if (sortedGenres.length === 0) {
        const noGenreMessage = document.createElement("div");
        noGenreMessage.textContent = "No genre found";
        noGenreMessage.style.color = "#666";
        noGenreMessage.style.textAlign = "center";
        noGenreMessage.style.padding = "10px";
        genreContainer.appendChild(noGenreMessage);
      } else {
        sortedGenres.forEach((genre) => {
          const genreButton = document.createElement("button");
          genreButton.classList.add("genre-button");
          
          const genreNameSpan = document.createElement("span");
          genreNameSpan.textContent = genre;

          const countBadge = document.createElement("span");
          countBadge.classList.add("genre-count-badge");
          const count = genreCounts.get(genre) || 0;
          countBadge.textContent = count;

          genreButton.appendChild(genreNameSpan);
          genreButton.appendChild(countBadge);

          if (selectedGenres.includes(genre)) {
            genreButton.classList.add("selected");
          }
    
          genreButton.addEventListener("click", () => {
            if (selectedGenres.includes(genre)) {
              selectedGenres = selectedGenres.filter((g) => g !== genre);
              genreButton.classList.remove("selected");
            } else {
              selectedGenres.push(genre);
              genreButton.classList.add("selected");
            }
            updateFilteredTracksCount();
          });
    
          genreContainer.appendChild(genreButton);
        });
      }
    }

    searchBar.addEventListener("input", () => {
      updateGenreButtons();
      clearSearchButton.style.display = searchBar.value.length > 0 ? 'block' : 'none';
    });

    clearSearchButton.addEventListener("click", () => {
        searchBar.value = "";
        const event = new Event('input', { bubbles: true });
        searchBar.dispatchEvent(event);
        searchBar.focus();
    });
    
    selectAllButton.addEventListener("click", () => {
      const searchTerm = searchBar.value.toLowerCase();
      const filteredGenres = Array.from(allGenres).filter((genre) => 
        genre.toLowerCase().includes(searchTerm)
      );
      const allSelected = filteredGenres.every((genre) => selectedGenres.includes(genre));
    
      if (allSelected) {
        selectedGenres = selectedGenres.filter((genre) => !filteredGenres.includes(genre));
      } else {
        filteredGenres.forEach((genre) => {
          if (!selectedGenres.includes(genre)) {
            selectedGenres.push(genre);
          }
        });
      }
      updateGenreButtons();
      updateFilteredTracksCount();
    });

    searchBar.addEventListener("input", updateGenreButtons);
    updateGenreButtons();

    createPlaylistButton.addEventListener("click", async () => {
      if (selectedGenres.length === 0) {
          Spicetify.showNotification("Please select at least one genre.");
          return;
      }
    
      const filteredTracks = filterTracksByGenres(
          tracks,
          selectedGenres,
          trackGenreMap
      );
    
      if (filteredTracks.length === 0) {
          Spicetify.showNotification("No tracks found for the selected genres.");
          return;
      }
    
      const sortType = sortTypeSelect.value;
      Spicetify.PopupModal.hide();
    
      let sortedTracks; 
    
      async function createAndPopulatePlaylist(sortedTracks, playlistName, playlistDescription) {
          try {
              mainButton.innerText = "Creating...";
              const newPlaylist = await createPlaylist(playlistName, playlistDescription);
              await new Promise(resolve => setTimeout(resolve, 1250));
              mainButton.innerText = "Saving...";
    
              const trackUris = sortedTracks.map((track) => track.uri);
              await addTracksToPlaylist(newPlaylist.id, trackUris);
    
              await addPlaylistToLibrary(newPlaylist.uri);
    
              const sortTypeInfo = {
                  default: { fullName: "default order", shortName: "Default" },
                  playCount: { fullName: "play count", shortName: "PlayCount" },
                  popularity: { fullName: "popularity", shortName: "Popularity" },
                  releaseDate: { fullName: "release date", shortName: "ReleaseDate" },
                  scrobbles: { fullName: "Last.fm scrobbles", shortName: "Scrobbles" },
                  personalScrobbles: { fullName: "Last.fm personal scrobbles", shortName: "My Scrobbles" },
                  shuffle: { fullName: "shuffle", shortName: "Shuffle" },
                  aiPick: { fullName: "AI pick", shortName: "AI Pick" },
                  averageColor: { fullName: "album color", shortName: "Color" },
              }[sortType];
              Spicetify.showNotification(
                  `Playlist created with ${sortTypeInfo.fullName} and genre filter!`
              );
              
              await navigateToPlaylist(newPlaylist);
    
          } catch (error) {
              console.error("Error creating or updating playlist:", error);
              Spicetify.showNotification(
                  `An error occurred while creating or updating the playlist. Please check your internet connection and try again.`
              );
          } finally {
              resetButtons();
          }
      }
    
    
      const sourceUri = getCurrentUri();
      let sourceName;
      if (URI.isArtist(sourceUri)) {
          sourceName = await Spicetify.CosmosAsync.get(
              `https://api.spotify.com/v1/artists/${sourceUri.split(":")[2]}`
          ).then((r) => r.name);
      } else if (isLikedSongsPage(sourceUri)) {
          sourceName = "Liked Songs";
      } else if (URI.isAlbum(sourceUri)) {
          sourceName = await Spicetify.CosmosAsync.get(
              `https://api.spotify.com/v1/albums/${sourceUri.split(":")[2]}`
          ).then((r) => r.name);
      } else {
          sourceName = await Spicetify.CosmosAsync.get(
              `https://api.spotify.com/v1/playlists/${sourceUri.split(":")[2]}`
          ).then((r) => r.name);
      }
    
      let suffixPattern = new RegExp(
          `\\s*(${possibleSuffixes.join("|")})\\s*`
      );
    
      while (suffixPattern.test(sourceName)) {
          sourceName = sourceName.replace(suffixPattern, "");
      }
    
    
      let baseDescription = `Filtered using Sort-Play by genres: `;
      if (URI.isArtist(sourceUri)) {
          baseDescription = `Tracks by ${sourceName} ` + baseDescription;
      } else if (URI.isAlbum(sourceUri)) {
          const albumDetails = await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/albums/${sourceUri.split(":")[2]}`);
          const artistName = albumDetails.artists[0].name;
          baseDescription = `Tracks from ${sourceName} by ${artistName} ` + baseDescription;
      }
    
      let playlistDescription = baseDescription;
      let genreList = "";
      let addedGenres = 0;
    
      for (const genre of selectedGenres) {
          const potentialGenreList = genreList ? `${genreList}, ${genre}` : genre;
          if ((playlistDescription.length + potentialGenreList.length) <= 247) { 
              genreList = potentialGenreList;
              addedGenres++;
          } else {
              break; 
          }
      }
      if (addedGenres < selectedGenres.length) {
          playlistDescription += genreList + ",...";
      } else {
          playlistDescription += genreList + ".";
      }
    
      const playlistName = `${sourceName} (Genre Filter)`; 
    
      if (sortType === "default") {
        sortedTracks = filteredTracks;
        setButtonProcessing(true);
        mainButton.style.backgroundColor = buttonStyles.main.disabledBackgroundColor;
        mainButton.style.color = buttonStyles.main.disabledColor;
        mainButton.style.cursor = "default";
        svgElement.style.fill = buttonStyles.main.disabledColor;
        menuButtons.forEach((button) => (button.disabled = true));
        mainButton.innerHTML = "100%";
        await createAndPopulatePlaylist(sortedTracks, playlistName, playlistDescription);
      } else if (sortType === "playCount" || sortType === "popularity" || sortType === "shuffle" || sortType === "releaseDate") {
          setButtonProcessing(true);
          mainButton.style.backgroundColor = buttonStyles.main.disabledBackgroundColor;
          mainButton.style.color = buttonStyles.main.disabledColor;
          mainButton.style.cursor = "default";
          svgElement.style.fill = buttonStyles.main.disabledColor;
          menuButtons.forEach((button) => (button.disabled = true));
          mainButton.innerHTML = "0%";
    
          const tracksWithPlayCounts = await enrichTracksWithPlayCounts(
              filteredTracks,
              (progress) => {
                  mainButton.innerText = `${Math.floor(progress * 0.20)}%`;
              }
          );
          const tracksWithIds = await processBatchesWithDelay(
              tracksWithPlayCounts,
              50,
              500,
              (progress) => {
                  mainButton.innerText = `${20 + Math.floor(progress * 0.20)}%`;
              },
              collectTrackIdsForPopularity
          );
          const tracksWithPopularity = await fetchPopularityForMultipleTracks(
              tracksWithIds,
              (progress) => {
                  mainButton.innerText = `${40 + Math.floor(progress * 0.20)}%`;
              }
          );
    
          let uniqueTracks;
    
          if (sortType === "releaseDate") {
              const tracksWithReleaseDates = await processBatchesWithDelay(
                  tracksWithPopularity,
                  50,
                  500,
                  (progress) => {
                      mainButton.innerText = `${60 + Math.floor(progress * 0.20)}%`;
                  },
                  getTrackDetailsWithReleaseDate
              );
              uniqueTracks = deduplicateTracks(tracksWithReleaseDates).unique;
          } else {
              uniqueTracks = deduplicateTracks(tracksWithPopularity).unique;
          }
    
          if (sortType === "playCount") {
            sortedTracks = uniqueTracks
              .filter((track) => track.playCount !== "N/A")
              .sort((a, b) => sortOrderState.playCount ? a.playCount - b.playCount : b.playCount - a.playCount);
          } else if (sortType === "popularity") {
            sortedTracks = uniqueTracks
              .filter((track) => track.popularity !== null)
              .sort((a, b) => sortOrderState.popularity ? a.popularity - b.popularity : b.popularity - a.popularity);
        } else if (sortType === "releaseDate") {
          sortedTracks = uniqueTracks
            .filter((track) => track.releaseDate !== null)
            .sort((a, b) => {
              const dateComparison = sortOrderState.releaseDate
                ? (a.releaseDate || 0) - (b.releaseDate || 0)
                : (b.releaseDate || 0) - (a.releaseDate || 0);
    
              if (dateComparison !== 0) {
                return dateComparison;
              }
              
              return (a.trackNumber || 0) - (b.trackNumber || 0);
            });
        } else if (sortType === "shuffle") {
          sortedTracks = shuffleArray(uniqueTracks);
        }
    
          mainButton.innerText = "100%";
    
          await createAndPopulatePlaylist(sortedTracks, playlistName, playlistDescription);
    
      } else if (sortType === "scrobbles" || sortType === "personalScrobbles") {
          try {
              setButtonProcessing(true);
              mainButton.style.backgroundColor = buttonStyles.main.disabledBackgroundColor;
              mainButton.style.color = buttonStyles.main.disabledColor;
              mainButton.style.cursor = "default";
              svgElement.style.fill = buttonStyles.main.disabledColor;
              menuButtons.forEach((button) => (button.disabled = true));
              mainButton.innerHTML = "0%";
    
              const result = await handleScrobblesSorting(
                  filteredTracks,
                  sortType,
                  (progress) => {
                      mainButton.innerText = `${Math.floor(progress * 0.90)}%`;
                  }
              );
              sortedTracks = result.sortedTracks; 
              const totalTracks = sortedTracks.length;
              sortedTracks.forEach((_, index) => {
                  const progress = 90 + Math.floor(((index + 1) / totalTracks) * 10);
                  mainButton.innerText = `${progress}%`;
              });
              mainButton.innerText = "100%";
    
              await createAndPopulatePlaylist(sortedTracks, playlistName, playlistDescription);
    
    
          } catch (error) {
              resetButtons();
              Spicetify.showNotification(error.message);
              return;
          }
      }
    });
  }

  const GENRE_CACHE_KEY_PREFIX = 'sort-play-genre-cache-v2-';
  const GENRE_CACHE_MAX_SIZE_BYTES = 9 * 1024 * 1024;  

  function getGenreCacheKey(trackId) {
    return `${GENRE_CACHE_KEY_PREFIX}${trackId}`;
  }
  
  function getCachedTrackGenres(trackId) {
    const cacheKey = getGenreCacheKey(trackId);
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      try {
        const { genres, timestamp } = JSON.parse(cachedData);  
        return genres;  
      } catch (error) {
        console.error('Error parsing cached genre data:', error);
        localStorage.removeItem(cacheKey); 
      }
    }
    return null;
  }
  
  function setCachedTrackGenres(trackId, genres) {
    const cacheKey = getGenreCacheKey(trackId);
    const dataToCache = { genres, timestamp: Date.now() }; 
  
    try {
      localStorage.setItem(cacheKey, JSON.stringify(dataToCache));
      manageGenreCacheSize();
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        console.warn('Genre cache full. Clearing space...');
        clearOldestGenreCacheEntries();
        try {
          localStorage.setItem(cacheKey, JSON.stringify(dataToCache));
        } catch (retryError) {
          console.error('Failed to write to genre cache after cleanup:', retryError);
        }
      } else {
        console.error('Error setting genre cache:', error);
      }
    }
  }
  
  function manageGenreCacheSize() {
    let cacheSize = 0;
    const cacheItems = [];
  
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith(GENRE_CACHE_KEY_PREFIX)) {
        const item = localStorage.getItem(key);
        try {
            const { timestamp } = JSON.parse(item);
            cacheSize += item.length;
            cacheItems.push({ key, size: item.length, timestamp });
        } catch (error) {
            console.error('Error parsing cache item for size calculation:', error);
            localStorage.removeItem(key);
        }
      }
    }
  
    if (cacheSize > GENRE_CACHE_MAX_SIZE_BYTES) {
      cacheItems.sort((a, b) => a.timestamp - b.timestamp);
      let removedSize = 0;
      for (const item of cacheItems) {
        localStorage.removeItem(item.key);
        removedSize += item.size;
        if (cacheSize - removedSize <= GENRE_CACHE_MAX_SIZE_BYTES) {
          break;
        }
      }
    }
  }
  
  function clearOldestGenreCacheEntries() {
    const cacheItems = [];
  
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith(GENRE_CACHE_KEY_PREFIX)) {
        const item = localStorage.getItem(key);
        try {
          const { timestamp } = JSON.parse(item);
          cacheItems.push({ key, timestamp });
        } catch (error) {
          console.error('Error parsing cache item for removal:', error);
          localStorage.removeItem(key);
        }
      }
    }
  
    cacheItems.sort((a, b) => a.timestamp - b.timestamp); 
    cacheItems.forEach(item => localStorage.removeItem(item.key));
  }
  
  function isTrackRecent(releaseDateString) {
    const releaseDate = new Date(releaseDateString);
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
  
    return releaseDate >= twoWeeksAgo;
  }

  const artistGenreCache = new Map();
  const lastfmCache = new Map();
  
  const CONFIG = {
    batchSize: 5,
    batchDelay: 200,
    lastfm: {
      apiKey: '***REMOVED***',
      baseUrl: 'https://ws.audioscrobbler.com/2.0/',
      retryAttempts: 3,
      retryDelay: 1000,
    },
    spotify: {
      retryAttempts: 3,
      retryDelay: 1000,
    }
  };

  const spotifyApiLimits = {
    maxRequestsPerSecond: 20, 
    requests: [],
  };

  function canCallSpotifyApi() {
    const now = Date.now();
    const oneSecondAgo = now - 1000;

    spotifyApiLimits.requests = spotifyApiLimits.requests.filter(
        (timestamp) => timestamp > oneSecondAgo
    );

    return spotifyApiLimits.requests.length < spotifyApiLimits.maxRequestsPerSecond;
  }

  async function callSpotifyApiWithRateLimit(fn) {
    while (!canCallSpotifyApi()) {
        await new Promise((resolve) => setTimeout(resolve, 50)); 
    }

    spotifyApiLimits.requests.push(Date.now());
    return await fn();
  }

  async function withRetry(fn, retryAttempts, retryDelay) {
    let lastError;
    for (let attempt = 0; attempt < retryAttempts; attempt++) {
        try {
            const response = await callSpotifyApiWithRateLimit(fn);
            
            if (response?.code === 429) {
                const error = new Error("Too Many Requests");
                error.status = 429;
                throw error;
            }
            
            if (response?.error) {
                const error = new Error(response.message || response.error);
                error.status = response.code;
                throw error;
            }
            
            return response;
        } catch (error) {
            lastError = error;
            let waitTime = retryDelay * Math.pow(2, attempt); 
            waitTime += Math.random() * retryDelay;          
            waitTime = Math.min(waitTime, 60000);            

            if (error.status === 429) {
                waitTime = Math.max(5000, waitTime); 
            }
            
            console.warn(`Attempt ${attempt + 1}/${retryAttempts} failed. Waiting ${waitTime}ms before retry...`);
            
            if (attempt < retryAttempts - 1) {
                await new Promise((resolve) => setTimeout(resolve, waitTime));
            }
        }
    }
    throw lastError;
  }

  async function processGenreBatches(tracks, updateProgress = () => {}) {
    const allGenres = new Set();
    const trackGenreMap = new Map();
    let tracksWithGenresCount = 0;
    const totalTracks = tracks.length;
    const batches = [];
  
    for (let i = 0; i < tracks.length; i += CONFIG.batchSize) {
        batches.push(tracks.slice(i, i + CONFIG.batchSize));
    }
  
    for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];
        const startTime = Date.now();
        
        const batchIsAllCached = batch.every(track => {
            const trackId = track.uri.split(":")[2];
            return getCachedTrackGenres(trackId) !== null;
        });
  
        const batchResults = await Promise.allSettled(
            batch.map(async (track) => {  
                try {
                    const genres = await getTrackGenres(track.uri);
                    return { track, genres };
                } catch (error) {
                    console.error(`Error processing track ${track.name}:`, error);
                    return { track, genres: [] };
                }
            })
        );
  
        const successfulResults = batchResults.filter(result => 
            result.status === 'fulfilled' && result.value.genres.length > 0
        );
        
        successfulResults.forEach((result) => {
            const { track, genres } = result.value;
            
            const mappedAndNormalizedGenres = mapAndNormalizeGenres(genres);

            const finalUniqueGenres = [];
            const seenGenreNames = new Set();
            for (const genre of mappedAndNormalizedGenres) {
                if (!seenGenreNames.has(genre.name)) {
                    finalUniqueGenres.push(genre);
                    seenGenreNames.add(genre.name);
                }
            }

            trackGenreMap.set(track.uri, finalUniqueGenres);
            finalUniqueGenres.forEach((genre) => allGenres.add(genre.name));
            tracksWithGenresCount++;
        });
  
        const endTime = Date.now(); 
        const elapsedTime = endTime - startTime;
        const delayMs = batchIsAllCached ? 0 : Math.max(CONFIG.batchDelay - elapsedTime, 0);
  
        const progress = Math.round(((i + 1) * CONFIG.batchSize / totalTracks) * 100);
        updateProgress(progress);
  
        if (i < batches.length - 1) {
            if (!batchIsAllCached) {
                await new Promise((resolve) => setTimeout(resolve, delayMs));
            }
        }
    }
  
    return { allGenres, trackGenreMap, tracksWithGenresCount };
  }

  async function getLastfmGenres(artist, track, spotifyGenres) {
    const cacheKey = `${artist}-${track}`;
    if (lastfmCache.has(cacheKey)) {
      return lastfmCache.get(cacheKey);
    }
  
    try {
      const trackParams = new URLSearchParams({
        method: 'track.getInfo',
        artist: artist,
        track: track,
        format: 'json'
      });
  
      const trackResponse = await fetchLfmWithGateway(trackParams);

      if (!trackResponse.ok) {
        throw new Error(`Track API request failed with status ${trackResponse.status}`);
      }

      const trackResponseText = await trackResponse.text();
      if (!trackResponseText) {
        throw new Error('Empty response from track API');
      }

      const trackData = JSON.parse(trackResponseText);
      let genres = trackData?.track?.toptags?.tag?.map(tag => tag.name.toLowerCase()) || [];
  
      if (genres.length > 0) {
        lastfmCache.set(cacheKey, genres);
        return genres;
      }
  
      if (genres.length === 0 && spotifyGenres.size === 0) { 
          const artistParams = new URLSearchParams({
            method: 'artist.getInfo',
            artist: artist,
            format: 'json'
          });
    
          const artistResponse = await fetchLfmWithGateway(artistParams);

          if (!artistResponse.ok) {
            throw new Error(`Artist API request failed with status ${artistResponse.status}`);
          }

          const artistResponseText = await artistResponse.text();
          if (!artistResponseText) {
            throw new Error('Empty response from artist API');
          }

          const artistData = JSON.parse(artistResponseText);
          genres = artistData?.artist?.tags?.tag?.map(tag => tag.name.toLowerCase()) || [];
      }

      lastfmCache.set(cacheKey, genres);
      return genres;
    } catch (error) {
      console.warn(`Last.fm fetch failed for ${artist} - ${track}:`, {
        error: error.message,
        stack: error.stack,
        type: error.constructor.name
      });
      return [];
    }
  }

  function containsYear(str) {
    return /(?:19|20)\d{2}|\d{2}s|\d{2}th/.test(str);
  }

  async function getTrackGenres(trackUri) {
    const trackId = trackUri.split(":")[2];

    const cachedGenres = getCachedTrackGenres(trackId);
    if (cachedGenres) {
        return cachedGenres;
    }

    try {
        const trackDetails = await withRetry(
            () => Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/tracks/${trackId}`),
            CONFIG.spotify.retryAttempts,
            CONFIG.spotify.retryDelay
        );

        if (trackDetails?.code || trackDetails?.error) {
            console.warn(`Failed to fetch track details for URI: ${trackUri}`, trackDetails);
            throw new Error(trackDetails.message || trackDetails.error);
        }

        if (!trackDetails?.artists?.length) {
            console.warn(`No artists found for track URI: ${trackUri}`);
            return [];
        }

        const isRecent = isTrackRecent(trackDetails.album.release_date);
        let spotifyGenres = new Set();

        const artistIds = [...new Set(trackDetails.artists.map(artist => artist.uri.split(":")[2]))];

        const artistBatches = [];
        for (let i = 0; i < artistIds.length; i += 50) {
            artistBatches.push(artistIds.slice(i, i + 50));
        }

        await Promise.all(artistBatches.map(async (batch) => {
            try {
                const artistData = await withRetry(
                    () => Spicetify.CosmosAsync.get(
                        `https://api.spotify.com/v1/artists?ids=${batch.join(',')}`
                    ),
                    CONFIG.spotify.retryAttempts,
                    CONFIG.spotify.retryDelay
                );
                
                if (artistData?.code || artistData?.error) {
                    console.warn(`Error in artist data:`, artistData);
                    throw new Error(artistData.message || artistData.error);
                }

                if (artistData?.artists) {
                    artistData.artists.forEach(artist => {
                        if (artist?.genres?.length > 0) {
                            const artistId = artist.id;
                            if (!artistGenreCache.has(artistId)) {
                                const genres = artist.genres
                                    .map(g => g.toLowerCase())
                                    .filter(genre => !containsYear(genre));
                                artistGenreCache.set(artistId, genres);
                                genres.forEach(genre => spotifyGenres.add(genre));
                            } else {
                                artistGenreCache.get(artistId).forEach(genre => spotifyGenres.add(genre));
                            }
                        }
                    });
                }
            } catch (error) {
                console.warn(`Error fetching Spotify genres for artists ${batch.join(',')}:`, error);
            }
        }));

        const lastfmGenres = await getLastfmGenres(trackDetails.artists[0].name, trackDetails.name, spotifyGenres);
        const artistNames = trackDetails.artists.map(artist => artist.name.toLowerCase());
        const filteredLastfmGenres = lastfmGenres.filter(genre => {
            return !containsYear(genre) && !artistNames.some(artistName => genre.includes(artistName));
        });
        
        const combinedGenres = new Map();

        spotifyGenres.forEach(genre => {
            combinedGenres.set(genre, { name: genre, source: 'spotify' });
        });

        filteredLastfmGenres.forEach(genre => {
            if (!combinedGenres.has(genre)) {
                combinedGenres.set(genre, { name: genre, source: 'lastfm' });
            }
        });

        const finalGenres = Array.from(combinedGenres.values());

        if (finalGenres.length > 0) {
            setCachedTrackGenres(trackId, finalGenres);
        } else if (!isRecent) {
            setCachedTrackGenres(trackId, []);
        }

        return finalGenres;

    } catch (error) {
        console.error(`Error fetching details for track ID ${trackId}:`, error);
        return [];
    }
  }
  
  function getNormalizedGenreKey(genre) {
    return genre
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/\s?music/g, '') 
      .replace(/[\s-]+/g, '');
  }

  const VARIANT_TO_MAIN_GENRE_MAP = {};
  Object.entries(GENRE_MAPPINGS).forEach(([mainGenre, variants]) => {
    const canonicalMainGenre = mainGenre;
    variants.forEach(variant => {
      const normalizedKey = getNormalizedGenreKey(variant);
      if (!VARIANT_TO_MAIN_GENRE_MAP[normalizedKey]) {
        VARIANT_TO_MAIN_GENRE_MAP[normalizedKey] = [];
      }
      if (!VARIANT_TO_MAIN_GENRE_MAP[normalizedKey].includes(canonicalMainGenre)) {
          VARIANT_TO_MAIN_GENRE_MAP[normalizedKey].push(canonicalMainGenre);
      }
    });
    const normalizedMainKey = getNormalizedGenreKey(mainGenre);
    if (!VARIANT_TO_MAIN_GENRE_MAP[normalizedMainKey]) {
        VARIANT_TO_MAIN_GENRE_MAP[normalizedMainKey] = [canonicalMainGenre];
    }
  });
  
  function mapAndNormalizeGenres(rawGenres) {
    const mappedGenres = new Set();
    if (!rawGenres) return [];

    rawGenres.forEach(genreObj => {
        const rawGenreName = typeof genreObj === 'string' ? genreObj : genreObj.name;
        const source = typeof genreObj === 'string' ? 'unknown' : genreObj.source;

        const normalizedKey = getNormalizedGenreKey(rawGenreName);
        
        if (VARIANT_TO_MAIN_GENRE_MAP[normalizedKey]) {
            VARIANT_TO_MAIN_GENRE_MAP[normalizedKey].forEach(mainGenre => {
                mappedGenres.add(JSON.stringify({ name: mainGenre, source: source }));
            });
        } else {
            mappedGenres.add(JSON.stringify({ name: rawGenreName.toLowerCase().trim(), source: source }));
        }
    });

    return Array.from(mappedGenres).map(item => JSON.parse(item));
  }

  async function fetchAllTrackGenres(tracks) {
    mainButton.innerText = "0%";
    return processGenreBatches(
      tracks,
      (progress) => {
        mainButton.innerText = `${progress}%`;
      }
    );
  }

  function filterTracksByGenres(tracks, selectedGenres, trackGenreMap) {
    if(matchAllGenres){
      if (selectedGenres.length === 0) {
          return [];
      }
      return tracks.filter((track) => {
        const trackGenres = trackGenreMap.get(track.uri);
        if (!trackGenres) return false;
        const trackGenreNames = new Set(trackGenres.map(g => g.name));
        return selectedGenres.every((selectedGenre) => 
          trackGenreNames.has(selectedGenre)
        );
      });
    } else {
      return tracks.filter((track) => {
        const trackGenres = trackGenreMap.get(track.uri);
        if (!trackGenres) return false;
        const trackGenreNames = new Set(trackGenres.map(g => g.name));
        return selectedGenres.some((selectedGenre) => 
          trackGenreNames.has(selectedGenre)
        );
      });
    }
  }

  const styleElement = document.createElement("style");
  styleElement.innerHTML = `
    .sort-play-font-scope,
    .sort-play-font-scope * {
      font-family: 'SpotifyMixUI', sans-serif !important;
    }
    .sort-play-failed-cell {
      position: relative;
      cursor: help;
      text-decoration: underline;
      text-decoration-style: dotted;
      text-decoration-color: var(--spice-subtext);
      text-underline-offset: 2px;
    }
    .sort-play-tooltip {
      visibility: hidden;
      width: max-content;
      max-width: 250px;
      background-color: #282828;
      color: #fff;
      text-align: center;
      border-radius: 4px;
      padding: 6px 10px;
      position: absolute;
      z-index: 1;
      bottom: 125%;
      left: 50%;
      transform: translateX(-50%);
      opacity: 0;
      transition: opacity 0.2s;
      font-size: 12px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      pointer-events: none;
      text-decoration: none;
    }
    .sort-play-failed-cell:hover .sort-play-tooltip {
      visibility: visible;
      opacity: 1;
    }
    .main-trackList-trackListRow .sort-play-like-button[aria-checked="true"],
    div[role="row"][aria-selected] .sort-play-like-button[aria-checked="true"] {
        opacity: 1 !important;
    }
    .loader {
      position: relative;
      width: 8px;
      height: 8px;
      border-radius: 5px;
      background-color: #555;
      color: #555;
      animation: 0.4s linear 0.2s infinite alternate none running loader;
    }
    
    .loader::before,
    .loader::after {
      content: "";
      display: inline-block;
      position: absolute;
      top: 0px;
    }
    
    .loader::before {
      left: -15px;
      width: 8px;
      height: 8px;
      border-radius: 5px;
      background-color: #555;
      color: #555;
      animation: 0.4s ease 0s infinite alternate none running loader;
    }
    
    .loader::after {
      left: 15px;
      width: 8px;
      height: 8px;
      border-radius: 5px;
      background-color: #555;
      color: #555;
      animation: 0.4s ease 0.4s infinite alternate none running loader;
    }
    
    @keyframes loader {
      0% {
        background-color: #555;
      }
      50%,
      100% {
        background-color: #888;
      }
    }
    .Button-sc-qlcn5g-0.Button-small-buttonTertiary-useBrowserDefaultFocusStyle {
      cursor: default;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 5px;
    }
    .sort-play-column {
      display: flex;
      align-items: center;
      justify-content: center;
      white-space: nowrap;
      text-overflow: ellipsis;
      width: 90px;
      color: var(--spice-text);
    }
    .main-trackList-row .sort-play-playcount {
        color: var(--spice-text);
        font-size: 13px;
        margin-left: 10px;
    }
    .main-trackList-row .sort-play-loading {
        color: var(--spice-subtext);
        font-size: 13px;
        margin-left: 10px;
    }
    .main-trackList-row .sort-play-playcount,
    .main-trackList-row .sort-play-loading {
        display: block;
        text-align: center;
        margin: auto;
    }
      div.main-trackList-trackList[aria-label="popular tracks"] .main-trackList-trackListHeaderRow .main-trackList-rowSectionVariable:nth-child(3) {
        justify-content: center;
    }
    div.main-trackList-trackList[aria-label="popular tracks"] .main-trackList-trackListRow .main-trackList-rowSectionVariable:nth-child(3) {
        justify-content: center;
    }
    #sort-play-now-playing-data {
        cursor: pointer;
    }
    #sort-play-now-playing-data:hover .sort-play-np-value {
        text-decoration: underline;
    }
  `;
  document.head.appendChild(styleElement);

  const albumDataCache = {};
  const inFlightAlbumRequests = {};
  const albumReleaseDateCache = {};
  const albumTracksDataCache = {};
  const inFlightAlbumReleaseDateRequests = {};

  const excludedPlaylistNames = ["New Music Friday", "Discover Weekly", "Release Radar"];

  function getCurrentPlaylistName() {
    const playlistNameElement = document.querySelector(
      ".encore-text.encore-text-headline-large"
    );
    return playlistNameElement ? playlistNameElement.textContent.trim() : null;
  }

  function isLikedSongsPage(uri) {
    if (!uri || typeof uri !== 'string') return false;
    try {
      const uriObj = Spicetify.URI.fromString(uri);
      return uriObj && uriObj.type === Spicetify.URI.Type.COLLECTION && uriObj.category === "tracks";
    } catch (e) {
      return false;
    }
  }

  function isLocalFilesPage(uri) {
    if (!uri || typeof uri !== 'string') return false;
    return uri === "spotify:collection:local-files";
  }

  function getCurrentUri() {
    const path = Spicetify.Platform.History.location?.pathname;
    if (!path) return null;

    const segments = path.split('/').filter(segment => segment.length > 0);
    
    const albumIndex = segments.indexOf('album');
    if (albumIndex > -1 && segments[albumIndex + 1]) {
        return `spotify:album:${segments[albumIndex + 1]}`;
    }
    
    const artistIndex = segments.indexOf('artist');
    if (artistIndex > -1 && segments[artistIndex + 1]) {
        return `spotify:artist:${segments[artistIndex + 1]}`;
    }
    
    const playlistIndex = segments.indexOf('playlist');
    if (playlistIndex > -1 && segments[playlistIndex + 1]) {
        return `spotify:playlist:${segments[playlistIndex + 1]}`;
    }
    
    if (segments.includes('collection') && segments.includes('tracks')) {
        return "spotify:collection:tracks";
    }
    
    if (segments.includes('collection') && segments.includes('local-files')) {
        return "spotify:collection:local-files";
    }
    
    return null;
  }
  
  async function getLikedSongs() {
    try {
      const likedTracksData = await Spicetify.Platform.LibraryAPI.getTracks({
        limit: Number.MAX_SAFE_INTEGER,
      });

      if (!likedTracksData || !likedTracksData.items) {
        throw new Error("Failed to fetch liked songs data.");
      }

      const likedTracks = likedTracksData.items.map((item) => ({
        uri: item.uri,
        uid: item.uid,
        name: item.name,
        albumUri: item.album.uri,
        albumName: item.album.name,
        artistUris: item.artists.map((artist) => artist.uri),
        artistName: item.artists[0].name,
        allArtists: item.artists.map(artist => artist.name).join(", "),
        durationMilis: item.duration.milliseconds,
        addedAt: item.addedAt,
        playCount: "N/A",
        popularity: null,
        releaseDate: null,
        track: {
            album: {
                id: item.album.uri.split(":")[2]
            },
            name: item.name,
            duration_ms: item.duration.milliseconds,
            id: item.uri.split(":")[2]
          }
      }));

      return likedTracks;

    } catch (error)      {
      console.error("Error fetching liked songs:", error);
      Spicetify.showNotification("Failed to fetch liked songs.", true);
      return [];
    }
  }
    
  async function getLocalFilesTracks() {
    try {
        const localTracksData = await Spicetify.Platform.LocalFilesAPI.getTracks();
        if (!localTracksData) {
            throw new Error("Failed to fetch local files data.");
        }

        return localTracksData.map((item) => ({
            uri: item.uri,
            uid: item.uid,
            name: item.name,
            albumUri: item.album.uri,
            albumName: item.album.name,
            artistUris: item.artists.map((artist) => artist.uri),
            artistName: item.artists[0].name,
            allArtists: normalizeArtistNames(item.artists),
            durationMilis: item.duration.milliseconds,
            playCount: "N/A",
            popularity: null,
            releaseDate: null,
            track: {
                album: {
                    id: item.album.uri.split(":")[2],
                    name: item.album.name,
                },
                name: item.name,
                duration_ms: item.duration.milliseconds,
                id: item.uri.split(":")[2]
            }
        }));
    } catch (error) {
        console.error("Error fetching local files:", error);
        Spicetify.showNotification("Failed to fetch local files.", true);
        return [];
    }
  }

  const fetchPlaylistContents = async (uri) => (await PlaylistAPI.getContents(uri)).items;

  const parsePlaylistAPITrack = (track) => ({
    uri: track.uri,
    uid: track.uid,
    name: track.name,
    albumUri: track.album.uri,
    albumName: track.album.name,
    artistUris: track.artists.map((artist) => artist.uri),
    allArtists: track.artists.map((artist) => artist.name).join(", "),
    artistName: track.artists[0].name,
    durationMilis: track.duration.milliseconds,
    playcount: 0,
    popularity: 0,
    releaseDate: 0,
    track: {
      album: {
        id: track.album.uri.split(":")[2]
      },
      name: track.name,
      duration_ms: track.duration.milliseconds,
      id: track.uri.split(":")[2]
    }
  });

  const getPlaylistTracksSpicetify = async (playlistId) => {
    const playlistUri = `spotify:playlist:${playlistId}`;
    const retries = 5;
    let delay = 1000;

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            if (!Spicetify || !URI) {
                throw new Error('Spicetify is not properly initialized');
            }

            if (!playlistId) {
                throw new Error('Invalid playlist ID');
            }

            const playlistContents = await fetchPlaylistContents(playlistUri);
            
            if (!playlistContents || !Array.isArray(playlistContents)) {
                throw new Error('Failed to fetch playlist contents');
            }

            const parsedTracks = playlistContents
                .filter(track => {
                    if (!track || !track.uri) {
                        return false;
                    }
                    return track.uri.startsWith("spotify:track:") || Spicetify.URI.isLocal(track.uri);
                })
                .map(track => {
                    try {
                        return parsePlaylistAPITrack(track);
                    } catch (parseError) {
                        Spicetify.showNotification(
                            'Error processing some tracks. Please try again.',
                            true
                        );
                        return null;
                    }
                })
                .filter(track => track !== null);

            if (parsedTracks.length === 0) {
                throw new Error('No valid tracks found in playlist');
            }

            return parsedTracks;
        } catch (error) {
            console.error(
                `Error fetching playlist tracks (Attempt ${attempt}/${retries}):`,
                error
            );
            
            if (attempt < retries) {
                await new Promise((resolve) => setTimeout(resolve, delay));
                delay *= 2;
            } else {
                console.error(
                    `Failed to fetch playlist tracks after ${retries} attempts.`
                );
                throw error;
            }
        }
    }
  };

  async function getPlaylistTracks(playlistId) {
    try {
        if (!playlistId || typeof playlistId !== 'string') {
            throw new Error('Invalid playlist format');
        }

        const tracks = await getPlaylistTracksSpicetify(playlistId);
        
        if (!Array.isArray(tracks)) {
            throw new Error('Failed to process playlist tracks');
        }

        if (tracks.length > 0) {
            return tracks;
        } else {
            throw new Error('No tracks found in playlist');
        }
    } catch (error) {
        console.error('Error in getPlaylistTracks:', error);
        Spicetify.showNotification(
            `Failed to fetch playlist tracks: ${error.message}. Please try again.`,
            true
        );
    }

    return [];
  }

  async function getAlbumTracks(albumId) {
    const { CosmosAsync } = Spicetify;
    try {
      const albumData = await CosmosAsync.get(`https://api.spotify.com/v1/albums/${albumId}`);
      if (!albumData || !albumData.tracks) {
        throw new Error("Failed to fetch initial album data.");
      }
  
      let allTracks = albumData.tracks.items;
      let nextUrl = albumData.tracks.next;
  
      while (nextUrl) {
        const nextPageData = await CosmosAsync.get(nextUrl);
        if (nextPageData && nextPageData.items) {
          allTracks.push(...nextPageData.items);
          nextUrl = nextPageData.next;
        } else {
          nextUrl = null; 
        }
      }

      return allTracks.map(track => ({
        uri: track.uri,
        uid: null,
        name: track.name,
        albumUri: albumData.uri,
        albumName: albumData.name,
        artistUris: track.artists.map(artist => artist.uri),
        allArtists: track.artists.map(artist => artist.name).join(", "),
        artistName: track.artists[0].name,
        durationMilis: track.duration_ms,
        playCount: "N/A",
        popularity: null,
        releaseDate: null,
        track: {
          album: {
            id: albumId,
            name: albumData.name,
          },
          name: track.name,
          duration_ms: track.duration_ms,
          id: track.id,
        }
      }));
    } catch (error) {
      console.error(`Error fetching tracks for album ${albumId}:`, error);
      Spicetify.showNotification("Failed to fetch all album tracks.", true);
      return [];
    }
  }

  async function getArtistTracks(artistUri, isHeadless = false) {
    const { Locale, GraphQL, CosmosAsync } = Spicetify;
  
    const queryArtistOverview = {
      name: "queryArtistOverview",
      operation: "query",
      sha256Hash: "35648a112beb1794e39ab931365f6ae4a8d45e65396d641eeda94e4003d41497",
    };
  
    if (!isHeadless) {
        mainButton.innerHTML = '<div class="loader"></div>';
        setButtonProcessing(true);
    }
  
    try {
      const artistData = await GraphQL.Request(queryArtistOverview, {
        uri: artistUri,
        locale: Locale.getLocale(),
        includePrerelease: false,
      });
  
      if (artistData.errors) throw new Error(artistData.errors[0].message);
      const artistName = artistData.data.artistUnion.profile.name;
      const artistId = artistUri.split(":")[2];

      const allAlbumIds = new Set();
      let nextUrl = `https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album,single,appears_on,compilation&limit=50`;
  
      do {
        const albumRes = await CosmosAsync.get(nextUrl);
        if (!albumRes.items) break;
  
        albumRes.items.forEach((album) => {
          allAlbumIds.add(album.id);
        });
  
        nextUrl = albumRes.next;
        if (nextUrl) await new Promise(resolve => setTimeout(resolve, 100)); 
      } while (nextUrl);
  
      const allTracks = [];
      const batchSize = 20; 
      const allAlbumIdArray = Array.from(allAlbumIds);
      const batchPromises = [];
      
      for (let i = 0; i < allAlbumIdArray.length; i += batchSize) {
        const batch = allAlbumIdArray.slice(i, i + batchSize);
        const promise = CosmosAsync.get(`https://api.spotify.com/v1/albums?ids=${batch.join(',')}`);
        batchPromises.push(promise);
      }
      
      const albumDataBatches = await Promise.all(batchPromises);
      
      for (const batch of albumDataBatches) {
        if (!batch.albums) continue;
        for (const album of batch.albums) {
          if (!album || !album.tracks || !album.tracks.items) continue;
          
          const tracksFromAlbum = album.tracks.items
            .filter(track => track.artists.some(artist => artist.name === artistName || artist.uri === artistUri))
            .map(track => ({
              uri: track.uri,
              uid: null, 
              name: track.name,
              albumUri: album.uri,
              albumName: album.name,
              artistUris: track.artists.map(artist => artist.uri),
              allArtists: track.artists.map(artist => artist.name).join(", "),
              artistName: track.artists[0].name,
              durationMilis: track.duration_ms,
              album_type: album.album_type,
              playcount: 0, popularity: 0, releaseDate: 0,
              track: {
                album: { id: album.id },
                name: track.name,
                duration_ms: track.duration_ms,
                id: track.id,
              },
            }));
          allTracks.push(...tracksFromAlbum);
        }
      }

      const coreTracks = [];
      const compilationTracks = [];

      for (const track of allTracks) {
        if (track.album_type === 'album' || track.album_type === 'single') {
          coreTracks.push(track);
        } else {
          compilationTracks.push(track);
        }
      }

      const uniqueCompilationTracksMap = new Map();
      for (const track of compilationTracks) {
        const title = (track.name || "").toLowerCase().trim();
        const duration = track.durationMilis;
        const artistKey = (track.artistUris || []).sort().join(',');
        const compositeKey = `${title}|${duration}|${artistKey}`;

        if (!uniqueCompilationTracksMap.has(compositeKey)) {
          uniqueCompilationTracksMap.set(compositeKey, track);
        }
      }
      const uniqueCompilationTracks = Array.from(uniqueCompilationTracksMap.values());

      const finalTracks = [...coreTracks, ...uniqueCompilationTracks];
  
      return finalTracks;
  
    } catch (error) {
      console.error("Error fetching artist tracks:", error);
      throw error;
    }
  }

  async function getArtistTracksForShuffle(artistUri) {
    const { Locale, GraphQL, CosmosAsync } = Spicetify;
  
    const queryArtistOverview = {
      name: "queryArtistOverview",
      operation: "query",
      sha256Hash: "35648a112beb1794e39ab931365f6ae4a8d45e65396d641eeda94e4003d41497",
    };
  
    try {
      const artistData = await GraphQL.Request(queryArtistOverview, {
        uri: artistUri,
        locale: Locale.getLocale(),
        includePrerelease: false,
      });
  
      if (artistData.errors) throw new Error(artistData.errors[0].message);
      const artistName = artistData.data.artistUnion.profile.name;
      const artistId = artistUri.split(":")[2];

      const allAlbumIds = new Set();
      let nextUrl = `https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album,single,appears_on,compilation&limit=50`;
  
      do {
        const albumRes = await CosmosAsync.get(nextUrl);
        if (!albumRes.items) break;
  
        albumRes.items.forEach((album) => {
          allAlbumIds.add(album.id);
        });
  
        nextUrl = albumRes.next;
        if (nextUrl) await new Promise(resolve => setTimeout(resolve, 100)); 
      } while (nextUrl);
  
      const allTracks = [];
      const batchSize = 20; 
      const allAlbumIdArray = Array.from(allAlbumIds);
      const batchPromises = [];
      
      for (let i = 0; i < allAlbumIdArray.length; i += batchSize) {
        const batch = allAlbumIdArray.slice(i, i + batchSize);
        const promise = CosmosAsync.get(`https://api.spotify.com/v1/albums?ids=${batch.join(',')}`);
        batchPromises.push(promise);
      }
      
      const albumDataBatches = await Promise.all(batchPromises);
      
      for (const batch of albumDataBatches) {
        if (!batch.albums) continue;
        for (const album of batch.albums) {
          if (!album || !album.tracks || !album.tracks.items) continue;
          
          const tracksFromAlbum = album.tracks.items
            .filter(track => track.artists.some(artist => artist.name === artistName || artist.uri === artistUri))
            .map(track => ({
              uri: track.uri,
              uid: null, 
              name: track.name,
              albumUri: album.uri,
              albumName: album.name,
              artistUris: track.artists.map(artist => artist.uri),
              allArtists: track.artists.map(artist => artist.name).join(", "),
              artistName: track.artists[0].name,
              durationMilis: track.duration_ms,
              album_type: album.album_type,
              playcount: 0, popularity: 0, releaseDate: 0,
              track: {
                album: { id: album.id },
                name: track.name,
                duration_ms: track.duration_ms,
                id: track.id,
              },
            }));
          allTracks.push(...tracksFromAlbum);
        }
      }
  
      const uniqueTracksMap = new Map();
      const isCoreDiscography = (track) => 
          track.album_type === 'album' || track.album_type === 'single';

      for (const track of allTracks) {
        const title = (track.name || "").toLowerCase().trim();
        const duration = track.durationMilis;
        const artistKey = (track.artistUris || []).sort().join(',');
        const compositeKey = `${title}|${duration}|${artistKey}`;

        const existingTrack = uniqueTracksMap.get(compositeKey);

        if (!existingTrack) {
            uniqueTracksMap.set(compositeKey, track);
        } else {
            if (isCoreDiscography(track) && !isCoreDiscography(existingTrack)) {
                uniqueTracksMap.set(compositeKey, track);
            }
        }
      }

      const uniqueTracks = Array.from(uniqueTracksMap.values());
  
      return uniqueTracks;
  
    } catch (error) {
      console.error("Error fetching artist tracks for shuffle:", error);
      throw error;
    }
  }

  async function getArtistImageUrl(artistId) {
    const artistData = await Spicetify.CosmosAsync.get(
      `https://api.spotify.com/v1/artists/${artistId}`
    );
    return artistData.images[0]?.url;
  }
  
  function setPlaylistImage(playlistId, base64Image, maxRetries = 10, retryInterval = 4000) {
    (async () => {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                try {
                    await Spicetify.CosmosAsync.put(
                        `https://api.spotify.com/v1/playlists/${playlistId}/images`,
                        base64Image.split("base64,")[1]
                    );
                } catch (putError) {
                    const isExpectedJsonError = putError instanceof SyntaxError && putError.message.includes("Unexpected end of JSON input");
                    if (!isExpectedJsonError) {
                        throw putError;
                    }
                }

                await new Promise(resolve => setTimeout(resolve, 1000));

                const updatedPlaylist = await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/playlists/${playlistId}`);
                
                if (updatedPlaylist?.images?.length > 0 && !isDefaultMosaicCover(updatedPlaylist.images[0].url)) {
                    return;
                } else {
                    throw new Error("Verification failed: Image not updated on Spotify's side yet.");
                }

            } catch (error) {                
                if (attempt < maxRetries) {
                    await new Promise(resolve => setTimeout(resolve, retryInterval));
                } else {
                    console.error(`[Sort-Play] Failed to set and verify playlist image for ${playlistId} after ${maxRetries} attempts.`);
                }
            }
        }
    })();
}

  async function imageUrlToBase64(url) {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
  }
  
  async function toBase64(imageUrl) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const size = 640;
        canvas.width = size;
        canvas.height = size;

        const sourceWidth = img.naturalWidth;
        const sourceHeight = img.naturalHeight;

        const cropSize = Math.min(sourceWidth, sourceHeight);
        const sx = (sourceWidth - cropSize) / 2;
        const sy = (sourceHeight - cropSize) / 2;

        ctx.drawImage(img, sx, sy, cropSize, cropSize, 0, 0, size, size);

        const dataUrl = canvas.toDataURL("image/jpeg"); 
        resolve(dataUrl);
      };
      img.onerror = (error) => reject(error);
      img.src = imageUrl;
    });
  }

  async function getPlayCountsForAlbum(albumId, retries = 10, retryDelay = 2000) {
    if (albumDataCache[albumId]) {
      return albumDataCache[albumId];
    }
    if (!inFlightAlbumRequests[albumId]) {
      inFlightAlbumRequests[albumId] = new Promise(async (resolve, reject) => {
        const { Locale, GraphQL } = Spicetify;

        for (let attempt = 1; attempt <= retries; attempt++) {
          try {
            const res = await GraphQL.Request(GraphQL.Definitions.getAlbum, {
              uri: `spotify:album:${albumId}`,
              locale: Locale.getLocale(),
              offset: 0,
              limit: 500,
            });

            if (!res.data?.albumUnion) {
              throw new Error(
                `No albumUnion in response for album ID: ${albumId}`
              );
            }

            const tracks = res.data.albumUnion.tracksV2 || res.data.albumUnion.tracks;
            if (!tracks?.items) {
              throw new Error(
                `No track items found in album data for album ID: ${albumId}`
              );
            }

            const albumTracks = tracks.items
              .map((item) => {
                const track = item.track;
                if (!track) {
                  console.warn(
                    `Missing track data in item for album ID: ${albumId}`
                  );
                  return null;
                }

                return {
                  uri: track.uri,
                  name: track.name,
                  trackNumber: parseInt(track.trackNumber, 10) || 0,
                  playcount: parseInt(track.playcount, 10) || 0,
                };
              })
              .filter((track) => track !== null);

            if (albumTracks.length === 0) {
              throw new Error(
                `No valid tracks found in response for album ID: ${albumId}`
              );
            }
            albumDataCache[albumId] = albumTracks;
            resolve(albumTracks);
            return;
          } catch (error) {
            if (attempt < retries) {
              await new Promise((resolve) => setTimeout(resolve, retryDelay));
              retryDelay *= 2;
            } else {
              reject(error);
            }
          }
        }
      });
    } 

    try {
      return await inFlightAlbumRequests[albumId];
    } catch (error) {
      console.error(`Final failure for album ID ${albumId}:`, error);
      return [];
    } finally {
      delete inFlightAlbumRequests[albumId];
    }
  }

  async function getReleaseDatesForAlbum(albumId, retries = 10, retryDelay = 2000) {
    if (albumReleaseDateCache[albumId]) {
      return albumReleaseDateCache[albumId];
    }

    if (!inFlightAlbumReleaseDateRequests[albumId]) {
      inFlightAlbumReleaseDateRequests[albumId] = new Promise(async (resolve, reject) => {
        if (albumTracksDataCache[albumId]) {
          const releaseDate = albumTracksDataCache[albumId][0]?.releaseDate;
          if (releaseDate) {
            albumReleaseDateCache[albumId] = releaseDate;
            resolve(releaseDate);
            return;
          }
        }

        const { Locale, GraphQL } = Spicetify;

        for (let attempt = 1; attempt <= retries; attempt++) {
          try {
            const res = await GraphQL.Request(GraphQL.Definitions.getAlbum, {
              uri: `spotify:album:${albumId}`,
              locale: Locale.getLocale(),
              offset: 0,
              limit: 500,
            });

            if (!res.data?.albumUnion) {
              throw new Error(`No albumUnion in response for album ID: ${albumId}`);
            }

            const releaseDate = new Date(res.data.albumUnion.date.isoString).getTime();
            albumReleaseDateCache[albumId] = releaseDate;

            const tracks = res.data.albumUnion.tracksV2?.items || res.data.albumUnion.tracks?.items;
            if (tracks) {
              const albumTracks = tracks.map((item) => {
                const track = item.track;
                return {
                  uri: track.uri,
                  name: track.name,
                  releaseDate: releaseDate, 
                };
              });
              albumTracksDataCache[albumId] = albumTracks;
            }

            resolve(releaseDate);
            return;
          } catch (error) {
            if (attempt < retries) {
              await new Promise((resolve) => setTimeout(resolve, retryDelay));
              retryDelay *= 2;
            } else {
              reject(error);
              return;
            }
          }
        }
      });
    } 

    try {
      return await inFlightAlbumReleaseDateRequests[albumId];
    } catch (error) {
      console.error(`Final failure for release date for album ID ${albumId}:`, error);
      return null;
    } finally {
      delete inFlightAlbumReleaseDateRequests[albumId];
    }
  }

  async function getTrackDetailsWithPlayCount(
    track,
    retries = 10,
    retryDelay = 1000
  ) {
    const albumId = track.track.album.id;

    try {
      const albumTracksWithPlayCounts = await getPlayCountsForAlbum(albumId);
      let playCount = "N/A";
      const foundTrack = albumTracksWithPlayCounts.find(
        (albumTrack) => albumTrack.uri === `spotify:track:${track.track.id}`
      );

      if (foundTrack) {
        playCount = foundTrack.playcount;
      }

      return {
        trackNumber: foundTrack ? foundTrack.trackNumber : 0,
        songTitle: track.name, 
        albumName: track.albumName || (track.album && track.album.name) ||  "Unknown Album",
        trackId: track.track.id,
        albumId: albumId,
        durationMs: track.track.duration_ms,
        playCount: playCount,
        uri: `spotify:track:${track.track.id}`,
        artistName: track.artistName,
        allArtists: track.allArtists,
      };
    } catch (error) {
      console.error(
        `Error getting details for track ${track.name} (album ${albumId}):`,
        error
      );

      if (retries > 0) {
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        return getTrackDetailsWithPlayCount(
          track,
          retries - 1,
          retryDelay * 2
        );
      } else {
        console.error(
          `Failed to get details for track ${track.name} after multiple retries.`
        );
        return null;
      }
    }
  }

  async function enrichTracksWithPlayCounts(tracks, updateProgress = () => {}) {
    const albumGroups = new Map();
    tracks.forEach(track => {
        const albumId = track?.track?.album?.id || track?.album?.id;
        if (albumId) {
            if (!albumGroups.has(albumId)) {
                albumGroups.set(albumId, []);
            }
            albumGroups.get(albumId).push(track);
        }
    });

    const uniqueAlbumIds = Array.from(albumGroups.keys());
    const albumPlayCountData = new Map();
    let processedAlbums = 0;
    const totalAlbums = uniqueAlbumIds.length;
    const CONCURRENCY_LIMIT = 10;

    async function processWithConcurrency(items, processorFn) {
        const results = new Map();
        const queue = [...items];
        
        async function worker() {
            while (queue.length > 0) {
                const albumId = queue.shift();
                if (albumId) {
                    try {
                        const albumTracks = await processorFn(albumId);
                        results.set(albumId, new Map(albumTracks.map(t => [t.uri, t])));
                    } catch (error) {
                        console.error(`Failed to process album ${albumId} in pool`, error);
                        results.set(albumId, new Map());
                    } finally {
                        processedAlbums++;
                        if (totalAlbums > 0) {
                            updateProgress(Math.floor((processedAlbums / totalAlbums) * 100));
                        }
                    }
                }
            }
        }

        const workers = Array(CONCURRENCY_LIMIT).fill(null).map(() => worker());
        await Promise.all(workers);
        return results;
    }

    const processedData = await processWithConcurrency(uniqueAlbumIds, getPlayCountsForAlbum);
    processedData.forEach((value, key) => {
        albumPlayCountData.set(key, value);
    });

    const enrichedTracks = tracks.map(track => {
        const albumId = track?.track?.album?.id || track?.album?.id;
        const trackId = track?.track?.id || track?.id;
        
        if (!albumId || !trackId) {
            return { 
                ...track, 
                playCount: "N/A", 
                trackNumber: 0,
                songTitle: track.name,
                trackId: trackId,
                albumId: albumId,
                uri: track.uri || (trackId ? `spotify:track:${trackId}` : undefined)
            };
        }

        const trackUri = `spotify:track:${trackId}`;
        const albumData = albumPlayCountData.get(albumId);
        const foundTrack = albumData ? albumData.get(trackUri) : null;

        const correctPlayCount = foundTrack ? foundTrack.playcount : "N/A";

        const enrichedData = {
            trackNumber: foundTrack ? foundTrack.trackNumber : 0,
            songTitle: track.name,
            albumName: track.albumName || track?.album?.name || (track?.track?.album?.name) || "Unknown Album",
            trackId: trackId,
            albumId: albumId,
            durationMs: track.durationMs || track.duration_ms || track?.track?.duration_ms,
            playcount: correctPlayCount,
            playCount: correctPlayCount,
            uri: trackUri,
            artistName: track.artistName || track?.artists?.[0]?.name,
            allArtists: track.allArtists || track?.artists?.map(a => a.name).join(", "),
        };
        
        return { ...track, ...enrichedData };
    });

    return enrichedTracks;
  }

  async function refreshTrackAlbumInfo(tracks, updateProgress = () => {}) {
    const BATCH_SIZE = 50;
    const refreshedTracks = [];
    const trackIds = tracks.map(t => t.id || t.track?.id).filter(Boolean);

    for (let i = 0; i < trackIds.length; i += BATCH_SIZE) {
        const batchIds = trackIds.slice(i, i + BATCH_SIZE);

        if (batchIds.length === 0) continue;

        try {
            const trackDetailsResponse = await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/tracks?ids=${batchIds.join(',')}`);
            if (trackDetailsResponse && trackDetailsResponse.tracks) {
                trackDetailsResponse.tracks.forEach(detailedTrack => {
                    if (!detailedTrack) return;

                    const newTrack = {
                        uri: detailedTrack.uri,
                        name: detailedTrack.name,
                        albumName: detailedTrack.album.name,
                        artistName: detailedTrack.artists[0]?.name,
                        allArtists: detailedTrack.artists.map(a => a.name).join(", "),
                        durationMs: detailedTrack.duration_ms,
                        popularity: detailedTrack.popularity,
                        trackId: detailedTrack.id,
                        albumId: detailedTrack.album.id,
                        track: {
                            id: detailedTrack.id,
                            name: detailedTrack.name,
                            uri: detailedTrack.uri,
                            duration_ms: detailedTrack.duration_ms,
                            album: {
                                id: detailedTrack.album.id,
                                name: detailedTrack.album.name,
                                uri: detailedTrack.album.uri,
                            },
                            artists: detailedTrack.artists.map(a => ({
                                id: a.id,
                                name: a.name,
                                uri: a.uri,
                            })),
                        }
                    };
                    refreshedTracks.push(newTrack);
                });
            }
        } catch (error) {
            console.warn(`[Sort-Play] Failed to refresh a batch of track album info:`, error);
        }
        const progress = Math.min(100, Math.floor(((i + BATCH_SIZE) / trackIds.length) * 100));
        updateProgress(progress);
    }
    return refreshedTracks;
  }
  
  async function collectTrackIdsForPopularity(track) {
    const trackId = track.uri.split(":")[2];
    return {
      ...track,
      trackId: trackId,
    };
  }

  async function fetchPopularityForMultipleTracks(
    tracks,
    updateProgress,
    totalProgressSteps = 1
  ) {
    const trackIds = tracks.map((track) => track.trackId).filter((id) => id);
    const batchSize = 100;
    const results = [];
    let tracksProcessed = 0;
    const maxRetries = 5;
    const initialDelay = 1000;  

    for (let i = 0; i < trackIds.length; i += batchSize) {
      const batch = trackIds.slice(i, i + batchSize);
      let retries = 0;
      let delay = initialDelay;
      let success = false;

      while (retries < maxRetries && !success) {
        try {
          const response = await Spicetify.CosmosAsync.get(
            `https://api.spotify.com/v1/tracks?ids=${batch.join(",")}`
          );

          if (response && response.tracks) {
            response.tracks.forEach((trackData) => {
              const originalTrack = tracks.find(
                (t) => t.trackId === trackData.id
              );
              if (originalTrack) {
                results.push({
                  ...originalTrack,
                  popularity: trackData.popularity,
                });
                tracksProcessed++;
              }
            });

            const intermediateProgress = Math.round(
              ((tracksProcessed / tracks.length) * 100) / totalProgressSteps
            );
            updateProgress(intermediateProgress);
            success = true; 
          } else {
          }
        } catch (error) {
        }
        if (!success) {
          retries++;
          if (retries < maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, delay));
            delay *= 2; 
          } else {
              batch.forEach((trackId) => {
                const originalTrack = tracks.find((t) => t.trackId === trackId);
                if (originalTrack) {
                  results.push({
                    ...originalTrack,
                    popularity: null,  
                  });
                }
              });
            tracksProcessed += batch.length; 
            const intermediateProgress = Math.round(
              ((tracksProcessed / tracks.length) * 100) / totalProgressSteps
            );
            updateProgress(intermediateProgress);
          }
        }
      }
    }

    return results;
  }

  async function getTrackDetailsWithReleaseDate(track) {
    let albumId;

    if (track.albumId) {
      albumId = track.albumId;
    } else if (track.albumUri) {
      albumId = track.albumUri.split(":")[2];
    } else {
      console.warn(`Could not determine album ID for track ${track.name}`);
      return {
        ...track,
        releaseDate: null,
      };
    }


    try {
      if (albumTracksDataCache[albumId]) {
        const trackData = albumTracksDataCache[albumId].find(t => t.uri === track.uri);
        if (trackData && trackData.releaseDate) {
          return {
            ...track,
            releaseDate: trackData.releaseDate,
          };
        }
      }

      const releaseDate = await getReleaseDatesForAlbum(albumId);
      if (releaseDate === null) {
        console.warn(`Could not fetch release date for track ${track.name}`);
      }

      return {
        ...track,
        releaseDate: releaseDate,
      };
    } catch (error) {
      console.error(`Error getting release date for track ${track.name} (album ${albumId}):`, error);
      return {
        ...track,
        releaseDate: null,
      };
    }
  }

  async function getTrackDetailsWithScrobbles(track) {
    const maxRetries = 5;
    const initialDelay = 1000; 
    let retries = 0;
    let delay = initialDelay;

    while (retries < maxRetries) {
      try {
        let artistName, trackName;

        if (track.artists) {
          artistName = track.artists[0]?.name || track.artistName;
          trackName = track.name;
        } else {
          artistName = track.artistName;
          trackName = track.name;
        }

        if (!artistName || !trackName) {
          console.warn("Missing artist name or track name:", track);
          return {
            ...track,
            scrobbles: null,
          };
        }

        const params = new URLSearchParams({
            method: 'track.getInfo',
            artist: encodeURIComponent(artistName),
            track: encodeURIComponent(trackName),
            format: 'json'
        });
        
        const response = await fetchLfmWithGateway(params);

        if (!response.ok) {
          throw new Error(
            `Last.fm API request failed with status ${response.status}`
          );
        }

        const data = await response.json();

        if (data.error) {
          if (data.error === 6) { 
            console.warn(
              `Track not found on Last.fm: ${trackName} by ${artistName}.`
            );
            return {
              ...track,
              scrobbles: 0,  
            };
          } else {
            throw new Error(`Last.fm API error: ${data.message}`);
          }
        }
        if (!data.track || !data.track.playcount) {
          return {
            ...track,
            scrobbles: null,
          };
        }

        const scrobbles = parseInt(data.track.playcount);

        return {
          ...track,
          scrobbles: scrobbles,
        };
      } catch (error) {
        console.error(
          `Error fetching scrobbles for track ${track.name} (Attempt ${
            retries + 1
          }):`,
          error
        );

        retries++;
        if (retries < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 2; 
        } else {
          console.error(
            `Failed to fetch scrobbles for track ${track.name} after ${maxRetries} attempts.`
          );
          return {
            ...track,
            scrobbles: null,
          };
        }
      }
    }
  }

  async function getTrackDetailsWithPersonalScrobbles(track) {
    const trackId = track.uri ? track.uri.split(":")[2] : (track.track ? track.track.id : null);
    if (!trackId) {
        return { ...track, personalScrobbles: null, error: "Invalid track ID." };
    }

    const isLocal = Spicetify.URI.isLocal(track.uri);

    const trackName = track.name;
    const artistName = track.artists ? track.artists[0]?.name || track.artistName : track.artistName;

    const isCurrentTrack = track.uri === currentTrackUriForScrobbleCache;
    const cachedData = isLocal ? null : getCachedPersonalScrobbles(trackId);

    if (cachedData && !cachedData.pendingUpdate && !isCurrentTrack) {
        return { ...track, personalScrobbles: cachedData.count };
    }

    const username = loadLastFmUsername();
    if (!username) {
      return { ...track, personalScrobbles: null, error: "Last.fm username not set." };
    }

    const maxRetries = 5;
    const initialDelay = 1000; 
    let retries = 0;
    let delay = initialDelay;

    while (retries < maxRetries) {
      try {
        if (!artistName || !trackName) {
          return { ...track, personalScrobbles: null, error: "Missing track metadata." };
        }

        const params = new URLSearchParams({
            method: 'track.getInfo',
            artist: encodeURIComponent(artistName),
            track: encodeURIComponent(trackName),
            username: username,
            format: 'json'
        });
        
        const response = await fetchLfmWithGateway(params);
        if (!response.ok) throw new Error(`Last.fm API request failed with status ${response.status}`);  
        
        const data = await response.json();

        if (data.error) {
          if (data.error === 6) { 
            if (!isLocal) {
                setCachedPersonalScrobbles(trackId, 0, false);
            }
            return { ...track, personalScrobbles: 0 };
          } else {
            throw new Error(`Last.fm API error: ${data.message}`);
          }
        }
        
        const newScrobbleCount = data.track?.userplaycount ? parseInt(data.track.userplaycount) : 0;
        
        if (!isLocal) {
            const oldScrobbleCount = cachedData ? cachedData.count : -1;

            if (newScrobbleCount > oldScrobbleCount) {
                setCachedPersonalScrobbles(trackId, newScrobbleCount, false);
            } else if (cachedData) {
                setCachedPersonalScrobbles(trackId, oldScrobbleCount, true);
            } else {
                setCachedPersonalScrobbles(trackId, newScrobbleCount, false);
            }
        }

        return { ...track, personalScrobbles: newScrobbleCount };

      } catch (error) {
        console.error(`Error fetching personal scrobbles for track ${trackName} (Attempt ${retries + 1}):`, error);
        retries++;
        if (retries < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 2;
        } else {
          return { ...track, personalScrobbles: null, error: `Failed to fetch after ${maxRetries} attempts.` };
        }
      }
    }
  }

  function showDefaultApiKeyWarning() {
    const modalContainer = document.createElement("div");
    modalContainer.innerHTML = `
      <style>
      .main-embedWidgetGenerator-container {
        width: 425px !important;
        border-radius: 30px;
        overflow: hidden; 
        background-color: #181818 !important;
        border: 2px solid #282828;
      }
      .GenericModal__overlay .GenericModal {
        border-radius: 30px;
        overflow: hidden;
      }
      .main-trackCreditsModal-mainSection {
        overflow-y: hidden !important;
      }
      .GenericModal > .main-embedWidgetGenerator-container {
        height: auto !important;
      } 
      .main-buttons-button:hover {
        filter: brightness(1.2); 
      }
      .main-trackCreditsModal-header {
        padding: 27px 32px 12px !important;
      }
      .main-trackCreditsModal-originalCredits{
        padding-bottom: 20px !important;
      }
      </style>
      <div style="display: flex; flex-direction: column; gap: 15px;">
        <div style="color: white; font-size: 16px; margin-bottom: 15px;">
          You are using the default API key for AI Pick. 
          For extended usage, please use your own API key.
        </div>
        <div style="display: flex; gap: 10px; justify-content: flex-end;">
          <button id="continueAnyway" class="main-buttons-button" 
                  style="padding: 8px 16px; border-radius: 20px; border: none; cursor: pointer; background-color: #333333; font-weight: 500; font-size: 13px; text-transform: uppercase; transition: all 0.04s ease;">
            Continue Anyway
          </button>
          <button id="addApiKey" class="main-buttons-button main-button-primary" 
                  style="padding: 8px 18px; border-radius: 20px; border: none; cursor: pointer; background-color: #1ED760; color: black; font-weight: 600; font-size: 13px; text-transform: uppercase; transition: all 0.04s ease;">
            Set Free API Key
          </button>
        </div>
      </div>
    `;
  
    Spicetify.PopupModal.display({
      title: "<span style='font-size: 25px;'>API Key Warning</span>",
      content: modalContainer,
      isLarge: true,
    });
    tagActiveModalWithFontScope();
  
    const continueButton = document.getElementById("continueAnyway");
    const addApiKeyButton = document.getElementById("addApiKey");
  
    continueButton.addEventListener("click", async () => {
      Spicetify.PopupModal.hide();
      menuButtons.forEach((btn) => {
        if (btn.tagName.toLowerCase() === 'button' && !btn.disabled) {
          btn.style.backgroundColor = "transparent";
        }
      });
      await handleSortAndCreatePlaylist("aiPick");  
    });
  
    addApiKeyButton.addEventListener("click", () => {
      Spicetify.PopupModal.hide();  
      setTimeout(() => {
        showGeminiApiKeyModal();  
      }, 350);
    });
  }

  function getSortArrowSvg(reverse) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 16 16");
    svg.setAttribute("width", "50%");
    svg.setAttribute("height", "50%");
    svg.style.fill = '#ffffffe6'; 
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", reverse
      ? "M.998 8.81A.749.749 0 0 1 .47 7.53L7.99 0l7.522 7.53a.75.75 0 1 1-1.06 1.06L8.74 2.87v12.38a.75.75 0 1 1-1.498 0V2.87L1.528 8.59a.751.751 0 0 1-.53.22z"
      : "M.998 7.19A.749.749 0 0 0 .47 8.47L7.99 16l7.522-7.53a.75.75 0 1 0-1.06-1.06L8.74 13.13V.75a.75.75 0 1 0-1.498 0v12.38L1.528 7.41a.749.749 0 0 0-.53-.22z"
    );

    svg.appendChild(path);
    return svg;
  }

  function createInnerButton(sortType, parentButton, svg) {
    const innerButton = document.createElement("button");
    innerButton.title = "Toggle Order (Ascending/Descending)";
    innerButton.appendChild(svg);

    innerButton.style.cssText = `
      background-color: transparent;
      border: none;
      border-radius: 2px;
      padding: 0;
      cursor: pointer;
      position: absolute;
      right: 0px;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
    `;

    innerButton.addEventListener("mouseenter", () => {
      svg.style.fill = "#1ED760";
    });

    innerButton.addEventListener("mouseleave", () => {
      svg.style.fill = 'currentColor';
    });

    innerButton.addEventListener("click", (event) => {
      event.stopPropagation();
      sortOrderState[sortType] = !sortOrderState[sortType];
      localStorage.setItem(`sort-play-${sortType}-reverse`, sortOrderState[sortType]);
      const path = svg.querySelector("path");
        if (path) {
          path.setAttribute("d", sortOrderState[sortType]
            ? "M.998 8.81A.749.749 0 0 1 .47 7.53L7.99 0l7.522 7.53a.75.75 0 1 1-1.06 1.06L8.74 2.87v12.38a.75.75 0 1 1-1.498 0V2.87L1.528 8.59a.751.751 0 0 1-.53.22z"
            : "M.998 7.19A.749.749 0 0 0 .47 8.47L7.99 16l7.522-7.53a.75.75 0 1 0-1.06-1.06L8.74 13.13V.75a.75.75 0 1 0-1.498 0v12.38L1.528 7.41a.749.749 0 0 0-.53-.22z"
          );
        }
    });

    return innerButton;
  }

  function createInnerPlayButton() {
    const plusIconSvg = `<svg width="17px" height="17px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 12H18M12 6V18" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

    const innerButton = document.createElement("button");
    innerButton.title = "Shuffle and Add to Queue";
    innerButton.innerHTML = plusIconSvg;

    const buttonBgColor = "rgba(var(--spice-rgb-selected-row), 0.03)";
    const buttonHoverBgColor = "rgba(var(--spice-rgb-selected-row), 0.2)";

    innerButton.style.cssText = `
      color: #ffffffe6;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      padding: 0;
      width: 35px;
      height: 25px;
      cursor: pointer;
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.1s ease;
    `;

    innerButton.style.backgroundColor = buttonBgColor;

    innerButton.addEventListener("mouseenter", () => {
      innerButton.style.backgroundColor = buttonHoverBgColor;
    });

    innerButton.addEventListener("mouseleave", () => {
      innerButton.style.backgroundColor = buttonBgColor;
    });

    innerButton.addEventListener("click", async (event) => {
      event.stopPropagation();
      innerButton.style.backgroundColor = buttonBgColor;
      
      menuButtons.forEach((btn) => {
        if (btn.tagName.toLowerCase() === 'button' && !btn.disabled) {
            btn.style.backgroundColor = "transparent";
        }
      });

      setButtonProcessing(true);
      mainButton.innerHTML = '<div class="loader"></div>';
      closeAllMenus();

      try {
        await executeShuffleAndPlay(getCurrentUri());
      } catch (error) {
        console.error("Error during shuffle and play:", error);
        Spicetify.showNotification(error.message, true);
      } finally {
        resetButtons();
      }
    });

    return innerButton;
  }

  const buttonStyles = {
    main: {
      backgroundColor: "transparent",
      color: "#FFFFFFB3",
      clickBackgroundColor: "transparent",
      disabledBackgroundColor: "#FFFFFFB3",
      disabledColor: "#474747",
    },
    menuItems: [
      {
        type: "parent",
        text: "Sort By",
        sortType: "sortByParent", 
        children: [
          { backgroundColor: "transparent", color: "white", text: "Play Count", sortType: "playCount", hasInnerButton: true },
          { backgroundColor: "transparent", color: "white", text: "Popularity", sortType: "popularity", hasInnerButton: true },
          { backgroundColor: "transparent", color: "white", text: "Release Date", sortType: "releaseDate", hasInnerButton: true },
          { backgroundColor: "transparent", color: "white", text: "Scrobbles", sortType: "scrobbles", hasInnerButton: true },
          { backgroundColor: "transparent", color: "white", text: "My Scrobbles", sortType: "personalScrobbles", hasInnerButton: true },
          { backgroundColor: "transparent", color: "white", text: "Last Scrobbled", sortType: "lastScrobbled", hasInnerButton: true },
          { backgroundColor: "transparent", color: "white", text: "Energy Wave", sortType: "energyWave", hasInnerButton: true },
          { backgroundColor: "transparent", color: "white", text: "Album Color", sortType: "averageColor", hasInnerButton: true },
          {
            type: "parent",
            text: "Audio Features",
            sortType: "audioFeaturesParent",
            children: [
              { backgroundColor: "transparent", color: "white", text: "Tempo (BPM)", sortType: "tempo", hasInnerButton: true },
              { backgroundColor: "transparent", color: "white", text: "Energy", sortType: "energy", hasInnerButton: true },
              { backgroundColor: "transparent", color: "white", text: "Danceability", sortType: "danceability", hasInnerButton: true },
              { backgroundColor: "transparent", color: "white", text: "Valence", sortType: "valence", hasInnerButton: true },
              { backgroundColor: "transparent", color: "white", text: "Acousticness", sortType: "acousticness", hasInnerButton: true },
              { backgroundColor: "transparent", color: "white", text: "Instrumentalness", sortType: "instrumentalness", hasInnerButton: true },
            ],
          },
        ],
      },
      {
        backgroundColor: "transparent",
        color: "white",
        text: "Shuffle",
        sortType: "shuffle",
        hasInnerPlayButton: true,
      },
      {
        backgroundColor: "transparent",
        color: "white",
        text: "Deduplicate",
        sortType: "deduplicateOnly",
      },
      {
        type: "divider",
      },
      {
        backgroundColor: "transparent",
        color: "white",
        text: "Create Playlist",
        sortType: "createNewPlaylist",
        onClick: (event) => {
          event.stopPropagation();
          menuButtons.forEach((btn) => {
            if (btn.tagName.toLowerCase() === 'button' && !btn.disabled) {
                btn.style.backgroundColor = "transparent";
            }
          });
          closeAllMenus();
          showCreatePlaylistModal();
        },
      },
      {
        backgroundColor: "transparent",
        color: "white",
        text: "Genre Filter",
        sortType: "genreFilter",
      },
      {
        backgroundColor: "transparent",
        color: "white",
        text: "Custom Filter",
        sortType: "customFilter",
      },
      {
        backgroundColor: "transparent",
        color: "white",
        text: "AI Pick",
        sortType: "aiPick",
        onClick: async function (event) {
          event.stopPropagation();
          const userApiKey = localStorage.getItem("sort-play-gemini-api-key");
          if (!userApiKey || Ge_mini_Key_Pool.includes(userApiKey)) {  
            showDefaultApiKeyWarning();
          } else {
            menuButtons.forEach((btn) => {
              if (btn.tagName.toLowerCase() === 'button' && !btn.disabled) {
                btn.style.backgroundColor = "transparent";
              }
            });
            await handleSortAndCreatePlaylist("aiPick");
          }
        },
      },
      {
        backgroundColor: "transparent",
        color: "white",
        text: "Dynamic Playlists",
        sortType: "dynamicPlaylists",
        onClick: (event) => {
          event.stopPropagation();
          menuButtons.forEach((btn) => {
            if (btn.tagName.toLowerCase() === 'button' && !btn.disabled) {
                btn.style.backgroundColor = "transparent";
            }
          });
          closeAllMenus();
          showDynamicPlaylistsWindow();
        },
      },
      {
        type: "divider",
      },
      {
        backgroundColor: "transparent",
        color: "white",
        text: "Settings",
        isSetting: true, 
      },
    ],
  };
  
  const settingsSvg = `<?xml version="1.0" encoding="utf-8"?>
  <!DOCTYPE svg>
  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 256 256" enable-background="new 0 0 256 256" xml:space="preserve">
  <g><g><path d="M244.1,105.9c-0.4-2.9-2.6-5.5-5.6-6.3c-10.7-3.3-19.9-10.7-25.8-20.7c-5.9-10.4-7.8-21.4-5.2-32.9c0.7-2.9-0.4-6.3-2.6-8.1c-11.4-9.9-24-17-37.7-21.8c-2.9-0.7-5.9,0-8.1,1.9c-8.5,7.8-19.5,12.2-31,12.2s-22.5-4.4-31-12.2c-2.2-2.2-5.2-2.6-8.1-1.9C75.3,20.6,62.8,28,51.3,38c-2.2,2.2-3.3,5.2-2.6,8.1c2.6,11.1,0.7,22.5-5.2,32.9c-5.9,10-14.8,17.4-26.2,21c-2.9,0.7-5.2,3.3-5.5,6.3c-1.1,8.1-1.9,15.1-1.9,21.8c0,7,0.4,13.7,1.9,21.8c0.4,3,2.6,5.2,5.5,6.3c11.1,3.7,20.3,11.1,26.2,21.1c5.9,10,7.8,21.8,5.2,32.5c-0.7,2.9,0.4,6.3,2.6,8.1c11.4,10,24,17,37.7,21.8c0.7,0.4,1.9,0.4,2.6,0.4c1.9,0,4-0.7,4.8-1.9c8.5-7.7,19.6-12.2,31-12.2s22.5,4.4,31,12.2c2.2,1.9,5.5,2.6,8.5,1.5c14.4-5.2,26.9-12.6,37.7-21.8c2.2-2.2,3.3-5.2,2.6-8.1c-2.6-11.1-0.7-22.5,5.2-32.9c5.9-10,14.8-17.4,26.2-21c3-0.7,5.2-3.3,5.6-6.3c1.1-8.1,1.9-15.2,1.9-21.8C246,120.7,245.6,114,244.1,105.9z M127.8,174.9c-25.4,0-46-20.6-46-46c0-25.4,20.6-46,46-46s46,20.6,46,46C173.8,154.2,153.2,174.9,127.8,174.9z"/></g></g>
  </svg>`;

  const sortIconSvg = `
  <svg width="22px" height="22px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M13 12H21M13 8H21M13 16H21M6 7V17M6 17L3 14M6 17L9 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
  
  const createPlaylistIconSvg = `
  <svg width="22px" height="21px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill="none" d="M16 5V18M16 18C16 19.1046 14.6569 20 13 20C11.3431 20 10 19.1046 10 18C10 16.8954 11.3431 16 13 16C14.6569 16 16 16.8954 16 18ZM4 5H12M4 9H12M4 13H8M16 4L20 3V7L16 8V4Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

  const dynamicPlaylistIconSvg = `
  <svg width="22px" height="21px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill="none" d="M5.06152 12C5.55362 8.05369 8.92001 5 12.9996 5C17.4179 5 20.9996 8.58172 20.9996 13C20.9996 17.4183 17.4179 21 12.9996 21H8M13 13V9M11 3H15M3 15H8M5 18H10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

  const genreFilterIconSvg = `
  <svg width="22px" height="21px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill="none" d="M20 20L18.2678 18.2678M18.2678 18.2678C18.7202 17.8154 19 17.1904 19 16.5C19 15.1193 17.8807 14 16.5 14C15.1193 14 14 15.1193 14 16.5C14 17.8807 15.1193 19 16.5 19C17.1904 19 17.8154 18.7202 18.2678 18.2678ZM15.6 10H18.4C18.9601 10 19.2401 10 19.454 9.89101C19.6422 9.79513 19.7951 9.64215 19.891 9.45399C20 9.24008 20 8.96005 20 8.4V5.6C20 5.03995 20 4.75992 19.891 4.54601C19.7951 4.35785 19.6422 4.20487 19.454 4.10899C19.2401 4 18.9601 4 18.4 4H15.6C15.0399 4 14.7599 4 14.546 4.10899C14.3578 4.20487 14.2049 4.35785 14.109 4.54601C14 4.75992 14 5.03995 14 5.6V8.4C14 8.96005 14 9.24008 14.109 9.45399C14.2049 9.64215 14.3578 9.79513 14.546 9.89101C14.7599 10 15.0399 10 15.6 10ZM5.6 10H8.4C8.96005 10 9.24008 10 9.45399 9.89101C9.64215 9.79513 9.79513 9.64215 9.89101 9.45399C10 9.24008 10 8.96005 10 8.4V5.6C10 5.03995 10 4.75992 9.89101 4.54601C9.79513 4.35785 9.64215 4.20487 9.45399 4.10899C9.24008 4 8.96005 4 8.4 4H5.6C5.03995 4 4.75992 4 4.54601 4.10899C4.35785 4.20487 4.20487 4.35785 4.10899 4.54601C4 4.75992 4 5.03995 4 5.6V8.4C4 8.96005 4 9.24008 4.10899 9.45399C4.20487 9.64215 4.35785 9.79513 4.54601 9.89101C4.75992 10 5.03995 10 5.6 10ZM5.6 20H8.4C8.96005 20 9.24008 20 9.45399 19.891C9.64215 19.7951 9.79513 19.6422 9.89101 19.454C10 19.2401 10 18.9601 10 18.4V15.6C10 15.0399 10 14.7599 9.89101 14.546C9.79513 14.3578 9.64215 14.2049 9.45399 14.109C9.24008 14 8.96005 14 8.4 14H5.6C5.03995 14 4.75992 14 4.54601 14.109C4.35785 14.2049 4.20487 14.3578 4.10899 14.546C4 14.7599 4 15.0399 4 15.6V18.4C4 18.9601 4 19.2401 4.10899 19.454C4.20487 19.6422 4.35785 19.7951 4.54601 19.891C4.75992 20 5.03995 20 5.6 20Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
  
  const customFilterIconSvg = `
  <svg width="22px" height="22px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill="none" d="M7 9H17M7 15H17M15 13V17M9 7V11M7.2 20H16.8C17.9201 20 18.4802 20 18.908 19.782C19.2843 19.5903 19.5903 19.2843 19.782 18.908C20 18.4802 20 17.9201 20 16.8V7.2C20 6.0799 20 5.51984 19.782 5.09202C19.5903 4.71569 19.2843 4.40973 18.908 4.21799C18.4802 4 17.9201 4 16.8 4H7.2C6.0799 4 5.51984 4 5.09202 4.21799C4.71569 4.40973 4.40973 4.71569 4.21799 5.09202C4 5.51984 4 6.07989 4 7.2V16.8C4 17.9201 4 18.4802 4.21799 18.908C4.40973 19.2843 4.71569 19.5903 5.09202 19.782C5.51984 20 6.07989 20 7.2 20Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

  const aiPickIconSvg = `
  <svg width="22px" height="22px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill="none" d="M12 3L14.0357 8.16153C14.2236 8.63799 14.3175 8.87622 14.4614 9.0771C14.5889 9.25516 14.7448 9.41106 14.9229 9.53859C15.1238 9.68245 15.362 9.77641 15.8385 9.96432L21 12L15.8385 14.0357C15.362 14.2236 15.1238 14.3175 14.9229 14.4614C14.7448 14.5889 14.5889 14.7448 14.4614 14.9229C14.3175 15.1238 14.2236 15.362 14.0357 15.8385L12 21L9.96432 15.8385C9.77641 15.362 9.68245 15.1238 9.53859 14.9229C9.41106 14.7448 9.25516 14.5889 9.0771 14.4614C8.87622 14.3175 8.63799 14.2236 8.16153 14.0357L3 12L8.16153 9.96432C8.63799 9.77641 8.87622 9.68245 9.0771 9.53859C9.25516 9.41106 9.41106 9.25516 9.53859 9.0771C9.68245 8.87622 9.77641 8.63799 9.96432 8.16153L12 3Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

  const shuffleIconSvg = `
  <svg width="22px" height="22px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill="none" d="M18 4L21 7M21 7L18 10M21 7H17C16.0707 7 15.606 7 15.2196 7.07686C13.6329 7.39249 12.3925 8.63288 12.0769 10.2196C12 10.606 12 11.0707 12 12C12 12.9293 12 13.394 11.9231 13.7804C11.6075 15.3671 10.3671 16.6075 8.78036 16.9231C8.39397 17 7.92931 17 7 17H3M18 20L21 17M21 17L18 14M21 17H17C16.0707 17 15.606 17 15.2196 16.9231C15.1457 16.9084 15.0724 16.8917 15 16.873M3 7H7C7.92931 7 8.39397 7 8.78036 7.07686C8.85435 7.09158 8.92758 7.1083 9 7.12698" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

  const deduplicateIconSvg = `
  <svg width="22px" height="22px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill="none" d="M8 8H7.2C6.0799 8 5.51984 8 5.09202 8.21799C4.71569 8.40973 4.40973 8.71569 4.21799 9.09202C4 9.51984 4 10.0799 4 11.2V16.8C4 17.9201 4 18.4802 4.21799 18.908C4.40973 19.2843 4.71569 19.5903 5.09202 19.782C5.51984 20 6.0799 20 7.2 20H12.8C13.9201 20 14.4802 20 14.908 19.782C15.2843 19.5903 15.5903 19.2843 15.782 18.908C16 18.4802 16 17.9201 16 16.8V16M11.2 16H16.8C17.9201 16 18.4802 16 18.908 15.782C19.2843 15.5903 19.5903 15.2843 19.782 14.908C20 14.4802 20 13.9201 20 12.8V7.2C20 6.0799 20 5.51984 19.782 5.09202C19.5903 4.71569 19.2843 4.40973 18.908 4.21799C18.4802 4 17.9201 4 16.8 4H11.2C10.0799 4 9.51984 4 9.09202 4.21799C8.71569 4.40973 8.40973 4.71569 8.21799 5.09202C8 5.51984 8 6.07989 8 7.2V12.8C8 13.9201 8 14.4802 8.21799 14.908C8.40973 15.2843 8.71569 15.5903 9.09202 15.782C9.51984 16 10.0799 16 11.2 16Z M17.186 6.814L10.814 13.186 M10.814 6.814L17.186 13.186" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

  const settingsIconSvg = `
  <svg width="22px" height="22px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill="none" d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path fill="none" d="M12.9046 3.06005C12.6988 3 12.4659 3 12 3C11.5341 3 11.3012 3 11.0954 3.06005C10.7942 3.14794 10.5281 3.32808 10.3346 3.57511C10.2024 3.74388 10.1159 3.96016 9.94291 4.39272C9.69419 5.01452 9.00393 5.33471 8.36857 5.123L7.79779 4.93281C7.3929 4.79785 7.19045 4.73036 6.99196 4.7188C6.70039 4.70181 6.4102 4.77032 6.15701 4.9159C5.98465 5.01501 5.83376 5.16591 5.53197 5.4677C5.21122 5.78845 5.05084 5.94882 4.94896 6.13189C4.79927 6.40084 4.73595 6.70934 4.76759 7.01551C4.78912 7.2239 4.87335 7.43449 5.04182 7.85566C5.30565 8.51523 5.05184 9.26878 4.44272 9.63433L4.16521 9.80087C3.74031 10.0558 3.52786 10.1833 3.37354 10.3588C3.23698 10.5141 3.13401 10.696 3.07109 10.893C3 11.1156 3 11.3658 3 11.8663C3 12.4589 3 12.7551 3.09462 13.0088C3.17823 13.2329 3.31422 13.4337 3.49124 13.5946C3.69158 13.7766 3.96395 13.8856 4.50866 14.1035C5.06534 14.3261 5.35196 14.9441 5.16236 15.5129L4.94721 16.1584C4.79819 16.6054 4.72367 16.829 4.7169 17.0486C4.70875 17.3127 4.77049 17.5742 4.89587 17.8067C5.00015 18.0002 5.16678 18.1668 5.5 18.5C5.83323 18.8332 5.99985 18.9998 6.19325 19.1041C6.4258 19.2295 6.68733 19.2913 6.9514 19.2831C7.17102 19.2763 7.39456 19.2018 7.84164 19.0528L8.36862 18.8771C9.00393 18.6654 9.6942 18.9855 9.94291 19.6073C10.1159 20.0398 10.2024 20.2561 10.3346 20.4249C10.5281 20.6719 10.7942 20.8521 11.0954 20.94C11.3012 21 11.5341 21 12 21C12.4659 21 12.6988 21 12.9046 20.94C13.2058 20.8521 13.4719 20.6719 13.6654 20.4249C13.7976 20.2561 13.8841 20.0398 14.0571 19.6073C14.3058 18.9855 14.9961 18.6654 15.6313 18.8773L16.1579 19.0529C16.605 19.2019 16.8286 19.2764 17.0482 19.2832C17.3123 19.2913 17.5738 19.2296 17.8063 19.1042C17.9997 18.9999 18.1664 18.8333 18.4996 18.5001C18.8328 18.1669 18.9994 18.0002 19.1037 17.8068C19.2291 17.5743 19.2908 17.3127 19.2827 17.0487C19.2759 16.8291 19.2014 16.6055 19.0524 16.1584L18.8374 15.5134C18.6477 14.9444 18.9344 14.3262 19.4913 14.1035C20.036 13.8856 20.3084 13.7766 20.5088 13.5946C20.6858 13.4337 20.8218 13.2329 20.9054 13.0088C21 12.7551 21 12.4589 21 11.8663C21 11.3658 21 11.1156 20.9289 10.893C20.866 10.696 20.763 10.5141 20.6265 10.3588C20.4721 10.1833 20.2597 10.0558 19.8348 9.80087L19.5569 9.63416C18.9478 9.26867 18.6939 8.51514 18.9578 7.85558C19.1262 7.43443 19.2105 7.22383 19.232 7.01543C19.2636 6.70926 19.2003 6.40077 19.0506 6.13181C18.9487 5.94875 18.7884 5.78837 18.4676 5.46762C18.1658 5.16584 18.0149 5.01494 17.8426 4.91583C17.5894 4.77024 17.2992 4.70174 17.0076 4.71872C16.8091 4.73029 16.6067 4.79777 16.2018 4.93273L15.6314 5.12287C14.9961 5.33464 14.3058 5.0145 14.0571 4.39272C13.8841 3.96016 13.7976 3.74388 13.6654 3.57511C13.4719 3.32808 13.2058 3.14794 12.9046 3.06005Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

  const buttonContainer = document.createElement("div");
  buttonContainer.style.position = "relative";
  buttonContainer.style.display = "inline-block";
  buttonContainer.style.width = "100px";
  const mainButton = document.createElement("button");
  mainButton.title = "sort-play extension";
  mainButton.className = "Button-sc-qlcn5g-0 Button-small-buttonTertiary-useBrowserDefaultFocusStyle";
  mainButton.innerText = "Sort Play"; 
  mainButton.style.backgroundColor = buttonStyles.main.backgroundColor;
  mainButton.style.color = 'var(--sort-play-text-color)';
  mainButton.style.borderRadius = "16px";
  mainButton.style.border = "none";
  mainButton.style.padding = "4px 10px";
  mainButton.style.fontWeight = "400";
  mainButton.style.fontSize = "14px";
  mainButton.style.height = "30px";  
  mainButton.style.overflow = "hidden";
  mainButton.style.width = "100px";
  mainButton.style.display = "flex";
  mainButton.style.justifyContent = "center";
  mainButton.style.alignItems = "center";

  const threeDotsSvg = `
    <svg width="15px" height="15px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
      <path d="M9.5 14a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
    </svg>`;

  const svgElement = new DOMParser().parseFromString(threeDotsSvg, "image/svg+xml").documentElement;
  svgElement.style.position = "relative";
  svgElement.style.marginLeft = "-2px";
  svgElement.style.bottom = "1px";
  mainButton.appendChild(svgElement);

  let isButtonClicked = false;

  mainButton.addEventListener("mouseenter", () => {
    mainButton.style.cursor = "pointer";
    if (!isProcessing) { 
      mainButton.style.filter = "brightness(1.5)";
    }
  });
  
  mainButton.addEventListener("mouseleave", () => {
    mainButton.style.cursor = "pointer"; 
    if (!isProcessing) {  
      if (!isButtonClicked) {
        mainButton.style.filter = "brightness(1)";
      }
    }
  });


  function getNativeMenuTextColor() {
    const primaryClass = 'niXChlbt7kxslMUdfwu9';
    const fallbackClass = 'main-contextMenu-menuItemButton';
    let tempContainer = null;

    try {
      tempContainer = document.createElement('div');
      tempContainer.className = 'main-contextMenu-menu';
      tempContainer.style.cssText = 'position: absolute; top: -9999px; left: -9999px; visibility: hidden;';
      
      const tempButton = document.createElement('button');
      tempButton.className = 'main-contextMenu-menuItemButton';
      tempContainer.appendChild(tempButton);
      document.body.appendChild(tempContainer);

      const tempSpan = document.createElement('span');
      tempSpan.className = "e-91000-text encore-text-body-small ellipsis-one-line m1hZc7vcFunpAF8jgPq6";
      tempSpan.innerText = "Add to queue";
      tempButton.appendChild(tempSpan);

      let textColor = window.getComputedStyle(tempSpan).color;
      tempButton.removeChild(tempSpan);

      if (textColor && textColor !== 'rgba(0, 0, 0, 0)' && textColor !== 'transparent') {
        return textColor;
      }

      tempButton.className = primaryClass;
      textColor = window.getComputedStyle(tempButton).color;

      if (textColor && textColor !== 'rgba(0, 0, 0, 0)' && textColor !== 'transparent') {
        return textColor;
      }

      tempButton.className = fallbackClass;
      textColor = window.getComputedStyle(tempButton).color;

      if (textColor && textColor !== 'rgba(0, 0, 0, 0)' && textColor !== 'transparent') {
        return textColor;
      }

      return '#b3b3b3'; 

    } catch (error) {
      console.warn("Sort-Play: Error detecting native menu text color.", error);
      return '#b3b3b3';
    } finally {
      if (tempContainer) {
        document.body.removeChild(tempContainer);
      }
    }
  }

  
  function getNativeTertiaryButtonColor() {
    const targetClass = 'Button-sc-qlcn5g-0 Button-buttonTertiary-large-iconOnly-useBrowserDefaultFocusStyle-condensed';
    const tempButton = document.createElement('button');
    tempButton.className = targetClass;
    tempButton.style.cssText = 'position: absolute; top: -9999px; left: -9999px; visibility: hidden;';
    document.body.appendChild(tempButton);
    const textColor = window.getComputedStyle(tempButton).color;
    document.body.removeChild(tempButton);
    return textColor;
  }


  const menuContainer = document.createElement("div");
  menuContainer.style.position = "fixed";
  menuContainer.style.display = "none";
  menuContainer.style.flexDirection = "column";
  menuContainer.style.zIndex = "1";
  menuContainer.style.padding = "4px 4px";
  menuContainer.style.transform = "translateX(-50%)";
  menuContainer.style.borderRadius = "4px";
  menuContainer.style.boxShadow = "0 16px 24px rgba(var(--spice-rgb-shadow), .3), 0 6px 8px rgba(var(--spice-rgb-shadow), .2)";
  menuContainer.style.backgroundColor = getNativeMenuBackgroundColor();
  menuContainer.style.backdropFilter = "blur(8px)";
  menuContainer.classList.add('main-contextMenu-menu');
  menuContainer.classList.add('sort-play-font-scope');
  
  const menuButtons = buttonStyles.menuItems.map((style) => {
    if (style.type === "divider") {
      const divider = document.createElement("hr");
      divider.style.cssText = `
        width: 100%;
        border: none;
        height: 1px;
        background-color: rgba(255, 255, 255, 0.1);
        margin: 0 auto;
      `;
      return divider;
    }

    if (style.type === "parent") {
      const parentButton = document.createElement("button");
      parentButton.style.backgroundColor = "transparent";
      parentButton.style.color = '#ffffffe6';
      parentButton.style.border = "none";
      parentButton.style.borderRadius = "2px";
      parentButton.style.margin = "0";
      parentButton.style.padding = "4px 10px 4px 8px";
      parentButton.style.fontWeight = "400";
      parentButton.style.fontSize = "0.875rem";
      parentButton.style.height = "39px";
      parentButton.style.width = "183px";
      parentButton.style.textAlign = "center";
      parentButton.style.opacity = "0";
      parentButton.style.transform = "translateY(-10px)";
      parentButton.style.position = "relative";
      parentButton.style.display = "flex";
      parentButton.style.alignItems = "center";
      parentButton.style.justifyContent = "space-between";
      parentButton.dataset.isParent = 'true';
      parentButton.dataset.sortType = style.sortType;

      const leftContainer = document.createElement("div");
      leftContainer.style.display = "flex";
      leftContainer.style.alignItems = "center";
      leftContainer.style.gap = "10px";

      let iconSvgString;
      if (style.text === "Personalized Sort") {
        iconSvgString = personalizedSortIconSvg;
      } else {
        iconSvgString = sortIconSvg;
      }
      const icon = new DOMParser().parseFromString(iconSvgString, "image/svg+xml").documentElement;
      leftContainer.appendChild(icon);

      const buttonTextSpan = document.createElement("span");
      buttonTextSpan.innerText = style.text;
      leftContainer.appendChild(buttonTextSpan);
      parentButton.appendChild(leftContainer);
     
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("viewBox", "0 0 16 16");
      svg.setAttribute("width", "16px");
      svg.setAttribute("height", "16px");
      svg.style.fill = 'var(--sort-play-icon-color)';
      svg.style.transform = "translateX(2px)";
    
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", "M6 14l6-6-6-6v12z");
      
      svg.appendChild(path);
      parentButton.appendChild(svg);
      
      parentButton.addEventListener("mouseenter", () => {
        if (!parentButton.disabled) {
          if (activeSubMenuParent && activeSubMenuParent !== parentButton) {
            activeSubMenuParent.style.backgroundColor = "transparent";
          }
          parentButton.style.backgroundColor = "rgba(var(--spice-rgb-selected-row), 0.1)";
          activeSubMenuParent = parentButton;
          showSubMenu(parentButton);
        }
      });
      
      parentButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        return false;
      });

      return parentButton;
    } else {
      const button = document.createElement("button");
      button.style.backgroundColor = "transparent";
      button.style.color = '#ffffffe6';
      button.style.border = "none";
      button.style.borderRadius = "2px";
      button.style.margin = "0"; 
      button.style.padding = "4px 10px 4px 8px";
      button.style.fontWeight = "400";
      button.style.fontSize = "0.875rem";
      button.style.height = "39px";
      button.style.width = "183px";
      button.style.textAlign = "left";
      button.style.opacity = "0";
      button.style.transform = "translateY(-10px)";
      button.style.position = "relative"; 
      button.style.display = "flex";  
      button.style.alignItems = "center";  
      button.style.justifyContent = "flex-start";
      button.style.gap = "10px";

      button.addEventListener("mouseenter", () => {
        button.style.backgroundColor = "rgba(var(--spice-rgb-selected-row), 0.1)";
        if (activeSubMenuParent) {
          activeSubMenuParent.style.backgroundColor = "transparent";
          activeSubMenuParent = null;
        }
        hideAllSubMenus();
      });
    
      button.addEventListener("mouseleave", () => {
        if (!button.disabled) {
          button.style.backgroundColor = "transparent";
        }
      });
      
      let iconSvgString;
      if (style.text === "Create Playlist") {
        iconSvgString = createPlaylistIconSvg;
      } else if (style.text === "Dynamic Playlists") {
        iconSvgString = dynamicPlaylistIconSvg;
      } else if (style.text === "Genre Filter") {
        iconSvgString = genreFilterIconSvg;
      } else if (style.text === "Custom Filter") {
        iconSvgString = customFilterIconSvg;
      } else if (style.text === "AI Pick") {
        iconSvgString = aiPickIconSvg;
      } else if (style.text === "Shuffle") {
        iconSvgString = shuffleIconSvg;
      } else if (style.text === "Deduplicate") {
        iconSvgString = deduplicateIconSvg;
      } else if (style.isSetting) {
        iconSvgString = settingsIconSvg;
      } else {
        iconSvgString = sortIconSvg;
      }
      const icon = new DOMParser().parseFromString(iconSvgString, "image/svg+xml").documentElement;
      button.appendChild(icon);

      const buttonTextSpan = document.createElement("span");
      buttonTextSpan.innerText = style.text;
      button.appendChild(buttonTextSpan);

      if (style.isSetting) {
        button.addEventListener("click", () => {
          button.style.backgroundColor = "transparent";
        });
      }
      return button;
    }
  });

  menuButtons.forEach(button => menuContainer.appendChild(button));
  
  let isMenuOpen = false;
  let areSubMenusCreated = false;
  let activeSubMenuParent = null;

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
    if (isMenuOpen) {
      if (!areSubMenusCreated) {
        const processMenuItems = (buttons, itemConfigs) => {
            buttons.forEach(button => {
                const sortType = button.dataset.sortType;
                if (sortType) {
                    const style = itemConfigs.find(item => item.sortType === sortType);
                    if (style && style.type === 'parent' && style.children) {
                        const subMenu = createSubMenu(style.children);
                        document.body.appendChild(subMenu);
                        button._submenu = subMenu;
                        
                        const subMenuParentButtons = Array.from(subMenu.querySelectorAll('button[data-is-parent]'));
                        processMenuItems(subMenuParentButtons, style.children);
                    }
                }
            });
        };
        processMenuItems(menuButtons, buttonStyles.menuItems);
        areSubMenusCreated = true;
      }

      menuContainer.style.backgroundColor = getNativeMenuBackgroundColor();

      applyCurrentThemeColors();
      const buttonRect = mainButton.getBoundingClientRect();
      const { bottom: headerBottom } = getHeaderInfo();

      if (buttonRect.bottom <= headerBottom) {
        isMenuOpen = false;
        return;
      }
      
      menuContainer.style.top = '0px';
      menuContainer.style.left = '0px';
      menuContainer.style.transform = 'none';
      menuContainer.style.display = 'flex';
      document.body.appendChild(menuContainer);

      checkAndUpdateMenuPosition();
      
      menuButtons.forEach((button) => {
        button.style.opacity = "1";
        button.style.transform = "translateY(0)";
      });
    } else {
      closeAllMenus();
    }
  }

  function closeAllMenus() {
    isMenuOpen = false;
    menuContainer.style.display = "none";
    if (menuContainer.parentElement === document.body) {
      document.body.removeChild(menuContainer);
    }
    
    if (activeSubMenuParent) {
      activeSubMenuParent.style.backgroundColor = "transparent";
      activeSubMenuParent = null;
    }
    hideAllSubMenus();
    
    isButtonClicked = false;
    mainButton.style.filter = "brightness(1)";
  }
  
  function hideAllSubMenus() {
    document.querySelectorAll('.submenu').forEach(sm => {
      sm.style.display = 'none';
      if (sm._activeSubMenuParent) {
        sm._activeSubMenuParent.style.backgroundColor = 'transparent';
        sm._activeSubMenuParent = null;
      }
    });
  }

  function createSubMenu(items) {
    const subMenu = document.createElement("div");
    subMenu.classList.add("submenu", "main-contextMenu-menu", "sort-play-font-scope");
    const bgColor = getNativeMenuBackgroundColor();
    subMenu.style.cssText = `
      position: fixed;
      display: none;
      flex-direction: column;
      z-index: 2000;
      padding: 4px;
      border-radius: 4px;
      box-shadow: 0 16px 24px rgba(var(--spice-rgb-shadow), .3), 0 6px 8px rgba(var(--spice-rgb-shadow), .2);
      background-color: ${bgColor};
      backdrop-filter: blur(8px);
    `;

    subMenu._activeSubMenuParent = null;

    items.forEach((item) => {
      if (item.type === "title") {
        const titleElement = document.createElement("div");
        titleElement.innerText = item.text;
        titleElement.style.cssText = `
          color: #878787;
          font-size: 0.600rem;
          font-weight: 700;
          letter-spacing: .08em;
          line-height: 16px;
          text-transform: uppercase;
          padding: 8px 12px 4px;
          pointer-events: none;
          margin-left: -2px;
        `;
        subMenu.appendChild(titleElement);
        return;
      }

      if (item.type === "parent") {
        const parentButton = document.createElement("button");
        parentButton.style.cssText = `
          background-color: transparent;
          color: #ffffffe6;
          border: none;
          border-radius: 2px;
          margin: 0;
          padding: 4px 10px 4px 8px;
          font-weight: 400;
          font-size: 0.875rem;
          height: 39px;
          width: 155px;
          text-align: left;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
        `;
        parentButton.dataset.isParent = 'true';
        parentButton.dataset.sortType = item.sortType;

        const buttonTextSpan = document.createElement("span");
        buttonTextSpan.innerText = item.text;
        parentButton.appendChild(buttonTextSpan);
       
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 16 16");
        svg.setAttribute("width", "16px");
        svg.setAttribute("height", "16px");
        svg.style.fill = 'var(--sort-play-icon-color)';
        svg.style.transform = "translateX(2px)";
      
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M6 14l6-6-6-6v12z");
        
        svg.appendChild(path);
        parentButton.appendChild(svg);

        parentButton.addEventListener("mouseenter", () => {
          if (!parentButton.disabled) {
            if (subMenu._activeSubMenuParent && subMenu._activeSubMenuParent !== parentButton) {
              subMenu._activeSubMenuParent.style.backgroundColor = "transparent";
            }
            parentButton.style.backgroundColor = "rgba(var(--spice-rgb-selected-row), 0.1)";
            subMenu._activeSubMenuParent = parentButton;
            showSubMenu(parentButton);
          }
        });
        
        parentButton.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          return false;
        });

        subMenu.appendChild(parentButton);
        return;
      }

      const button = document.createElement("button");
      button.style.backgroundColor = item.backgroundColor;
      button.style.color = '#ffffffe6';
      button.style.border = "none";
      button.style.borderRadius = "2px";
      button.style.margin = "0";
      button.style.padding = "4px 10px";
      button.style.fontWeight = "400";
      button.style.fontSize = "0.875rem";
      button.style.height = "37px";
      button.style.width = "155px";
      button.style.textAlign = "center";
      button.style.position = "relative";
      button.style.display = "flex";
      button.style.alignItems = "center";
      button.style.justifyContent = "space-between";
      button.innerText = item.text;

      button.addEventListener("mouseenter", () => {
        if (!button.disabled) {
          button.style.backgroundColor = "rgba(var(--spice-rgb-selected-row), 0.1)";
          if (subMenu._activeSubMenuParent) {
            subMenu._activeSubMenuParent.style.backgroundColor = "transparent";
            if (subMenu._activeSubMenuParent._submenu) {
              subMenu._activeSubMenuParent._submenu.style.display = 'none';
            }
            subMenu._activeSubMenuParent = null;
          }
        }
      });
  
      button.addEventListener("mouseleave", () => {
        button.style.backgroundColor = item.backgroundColor;
      });
  
      if (item.hasInnerButton) {
        const svg = getSortArrowSvg(sortOrderState[item.sortType]); 
        const innerButton = createInnerButton(item.sortType, button, svg); 
        button.appendChild(innerButton);
      }
  
      button.addEventListener("click", async (event) => {
        event.stopPropagation();
        if (item.onClick) {
          await item.onClick(event);
        } else {
          await handleSortAndCreatePlaylist(item.sortType);
        }
        closeAllMenus();
      });
  
      subMenu.appendChild(button);
    });

    return subMenu;
  }

  function showSubMenu(parentButton) {
    const parentMenu = parentButton.parentElement;
    if (parentMenu) {
        parentMenu.querySelectorAll('button[data-is-parent]').forEach(siblingParent => {
            if (siblingParent !== parentButton && siblingParent._submenu) {
                siblingParent._submenu.style.display = 'none';
                siblingParent.style.backgroundColor = "transparent";
            }
        });
    }

    const subMenu = parentButton._submenu;
    if (!subMenu) return;

    subMenu.style.visibility = 'hidden';
    subMenu.style.display = 'flex';
    const subMenuHeight = subMenu.offsetHeight;
    const subMenuWidth = subMenu.offsetWidth;
    
    const parentRect = parentButton.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const margin = 8;

    let finalTop;
    let finalLeft;

    const spaceRight = viewportWidth - parentRect.right;
    const spaceLeft = parentRect.left;

    if (spaceRight >= subMenuWidth + margin) {
        finalLeft = parentRect.right;
    } else if (spaceLeft >= subMenuWidth + margin) {
        finalLeft = parentRect.left - subMenuWidth;
    } else {
        finalLeft = (spaceRight > spaceLeft) 
            ? viewportWidth - subMenuWidth - margin 
            : margin;
    }
    const topAlignedTop = parentRect.top;
    if ((topAlignedTop + subMenuHeight) <= (viewportHeight - margin)) {
        finalTop = topAlignedTop;
    } 

    else {
        const centerAlignedTop = parentRect.top + (parentRect.height / 2) - (subMenuHeight / 2);
        if (centerAlignedTop >= margin && (centerAlignedTop + subMenuHeight) <= (viewportHeight - margin)) {
            finalTop = centerAlignedTop;
        } 
        else {
            finalTop = parentRect.bottom - subMenuHeight;
        }
    }

    finalTop = Math.max(margin, Math.min(finalTop, viewportHeight - subMenuHeight - margin));

    subMenu.style.left = `${finalLeft}px`;
    subMenu.style.top = `${finalTop}px`;
    subMenu.style.visibility = 'visible';
  }
  
  window.addEventListener('resize', closeAllMenus);

  window.addEventListener('scroll', closeAllMenus);

  let setButtonProcessing = (processing) => {
    isProcessing = processing;
    mainButton.style.cursor = "pointer"; 
    
    if (processing) {
      mainButton.style.backgroundColor = buttonStyles.main.disabledBackgroundColor;
      mainButton.style.color = buttonStyles.main.disabledColor;
      svgElement.style.fill = buttonStyles.main.disabledColor;
    } else {
      mainButton.style.backgroundColor = buttonStyles.main.backgroundColor;
      mainButton.style.color = buttonStyles.main.color;
      svgElement.style.fill = buttonStyles.main.color;
    }
  };
  
  const container = document.createElement("div");
  document.body.appendChild(container);

  mainButton.addEventListener("click", async (event) => {
    event.stopPropagation();
    if (isProcessing) {
      const confirmed = await showConfirmationModal({
        title: "Stop and Reload Spotify?",
        description: "This will stop the current Sort-Play operation and reload Spotify. Unsaved changes may be lost.",
        confirmText: "Confirm",
        cancelText: "Cancel",
      });

      if (confirmed === 'confirm') {
        closeAllMenus();
        mainButton.style.backgroundColor = buttonStyles.main.backgroundColor;
        mainButton.innerText = "Stopping...";
        setButtonProcessing(false);
        location.reload();
      }
      return;
    }
  
    isButtonClicked = !isMenuOpen; 
    
    if (!isMenuOpen) {
      toggleMenu();
    } else {
      closeAllMenus();
    }
  });
  
  document.addEventListener("click", (event) => {
    if (isMenuOpen && !mainButton.contains(event.target) && !menuContainer.contains(event.target)) {
      closeAllMenus(); 
    }
  });

  function getHeaderInfo() {
    const header = document.querySelector('[data-testid="topbar"]');
    if (!header) return { height: 0, bottom: 0 };
    const headerRect = header.getBoundingClientRect();
    return {
        height: headerRect.height,
        bottom: headerRect.bottom
    };
  }

  function checkAndUpdateMenuPosition() {
    if (!isMenuOpen) return;

    const buttonRect = mainButton.getBoundingClientRect();
    const { bottom: headerBottom } = getHeaderInfo();
    const menuHeight = menuContainer.offsetHeight;
    const menuWidth = menuContainer.offsetWidth;

    if (buttonRect.bottom <= headerBottom) {
        closeAllMenus();
        return;
    }

    const spaceBelow = window.innerHeight - buttonRect.bottom;
    const usableSpaceAbove = buttonRect.top - headerBottom;
    
    let topPosition;
    let leftPosition;

    if (spaceBelow >= menuHeight + 8) {
        topPosition = buttonRect.bottom + 8;
        leftPosition = buttonRect.right - menuWidth;
    } 
    else if (usableSpaceAbove >= menuHeight + 8) {
        topPosition = buttonRect.top - menuHeight - 8;
        leftPosition = buttonRect.right - menuWidth;
    } 
    else {
        topPosition = Math.max(headerBottom + 8, (window.innerHeight - menuHeight) / 2);
        leftPosition = Math.max(8, buttonRect.left - menuWidth - 8);
        
        if (leftPosition + menuWidth < 20 || topPosition + menuHeight > window.innerHeight) {
            closeAllMenus();
            return;
        }
    }

    menuContainer.style.top = `${topPosition}px`;
    menuContainer.style.left = `${leftPosition}px`;
    menuContainer.style.transform = "none";
  }

  window.addEventListener("scroll", checkAndUpdateMenuPosition, true);
  window.addEventListener("resize", checkAndUpdateMenuPosition);
  const menuPositionObserver = new MutationObserver(checkAndUpdateMenuPosition);
  menuPositionObserver.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style', 'class']
  });

  async function processBatchesWithDelay(
    tracks,
    batchSize = 200,
    delayMs = 1000,
    updateProgress = () => {},
    processTrack,
    totalProgressSteps = 1  
  ) {
    const results = [];
    const batches = [];
    let processedTrackCount = 0;
    for (let i = 0; i < tracks.length; i += batchSize) {
      batches.push(tracks.slice(i, i + batchSize));
    }
    for (let i = 0; i < batches.length; i++) {
      const batchResults = await Promise.all(batches[i].map(track => processTrack(track)));
  
      batchResults.forEach(result => {
        if (result !== null) {
          results.push(result);
          processedTrackCount++;
        }
      });
      const intermediateProgress = Math.round(
        ((processedTrackCount / tracks.length) * 100) / totalProgressSteps
      );
      updateProgress(intermediateProgress);
      if (i < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  
    return results;
  }

  async function replacePlaylistTracks(playlistId, trackUris, maxRetries = 10, initialDelay = 2000) {
    const validUris = trackUris.filter(uri => typeof uri === 'string' && (uri.startsWith("spotify:track:") || Spicetify.URI.isLocal(uri)));
    const hasLocalTracks = validUris.some(uri => Spicetify.URI.isLocal(uri));

    if (!hasLocalTracks) {
        const BATCH_SIZE = 100;
        const firstBatch = validUris.slice(0, BATCH_SIZE);
        const playlistUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
        
        let retries = 0;
        let currentDelay = initialDelay;
        let success = false;

        while (retries <= maxRetries && !success) {
            try {
                await Spicetify.CosmosAsync.put(playlistUrl, { uris: firstBatch });
                success = true;
            } catch (error) {
                console.error(`[Sort-Play] Error replacing tracks in playlist ${playlistId} (Attempt ${retries + 1}):`, error);
                retries++;
                if (retries <= maxRetries) {
                    await new Promise(resolve => setTimeout(resolve, currentDelay));
                    currentDelay *= 2;
                } else {
                    throw new Error(`Failed to replace tracks in playlist ${playlistId}.`);
                }
            }
        }

        if (success && validUris.length > BATCH_SIZE) {
            const remainingUris = validUris.slice(BATCH_SIZE);
            await addTracksToPlaylist(playlistId, remainingUris);
        }
    } else {
        const playlistUri = `spotify:playlist:${playlistId}`;
        try {
            const { items } = await Spicetify.Platform.PlaylistAPI.getContents(playlistUri);
            if (items.length > 0) {
                const tracksToRemove = items.map(track => ({ uri: track.uri, uid: track.uid }));
                await Spicetify.Platform.PlaylistAPI.remove(playlistUri, tracksToRemove);
            }
            await addTracksToPlaylist(playlistId, validUris);
        } catch (error) {
            console.error(`[Sort-Play] Error updating playlist with local files using Platform API:`, error);
            Spicetify.showNotification("Failed to update playlist with local files.", true);
        }
    }
  }

  async function addTracksToPlaylist(playlistId, trackUris, maxRetries = 10, initialDelay = 2000) {
    const playlistUri = `spotify:playlist:${playlistId}`;
    const spotifyUris = [];
    const localUris = [];

    trackUris.forEach(uri => {
        if (typeof uri === "string") {
            if (Spicetify.URI.isLocal(uri)) {
                localUris.push(uri);
            } else if (uri.startsWith("spotify:track:")) {
                spotifyUris.push(uri);
            }
        }
    });

    const promises = [];

    if (localUris.length > 0) {
        promises.push(
            Spicetify.Platform.PlaylistAPI.add(playlistUri, localUris, {}).catch(error => {
                console.error("[Sort-Play] Error adding local tracks via Platform API:", error);
                Spicetify.showNotification("Failed to add local tracks to the playlist.", true);
            })
        );
    }

    if (spotifyUris.length > 0) {
        const spotifyAddPromise = (async () => {
            const BATCH_SIZE = 100;
            const playlistUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;

            for (let i = 0; i < spotifyUris.length; i += BATCH_SIZE) {
                const batch = spotifyUris.slice(i, i + BATCH_SIZE);
                let retries = 0;
                let currentDelay = initialDelay;

                while (retries <= maxRetries) {
                    try {
                        await Spicetify.CosmosAsync.post(playlistUrl, { uris: batch });
                        break;
                    } catch (error) {
                        console.error(`[Sort-Play] Error adding Spotify track batch (Attempt ${retries + 1}):`, error);
                        if (retries === maxRetries) {
                            console.error(`[Sort-Play] Failed to add Spotify track batch after ${maxRetries + 1} attempts. Giving up.`);
                            Spicetify.showNotification("Failed to add some Spotify tracks.", true);
                            break;
                        }
                        retries++;
                        await new Promise((resolve) => setTimeout(resolve, currentDelay));
                        currentDelay *= 2;
                    }
                }
            }
        })();
        promises.push(spotifyAddPromise);
    }

    await Promise.all(promises);
  }

  async function setPlaylistVisibility(playlist, visibleForAll) {
    await Spicetify.Platform.PlaylistPermissionsAPI.setBasePermission(
        playlist,
        visibleForAll ? "VIEWER" : "BLOCKED"
    );
  }

  async function movePlaylistToTop(playlistUri) {
    const { CosmosAsync } = Spicetify.Platform;
    if (!CosmosAsync) return;

    try {
        let moveRequestBody = {
            operation: "move",
            uris: [playlistUri],
        };

        if (placePlaylistsInFolder) {
            const folderUri = await findOrCreatePlaylistFolder(sortPlayFolderName);
            if (folderUri) {
                moveRequestBody.after = folderUri;
            } else {
                moveRequestBody.before = "start";
            }
        } else {
            moveRequestBody.before = "start";
        }

        await CosmosAsync.post("sp://core-playlist/v1/rootlist", moveRequestBody);
    } catch (error) {
        console.warn(`Could not move playlist ${playlistUri}.`, error);
    }
  }

  
  async function getActiveUserPlaylistUris() {
    try {
        const rootlist = await Spicetify.Platform.RootlistAPI.getContents();
        const playlistUris = new Set();

        function traverseItems(items) {
            for (const item of items) {
                if (item.type === 'playlist') {
                    playlistUris.add(item.uri);
                } else if (item.type === 'folder' && Array.isArray(item.items)) {
                    traverseItems(item.items);
                }
            }
        }

        traverseItems(rootlist.items);
        return playlistUris;

    } catch (error) {
        console.error("An error occurred while fetching user playlists from RootlistAPI:", error);
        try {
            const response = await Spicetify.CosmosAsync.get('https://api.spotify.com/v1/me/playlists?limit=50');
            return new Set(response.items.map(p => p.uri));
        } catch (fallbackError) {
            console.error("Fallback playlist fetch also failed:", fallbackError);
            return new Set();
        }
    }
  }

  function isDefaultMosaicCover(url) {
    if (!url) return false;
    return url.includes("mosaic.scdn.co") || url.includes("i.scdn.co/image/");
  }
  
  async function generatePlaylistCover(userName, baseImageUrl, usernameColor) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const size = 640;
    canvas.width = size;
    canvas.height = size;

    try {
        const baseImage = new Image();
        baseImage.crossOrigin = 'Anonymous';
        baseImage.src = baseImageUrl;
        await new Promise((resolve, reject) => {
            baseImage.onload = resolve;
            baseImage.onerror = reject;
        });

        ctx.drawImage(baseImage, 0, 0, size, size);
    } catch (error) {
        console.error("Sort-Play: Failed to load base cover image. Using a black background.", error);
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, size, size);
    }

    const MAX_USERNAME_LENGTH = 35;
    let displayName = userName;

    if (userName.length > MAX_USERNAME_LENGTH) {
      displayName = userName.substring(0, MAX_USERNAME_LENGTH) + '...';
    }

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillStyle = usernameColor || '#24bf70'; 
    
    let userNameFontSize = 50;
    ctx.font = `bold ${userNameFontSize}px 'SpotifyMixUI', sans-serif`;
    const maxUserNameWidth = size * 0.8;

    while (ctx.measureText(displayName).width > maxUserNameWidth && userNameFontSize > 20) {
        userNameFontSize -= 2;
        ctx.font = `bold ${userNameFontSize}px 'SpotifyMixUI', sans-serif`;
    }

    const userNameY = size * 0.76; 
    ctx.fillText(displayName, size / 2, userNameY);

    const timestamp = new Date().toISOString();
    ctx.font = "10px sans-serif";
    ctx.fillStyle = "rgba(0, 0, 0, 0.01)";
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(timestamp, 5, 5);

    return canvas.toDataURL('image/jpeg');
  }

  async function addPlaylistToLibrary(playlistUri) {
    const { CosmosAsync } = Spicetify;
    if (!playlistUri) return;

    try {
        await new Promise(resolve => setTimeout(resolve, 250));

        let moveRequestBody = {
            operation: "move",
            uris: [playlistUri],
        };

        if (placePlaylistsInFolder) {
            const folderUri = await findOrCreatePlaylistFolder(sortPlayFolderName);
            if (folderUri) {
                moveRequestBody.after = folderUri;
            } else {
                moveRequestBody.before = "start";
            }
        } else {
            moveRequestBody.before = "start";
        }
        
        await CosmosAsync.post("sp://core-playlist/v1/rootlist", moveRequestBody);

    } catch (error) {
        if (error.status !== 400) {
            console.error("Unexpected error while moving playlist:", error);
        }
    }
  }

  async function executeShuffleAndPlay(uri) {
    if (!uri) {
      throw new Error("No context URI provided for shuffling.");
    }

    let tracks;
    const isArtistPage = URI.isArtist(uri);
    let contextUri = uri; 

    if (URI.isPlaylistV1OrV2(uri)) {
        tracks = await getPlaylistTracks(uri.split(":")[2]);
    } else if (isArtistPage) {
        tracks = await getArtistTracksForShuffle(uri);
    } else if (isLikedSongsPage(uri)) {
        tracks = await getLikedSongs();
        contextUri = null; 
    } else if (isLocalFilesPage(uri)) {
        tracks = await getLocalFilesTracks();
        contextUri = null; 
    } else if (URI.isAlbum(uri)) {
        tracks = await getAlbumTracks(uri.split(":")[2]);
    } else {
        throw new Error('Invalid context for shuffling');
    }

    if (!tracks || tracks.length === 0) {
      throw new Error('No tracks found to shuffle');
    }

    const containsLocalFiles = tracks.some(track => Spicetify.URI.isLocal(track.uri));

    let tracksToProcess;

    if (isArtistPage) {
      const refreshedTracks = await refreshTrackAlbumInfo(tracks);
      const tracksWithPlayCounts = await enrichTracksWithPlayCounts(refreshedTracks);
      const tracksWithIds = await processBatchesWithDelay(tracksWithPlayCounts, 50, 500, () => {}, collectTrackIdsForPopularity);
      const tracksWithPopularity = await fetchPopularityForMultipleTracks(tracksWithIds, () => {});
      const { unique: uniqueTracks } = deduplicateTracks(tracksWithPopularity, false, true);
      tracksToProcess = uniqueTracks;
    } else {
      tracksToProcess = tracks;
    }

    let finalSortedTracks;

    if (useEnergyWaveShuffle && !containsLocalFiles) {
        Spicetify.showNotification("Performing Randomized Energy Wave Shuffle...");
        
        const trackIds = tracksToProcess.map(t => t.trackId || t.uri.split(":")[2]);
        const allStats = await getBatchTrackStats(trackIds);
        const tracksWithData = tracksToProcess.map(track => ({
            ...track,
            features: allStats[track.trackId || track.uri.split(":")[2]]
        }));

        finalSortedTracks = await randomizedEnergyWaveSort(tracksWithData);
    } else {
        if (useEnergyWaveShuffle && containsLocalFiles) {
            Spicetify.showNotification("Playlist contains local files. Using normal shuffle instead of Vibe & Flow.");
        }
        finalSortedTracks = shuffleArray(tracksToProcess);
    }

    await setQueueFromTracks(finalSortedTracks, contextUri, 'shuffle');
  }

  function shouldShowShufflePlayOption(uris) {
    if (uris.length !== 1) {
        return false;
    }
    const uri = Spicetify.URI.fromString(uris[0]);
    switch (uri.type) {
        case Spicetify.URI.Type.PLAYLIST:
        case Spicetify.URI.Type.PLAYLIST_V2:
        case Spicetify.URI.Type.ALBUM:
        case Spicetify.URI.Type.ARTIST:
        case Spicetify.URI.Type.COLLECTION:
            return true;
    }
    return false;
  }

  new Spicetify.ContextMenu.Item(
    "Shuffle with Sort-Play",
    async (uris) => {
        setButtonProcessing(true);
        mainButton.innerHTML = '<div class="loader"></div>';
        closeAllMenus();

        try {
            await executeShuffleAndPlay(uris[0]);
        } catch (error) {
            console.error("Error from context menu shuffle:", error);
            Spicetify.showNotification(error.message, true);
        } finally {
            resetButtons();
        }
    },
    shouldShowShufflePlayOption,
    "shuffle"
  ).register();

  async function getOrCreateDedicatedPlaylist(sortType, name, description, maxRetries = 5, initialDelay = 1000) {
    const dedicatedPlaylistBehavior = JSON.parse(localStorage.getItem(STORAGE_KEY_DEDICATED_PLAYLIST_BEHAVIOR) || '{}');
    const behavior = dedicatedPlaylistBehavior[sortType] || 'createOnce';
    const isUpdateEnabled = behavior === 'replace' || behavior === 'autoUpdate';

    const releasePlaylistColor = '#3798a5';
    const discoveryPlaylistColor = '#8f46d7';
    const defaultUsernameColor = '#24bf70';

    const releasePlaylistTypes = playlistCardsData
        .find(section => section.title === 'New Releases')?.cards
        .map(card => card.id) || [];

    const discoveryPlaylistTypes = playlistCardsData
        .find(section => section.title === 'Discovery')?.cards
        .map(card => card.id) || [];
    
    let usernameColor;
    if (discoveryPlaylistTypes.includes(sortType)) {
        usernameColor = discoveryPlaylistColor;
    } else if (releasePlaylistTypes.includes(sortType)) {
        usernameColor = releasePlaylistColor;
    } else {
        usernameColor = defaultUsernameColor;
    }

    if (isUpdateEnabled) {
        let dedicatedPlaylistMap = JSON.parse(localStorage.getItem(STORAGE_KEY_DEDICATED_PLAYLIST_MAP) || '{}');
        const playlistUri = dedicatedPlaylistMap[sortType];

        if (playlistUri) {
            const activePlaylistsSet = await getActiveUserPlaylistUris();

            if (activePlaylistsSet.has(playlistUri)) {
                const playlistId = playlistUri.split(':')[2];

                try {
                    await Spicetify.CosmosAsync.put(`https://api.spotify.com/v1/playlists/${playlistId}`, {
                        name: name,
                        description: description
                    });
                } catch (updateError) {
                }

                if (setDedicatedPlaylistCovers) {
                    (async () => {
                        try {
                            const user = await Spicetify.Platform.UserAPI.getUser();
                            const baseImageUrl = DEDICATED_PLAYLIST_COVERS[sortType] || DEDICATED_PLAYLIST_COVERS['default'];
                            const coverBase64 = await generatePlaylistCover(user.displayName, baseImageUrl, usernameColor);
                            setPlaylistImage(playlistId, coverBase64);
                        } catch (coverError) {
                            console.error("Failed to update custom playlist cover:", coverError);
                        }
                    })();
                }

                await movePlaylistToTop(playlistUri);

                const minimalPlaylistData = { id: playlistId, uri: playlistUri, name: name };
                return { playlist: minimalPlaylistData, wasUpdated: true };

            } else {
                console.log(`[Sort-Play] Linked playlist ${playlistUri} is no longer in the user's library. A new one will be created.`);
                delete dedicatedPlaylistMap[sortType];
                localStorage.setItem(STORAGE_KEY_DEDICATED_PLAYLIST_MAP, JSON.stringify(dedicatedPlaylistMap));
            }
        }
    }

    const newPlaylist = await createPlaylist(name, description, maxRetries, initialDelay);

    if (newPlaylist) {
        await new Promise(resolve => setTimeout(resolve, 250));

        if (setDedicatedPlaylistCovers) {
            (async () => {
                try {
                    const user = await Spicetify.Platform.UserAPI.getUser();
                    const baseImageUrl = DEDICATED_PLAYLIST_COVERS[sortType] || DEDICATED_PLAYLIST_COVERS['default'];
                    const coverBase64 = await generatePlaylistCover(user.displayName, baseImageUrl, usernameColor);
                    setPlaylistImage(newPlaylist.id, coverBase64);
                } catch (coverError) {
                    console.error("Failed to generate or set custom playlist cover:", coverError);
                }
            })();
        }
        
        await addPlaylistToLibrary(newPlaylist.uri);

        if (isUpdateEnabled) {
            let dedicatedPlaylistMap = JSON.parse(localStorage.getItem(STORAGE_KEY_DEDICATED_PLAYLIST_MAP) || '{}');
            dedicatedPlaylistMap[sortType] = newPlaylist.uri;
            localStorage.setItem(STORAGE_KEY_DEDICATED_PLAYLIST_MAP, JSON.stringify(dedicatedPlaylistMap));
        }
    }

    return { playlist: newPlaylist, wasUpdated: false };
  }

  async function createPlaylist(
    name = "Sorted by Play Count",
    description = "Created with Spotify Playlist Sorter",
  ) {
    const { CosmosAsync, Platform } = Spicetify;
    if (!CosmosAsync || !Platform) {
        console.error("Spicetify APIs not available.");
        throw new Error("Spicetify APIs not available.");
    }

    let newPlaylist;
    try {
        const { RootlistAPI } = Platform;
        if (!RootlistAPI) throw new Error("RootlistAPI not available for folder creation.");

        let requestBody = {
            operation: "create",
            name: name,
            playlist: true,
            before: "start",
        };

        if (placePlaylistsInFolder) {
            const folderUri = await findOrCreatePlaylistFolder(sortPlayFolderName);
            if (folderUri) {
                requestBody = { ...requestBody, after: folderUri, before: undefined };
            } else {
                Spicetify.showNotification("Failed to find/create folder. Creating playlist at the top.", true);
            }
        }

        newPlaylist = await CosmosAsync.post("sp://core-playlist/v1/rootlist", requestBody);

        if (!newPlaylist || !newPlaylist.uri) {
            throw new Error("Internal playlist creation failed, trying fallback.");
        }

    } catch (error) {
        console.warn("Internal playlist creation failed, using Web API fallback:", error);
        Spicetify.showNotification("Using fallback to create playlist.", false, 2000);
        const user = await Spicetify.Platform.UserAPI.getUser();
        const createPlaylistUrl = `https://api.spotify.com/v1/users/${user.username}/playlists`;
        newPlaylist = await Spicetify.CosmosAsync.post(createPlaylistUrl, { name, description, public: !createPlaylistPrivate });
    }

    if (!newPlaylist || !newPlaylist.uri) {
        throw new Error("Failed to create playlist after all attempts.");
    }
    
    const playlistId = newPlaylist.uri.split(':')[2];

    await new Promise(resolve => setTimeout(resolve, 500));

    await Promise.all([
        setPlaylistVisibility(newPlaylist.uri, !createPlaylistPrivate),
        updatePlaylistDescription(playlistId, description)
    ]);
    
    return { ...newPlaylist, id: newPlaylist.uri.split(':')[2] };
  }

  function updatePlaylistDescription(playlistId, description, maxRetries = 12, retryInterval = 5000) {
    (async () => {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                try {
                    await Spicetify.CosmosAsync.put(`https://api.spotify.com/v1/playlists/${playlistId}`, {
                        description: description,
                    });
                } catch (putError) {
                    const isExpectedJsonError = putError instanceof SyntaxError && putError.message.includes("Unexpected end of JSON input");
                    if (!isExpectedJsonError) {
                        throw putError;
                    }
                }

                await new Promise(resolve => setTimeout(resolve, 1000));

                const updatedPlaylist = await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/playlists/${playlistId}`);
                
                if (updatedPlaylist && updatedPlaylist.description === description) {
                    return;
                } else {
                    throw new Error("Verification failed: Description not updated on Spotify's side yet.");
                }

            } catch (error) {                
                if (attempt < maxRetries) {
                    await new Promise(resolve => setTimeout(resolve, retryInterval));
                } else {
                    console.error(`[Sort-Play] Failed to set and verify playlist description for ${playlistId} after ${maxRetries} attempts.`);
                }
            }
        }
    })();
  }
  
  async function navigateToPlaylist(playlistObject) {
    if (openPlaylistAfterSortEnabled && playlistObject && playlistObject.uri) { 
        const tempPath = "/library"; 
        Spicetify.Platform.History.push(tempPath);
        await new Promise(resolve => setTimeout(resolve, 500)); 
        const newPlaylistPath = Spicetify.URI.fromString(playlistObject.uri).toURLPath(true);
        if (newPlaylistPath) {
          Spicetify.Platform.History.push(newPlaylistPath);
        } else {
          console.warn("Could not determine path for new playlist URI:", playlistObject.uri);
        }
    }
  }

  async function findOrCreatePlaylistFolder(folderName) {
      const { RootlistAPI } = Spicetify.Platform;
      if (!RootlistAPI) {
          console.error("Spicetify.Platform.RootlistAPI is not available.");
          Spicetify.showNotification("Error: Cannot manage folders.", true);
          return null;
      }
      try {
          const rootlist = await RootlistAPI.getContents();
          const existingFolder = rootlist.items.find(
              item => item.type === 'folder' && item.name === folderName
          );
          if (existingFolder) {
              return existingFolder.uri;
          }
          const newFolder = await RootlistAPI.createFolder(folderName, { before: "start" });
          if (newFolder && newFolder.uri) {
              return newFolder.uri;
          } else {
              throw new Error("Folder creation did not return a valid URI.");
          }
      } catch (error) {
          console.error(`Error in findOrCreatePlaylistFolder for "${folderName}":`, error);
          Spicetify.showNotification(`Error managing folder: ${folderName}`, true);
          return null;
      }
  }


  async function getTopItems(type, time_range, totalLimit) {
    let allItems = [];
    let offset = 0;
    const limitPerRequest = 50;

    while (allItems.length < totalLimit) {
        const res = await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/me/top/${type}`, {
            time_range: time_range,
            limit: limitPerRequest,
            offset: offset
        });

        if (!res.items || res.items.length === 0) {
            break;
        }

        allItems = allItems.concat(res.items);
        offset += limitPerRequest;

        if (res.items.length < limitPerRequest) {
            break;
        }
    }
    return allItems.slice(0, totalLimit);
  }

  async function getAllFollowedArtists() {
    let allArtists = [];
    let nextUrl = 'https://api.spotify.com/v1/me/following?type=artist&limit=50';

    try {
        while (nextUrl) {
            const response = await Spicetify.CosmosAsync.get(nextUrl);
            if (response?.artists?.items) {
                allArtists.push(...response.artists.items);
                nextUrl = response.artists.next;
            } else {
                nextUrl = null;
            }
        }
    } catch (error) {
        console.error("Failed to fetch all followed artists:", error);
    }
    return allArtists;
  }

  async function getComprehensiveKnownArtistsSet(options = {}) {
    const { isHeadless = false } = options;
    if (!isHeadless) {
        mainButton.innerText = "Filtering...";
    }
    
    const [longTerm, mediumTerm, shortTerm, followedArtists] = await Promise.all([
        getTopItems('artists', 'long_term', 300),
        getTopItems('artists', 'medium_term', 150),
        getTopItems('artists', 'short_term', 150),
        getAllFollowedArtists()
    ]);

    const knownArtistIds = new Set([
        ...longTerm.map(a => a.id),
        ...mediumTerm.map(a => a.id),
        ...shortTerm.map(a => a.id),
        ...followedArtists.map(a => a.id)
    ]);

    return knownArtistIds;
  }
  
  async function generateSpotifyRecommendations(vibeType, options = {}) {
    const { isHeadless = false } = options;
    let playlistName = "";
    let playlistDescription = "";

    if (!isHeadless) {
        setButtonProcessing(true);
        mainButton.style.backgroundColor = buttonStyles.main.disabledBackgroundColor;
        mainButton.style.color = buttonStyles.main.disabledColor;
        mainButton.style.cursor = "default";
        svgElement.style.fill = buttonStyles.main.disabledColor;
        menuButtons.forEach((button) => (button.disabled = true));
        toggleMenu();
        closeAllMenus();
    }

    try {
        if (!isHeadless) mainButton.innerText = "Get library...";
        const allLikedSongs = await getLikedSongs();
        const completeLikedSongUrisSet = new Set(allLikedSongs.map(song => song.uri));
        
        const likedSongsFingerprintMap = new Map();
        allLikedSongs.forEach(song => {
            const title = song.name.toLowerCase().trim();
            if (!likedSongsFingerprintMap.has(title)) {
                likedSongsFingerprintMap.set(title, new Set());
            }
            const artistUrisForTitle = likedSongsFingerprintMap.get(title);
            song.artistUris.forEach(uri => artistUrisForTitle.add(uri));
        });

        if (vibeType === 'pureDiscovery') {
            playlistName = "Pure Discovery";
            playlistDescription = "Discover new music from artists completely new to you. Created by Sort-Play.";

            mainButton.innerText = "Filtering...";
            const knownArtistIds = await getComprehensiveKnownArtistsSet();
            const topArtistsForSeeding = await getTopItems('artists', 'long_term', 100);

            if (topArtistsForSeeding.length === 0) {
                throw new Error("Need more listening history to build a discovery profile.");
            }

            if (!isHeadless) mainButton.innerText = "Related...";
            let relatedArtistPool = new Map();
            const shuffledTopArtists = shuffleArray(topArtistsForSeeding);

            for (const artist of shuffledTopArtists) {
                if (relatedArtistPool.size > 500) break;
                try {
                    const related = await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/artists/${artist.id}/related-artists`);
                    related.artists.forEach(relArtist => {
                        if (!knownArtistIds.has(relArtist.id)) {
                            relatedArtistPool.set(relArtist.id, relArtist);
                        }
                    });
                } catch (e) { console.warn(`Could not get related artists for ${artist.name}`); }
            }
            
            const unknownRelatedArtists = Array.from(relatedArtistPool.values());
            if (unknownRelatedArtists.length < 3) {
                throw new Error("Couldn't find enough new artists related to your taste.");
            }

            const topTracksForSeeding = await getTopItems('tracks', 'long_term', 50);
            const chosenUnknownArtists = shuffleArray(unknownRelatedArtists).slice(0, 3);
            const chosenSeedTracks = shuffleArray(topTracksForSeeding).slice(0, 2);
            
            const seed_artists = chosenUnknownArtists.map(a => a.id);
            const seed_tracks = chosenSeedTracks.map(t => t.id);
            
            if (!isHeadless) mainButton.innerText = "Get recs...";
            const params = new URLSearchParams({ limit: 100 });
            if (seed_artists.length > 0) params.append('seed_artists', [...new Set(seed_artists)].join(','));
            if (seed_tracks.length > 0) params.append('seed_tracks', [...new Set(seed_tracks)].join(','));
            
            const recommendations = await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/recommendations?${params.toString()}`);
            
            if (!recommendations?.tracks?.length) throw new Error("Spotify didn't return any recommendations. Try again!");
            
            if (!isHeadless) mainButton.innerText = "Excluding...";
            const availabilityChecks = await Promise.all(recommendations.tracks.map(track => isTrackAvailable(track)));
            let newRecommendedTracks = recommendations.tracks
                .filter((track, index) => availabilityChecks[index])
                .filter(track => !completeLikedSongUrisSet.has(track.uri))
                .filter(track => track.artists.every(artist => !knownArtistIds.has(artist.id)));
            
            if (newRecommendedTracks.length === 0) throw new Error("All recommended tracks were already known to you. Great taste!");
            
            const trackUris = newRecommendedTracks.slice(0, discoveryPlaylistSize).map(track => track.uri);
            
            if (!isHeadless) mainButton.innerText = "Creating...";
            const { playlist: newPlaylist, wasUpdated } = await getOrCreateDedicatedPlaylist(vibeType, playlistName, playlistDescription);
            
            if (wasUpdated) {
                await replacePlaylistTracks(newPlaylist.id, trackUris);
            } else {
                await addTracksToPlaylist(newPlaylist.id, trackUris);
            }
            
            Spicetify.showNotification(`Playlist "${playlistName}" ${wasUpdated ? 'updated' : 'created'} successfully!`);
            await navigateToPlaylist(newPlaylist);
            return;
        }

        let time_range = 'medium_term';
        let contrast_time_range = 'long_term';
        let top_pool_size = 100;

        if (vibeType === 'recommendRecentVibe') {
            playlistName = "Discovery: Recent Taste";
            playlistDescription = "A diverse mix based on your recent taste. Created by Sort-Play.";
            time_range = 'short_term';
            contrast_time_range = 'long_term';
        } else if (vibeType === 'recommendAllTime') {
            playlistName = "Discovery: All-Time Taste";
            playlistDescription = "A diverse mix based on your all-time taste. Created by Sort-Play.";
            time_range = 'long_term';
            contrast_time_range = 'short_term';
        }

        if (!isHeadless) mainButton.innerText = "Get top...";
        const [topArtists, topTracks, contrastTopTracks] = await Promise.all([
            getTopItems('artists', time_range, top_pool_size),
            getTopItems('tracks', time_range, top_pool_size),
            getTopItems('tracks', contrast_time_range, 1)
        ]);

        if (topArtists.length < 10 || topTracks.length < 10) {
            throw new Error("Not enough listening history for diverse recommendations.");
        }
        
        if (!isHeadless) mainButton.innerText = "Profiling...";

        const allGenres = new Set(topArtists.flatMap(a => a.genres));
        const shuffledGenres = shuffleArray(Array.from(allGenres));
        let genreBridgeSeeds = [];
        if (shuffledGenres.length >= 2) {
            const genre1 = shuffledGenres[0];
            const genre2 = shuffledGenres[1];
            const artistsForGenre1 = shuffleArray(topArtists.filter(a => a.genres.includes(genre1))).slice(0, 3);
            const artistsForGenre2 = shuffleArray(topArtists.filter(a => a.genres.includes(genre2))).slice(0, 2);
            genreBridgeSeeds = [...artistsForGenre1, ...artistsForGenre2].map(a => a.id);
        }

        const sortedByPopAsc = [...topTracks].sort((a, b) => a.popularity - b.popularity);
        const deepCutPool = sortedByPopAsc.slice(0, 50);
        const deepCutSeeds = shuffleArray(deepCutPool).slice(0, 5).map(t => t.id);

        let likedSongSeedUris = [];
        if (vibeType === 'recommendRecentVibe') {
            likedSongSeedUris = shuffleArray(allLikedSongs.slice(0, 10)).slice(0, 5).map(t => t.uri.split(':')[2]);
        } else {
            likedSongSeedUris = shuffleArray(allLikedSongs.slice(-100)).slice(0, 5).map(t => t.uri.split(':')[2]);
        }

        const smartSongSeeds = new Set();
        if (vibeType === 'recommendAllTime') smartSongSeeds.add(shuffleArray(topTracks.slice(0, 20))[0]);
        else smartSongSeeds.add(shuffleArray(topTracks.slice(0, 5))[0]);
        smartSongSeeds.add([...topTracks].sort((a, b) => b.popularity - a.popularity)[0]);
        smartSongSeeds.add(deepCutPool[0]);
        if (contrastTopTracks.length > 0) smartSongSeeds.add(contrastTopTracks[0]);
        const randomLikedTopTrackPool = topTracks.filter(t => completeLikedSongUrisSet.has(t.uri));
        if(randomLikedTopTrackPool.length > 0) smartSongSeeds.add(shuffleArray(randomLikedTopTrackPool)[0]);
        
        const finalSmartSeeds = Array.from(smartSongSeeds);
        let seedIdx = 0;
        while (finalSmartSeeds.length < 5 && seedIdx < topTracks.length) {
            if (!finalSmartSeeds.some(s => s.uri === topTracks[seedIdx].uri)) finalSmartSeeds.push(topTracks[seedIdx]);
            seedIdx++;
        }
        const smartSeedUris = finalSmartSeeds.slice(0, 5).map(t => t.id);

        if (!isHeadless) mainButton.innerText = "Get recs...";
        const recommendationBatches = [];
        const NUM_CALLS = 6;
        
        for (let i = 0; i < NUM_CALLS; i++) {
            const params = new URLSearchParams({ limit: 100 });
            let seed_artists = [], seed_tracks = [];

            if (i < 2) {
                seed_artists = shuffleArray(topArtists).slice(0, 3).map(a => a.id);
                seed_tracks = shuffleArray(topTracks).slice(0, 2).map(t => t.id);
            } else if (i === 2) {
                seed_artists = genreBridgeSeeds;
            } else if (i === 3) {
                seed_tracks = deepCutSeeds;
                params.append('max_popularity', '40');
            } else if (i === 4) {
                seed_tracks = likedSongSeedUris;
            } else {
                seed_tracks = smartSeedUris;
            }

            if (seed_artists.length > 0) params.append('seed_artists', [...new Set(seed_artists)].join(','));
            if (seed_tracks.length > 0) params.append('seed_tracks', [...new Set(seed_tracks)].join(','));

            try {
                const recsResponse = await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/recommendations?${params.toString()}`);
                if (recsResponse?.tracks?.length > 0) {
                    recommendationBatches.push(recsResponse.tracks);
                }
            } catch (e) { console.warn(`Recommendation call ${i+1} failed.`, e); }
            await new Promise(resolve => setTimeout(resolve, 250));
        }

        if (recommendationBatches.length === 0) {
            throw new Error("Spotify didn't return any recommendations. Try again!");
        }

        if (!isHeadless) mainButton.innerText = "Mixing...";
        let interleavedTracks = [];
        const maxBatchLength = Math.max(...recommendationBatches.map(batch => batch.length));
        for (let i = 0; i < maxBatchLength; i++) {
            for (let j = 0; j < recommendationBatches.length; j++) {
                if (recommendationBatches[j][i]) {
                    interleavedTracks.push(recommendationBatches[j][i]);
                }
            }
        }
        
        const seenUris = new Set();
        const uniqueMixedTracks = interleavedTracks.filter(track => {
            if (seenUris.has(track.uri)) return false;
            seenUris.add(track.uri);
            return true;
        });

        if (!isHeadless) mainButton.innerText = "Excluding...";
        const availabilityChecks = await Promise.all(uniqueMixedTracks.map(track => isTrackAvailable(track)));
        let newRecommendedTracks = uniqueMixedTracks.filter((track, index) => {
            if (!availabilityChecks[index]) return false;
            if (completeLikedSongUrisSet.has(track.uri)) return false;
            
            const title = track.name.toLowerCase().trim();
            const likedArtistUrisForTitle = likedSongsFingerprintMap.get(title);
            if (!likedArtistUrisForTitle) return true;
            
            const recommendedArtistUris = track.artists.map(a => a.uri);
            return !recommendedArtistUris.some(uri => likedArtistUrisForTitle.has(uri));
        });

        if (newRecommendedTracks.length === 0) throw new Error("All recommended tracks were already known to you. Great taste!");
        
        const trackUris = newRecommendedTracks.slice(0, discoveryPlaylistSize).map(track => track.uri);
        
        if (!isHeadless) mainButton.innerText = "Creating...";
        const { playlist: newPlaylist, wasUpdated } = await getOrCreateDedicatedPlaylist(vibeType, playlistName, playlistDescription);
        
        if (wasUpdated) {
            await replacePlaylistTracks(newPlaylist.id, trackUris);
        } else {
            await addTracksToPlaylist(newPlaylist.id, trackUris);
        }

        Spicetify.showNotification(`Playlist "${playlistName}" ${wasUpdated ? 'updated' : 'created'} successfully!`);
        await navigateToPlaylist(newPlaylist);

    } catch (error) {
        console.error(`Error in generateSpotifyRecommendations (${vibeType}):`, error);
        Spicetify.showNotification(error.message, true);
    } finally {
        if (!isHeadless) {
            resetButtons();
        }
    }
  }

  async function generateFollowedReleasesChronological(options = {}) {
    const { isHeadless = false } = options;
    const { GraphQL, CosmosAsync } = Spicetify;
    if (!isHeadless) {
        setButtonProcessing(true);
        mainButton.style.backgroundColor = buttonStyles.main.disabledBackgroundColor;
        mainButton.style.color = buttonStyles.main.disabledColor;
        mainButton.style.cursor = "default";
        svgElement.style.fill = buttonStyles.main.disabledColor;
        menuButtons.forEach((button) => (button.disabled = true));
        toggleMenu();
        closeAllMenus();
    }

    try {
        const updateProgress = isHeadless ? () => {} : (message) => { mainButton.innerText = message; };

        updateProgress("Get artists...");
        
        async function getFollowedArtists() {
            let artists = [];
            let nextUrl = 'https://api.spotify.com/v1/me/following?type=artist&limit=50';
            while (nextUrl) {
                const response = await Spicetify.CosmosAsync.get(nextUrl);
                if (response.artists?.items) {
                    artists.push(...response.artists.items);
                    nextUrl = response.artists.next;
                } else {
                    nextUrl = null;
                }
            }
            return artists;
        }

        const followedArtists = await getFollowedArtists();
        if (followedArtists.length === 0) {
            throw new Error("You are not following any artists.");
        }

        const dateLimit = new Date();
        dateLimit.setUTCHours(0, 0, 0, 0);
        const daysSinceLastFriday = (dateLimit.getUTCDay() + 2) % 7;
        const numberOfWeeks = Math.ceil(newReleasesDaysLimit / 7);
        const totalDaysToSubtract = daysSinceLastFriday + (numberOfWeeks - 1) * 7;
        dateLimit.setUTCDate(dateLimit.getUTCDate() - totalDaysToSubtract);
        const newReleasesMap = new Map();
        
        const BATCH_SIZE = 300;
        for (let i = 0; i < followedArtists.length; i += BATCH_SIZE) {
            const artistBatch = followedArtists.slice(i, i + BATCH_SIZE);
            updateProgress(`Scanning...`);

            const batchPromises = artistBatch.map(artist => {
                const variables = { uri: artist.uri, order: "DATE_DESC", offset: 0, limit: 20 };
                return GraphQL.Request(GraphQL.Definitions.queryArtistDiscographyAll, variables)
                    .catch(err => {
                        console.warn(`Failed to fetch discography for ${artist.name}`, err);
                        return null;
                    });
            });

            const batchResponses = await Promise.all(batchPromises);

            for (const response of batchResponses) {
                if (!response || response.errors || !response.data?.artistUnion) continue;
                
                const releases = response.data.artistUnion.discography?.all?.items;
                if (releases) {
                    for (const release of releases) {
                        const album = release.releases.items[0];
                        if (album?.date?.isoString) {
                            const releaseDate = new Date(album.date.isoString);
                            if (releaseDate >= dateLimit) {
                                newReleasesMap.set(album.uri, album);
                            }
                        }
                    }
                }
            }
            await new Promise(resolve => setTimeout(resolve, 200));
        }

        const allNewReleases = Array.from(newReleasesMap.values());
        if (allNewReleases.length === 0) {
            throw new Error(`No new releases found in the last ${newReleasesDaysLimit} days.`);
        }

        updateProgress(`Get tracks...`);
        let initialTrackPool = [];
        const albumUris = allNewReleases.map(album => album.uri);

        for (let i = 0; i < albumUris.length; i += 20) {
            const albumIdBatch = albumUris.slice(i, i + 20).map(uri => uri.split(':')[2]);
            const albumsData = await CosmosAsync.get(`https://api.spotify.com/v1/albums?ids=${albumIdBatch.join(',')}`);
            if (albumsData.albums) {
                for (const album of albumsData.albums) {
                    if (album && album.tracks && album.tracks.items) {
                        let tracksFromAlbum = album.tracks.items;
                        if (followedReleasesAlbumLimit !== 'all') {
                            tracksFromAlbum = tracksFromAlbum.slice(0, parseInt(followedReleasesAlbumLimit, 10));
                        }
                        initialTrackPool.push(...tracksFromAlbum);
                    }
                }
            }
        }
        
        if (initialTrackPool.length === 0) {
            throw new Error("Could not fetch any tracks from the new releases.");
        }

        updateProgress("Verifying...");
        const verifiedNewTracks = [];
        const trackIdsToVerify = initialTrackPool.map(t => t.id);

        for (let i = 0; i < trackIdsToVerify.length; i += 50) {
            const batchIds = trackIdsToVerify.slice(i, i + 50);
            const trackDetailsResponse = await CosmosAsync.get(`https://api.spotify.com/v1/tracks?ids=${batchIds.join(',')}`);

            if (trackDetailsResponse && trackDetailsResponse.tracks) {
                for (const detailedTrack of trackDetailsResponse.tracks) {
                    if (detailedTrack && detailedTrack.album && detailedTrack.album.release_date) {
                        const trackReleaseDate = new Date(detailedTrack.album.release_date);
                        if (trackReleaseDate >= dateLimit) {
                            verifiedNewTracks.push(detailedTrack);
                        }
                    }
                }
            }
        }
        
        updateProgress("Deduplicating...");
        const trackGroups = new Map();

        const getFirstWord = (title) => {
            if (!title) return "";
            const clean = title.replace(/^[^a-zA-Z0-9]+/, '').split(/\s+/)[0].replace(/[^a-zA-Z0-9]+$/, '').toLowerCase();
            return clean;
        };

        for (const track of verifiedNewTracks) {
            const duration = track.duration_ms;
            const artistIds = track.artists.map(a => a.id).sort().join(',');
            const firstWord = getFirstWord(track.name);

            const key = `${duration}|${artistIds}|${firstWord}`;

            if (!trackGroups.has(key)) {
                trackGroups.set(key, []);
            }
            trackGroups.get(key).push(track);
        }

        const finalDeduplicatedTracks = [];

        const getTypeScore = (type) => {
            if (type === 'album') return 3;
            if (type === 'compilation') return 2;
            if (type === 'single') return 1;
            return 0;
        };

        for (const group of trackGroups.values()) {
            if (group.length === 1) {
                finalDeduplicatedTracks.push(group[0]);
                continue;
            }

            group.sort((a, b) => {
                const scoreA = getTypeScore(a.album.album_type);
                const scoreB = getTypeScore(b.album.album_type);
                if (scoreA !== scoreB) {
                    return scoreB - scoreA;
                }

                const dateA = new Date(a.album.release_date).getTime();
                const dateB = new Date(b.album.release_date).getTime();
                if (dateA !== dateB) {
                    return dateB - dateA;
                }

                const tracksA = a.album.total_tracks || 0;
                const tracksB = b.album.total_tracks || 0;
                return tracksB - tracksA;
            });

            finalDeduplicatedTracks.push(group[0]);
        }

        let genuinelyNewTracks = finalDeduplicatedTracks;
        console.log(`Followed Releases: Verified ${verifiedNewTracks.length} tracks, deduplicated to ${genuinelyNewTracks.length} tracks.`);

        if (genuinelyNewTracks.length === 0) {
            throw new Error("No genuinely new tracks found after verification and deduplication.");
        }
        
        updateProgress("Sorting...");
        genuinelyNewTracks.sort((a, b) => {
            const dateA = new Date(a.album.release_date).getTime();
            const dateB = new Date(b.album.release_date).getTime();
            if (dateB !== dateA) {
                return dateB - dateA;
            }
        
            const albumNameA = a.album.name || '';
            const albumNameB = b.album.name || '';
            const albumCompare = albumNameA.localeCompare(albumNameB);
            if (albumCompare !== 0) {
                return albumCompare; 
            }
        
            return a.track_number - b.track_number;
        });

        const trackUris = genuinelyNewTracks.map(track => track.uri);
        const playlistName = "Followed Artists: Full Releases";
        const playlistDescription = `All new releases from artists you follow from the last ${newReleasesDaysLimit} days, sorted by release date. Created by Sort-Play.`;
        
        updateProgress("Creating...");
        const { playlist: newPlaylist, wasUpdated } = await getOrCreateDedicatedPlaylist('followedReleasesChronological', playlistName, playlistDescription);
        
        updateProgress("Saving...");
        if (wasUpdated) {
            await replacePlaylistTracks(newPlaylist.id, trackUris);
        } else {
            await addTracksToPlaylist(newPlaylist.id, trackUris);
        }
        
        Spicetify.showNotification(`Playlist "${playlistName}" ${wasUpdated ? 'updated' : 'created'} with ${trackUris.length} tracks!`);

        if (openPlaylistAfterSortEnabled && newPlaylist.uri) { 
            const tempPath = "/library"; 
            Spicetify.Platform.History.push(tempPath);
            await new Promise(resolve => setTimeout(resolve, 600)); 
            const newPlaylistPath = Spicetify.URI.fromString(newPlaylist.uri).toURLPath(true);
            if (newPlaylistPath) Spicetify.Platform.History.push(newPlaylistPath);
        }

    } catch (error) {
        console.error("Error generating Chronological Followed Releases:", error);
        Spicetify.showNotification(error.message, true);
    } finally {
        if (!isHeadless) {
            resetButtons();
        }
    }
  }

  async function isTrackAvailable(track) {
    if (!track) return false;

    if (track.is_playable === false) {
        return false;
    }

    if (Array.isArray(track.available_markets)) {
        if (track.available_markets.length === 0) {
            return false;
        }

        const userMarket = await userMarketPromise;
        if (userMarket) {
            return track.available_markets.includes(userMarket);
        }
    }

    return true;
  }

  async function getDirectTracksFromGenrePlaylists(playlistsToFetch, numTracksNeeded) {
    const directTracks = [];
    const allSimplifiedTracks = [];

    for (const playlist of playlistsToFetch.values()) {
        try {
            const playlistTracks = await getPlaylistTracks(playlist.uri);
            if (playlistTracks.length > 0) {
                allSimplifiedTracks.push(...playlistTracks);
            }
        } catch (error) {
            console.warn(`Could not fetch tracks for genre playlist ${playlist.genre}:`, error);
        }
    }

    if (allSimplifiedTracks.length === 0) {
        return [];
    }

    const uniqueTracksMap = new Map(allSimplifiedTracks.map(t => [t.uri, t]));
    const shuffledPool = shuffleArray(Array.from(uniqueTracksMap.values()));
    
    let poolIndex = 0;

    while (directTracks.length < numTracksNeeded && poolIndex < shuffledPool.length) {
        const needed = numTracksNeeded - directTracks.length;
        const batchSize = Math.min(needed + 10, 50);
        const batchToTest = shuffledPool.slice(poolIndex, poolIndex + batchSize);
        poolIndex += batchSize;

        if (batchToTest.length === 0) break;

        const trackIds = batchToTest.map(t => t.uri.split(':')[2]);
        
        try {
            const fullTrackDetails = await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/tracks?ids=${trackIds.join(',')}`);
            if (fullTrackDetails && fullTrackDetails.tracks) {
                for (const fullTrack of fullTrackDetails.tracks) {
                    if (fullTrack && await isTrackAvailable(fullTrack)) {
                        directTracks.push(fullTrack);
                        if (directTracks.length >= numTracksNeeded) {
                            break;
                        }
                    }
                }
            }
        } catch (error) {
            console.warn(`Failed to fetch a batch of full track details for availability check:`, error);
        }
    }

    const flaggedTracks = directTracks.map(track => ({
        ...track,
        sourceInfo: {
            method: 'Direct Pick',
            sourcePlaylist: 'Various Genre Playlists'
        }
    }));
    
    return flaggedTracks;
  }

  async function discoverTracksViaGenreSearch(selectedGenres, numTracksNeeded, existingTracks = []) {
    const allSearchedTracks = new Map();
    const existingTrackUris = new Set(existingTracks.map(t => t.uri));

    for (const genre of selectedGenres) {
        const searchPromises = [];
        for (let offset = 0; offset < 200; offset += 50) {
            const params = new URLSearchParams({
                q: `genre:"${genre}"`,
                type: 'track',
                limit: 50,
                offset: offset
            });
            searchPromises.push(Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/search?${params.toString()}`));
        }

        const searchResults = await Promise.all(searchPromises);
        for (const result of searchResults) { 
            if (result.tracks?.items) {
                const availabilityChecks = await Promise.all(result.tracks.items.map(track => isTrackAvailable(track)));
                result.tracks.items.forEach((track, index) => {
                    if (availabilityChecks[index] && !allSearchedTracks.has(track.uri)) {
                        allSearchedTracks.set(track.uri, track);
                    }
                });
            }
        }
    }

    if (allSearchedTracks.size === 0) {
        console.warn("Genre search returned no available tracks.");
        return [];
    }
    
    const trackPool = Array.from(allSearchedTracks.values()).filter(track => !existingTrackUris.has(track.uri));

    return shuffleArray(trackPool).slice(0, numTracksNeeded).map(track => ({
        ...track,
        sourceInfo: {
            method: 'Genre Search',
            searchTerm: selectedGenres.join(', ')
        }
    }));
  }

  async function discoverTracksViaMultiSeedRecommendation(playlistsToFetch, numTracksNeeded, existingTracks = []) {
    const existingTrackUris = new Set(existingTracks.map(t => t.uri));
    const recommendationPool = new Map();
    let seedTrackPool = [];

    for (const playlist of playlistsToFetch.values()) {
        try {
            const playlistTracks = await getPlaylistTracks(playlist.uri);
            const availabilityChecks = await Promise.all(playlistTracks.map(track => isTrackAvailable(track)));
            seedTrackPool.push(...playlistTracks.filter((_, index) => availabilityChecks[index]));
        } catch (error) {
            console.warn(`Could not fetch seed tracks from ${playlist.genre}:`, error);
        }
    }
    
    if (seedTrackPool.length < 5) {
        console.warn("Not enough available seed tracks for multi-seed recommendation.");
        return [];
    }

    seedTrackPool = shuffleArray(Array.from(new Map(seedTrackPool.map(t => [t.uri, t])).values()));

    const NUM_RECOMMENDATION_CALLS = 4;
    const recommendationPromises = [];

    for (let i = 0; i < NUM_RECOMMENDATION_CALLS; i++) {
        const seedTracks = seedTrackPool.slice(i * 5, (i * 5) + 5).map(t => t.uri.split(':')[2]);
        if (seedTracks.length === 0) continue;

        const params = new URLSearchParams({
            limit: 50,
            seed_tracks: seedTracks.join(',')
        });
        recommendationPromises.push(Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/recommendations?${params.toString()}`));
    }

    const recommendationResults = await Promise.all(recommendationPromises);
    for (const result of recommendationResults) { 
        if (result.tracks) {
            const availabilityChecks = await Promise.all(result.tracks.map(track => isTrackAvailable(track)));
            result.tracks.forEach((track, index) => {
                if (availabilityChecks[index] && !recommendationPool.has(track.uri)) {
                    recommendationPool.set(track.uri, track);
                }
            });
        }
    }

    const sourceDescription = `Seeded from ${playlistsToFetch.size} playlists like: ${Array.from(playlistsToFetch.values()).slice(0,3).map(p => p.genre).join(', ')}...`;
    const recommendedTracks = Array.from(recommendationPool.values())
        .filter(track => !existingTrackUris.has(track.uri))
        .map(track => ({
            ...track,
            sourceInfo: {
                method: 'Recommendation',
                details: sourceDescription
            }
        }));

    return shuffleArray(recommendedTracks).slice(0, numTracksNeeded);
  }

  async function generateGenreTreePlaylist(selectedGenres) {
    setButtonProcessing(true);
    mainButton.style.backgroundColor = buttonStyles.main.disabledBackgroundColor;
    mainButton.style.color = buttonStyles.main.disabledColor;
    mainButton.style.cursor = "default";
    svgElement.style.fill = buttonStyles.main.disabledColor;
    menuButtons.forEach((button) => (button.disabled = true));
    toggleMenu();
    closeAllMenus();

    try {
        mainButton.innerText = "Finding...";
        if (!genrePlaylistsCache) {
            const response = await fetch(GENRE_PLAYLISTS_URL);
            genrePlaylistsCache = await response.json();
        }

        const playlistsToFetch = new Map();
        const numPlaylistsPerGenre = Math.max(5, Math.floor(20 / selectedGenres.length));

        for (const selectedGenre of selectedGenres) {
            const isMainGenre = !!GENRE_MAPPINGS[selectedGenre];
            const allGenreTerms = isMainGenre 
                ? new Set([selectedGenre, ...(GENRE_MAPPINGS[selectedGenre] || [])])
                : new Set([selectedGenre]);
            
            const matchingPlaylists = genrePlaylistsCache.filter(p => 
                [...allGenreTerms].some(term => {
                    const escapedTerm = escapeRegExp(term);
                    const regex = new RegExp(`\\b${escapedTerm}\\b`, 'i');
                    return regex.test(p.genre);
                })
            );

            const shuffled = shuffleArray(matchingPlaylists);
            shuffled.slice(0, numPlaylistsPerGenre).forEach(p => playlistsToFetch.set(p.uri, p));
        }

        if (playlistsToFetch.size === 0) {
            throw new Error("Could not find any genre playlists for your selection.");
        }

        const tracksPerPart = Math.ceil(discoveryPlaylistSize / 3);

        mainButton.innerText = "Fetching...";
        const directTracks = await getDirectTracksFromGenrePlaylists(playlistsToFetch, tracksPerPart);

        mainButton.innerText = "Discover...";
        const [searchedTracks, recommendedTracks] = await Promise.all([
            discoverTracksViaGenreSearch(selectedGenres, tracksPerPart, directTracks),
            discoverTracksViaMultiSeedRecommendation(playlistsToFetch, tracksPerPart, directTracks)
        ]);

        mainButton.innerText = "Combining...";
        const allTracks = [...directTracks, ...searchedTracks, ...recommendedTracks];

        const uniqueFinalTracks = Array.from(new Map(allTracks.map(t => [t.uri, t])).values());
        const finalSizedTracks = shuffleArray(uniqueFinalTracks).slice(0, discoveryPlaylistSize);

        mainButton.innerText = "Sorting...";
        const { trackGenreMap } = await fetchAllTrackGenres(finalSizedTracks);
        const sortedTracks = interleaveSortByGenre(finalSizedTracks, trackGenreMap);

        const trackUris = sortedTracks.map(t => t.uri);
        const playlistName = `Genre Explorer: ${selectedGenres.slice(0, 3).join(', ')}${selectedGenres.length > 3 ? '...' : ''}`;
        
        let genreListString = selectedGenres.join(', ');
        const maxGenreListLength = 240;
        if (genreListString.length > maxGenreListLength) {
            genreListString = genreListString.substring(0, maxGenreListLength) + "...";
        }
        const playlistDescription = `A playlist exploring the genres: ${genreListString}. Created by Sort-Play.`;

        mainButton.innerText = "Creating...";
        const { playlist: newPlaylist, wasUpdated } = await getOrCreateDedicatedPlaylist('genreTreeExplorer', playlistName, playlistDescription);

        mainButton.innerText = "Saving...";
        if (wasUpdated) {
            await replacePlaylistTracks(newPlaylist.id, trackUris);
        } else {
            await addTracksToPlaylist(newPlaylist.id, trackUris);
        }

        Spicetify.showNotification(`Playlist "${playlistName}" ${wasUpdated ? 'updated' : 'created'}!`);
        await navigateToPlaylist(newPlaylist);

    } catch (error) {
        console.error("Error in Genre Tree Explorer:", error);
        Spicetify.showNotification(error.message, true);
    } finally {
        resetButtons();
    }
  }

  async function generateRandomGenrePlaylist(options = {}) {
    const { isHeadless = false } = options;
    if (!isHeadless) {
        setButtonProcessing(true);
        mainButton.style.backgroundColor = buttonStyles.main.disabledBackgroundColor;
        mainButton.style.color = buttonStyles.main.disabledColor;
        mainButton.style.cursor = "default";
        svgElement.style.fill = buttonStyles.main.disabledColor;
        menuButtons.forEach((button) => (button.disabled = true));
        toggleMenu();
        closeAllMenus();
    }

    try {
        if (!isHeadless) mainButton.innerText = "Finding...";
        if (!genrePlaylistsCache) {
            const response = await fetch(GENRE_PLAYLISTS_URL);
            genrePlaylistsCache = await response.json();
        }

        const allAvailableGenres = [...new Set(genrePlaylistsCache.map(p => p.genre))];
        if (allAvailableGenres.length < RANDOM_GENRE_SELECTION_SIZE) {
            throw new Error("Not enough genres in the database to create a random playlist.");
        }

        let genreHistory = JSON.parse(localStorage.getItem(STORAGE_KEY_RANDOM_GENRE_HISTORY) || '[]');
        let availablePool = allAvailableGenres.filter(genre => !genreHistory.includes(genre));

        if (availablePool.length < RANDOM_GENRE_SELECTION_SIZE) {
            genreHistory = [];
            availablePool = allAvailableGenres;
        }

        const selectedGenres = shuffleArray(availablePool).slice(0, RANDOM_GENRE_SELECTION_SIZE);

        genreHistory.push(...selectedGenres);
        if (genreHistory.length > RANDOM_GENRE_HISTORY_SIZE) {
            genreHistory = genreHistory.slice(genreHistory.length - RANDOM_GENRE_HISTORY_SIZE);
        }
        localStorage.setItem(STORAGE_KEY_RANDOM_GENRE_HISTORY, JSON.stringify(genreHistory));

        const playlistsToFetch = new Map();
        for (const selectedGenre of selectedGenres) {
            const matchingPlaylists = genrePlaylistsCache.filter(p => p.genre === selectedGenre);
            if (matchingPlaylists.length > 0) {
                const chosenPlaylist = matchingPlaylists[Math.floor(Math.random() * matchingPlaylists.length)];
                playlistsToFetch.set(chosenPlaylist.uri, chosenPlaylist);
            }
        }

        if (playlistsToFetch.size === 0) {
            throw new Error("Could not find any genre playlists for the random selection.");
        }

        const tracksPerPart = Math.ceil(discoveryPlaylistSize / 3);

        if (!isHeadless) mainButton.innerText = "Fetching...";
        const directTracks = await getDirectTracksFromGenrePlaylists(playlistsToFetch, tracksPerPart);

        if (!isHeadless) mainButton.innerText = "Discover...";
        const [searchedTracks, recommendedTracks] = await Promise.all([
            discoverTracksViaGenreSearch(selectedGenres, tracksPerPart, directTracks),
            discoverTracksViaMultiSeedRecommendation(playlistsToFetch, tracksPerPart, directTracks)
        ]);

        if (!isHeadless) mainButton.innerText = "Combining...";
        const allTracks = [...directTracks, ...searchedTracks, ...recommendedTracks];
        
        const uniqueFinalTracks = Array.from(new Map(allTracks.map(t => [t.uri, t])).values());
        const finalSizedTracks = shuffleArray(uniqueFinalTracks).slice(0, discoveryPlaylistSize);

        if (!isHeadless) mainButton.innerText = "Sorting...";
        const { trackGenreMap } = await fetchAllTrackGenres(finalSizedTracks);
        const sortedTracks = interleaveSortByGenre(finalSizedTracks, trackGenreMap);

        const trackUris = sortedTracks.map(t => t.uri);
        const playlistName = `Random Genre Explorer`;
        
        let genreListString = selectedGenres.slice(0, 10).join(', ');
        const maxGenreListLength = 240;
        if (genreListString.length > maxGenreListLength) {
            genreListString = genreListString.substring(0, maxGenreListLength) + "...";
        }
        const playlistDescription = `A playlist exploring a random mix of genres including: ${genreListString}. Created by Sort-Play.`;

        if (!isHeadless) mainButton.innerText = "Creating...";
        const { playlist: newPlaylist, wasUpdated } = await getOrCreateDedicatedPlaylist('randomGenreExplorer', playlistName, playlistDescription);

        if (!isHeadless) mainButton.innerText = "Saving...";
        if (wasUpdated) {
            await replacePlaylistTracks(newPlaylist.id, trackUris);
        } else {
            await addTracksToPlaylist(newPlaylist.id, trackUris);
        }

        Spicetify.showNotification(`Playlist "${playlistName}" ${wasUpdated ? 'updated' : 'created'}!`);
        await navigateToPlaylist(newPlaylist);

    } catch (error) {
        console.error("Error in Random Genre Explorer:", error);
        Spicetify.showNotification(error.message, true);
    } finally {
        if (!isHeadless) {
            resetButtons();
        }
    }
  }

  function interleaveSortByGenre(tracks, trackGenreMap) {
    if (!tracks || tracks.length === 0) return [];

    const genreToTracksMap = new Map();
    const trackToGenresMap = new Map();

    tracks.forEach(track => {
        const genres = trackGenreMap.get(track.uri);
        if (genres && genres.length > 0) {
            const genreNames = genres.map(g => g.name);
            trackToGenresMap.set(track.uri, genreNames);

            genreNames.forEach(genreName => {
                if (!genreToTracksMap.has(genreName)) {
                    genreToTracksMap.set(genreName, []);
                }
                genreToTracksMap.get(genreName).push(track);
            });
        } else {
            const NO_GENRE_KEY = '__no_genre__';
            if (!genreToTracksMap.has(NO_GENRE_KEY)) {
                genreToTracksMap.set(NO_GENRE_KEY, []);
            }
            genreToTracksMap.get(NO_GENRE_KEY).push(track);
            trackToGenresMap.set(track.uri, [NO_GENRE_KEY]);
        }
    });

    const sortedTracks = [];
    const remainingTracksUris = new Set(tracks.map(t => t.uri));
    let lastGenre = null;

    while (remainingTracksUris.size > 0) {
        let availableGenres = [...genreToTracksMap.keys()].filter(g => genreToTracksMap.get(g).length > 0);
        
        if (availableGenres.length > 1 && lastGenre && availableGenres.includes(lastGenre)) {
            availableGenres = availableGenres.filter(g => g !== lastGenre);
        }

        if (availableGenres.length === 0) {
            availableGenres = [...genreToTracksMap.keys()].filter(g => genreToTracksMap.get(g).length > 0);
            if (availableGenres.length === 0) break;
        }

        const chosenGenre = availableGenres[Math.floor(Math.random() * availableGenres.length)];
        const tracksInGenre = genreToTracksMap.get(chosenGenre);
        const chosenTrack = tracksInGenre.splice(Math.floor(Math.random() * tracksInGenre.length), 1)[0];

        sortedTracks.push(chosenTrack);
        remainingTracksUris.delete(chosenTrack.uri);
        lastGenre = chosenGenre;

        const allGenresOfChosenTrack = trackToGenresMap.get(chosenTrack.uri);
        allGenresOfChosenTrack.forEach(genreName => {
            if (genreToTracksMap.has(genreName)) {
                const list = genreToTracksMap.get(genreName);
                const index = list.findIndex(t => t.uri === chosenTrack.uri);
                if (index > -1) {
                    list.splice(index, 1);
                }
            }
        });
    }

    return sortedTracks;
  }

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  async function showGenreTreeExplorerModal() {
    const overlay = document.createElement("div");
    overlay.id = "sort-play-genre-tree-overlay";
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
        z-index: 2002;
        display: flex; justify-content: center; align-items: center;
    `;

    const modalContainer = document.createElement("div");
    modalContainer.className = "main-embedWidgetGenerator-container sort-play-font-scope";
    modalContainer.style.cssText = `
        z-index: 2003;
        width: 620px !important;
        display: flex;
        flex-direction: column;
        border-radius: 30px;
    `;

    if (!genrePlaylistsCache) {
        try {
            const response = await fetch(GENRE_PLAYLISTS_URL);
            genrePlaylistsCache = await response.json();
        } catch (e) {
            console.error("Sort-Play: Failed to fetch genre database for sorting.", e);
            Spicetify.showNotification("Could not fetch genre database.", true);
            genrePlaylistsCache = []; 
        }
    }
    
    const genreRankMap = new Map();
    genrePlaylistsCache.forEach((p, index) => {
        const lowerGenre = p.genre.toLowerCase();
        if (!genreRankMap.has(lowerGenre)) {
            genreRankMap.set(lowerGenre, index);
        }
    });

    const mainGenreList = Object.keys(GENRE_MAPPINGS);
    const mainGenreRankCache = new Map();

    const getMainGenreRank = (mainGenre) => {
        if (mainGenreRankCache.has(mainGenre)) {
            return mainGenreRankCache.get(mainGenre);
        }

        let rank = genreRankMap.get(mainGenre.toLowerCase());
        if (rank !== undefined) {
            mainGenreRankCache.set(mainGenre, rank);
            return rank;
        }

        const subGenres = GENRE_MAPPINGS[mainGenre] || [];
        let minRank = Infinity;
        for (const subGenre of subGenres) {
            const subGenreRank = genreRankMap.get(subGenre.toLowerCase());
            if (subGenreRank !== undefined) {
                minRank = Math.min(minRank, subGenreRank);
            }
        }

        mainGenreRankCache.set(mainGenre, minRank);
        return minRank;
    };

    const priorityGenres = ["pop", "rock", "hip hop", "rap", "jazz", "electronic", "r&b", "country", "classical", "metal", "folk", "blues", "reggae", "punk"];

    mainGenreList.sort((a, b) => {
        const aLower = a.toLowerCase();
        const bLower = b.toLowerCase();
        const isAPriority = priorityGenres.includes(aLower);
        const isBPriority = priorityGenres.includes(bLower);

        if (isAPriority && !isBPriority) return -1;
        if (!isAPriority && isBPriority) return 1;
        if (isAPriority && isBPriority) {
            return priorityGenres.indexOf(aLower) - priorityGenres.indexOf(bLower);
        }

        const rankA = getMainGenreRank(a);
        const rankB = getMainGenreRank(b);

        if (rankA !== Infinity && rankB === Infinity) return -1;
        if (rankA === Infinity && rankB !== Infinity) return 1;
        
        if (rankA !== rankB) {
            return rankA - rankB;
        }

        return a.localeCompare(b);
    });


    let selectedMainGenres = [];
    let userAddedGenres = new Set();
    let selectedUserGenres = new Set();

    const savedUserGenres = localStorage.getItem(STORAGE_KEY_USER_ADDED_GENRES);
    if (savedUserGenres) {
        try {
            userAddedGenres = new Set(JSON.parse(savedUserGenres));
        } catch (e) {
            console.error("Sort-Play: Failed to parse user-added genres.", e);
            userAddedGenres = new Set();
        }
    }

    const saveUserGenres = () => {
        localStorage.setItem(STORAGE_KEY_USER_ADDED_GENRES, JSON.stringify(Array.from(userAddedGenres)));
    };

    modalContainer.innerHTML = `
      <style>
        .genre-tree-modal .genre-container { max-height: 23vh; overflow-y: auto; background-color: #1e1e1e; border-radius: 20px; padding: 15px 10px; margin-top: 15px; scrollbar-width: thin; scrollbar-color: #3b3b3b transparent; }
        .genre-tree-modal .genre-container::-webkit-scrollbar { width: 6px; }
        .genre-tree-modal .genre-container::-webkit-scrollbar-track { background: transparent; }
        .genre-tree-modal .genre-container::-webkit-scrollbar-thumb { background-color: #535353; border-radius: 3px; }
        .genre-tree-modal .user-added-container { margin-top: 0; max-height: 12vh; margin-bottom: 15px; margin-top: 15px; }
        .genre-tree-modal .genre-button { display: inline-flex; align-items: center; padding: 6px 16px; margin: 4px; border-radius: 20px; border: none; cursor: pointer; background-color: #343434; color: white; font-weight: 500; font-size: 14px; transition: background-color 0.2s ease; }
        .genre-tree-modal .genre-button.selected { background-color: #1ED760; color: black; }
        .genre-tree-modal .user-genre-remove { margin-left: 8px; font-size: 16px; font-weight: bold; line-height: 1; opacity: 0.7; }
        .genre-tree-modal .user-genre-remove:hover { opacity: 1; }
        .genre-tree-modal .search-bar-wrapper { position: relative; display: flex; align-items: center; }
        .genre-tree-modal .search-bar { width: 100%; padding: 10px 45px 10px 15px; border-radius: 20px; border: 1px solid #282828; background: #282828; color: white; }
        .genre-tree-modal .add-genre-button { position: absolute; right: 5px; top: 5px; bottom: 5px; width: 50px; height: 30px; background-color: #1ED760; color: black; border: none; border-radius: 20px; font-size: 24px; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; line-height: 1; }
        .genre-tree-modal .add-genre-button:hover { background-color: #3BE377; }
        .genre-tree-modal #genre-add-error { color: #f15e6c; font-size: 13px; margin-top: 8px; text-align: center; display: none; }
        .genre-tree-modal .main-button-primary { background-color: #1ED760; color: black; transition: background-color 0.1s ease;}
        .genre-tree-modal .main-button-primary:hover { background-color: #3BE377; }
        .genre-tree-modal .genre-section-header { color: #b3b3b3; font-size: 14px; font-weight: bold; margin-top: 15px; margin-bottom: -5px; padding-left: 10px; }
        .main-trackCreditsModal-closeBtn { background: transparent; border: 0; padding: 0; color: #b3b3b3; cursor: pointer; transition: color 0.2s ease; }
        .main-trackCreditsModal-closeBtn:hover { color: #ffffff; }
        .main-buttons-button.main-button-primary { background-color: #1ED760; color: black; transition: background-color 0.1s ease;}
        .main-buttons-button.main-button-primary:hover { background-color: #3BE377; }
      </style>
      <div class="main-trackCreditsModal-header" style="display: flex; justify-content: space-between; align-items: center;">
          <h1 class="main-trackCreditsModal-title"><span style='font-size: 25px;'>Genre Tree Explorer</span></h1>
          <button id="closeGenreTreeModal" aria-label="Close" class="main-trackCreditsModal-closeBtn">
            <svg width="18" height="18" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <title>Close</title>
                <path d="M31.098 29.794L16.955 15.65 31.097 1.51 29.683.093 15.54 14.237 1.4.094-.016 1.508 14.126 15.65-.016 29.795l1.414 1.414L15.54 17.065l14.144 14.143" fill="currentColor" fill-rule="evenodd"></path>
            </svg>
          </button>
      </div>
      <div class="main-trackCreditsModal-mainSection genre-tree-modal" style="padding: 22px 47px 20px !important; max-height: 70vh; flex-grow: 1;">
        <p style="color: #c1c1c1; font-size: 16px; margin-bottom: 15px;">Select genres or add your own to start exploring.</p>
        <div class="search-bar-wrapper">
            <input type="text" id="genre-search-bar" class="search-bar" placeholder="Search or add a new genre...">
            <button id="add-genre-btn" class="add-genre-button" title="Add Genre">+</button>
        </div>
        <div id="genre-add-error"></div>
        <div id="user-added-section" style="display: none;">
            <div class="genre-section-header">Your Added Genres</div>
            <div id="user-added-genres-container" class="genre-container user-added-container"></div>
        </div>
        <div class="genre-section-header">Main Genres</div>
        <div id="genre-buttons-container" class="genre-container"></div>
      </div>
      <div class="main-trackCreditsModal-originalCredits" style="padding: 15px 24px !important; border-top: 1px solid #282828; flex-shrink: 0;">
        <div style="display: flex; justify-content: flex-end; align-items: center; gap: 15px;">
            <div id="genre-selection-error" style="color: #f15e6c; font-size: 13px; display: none; flex-grow: 1; text-align: right;"></div>
            <button id="createGenreTreePlaylist" class="main-buttons-button main-button-primary" 
                    style="padding: 8px 18px; border-radius: 20px; font-weight: 550; font-size: 13px; text-transform: uppercase; border: none; cursor: pointer;">
                Create Playlist
            </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(overlay);
    overlay.appendChild(modalContainer);

    const userGenreSection = modalContainer.querySelector('#user-added-section');
    const userGenreContainer = modalContainer.querySelector('#user-added-genres-container');
    const mainGenreContainer = modalContainer.querySelector('#genre-buttons-container');
    const searchBar = modalContainer.querySelector('#genre-search-bar');
    const addBtn = modalContainer.querySelector('#add-genre-btn');
    const errorDiv = modalContainer.querySelector('#genre-add-error');

    const renderGenres = (filter = '') => {
        mainGenreContainer.innerHTML = '';
        const filteredGenres = mainGenreList.filter(g => g.toLowerCase().includes(filter.toLowerCase()));
        filteredGenres.forEach(genre => {
            const btn = document.createElement('button');
            btn.className = 'genre-button';
            btn.textContent = genre;
            if (selectedMainGenres.includes(genre)) {
                btn.classList.add('selected');
            }
            btn.onclick = () => {
                if (selectedMainGenres.includes(genre)) {
                    selectedMainGenres = selectedMainGenres.filter(g => g !== genre);
                    btn.classList.remove('selected');
                } else {
                    selectedMainGenres.push(genre);
                    btn.classList.add('selected');
                }
            };
            mainGenreContainer.appendChild(btn);
        });
    };

    const renderUserGenres = (filter = '') => {
        userGenreContainer.innerHTML = '';
        const filteredUserGenres = [...userAddedGenres].filter(g => g.toLowerCase().includes(filter.toLowerCase()));
        
        if (userAddedGenres.size === 0) {
            userGenreSection.style.display = 'none';
            return;
        }
        userGenreSection.style.display = 'block';

        filteredUserGenres.forEach(genre => {
            const btn = document.createElement('button');
            btn.className = 'genre-button';
            
            const textSpan = document.createElement('span');
            textSpan.textContent = genre;
            btn.appendChild(textSpan);

            const removeSpan = document.createElement('span');
            removeSpan.className = 'user-genre-remove';
            removeSpan.innerHTML = '&times;';
            removeSpan.onclick = (e) => {
                e.stopPropagation();
                userAddedGenres.delete(genre);
                selectedUserGenres.delete(genre);
                saveUserGenres();
                fullRender(searchBar.value);
            };
            btn.appendChild(removeSpan);

            if (selectedUserGenres.has(genre)) {
                btn.classList.add('selected');
            }
            btn.onclick = () => {
                if (selectedUserGenres.has(genre)) {
                    selectedUserGenres.delete(genre);
                    btn.classList.remove('selected');
                } else {
                    selectedUserGenres.add(genre);
                    btn.classList.add('selected');
                }
            };
            userGenreContainer.appendChild(btn);
        });
    };

    const fullRender = (filter = '') => {
        renderUserGenres(filter);
        renderGenres(filter);
    };

    searchBar.addEventListener('input', () => fullRender(searchBar.value));
    
    addBtn.addEventListener('click', async () => {
        const newGenre = searchBar.value.trim().toLowerCase();
        errorDiv.style.display = 'none';

        if (!newGenre) return;
        if (mainGenreList.includes(newGenre) || userAddedGenres.has(newGenre)) {
            errorDiv.textContent = `"${newGenre}" already exists in the list.`;
            errorDiv.style.display = 'block';
            setTimeout(() => { errorDiv.style.display = 'none'; }, 4000);
            return;
        }

        if (!genrePlaylistsCache) {
            errorDiv.textContent = "Could not verify genre; genre database is unavailable.";
            errorDiv.style.display = 'block';
            setTimeout(() => { errorDiv.style.display = 'none'; }, 4000);
            return;
        }

        const escapedGenre = escapeRegExp(newGenre);
        const regex = new RegExp(`\\b${escapedGenre}\\b`, 'i');
        const hasMatch = genrePlaylistsCache.some(p => regex.test(p.genre));

        if (hasMatch) {
            userAddedGenres.add(newGenre);
            selectedUserGenres.add(newGenre);
            saveUserGenres();
            searchBar.value = '';
            fullRender();
        } else {
            errorDiv.textContent = `No genre found for "${newGenre}". Try a broader term.`;
            errorDiv.style.display = 'block';
            setTimeout(() => { errorDiv.style.display = 'none'; }, 4000);
        }
    });

    fullRender();

    const closeModal = () => overlay.remove();
    
    const createPlaylistBtn = modalContainer.querySelector('#createGenreTreePlaylist');
    const selectionErrorDiv = modalContainer.querySelector('#genre-selection-error');

    createPlaylistBtn.addEventListener('click', () => {
        const allSelected = [...selectedMainGenres, ...selectedUserGenres];
        if (allSelected.length === 0) {
            selectionErrorDiv.textContent = "Please select at least one genre.";
            selectionErrorDiv.style.display = 'block';
            setTimeout(() => { selectionErrorDiv.style.display = 'none'; }, 4000);
            return;
        }
        closeModal();
        generateGenreTreePlaylist(allSelected);
    });

    const closeButton = modalContainer.querySelector("#closeGenreTreeModal");
    if (closeButton) {
        closeButton.addEventListener("click", closeModal);
    }

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            e.preventDefault();
            e.stopPropagation();
        }
    });
  }

  async function handleSortAndCreatePlaylist(sortType, options = {}) {
    const { isHeadless = false } = options;

    const currentUriAtStartForCheck = getCurrentUri();
    if (isLocalFilesPage(currentUriAtStartForCheck)) {
        const unsupportedSortsForLocalFiles = [
            'playCount', 'popularity', 'releaseDate', 'averageColor', 
            'energyWave', 'tempo', 'energy', 'danceability', 'valence', 
            'acousticness', 'instrumentalness', 'deduplicateOnly', 
            'aiPick', 'customFilter', 'genreFilter'
        ];

        if (unsupportedSortsForLocalFiles.includes(sortType)) {
            Spicetify.showNotification("This sort type is not available for Local Files. Only Scrobble and Shuffle sorts are supported.", true);
            if (!isHeadless) {
                resetButtons();
            }
            return;
        }
    }

    if (sortType === "sortByParent" || sortType === "createNewPlaylist") {
      return;
    }

    const topTrackSortTypes = {
        topThisMonth:    { time_range: 'short_term',  name: 'This Month',      description: 'from this month' },
        topLast6Months:  { time_range: 'medium_term', name: 'Last 6 Months',   description: 'from the last 6 months' },
        topAllTime:      { time_range: 'long_term',   name: 'All-Time',        description: 'of all time' }
    };

    const recommendationSortTypes = ['recommendRecentVibe', 'recommendAllTime', 'pureDiscovery', 'followedReleasesChronological', 'genreTreeExplorer'];
    if (recommendationSortTypes.includes(sortType)) {
        if (sortType === 'genreTreeExplorer') {
            showGenreTreeExplorerModal();
        } else if (sortType === 'followedReleasesChronological') {
            await generateFollowedReleasesChronological(options);
        } else { 
            await generateSpotifyRecommendations(sortType, options);
        }
        return; 
    }

    if (sortType === "aiPick") {
        setButtonProcessing(true);
        mainButton.innerHTML = '<div class="loader"></div>';
        mainButton.innerText = "Preparing...";
        toggleMenu();
        closeAllMenus();
    
        try {
            const currentUri = getCurrentUri();
            if (!currentUri) {
                throw new Error("Please select a playlist or artist first");
            }
    
            let tracks;
            if (URI.isPlaylistV1OrV2(currentUri)) {
                tracks = await getPlaylistTracks(currentUri.split(":")[2]);
            } else if (URI.isArtist(currentUri)) {
                tracks = await getArtistTracks(currentUri);
            } else if (isLikedSongsPage(currentUri)) {
                tracks = await getLikedSongs();
            } else if (URI.isAlbum(currentUri)) {
                tracks = await getAlbumTracks(currentUri.split(":")[2]);
            } else {
                throw new Error('Invalid page for AI Pick');
            }
    
            if (!tracks || tracks.length === 0) {
                throw new Error('No tracks found to analyze');
            }
            
            await showAiPickModal(tracks);
            resetButtons(); 
    
        } catch (error) {
            console.error("Error preparing AI Pick:", error);
            Spicetify.showNotification(error.message, true);
            resetButtons();
        }
        return;
    }
    
    if (topTrackSortTypes[sortType]) {
        if (!isHeadless) {
            setButtonProcessing(true);
            mainButton.style.backgroundColor = buttonStyles.main.disabledBackgroundColor;
            mainButton.style.color = buttonStyles.main.disabledColor;
            mainButton.style.cursor = "default";
            svgElement.style.fill = buttonStyles.main.disabledColor;
            menuButtons.forEach((button) => (button.disabled = true));
            toggleMenu();
            closeAllMenus();
        }
        
        try {
            if (!isHeadless) mainButton.innerText = "Fetching...";
            const topTracksData = await getTopItems('tracks', topTrackSortTypes[sortType].time_range, topTracksLimit);
            
            if (!topTracksData || topTracksData.length === 0) {
                Spicetify.showNotification(`No top tracks found for "${topTrackSortTypes[sortType].name}".`, true);
                if (!isHeadless) resetButtons();
                return;
            }

            const trackUris = topTracksData.map(track => track.uri);
            const playlistName = `My Top Tracks: ${topTrackSortTypes[sortType].name}`;
            const playlistDescription = `Your top tracks ${topTrackSortTypes[sortType].description}, created by Sort-Play.`;
            
            if (!isHeadless) mainButton.innerText = "Creating...";
            const { playlist: newPlaylist, wasUpdated } = await getOrCreateDedicatedPlaylist(sortType, playlistName, playlistDescription);
            
            if (!isHeadless) mainButton.innerText = "Saving...";
            if (wasUpdated) {
                await replacePlaylistTracks(newPlaylist.id, trackUris);
            } else {
                await addTracksToPlaylist(newPlaylist.id, trackUris);
            }
            
            Spicetify.showNotification(`Playlist "${playlistName}" ${wasUpdated ? 'updated' : 'created'} successfully!`);

            if (openPlaylistAfterSortEnabled && newPlaylist && newPlaylist.uri) { 
                const tempPath = "/library"; 
                Spicetify.Platform.History.push(tempPath);
                await new Promise(resolve => setTimeout(resolve, 450)); 
                const newPlaylistPath = Spicetify.URI.fromString(newPlaylist.uri).toURLPath(true);
                if (newPlaylistPath) {
                  Spicetify.Platform.History.push(newPlaylistPath);
                } else {
                  console.warn("Could not determine path for new playlist URI:", newPlaylist.uri);
                }
            }
        } catch (error) {
            console.error("Error creating top tracks playlist:", error);
            Spicetify.showNotification("Failed to create top tracks playlist.", true);
        } finally {
            if (!isHeadless) {
                resetButtons();
            }
        }
        return; 
    }

    if (!isHeadless) {
        setButtonProcessing(true);
        mainButton.style.backgroundColor = buttonStyles.main.disabledBackgroundColor;
        mainButton.style.color = buttonStyles.main.disabledColor;
        mainButton.style.cursor = "default";
        svgElement.style.fill = buttonStyles.main.disabledColor;
        menuButtons.forEach((button) => (button.disabled = true));
        toggleMenu();
        closeAllMenus();
    }

    const initialPagePath = Spicetify.Platform.History.location.pathname; 

    try {
      const currentUriAtStart = getCurrentUri(); 
      if (!currentUriAtStart) {
        if (!isHeadless) resetButtons();
        Spicetify.showNotification("Please select a playlist or artist first");
        return;
      }

      let tracks;
      let isArtistPage = false;
      let isAlbumPage = false;
      let currentPlaylistDetails = null;
      let sourcePlaylistCoverUrl = null;
      let sourceNameForDialog = "Current Context"; 

      if (URI.isPlaylistV1OrV2(currentUriAtStart)) {
        const playlistId = currentUriAtStart.split(":")[2];
        tracks = await getPlaylistTracks(playlistId);
        try {
            currentPlaylistDetails = await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/playlists/${playlistId}`);
            sourceNameForDialog = currentPlaylistDetails?.name || "Current Playlist";
            if (currentPlaylistDetails?.images?.length > 0) {
                sourcePlaylistCoverUrl = currentPlaylistDetails.images[0].url;
            }
        } catch (e) {
            console.warn("Could not fetch current playlist details for ownership check/dialog", e);
        }
      } else if (URI.isArtist(currentUriAtStart)) {
        tracks = await getArtistTracks(currentUriAtStart);
        isArtistPage = true;
      } else if (isLikedSongsPage(currentUriAtStart)) {
        tracks = await getLikedSongs();
      } else if (isLocalFilesPage(currentUriAtStart)) {
        tracks = await getLocalFilesTracks();
      } else if (URI.isAlbum(currentUriAtStart)) {
        const albumId = currentUriAtStart.split(":")[2];
        tracks = await getAlbumTracks(albumId);
        isAlbumPage = true;
        try {
            const albumDetails = await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/albums/${albumId}`);
            sourceNameForDialog = albumDetails?.name || "Current Album";
            if (albumDetails?.images?.length > 0) {
                sourcePlaylistCoverUrl = albumDetails.images[0].url;
            }
        } catch (e) {
            console.warn("Could not fetch current album details", e);
        }
      } else {
        throw new Error('Invalid page for sorting');
      }

      if (!tracks || tracks.length === 0) {
          Spicetify.showNotification('No tracks found to sort');
          if (!isHeadless) resetButtons();
          return;
      }

      const user = await Spicetify.Platform.UserAPI.getUser();
      let canModifyCurrentPlaylist = sortCurrentPlaylistEnabled &&
                                       createPlaylistAfterSort && 
                                       isDirectSortType(sortType) &&
                                       URI.isPlaylistV1OrV2(currentUriAtStart) &&
                                       !isArtistPage &&
                                       !isAlbumPage &&
                                       !isLikedSongsPage(currentUriAtStart) &&
                                       currentPlaylistDetails &&
                                       currentPlaylistDetails.owner &&
                                       currentPlaylistDetails.owner.id === user.username;

      if (canModifyCurrentPlaylist && !isHeadless) {
        const userChoice = await showConfirmationModal({
            title: "Sort Current Playlist?",
            description: `This will replace all tracks in this playlist with the sorted version. Do you want to modify the current playlist, or create a new one instead?`,
            confirmText: "Modify Current",
            cancelText: "Cancel",
            neutralText: "Create New",
        });

        if (userChoice === 'cancel') {
            Spicetify.showNotification("Sorting cancelled.");
            if (!isHeadless) resetButtons();
            return;
        } else if (userChoice === 'neutral') {
            canModifyCurrentPlaylist = false;
        }
      }

      let sortedTracks;
      let uniqueTracks;
      let removedTracks = [];
      let playlistUriForQueue = currentUriAtStart; 
      let playlistWasModifiedOrCreated = false;
      let newPlaylistObjectForNavigation = null; 
      let modifiedPlaylistOriginalPath = null;
      let missingDataCount = 0;


      if (sortType === "lastScrobbled") {
          try {
              const result = await handleLastScrobbledSorting(
                tracks, (progress) => { if (!isHeadless) mainButton.innerText = `${progress}%`; }
              );
              sortedTracks = result.sortedTracks;
              removedTracks = result.removedTracks;
              if (!isHeadless) mainButton.innerText = "100%";
          } catch (error) {
              if (!isHeadless) resetButtons();
              Spicetify.showNotification(error.message, true);
              return;
          }
      } else {
        if (!isHeadless) mainButton.innerText = "0%";

        let tracksWithPopularity;

        if (playlistDeduplicate || sortType === 'deduplicateOnly' || isArtistPage) {
          
            let refreshedTracks = tracks;
            if (isArtistPage) {
                if (!isHeadless) mainButton.innerText = "Correcting...";
                refreshedTracks = await refreshTrackAlbumInfo(
                    tracks, (progress) => { if (!isHeadless) mainButton.innerText = `${Math.floor(progress * 0.15)}%`; }
                );
            }
  
            const tracksWithPlayCounts = await enrichTracksWithPlayCounts(
              refreshedTracks, (progress) => { if (!isHeadless) mainButton.innerText = `${15 + Math.floor(progress * 0.30)}%`; }
            );
            const tracksWithIds = await processBatchesWithDelay(
              tracksWithPlayCounts, 50, 500, (progress) => { if (!isHeadless) mainButton.innerText = `${45 + Math.floor(progress * 0.20)}%`; },
              collectTrackIdsForPopularity
            );
            tracksWithPopularity = await fetchPopularityForMultipleTracks(
              tracksWithIds, (progress) => { if (!isHeadless) mainButton.innerText = `${65 + Math.floor(progress * 0.15)}%`; }
            );
        
        } else if (sortType === 'playCount') {
            if (!isHeadless) mainButton.innerText = "0%";
            tracksWithPopularity = await enrichTracksWithPlayCounts(
                tracks, (progress) => { if (!isHeadless) mainButton.innerText = `${Math.floor(progress * 0.80)}%`; }
            );

        } else if (sortType === 'popularity') {
            if (!isHeadless) mainButton.innerText = "0%";
            const tracksWithIds = await processBatchesWithDelay(
              tracks, 50, 500, 
              (progress) => { if (!isHeadless) mainButton.innerText = `${Math.floor(progress * 0.10)}%`; },
              collectTrackIdsForPopularity
            );
            tracksWithPopularity = await fetchPopularityForMultipleTracks(
              tracksWithIds, 
              (progress) => { if (!isHeadless) mainButton.innerText = `${10 + Math.floor(progress * 0.90)}%`; }
            );

        } else {
            tracksWithPopularity = tracks.map(track => ({
                ...track,
                trackId: track.uri.split(":")[2],
                songTitle: track.name,
                artistName: track.artistName || (track.artists && track.artists[0]?.name),
                allArtists: track.allArtists || (track.artists?.map(a => a.name).join(", ")),
                albumName: track.albumName || track.album?.name,
                playCount: "N/A",
                popularity: null,
            }));
        }


        if (
          sortType === "playCount" ||
          sortType === "popularity" ||
          sortType === "shuffle" ||
          sortType === "releaseDate" ||
          sortType === "averageColor" ||
          sortType === "deduplicateOnly"
        ) {
          let tracksForDeduplication;
          if (sortType === "releaseDate") {
            const tracksWithReleaseDates = await processBatchesWithDelay(
              tracksWithPopularity, 50, 500, (progress) => { if (!isHeadless) mainButton.innerText = `${Math.floor(progress * 0.80)}%`; }, getTrackDetailsWithReleaseDate
            );
            tracksForDeduplication = tracksWithReleaseDates;
          } else if (sortType === "averageColor") {
              const cachedTracks = [];
              const uncachedTracks = [];
              for (const track of tracksWithPopularity) {
                  const albumId = track.albumId || track.track?.album?.id;
                  if (albumId && getCachedPaletteAnalysis(albumId)) {
                      cachedTracks.push(track);
                  } else {
                      uncachedTracks.push(track);
                  }
              }

              let tracksWithColor = [];
              const totalColorTracks = tracksWithPopularity.length;

              if (cachedTracks.length > 0) {
                  const cachedResults = await processBatchesWithDelay(
                      cachedTracks, 50, 500,
                      (progress) => {
                          const overallProgress = (cachedTracks.length / totalColorTracks) * progress;
                          if (!isHeadless) mainButton.innerText = `${60 + Math.floor(overallProgress * 0.40)}%`;
                      },
                      getTrackDetailsWithPaletteAnalysis
                  );
                  tracksWithColor.push(...cachedResults);
              }

              if (uncachedTracks.length > 0) {
                  const uncachedResults = await processBatchesWithDelay(
                      uncachedTracks, 15, 1500,
                      (progress) => {
                          const cachedPortion = (cachedTracks.length / totalColorTracks) * 40;
                          const uncachedPortion = (uncachedTracks.length / totalColorTracks) * progress * 0.40;
                          if (!isHeadless) mainButton.innerText = `${60 + Math.floor(cachedPortion + uncachedPortion)}%`;
                      },
                      getTrackDetailsWithPaletteAnalysis
                  );
                  tracksWithColor.push(...uncachedResults);
              }

              tracksForDeduplication = tracksWithColor;
          } else {
            tracksForDeduplication = tracksWithPopularity;
          }
          

          const deduplicationResult = deduplicateTracks(tracksForDeduplication, sortType === "deduplicateOnly", isArtistPage);
          uniqueTracks = deduplicationResult.unique;
          removedTracks = deduplicationResult.removed;

          if (sortType === "playCount") {
            sortedTracks = uniqueTracks
              .filter((track) => track.playCount !== "N/A")
              .sort((a, b) => sortOrderState.playCount ? a.playCount - b.playCount : b.playCount - a.playCount);
          } else if (sortType === "popularity") {
            sortedTracks = uniqueTracks
              .filter((track) => track.popularity !== null)
              .sort((a, b) => sortOrderState.popularity ? a.popularity - b.popularity : b.popularity - a.popularity);
        } else if (sortType === "releaseDate") {
          sortedTracks = uniqueTracks
            .filter((track) => track.releaseDate !== null)
            .sort((a, b) => {
              const dateComparison = sortOrderState.releaseDate
                ? (a.releaseDate || 0) - (b.releaseDate || 0)
                : (b.releaseDate || 0) - (a.releaseDate || 0);

              if (dateComparison !== 0) {
                return dateComparison;
              }
              
              return (a.trackNumber || 0) - (b.trackNumber || 0);
            });
        } else if (sortType === "averageColor") {
              sortedTracks = uniqueTracks
                  .filter(track => track.averageColor && track.averageColor.dominantHsl)
                  .sort((a, b) => {
                      const analysisA = a.averageColor;
                      const analysisB = b.averageColor;
                      const sortOrder = sortOrderState.averageColor ? -1 : 1;

                      if (colorSortMode === 'perceptual') {
                          if (analysisA.isMonochrome && !analysisB.isMonochrome) return -1;
                          if (!analysisA.isMonochrome && analysisB.isMonochrome) return 1;

                          if (analysisA.isMonochrome) {
                              return (analysisB.dominantHsl.l - analysisA.dominantHsl.l);
                          } else {
                              const colorA = analysisA.dominantHsl;
                              const colorB = analysisB.dominantHsl;
                              if (colorA.h !== colorB.h) {
                                  return (colorA.h - colorB.h) * sortOrder;
                              }
                              return colorB.l - colorA.l;
                          }
                      } else {
                          const colorA = analysisA.dominantHsl;
                          const colorB = analysisB.dominantHsl;
                          if (colorA.h !== colorB.h) {
                              return (colorA.h - colorB.h) * sortOrder;
                          }
                          if (colorA.l !== colorB.l) {
                              return (colorA.l - colorB.l) * sortOrder;
                          }
                          return (colorA.s - colorB.s) * sortOrder;
                      }
                  });
          } else if (sortType === "shuffle") {
            const containsLocalFiles = uniqueTracks.some(track => Spicetify.URI.isLocal(track.uri));

            if (useEnergyWaveShuffle && !containsLocalFiles) {
                if (!isHeadless) mainButton.innerText = "Analyzing...";
                const trackIds = uniqueTracks.map(t => t.trackId);
                const allStats = await getBatchTrackStats(trackIds);

                const tracksWithAudioFeatures = uniqueTracks.map(track => {
                    const stats = allStats[track.trackId] || {};
                    return { ...track, ...stats, features: stats };
                });
                
                const tracksWithData = tracksWithAudioFeatures.filter(track => track.features && track.features.energy !== null && track.features.valence !== null);
                const tracksWithoutData = tracksWithAudioFeatures.filter(track => !track.features || track.features.energy === null || track.features.valence === null);
                missingDataCount = tracksWithoutData.length;

                const waveSortedTracks = await randomizedEnergyWaveSort(tracksWithData);

                sortedTracks = [...waveSortedTracks, ...shuffleArray(tracksWithoutData)];
            } else {
                if (useEnergyWaveShuffle && containsLocalFiles && !isHeadless) {
                    Spicetify.showNotification("Playlist contains local files. Using normal shuffle instead of Vibe & Flow.");
                }
                sortedTracks = shuffleArray(uniqueTracks);
            }
          } else if (sortType === "deduplicateOnly") {
            if (removedTracks.length === 0) {
                Spicetify.showNotification("No duplicate tracks found.");
                if (!isHeadless) resetButtons();
                return;
            }
            const originalOrderMap = new Map();
            tracksForDeduplication.forEach((track, index) => {
                if (track.uri) {
                    originalOrderMap.set(track.uri, index);
                }
            });
            sortedTracks = uniqueTracks.sort((a, b) => {
                const orderA = originalOrderMap.get(a.uri);
                const orderB = originalOrderMap.get(b.uri);
                return orderA - orderB;
            });
          }
          if (!isHeadless) mainButton.innerText = "100%";

        } else if (sortType === "energyWave") {
            if (!isHeadless) mainButton.innerText = "Analyzing...";
            const trackIds = tracksWithPopularity.map(t => t.trackId);
            const allStats = await getBatchTrackStats(trackIds);

            const tracksWithAudioFeatures = tracksWithPopularity.map(track => {
                const stats = allStats[track.trackId] || {};
                return { ...track, ...stats, features: stats };
            });
    
            const deduplicationResult = deduplicateTracks(tracksWithAudioFeatures, false, isArtistPage);;
            uniqueTracks = deduplicationResult.unique;
            removedTracks = deduplicationResult.removed;
    
            const tracksWithData = uniqueTracks.filter(track => track.features && track.features.energy !== null && track.features.valence !== null);
            const tracksWithoutData = uniqueTracks.filter(track => !track.features || track.features.energy === null || track.features.valence === null);
            missingDataCount = tracksWithoutData.length;

            const journeySortedTracks = await energyWaveSort(tracksWithData);

            if (sortOrderState.energyWave) {
                journeySortedTracks.reverse();
            }

            if (canModifyCurrentPlaylist) {
                sortedTracks = [...journeySortedTracks, ...tracksWithoutData];
            } else {
                sortedTracks = journeySortedTracks;
            }
            if (!isHeadless) mainButton.innerText = "100%";

        } else if (['tempo', 'energy', 'danceability', 'valence', 'acousticness', 'instrumentalness'].includes(sortType)) {
            const trackIds = tracksWithPopularity.map(t => t.trackId);
            const allStats = await getBatchTrackStats(trackIds, (progress) => {
                const overallProgress = 60 + Math.floor(progress * 0.40);
                if (!isHeadless) mainButton.innerText = `${overallProgress}%`;
            });

            const tracksWithAudioFeatures = tracksWithPopularity.map(track => {
                const stats = allStats[track.trackId] || {};
                return { ...track, ...stats };
            });
    
            const deduplicationResult = deduplicateTracks(tracksWithAudioFeatures, false, isArtistPage);;
            uniqueTracks = deduplicationResult.unique;
            removedTracks = deduplicationResult.removed;
    
            const tracksWithData = uniqueTracks.filter(track => track[sortType] !== null && track[sortType] !== undefined);
            const tracksWithoutData = uniqueTracks.filter(track => track[sortType] === null || track[sortType] === undefined);
            missingDataCount = tracksWithoutData.length;

            const sortedTracksWithData = tracksWithData.sort((a, b) => {
                const valA = a[sortType] || 0;
                const valB = b[sortType] || 0;
                return sortOrderState[sortType] ? valA - valB : valB - valA;
            });

            if (canModifyCurrentPlaylist) {
                sortedTracks = [...sortedTracksWithData, ...tracksWithoutData];
            } else {
                sortedTracks = sortedTracksWithData;
            }

        } else if (sortType === "scrobbles" || sortType === "personalScrobbles") {
            try {
                const tracksWithScrobbles = await handleScrobblesSorting(
                  tracksWithPopularity,
                  sortType,
                  (progress) => { if (!isHeadless) mainButton.innerText = `${80 + Math.floor(progress * 0.20)}%`; }
                );

                const deduplicationResult = deduplicateTracks(tracksWithScrobbles, sortType === "deduplicateOnly", isArtistPage);
                uniqueTracks = deduplicationResult.unique;
                removedTracks = deduplicationResult.removed;

                if (sortType === 'personalScrobbles') {
                    const includeZeroScrobbles = localStorage.getItem("sort-play-include-zero-scrobbles") === "true";
                    sortedTracks = uniqueTracks
                        .filter((track) => includeZeroScrobbles || track.personalScrobbles > 0)
                        .sort((a, b) => sortOrderState.personalScrobbles ? (a.personalScrobbles ?? 0) - (b.personalScrobbles ?? 0) : (b.personalScrobbles ?? 0) - (a.personalScrobbles ?? 0));
                } else {
                    sortedTracks = uniqueTracks
                        .filter((track) => track.scrobbles !== null)
                        .sort((a, b) => sortOrderState.scrobbles ? a.scrobbles - b.scrobbles : b.scrobbles - a.scrobbles);
                }
                if (!isHeadless) mainButton.innerText = "100%";

              } catch (error) {
                if (!isHeadless) resetButtons();
                Spicetify.showNotification(error.message);
                return;
              }
        } else if (sortType === "lastScrobbled") { 
            try {
                const result = await handleLastScrobbledSorting(
                    tracks, (progress) => { if (!isHeadless) mainButton.innerText = `${progress}%`; }
                );
                sortedTracks = result.sortedTracks;
                removedTracks = result.removedTracks;
                if (!isHeadless) mainButton.innerText = "100%";
            } catch (error) {
                if (!isHeadless) resetButtons();
                Spicetify.showNotification(error.message, true);
                return;
            }
        }
      }
      
      if (createPlaylistAfterSort && isDirectSortType(sortType)) {
        if (!sortedTracks || sortedTracks.length === 0) {
            console.log("No tracks left after sorting/filtering to create/modify playlist.");
            if (!addToQueueEnabled) {
                Spicetify.showNotification("No tracks to process for playlist.");
            }
            if (!isHeadless) resetButtons();
            return;
        }
        
        const sourceUriForNaming = currentUriAtStart; 
        let finalSourceName;
        if (URI.isArtist(sourceUriForNaming)) {
            finalSourceName = await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/artists/${sourceUriForNaming.split(":")[2]}`).then((r) => r.name);
        } else if (isLikedSongsPage(sourceUriForNaming)) {
            finalSourceName = "Liked Songs";
        } else if (isLocalFilesPage(sourceUriForNaming)) {
            finalSourceName = "Local Files";
        } else if (URI.isAlbum(sourceUriForNaming)) {
            const albumId = sourceUriForNaming.split(":")[2];
            finalSourceName = await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/albums/${albumId}`).then((r) => r.name);
        } else {
            finalSourceName = currentPlaylistDetails?.name || "Current Playlist";
        }
        
        let suffixPattern = new RegExp(`\\s*(${possibleSuffixes.join("|")})\\s*`);
        while (suffixPattern.test(finalSourceName)) {
          finalSourceName = finalSourceName.replace(suffixPattern, "");
        }
        const sortTypeInfo = {
          playCount: { fullName: "play count", shortName: "PlayCount" },
          popularity: { fullName: "popularity", shortName: "Popularity" },
          releaseDate: { fullName: "release date", shortName: "ReleaseDate" },
          scrobbles: { fullName: "Last.fm scrobbles", shortName: "Scrobbles" },
          personalScrobbles: { fullName: "Last.fm personal scrobbles", shortName: "My Scrobbles" },
          lastScrobbled: { fullName: "your last scrobbled date", shortName: "Last Scrobbled" },
          shuffle: { fullName: "shuffle", shortName: "Shuffle" },
          averageColor: { fullName: "album color", shortName: "Color" },
          deduplicateOnly: { fullName: "deduplication", shortName: "Deduplicated" },
          energyWave: { fullName: "energy wave", shortName: "Energy Wave" },
          tempo: { fullName: "tempo (BPM)", shortName: "Tempo" },
          energy: { fullName: "energy", shortName: "Energy" },
          danceability: { fullName: "danceability", shortName: "Danceability" },
          valence: { fullName: "valence", shortName: "Valence" },
          acousticness: { fullName: "acousticness", shortName: "Acousticness" },
          instrumentalness: { fullName: "instrumentalness", shortName: "Instrumentalness" }
        }[sortType];

        if (canModifyCurrentPlaylist) {
            const playlistIdToModify = currentUriAtStart.split(":")[2];
            modifiedPlaylistOriginalPath = initialPagePath; 

            try {
                const requestBody = {
                    description: `Sorted by ${sortTypeInfo.fullName} using Sort-Play`
                };

                if (changeTitleOnModify) {
                    requestBody.name = `${finalSourceName} (${sortTypeInfo.shortName})`;
                }

                try {
                    await Spicetify.CosmosAsync.put(
                        `https://api.spotify.com/v1/playlists/${playlistIdToModify}`,
                        requestBody
                    );
                } catch (error) {
                    const isExpectedJsonError = error instanceof SyntaxError && error.message.includes("Unexpected end of JSON input");
                    if (!isExpectedJsonError) {
                        console.warn("An unexpected error occurred while updating playlist details. Proceeding with track replacement.", error);
                    }
                }

                if (!isHeadless) mainButton.innerText = "Saving...";
                const trackUris = sortedTracks.map((track) => track.uri);
                await replacePlaylistTracks(playlistIdToModify, trackUris);
                
                Spicetify.showNotification(`Playlist sorted by ${sortTypeInfo.fullName}!`);
                playlistUriForQueue = currentUriAtStart; 
                playlistWasModifiedOrCreated = true; 

            } catch (error) {
                console.error("Error modifying current playlist:", error);
                Spicetify.showNotification(`An error occurred while modifying the current playlist.`);
                playlistWasModifiedOrCreated = false;
                playlistUriForQueue = currentUriAtStart; 
                modifiedPlaylistOriginalPath = null; 
            }
        } else {
            if (sortCurrentPlaylistEnabled && URI.isPlaylistV1OrV2(currentUriAtStart) && (!currentPlaylistDetails || !currentPlaylistDetails.owner || currentPlaylistDetails.owner.id !== user.username)) {
            }
            try {
              if (showRemovedDuplicates && removedTracks.length > 0 && !isArtistPage) {
                showRemovedTracksModal(removedTracks);
              }
              let playlistDescription = `Sorted by ${sortTypeInfo.fullName} using Sort-Play`;
              if (isArtistPage) {
                playlistDescription = `Discography of ${finalSourceName} - created and sorted by ${sortTypeInfo.fullName} using Sort-Play`
              } else if (isAlbumPage) {
                const albumId = currentUriAtStart.split(":")[2];
                const albumDetails = await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/albums/${albumId}`);
                const artistName = albumDetails.artists[0].name;
                playlistDescription = `Tracks from ${finalSourceName} by ${artistName} - created and sorted by ${sortTypeInfo.fullName} using Sort-Play`;
              }

              if (playlistDescription.length > 300) {
                playlistDescription = playlistDescription.substring(0, 296) + "...";
              }

              if (!isHeadless) mainButton.innerText = "Creating...";

              let playlistName = finalSourceName;
              if (changeTitleOnCreate) {
                  playlistName = `${finalSourceName} (${sortTypeInfo.shortName})`;
              }

              const newPlaylist = await createPlaylist(playlistName, playlistDescription);
              
              await new Promise(resolve => setTimeout(resolve, 1250));
              
              playlistUriForQueue = newPlaylist.uri;
              newPlaylistObjectForNavigation = newPlaylist; 
              playlistWasModifiedOrCreated = true;
              if (!isHeadless) mainButton.innerText = "Saving...";
              if (isArtistPage) {
                try {
                  const artistImageUrl = await getArtistImageUrl(currentUriAtStart.split(":")[2]);
                  if (artistImageUrl) {
                    const base64Image = await toBase64(artistImageUrl);
                    await setPlaylistImage(newPlaylist.id, base64Image);
                  }
                } catch (error) { console.error("Error setting playlist image:", error); }
              } else if (sourcePlaylistCoverUrl && !isDefaultMosaicCover(sourcePlaylistCoverUrl)) {
                try {
                  const base64Image = await imageUrlToBase64(sourcePlaylistCoverUrl);
                  await setPlaylistImage(newPlaylist.id, base64Image);
                } catch (error) {
                  console.warn("Could not apply original playlist/album cover:", error);
                }
              }
              const trackUris = sortedTracks.map((track) => track.uri);
              await addTracksToPlaylist(newPlaylist.id, trackUris);

              await addPlaylistToLibrary(newPlaylist.uri);

              Spicetify.showNotification(`Playlist sorted by ${sortTypeInfo.fullName}!`);

            } catch (error) {
              console.error("Error creating or updating playlist:", error);
              Spicetify.showNotification(`An error occurred while creating the playlist.`);
              playlistWasModifiedOrCreated = false;
              playlistUriForQueue = currentUriAtStart;
              newPlaylistObjectForNavigation = null;
            }
        }
      }

      if (missingDataCount > 0 && ['tempo', 'energy', 'danceability', 'valence', 'acousticness', 'instrumentalness'].includes(sortType)) {
        const sortTypeInfo = {
            tempo: { fullName: "tempo (BPM)" },
            energy: { fullName: "energy" },
            danceability: { fullName: "danceability" },
            valence: { fullName: "valence" },
            acousticness: { fullName: "acousticness" },
            instrumentalness: { fullName: "instrumentalness" }
        }[sortType];

        const plural = missingDataCount === 1 ? "track was" : "tracks were";
        setTimeout(() => {
            Spicetify.showNotification(`${missingDataCount} ${plural} missing ${sortTypeInfo.fullName} data.`);
        }, 1500);
      }
      
      if (addToQueueEnabled && isDirectSortType(sortType) && sortedTracks && sortedTracks.length > 0) {
        try {
          await setQueueFromTracks(sortedTracks, playlistUriForQueue);
        } catch (queueError) {
          console.error("Failed to add sorted tracks to queue:", queueError);
          Spicetify.showNotification("Failed to add to queue.", true);
        }
      } else if (addToQueueEnabled && isDirectSortType(sortType) && (!sortedTracks || sortedTracks.length === 0)) {
          Spicetify.showNotification("No tracks to add to queue after sorting/filtering.", true);
      }

      if (isDirectSortType(sortType) && !playlistWasModifiedOrCreated && !addToQueueEnabled) {
        if (sortedTracks && sortedTracks.length > 0) {
             Spicetify.showNotification(`Sorting complete for ${sortType}. No playlist created or queue modified as per settings.`);
        }
      } else if (isDirectSortType(sortType) && !createPlaylistAfterSort && addToQueueEnabled) {
        console.log(`Playlist creation skipped for ${sortType} due to setting, tracks added to queue.`);
      } else if (isDirectSortType(sortType) && !createPlaylistAfterSort && !addToQueueEnabled) {
        console.log(`Playlist creation and queueing skipped for ${sortType} due to settings.`);
      }

      if (playlistWasModifiedOrCreated) {
          if (modifiedPlaylistOriginalPath) { 
              const currentPathAfterSort = Spicetify.Platform.History.location.pathname;
              if (openPlaylistAfterSortEnabled || currentPathAfterSort === modifiedPlaylistOriginalPath) {
                  const tempPath = "/library"; 
                  Spicetify.Platform.History.push(tempPath);
                  await new Promise(resolve => setTimeout(resolve, 1000));
                  Spicetify.Platform.History.push(modifiedPlaylistOriginalPath); 
              }
          } else if (newPlaylistObjectForNavigation) { 
              await navigateToPlaylist(newPlaylistObjectForNavigation);
          }
      }


    } catch (error) {
      console.error("Error during sorting process:", error);
      Spicetify.showNotification(`An error occurred during the sorting process: ${error.message}`);
    } finally {
      if (!isHeadless) {
        resetButtons();
      }
    }
  }

  const KEY_TO_CAMELOT_MAP = {
    "B": "1B", "F♯/G♭": "2B", "C♯/D♭": "3B", "G♯/A♭": "4B", "D♯/E♭": "5B", 
    "A♯/B♭": "6B", "F": "7B", "C": "8B", "G": "9B", "D": "10B", "A": "11B", "E": "12B",
    "G♯/A♭m": "1A", "D♯/E♭m": "2A", "A♯/B♭m": "3A", "Fm": "4A", "Cm": "5A", 
    "Gm": "6A", "Dm": "7A", "Am": "8A", "Em": "9A", "Bm": "10A", "F♯/G♭m": "11A", "C♯/D♭m": "12A"
  };


  function getHarmonicCompatibilityScore(camelotKey1, camelotKey2) {
    if (!camelotKey1 || !camelotKey2) return 0;

    const num1 = parseInt(camelotKey1.slice(0, -1));
    const mode1 = camelotKey1.slice(-1);
    const num2 = parseInt(camelotKey2.slice(0, -1));
    const mode2 = camelotKey2.slice(-1);

    if (num1 === num2 && mode1 === mode2) return 100;
    if (num1 === num2) return 80;

    const diff = Math.abs(num1 - num2);
    if (diff === 1 || diff === 11) return 85;

    return 0;
  }


  function generateJourneyMap(playlistLength, persona = 'wave') {
    let journeyPattern;
    switch (persona) {
        case 'workout':
            journeyPattern = [
                'Medium-Energy/Positive-Valence', 'High-Energy/Positive-Valence', 'High-Energy/Neutral-Valence',
                'High-Energy/Positive-Valence', 'Medium-Energy/Neutral-Valence', 'Low-Energy/Positive-Valence'
            ];
            break;
        case 'wave':
        default:
            journeyPattern = [
                'Medium-Energy/Neutral-Valence', 'Medium-Energy/Positive-Valence',
                'High-Energy/Positive-Valence', 'High-Energy/Neutral-Valence',
                'Medium-Energy/Positive-Valence', 'Medium-Energy/Neutral-Valence',
                'Low-Energy/Neutral-Valence', 'Low-Energy/Positive-Valence'
            ];
            break;
    }
    return Array.from({ length: playlistLength }, (_, i) => journeyPattern[i % journeyPattern.length]);
  }
  
  async function energyWaveSort(tracks) {
    if (tracks.length < 3) {
        return tracks;
    }

    const trackProfiles = tracks.map(track => {
        const features = track.features || {};
        const energy = (features.energy || 50) / 100;
        const valence = (features.valence || 50) / 100;

        const getTier = (val) => val <= 0.33 ? 'Low' : val <= 0.66 ? 'Medium' : 'High';
        const moodBucket = `${getTier(energy)}-Energy/${getTier(valence)}-Valence`;

        const keyName = features.key || "C";
        const mode = features.mode === 0 ? 'm' : '';
        const camelotKey = KEY_TO_CAMELOT_MAP[keyName + mode] || KEY_TO_CAMELOT_MAP[keyName];

        return {
            ...track,
            profile: { moodBucket, camelotKey, tempo: features.tempo || 120 }
        };
    });

    const fullJourneyMap = generateJourneyMap(tracks.length);

    let remainingTracks = [...trackProfiles];
    const sortedPlaylist = [];

    let firstTrackIndex = remainingTracks.findIndex(t => t.profile.moodBucket === fullJourneyMap[0]);
    if (firstTrackIndex === -1) firstTrackIndex = 0;
    
    let lastTrack = remainingTracks.splice(firstTrackIndex, 1)[0];
    sortedPlaylist.push(lastTrack);

    while (remainingTracks.length > 0) {
        const currentJourneyStep = fullJourneyMap[sortedPlaylist.length];
        const scoredCandidates = [];

        for (const candidateTrack of remainingTracks) {
            let score = 0;

            if (candidateTrack.profile.moodBucket === currentJourneyStep) score += 100;

            const harmonicScore = getHarmonicCompatibilityScore(lastTrack.profile.camelotKey, candidateTrack.profile.camelotKey);
            score += harmonicScore * 0.8;

            const tempoDiff = Math.abs(candidateTrack.profile.tempo - lastTrack.profile.tempo);
            if (tempoDiff < 8) score += 50;
            else if (tempoDiff < 15) score += 25;

            scoredCandidates.push({ track: candidateTrack, score });
        }

        scoredCandidates.sort((a, b) => b.score - a.score);
        
        const selected = scoredCandidates[0];

        sortedPlaylist.push(selected.track);
        remainingTracks = remainingTracks.filter(t => t.uri !== selected.track.uri);
        
        lastTrack = selected.track;
    }

    return sortedPlaylist.map(profiledTrack => tracks.find(t => t.uri === profiledTrack.uri));
  }

  async function randomizedEnergyWaveSort(tracks) {
    if (tracks.length < 3) {
        return tracks;
    }

    const trackProfiles = tracks.map(track => {
        const features = track.features || {};
        const energy = (features.energy / 100) || 0.5;
        const valence = (features.valence / 100) || 0.5;

        const getTier = (val) => val <= 0.33 ? 'Low' : val <= 0.66 ? 'Medium' : 'High';
        const moodBucket = `${getTier(energy)}-Energy/${getTier(valence)}-Valence`;

        const keyName = features.key || "C";
        const mode = features.mode === 0 ? 'm' : '';
        const camelotKey = KEY_TO_CAMELOT_MAP[keyName + mode] || KEY_TO_CAMELOT_MAP[keyName];

        return {
            ...track,
            profile: { moodBucket, camelotKey, tempo: features.tempo || 120 }
        };
    });

    const fullJourneyMap = generateJourneyMap(tracks.length);

    let remainingTracks = [...trackProfiles];
    const sortedPlaylist = [];

    let firstTrackIndex = remainingTracks.findIndex(t => t.profile.moodBucket === fullJourneyMap[0]);
    if (firstTrackIndex === -1) firstTrackIndex = Math.floor(Math.random() * remainingTracks.length);
    
    let lastTrack = remainingTracks.splice(firstTrackIndex, 1)[0];
    sortedPlaylist.push(lastTrack);

    while (remainingTracks.length > 0) {
        const currentJourneyStep = fullJourneyMap[sortedPlaylist.length];
        const scoredCandidates = [];

        for (const candidateTrack of remainingTracks) {
            let score = 0;

            if (candidateTrack.profile.moodBucket === currentJourneyStep) score += 100;

            const harmonicScore = getHarmonicCompatibilityScore(lastTrack.profile.camelotKey, candidateTrack.profile.camelotKey);
            score += harmonicScore * 0.8;

            const tempoDiff = Math.abs(candidateTrack.profile.tempo - lastTrack.profile.tempo);
            if (tempoDiff < 8) score += 50;
            else if (tempoDiff < 15) score += 25;

            scoredCandidates.push({ track: candidateTrack, score });
        }

        scoredCandidates.sort((a, b) => b.score - a.score);
        
        const CANDIDATE_POOL_SIZE = 5;
        const topCandidates = scoredCandidates.slice(0, CANDIDATE_POOL_SIZE);

        const randomIndex = Math.floor(Math.random() * topCandidates.length);
        const selected = topCandidates[randomIndex];

        sortedPlaylist.push(selected.track);
        remainingTracks = remainingTracks.filter(t => t.uri !== selected.track.uri);
        
        lastTrack = selected.track;
    }

    return sortedPlaylist.map(profiledTrack => tracks.find(t => t.uri === profiledTrack.uri));
  }

  function shuffleArray(array) {
    if (array.length < 10) {
      return simpleShuffle(array);
    } else {
      return complexShuffle(array);
    }
  }

  function simpleShuffle(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  function complexShuffle(array) {
    let shuffled = [...array];

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const mid = Math.floor(shuffled.length / 2);
    const firstHalf = shuffled.slice(0, mid);
    const secondHalf = shuffled.slice(mid);
    
    shuffled = [];
    while (firstHalf.length || secondHalf.length) {
        if (Math.random() < 0.5 && firstHalf.length) {
            shuffled.push(firstHalf.pop());
        } else if (secondHalf.length) {
            shuffled.push(secondHalf.pop());
        } else if (firstHalf.length) {
            shuffled.push(firstHalf.pop());
        }
    }
    const chunkSize = Math.floor(Math.random() * 5) + 3;  
    for (let i = 0; i < shuffled.length; i += chunkSize) {
        const chunk = shuffled.slice(i, i + chunkSize);
        const rotateBy = Math.floor(Math.random() * chunk.length);
        const rotatedChunk = [
            ...chunk.slice(rotateBy),
            ...chunk.slice(0, rotateBy)
        ];
        shuffled.splice(i, chunk.length, ...rotatedChunk);
    }
    const breakUpClusters = (arr) => {
        for (let i = 0; i < arr.length - 2; i++) {
            if (arr[i].artists?.[0]?.uri === arr[i + 1].artists?.[0]?.uri &&
                arr[i].artists?.[0]?.uri === arr[i + 2].artists?.[0]?.uri) {
                const moveIdx = i + 1;
                const trackToMove = arr[moveIdx];
                const minDistance = 5;
                let newPosition;
                do {
                    newPosition = Math.floor(Math.random() * arr.length);
                } while (Math.abs(newPosition - moveIdx) < minDistance);
                
                arr.splice(moveIdx, 1);
                arr.splice(newPosition, 0, trackToMove);
                i++;
            }
        }
        return arr;
    };
    
    return breakUpClusters(shuffled);
  }

  function showRemovedTracksModal(removedTracks) {

    const styleId = 'sort-play-global-modal-height-fix';
    if (!document.getElementById(styleId)) {
      const styleElement = document.createElement('style');
      styleElement.id = styleId;
      styleElement.innerHTML = `
        .GenericModal > .main-embedWidgetGenerator-container {
          height: auto !important;
        }
      `;
      document.head.appendChild(styleElement);
    }

    const modalContainer = document.createElement("div");
    modalContainer.style.width = "800px"; 
    modalContainer.style.maxHeight = "auto";
    modalContainer.style.overflowY = "auto";
    modalContainer.style.display = "flex";  
    modalContainer.style.flexDirection = "column";  

    const textAreaContainer = document.createElement("div");
    textAreaContainer.style.overflowY = "auto";
    textAreaContainer.style.flexGrow = "1"; 
  
    const trackListTextArea = document.createElement("textarea");
    trackListTextArea.style.width = "100%";
    trackListTextArea.style.border = "1px solid #ccc";
    trackListTextArea.style.padding = "10px";
    trackListTextArea.style.boxSizing = "border-box";
    trackListTextArea.style.resize = "none"; 
    trackListTextArea.readOnly = true;
    trackListTextArea.style.minHeight = "300px";
  
    let trackListText = "";
    removedTracks.forEach((track, index) => {
      trackListText += `${index + 1}. ${track.songTitle} - ${track.artistName} - ${track.albumName} - (${track.uri})\n`;
    });
  
    trackListTextArea.value = trackListText;

    textAreaContainer.appendChild(trackListTextArea);

    const copyButton = document.createElement("button");
    copyButton.textContent = "Copy to Clipboard";
    copyButton.style.marginTop = "10px";
    copyButton.style.padding = "6px 12px";
    copyButton.style.width = "250px"; 
    copyButton.style.backgroundColor = "#1ED760";
    copyButton.style.color = "black";
    copyButton.style.border = "none";
    copyButton.style.borderRadius = "20px";
    copyButton.style.cursor = "pointer";
  
    copyButton.addEventListener("click", () => {
      navigator.clipboard.writeText(trackListTextArea.value).then(
        () => {
          Spicetify.showNotification("Tracks copied to clipboard!");
        },
        (err) => {
          console.error("Failed to copy:", err);
          Spicetify.showNotification("Failed to copy tracks to clipboard.");
        }
      );
    });

    modalContainer.appendChild(textAreaContainer);
    modalContainer.appendChild(copyButton);
  
    Spicetify.PopupModal.display({
      title: "Removed Duplicate Tracks",
      content: modalContainer,
      isLarge: true,
    });
  }
  

  function deduplicateTracks(tracks, force = false, isArtistPageContext = false) {
      if (!force && !playlistDeduplicate && !isArtistPageContext) {
          return { unique: tracks, removed: [] };
      }

      const DURATION_THRESHOLD = 2000; 
      const finalUniqueTracks = [];
      const finalRemovedTracks = [];

      const versionKeywords = [
          'remastered', 'remaster', '\\d{4} remaster', 'anniversary edition',
          'deluxe edition', 'super deluxe', 'legacy edition', 'mono', 'stereo',
          'radio edit', 'radio mix', 'single version', 'single edit', 'album version',
          'extended mix', 'extended version', 'club mix', 'clean', 'explicit',
          'special edition', 'original mix', 'original version'
      ];
      const versionRegex = new RegExp(`[\\(\\[\\-]?\\s*(${versionKeywords.join('|')})\\s*[\\)\\]\\-]?`, 'i');

      const getCleanTitle = (rawTitle) => {
          return rawTitle
              .toLowerCase()
              .replace(versionRegex, '')
              .replace(/['’ʼ]/g, "'")
              .replace(/[^a-z0-9\s]/g, '')
              .replace(/\s+/g, ' ')
              .trim();
      };
      
      const getNormalizedTitle = (rawTitle) => {
          return rawTitle
              .trim()
              .toLowerCase()
              .replace(/['’ʼ]/g, "'")
              .replace(/[()\[\],.:-]/g, ' ')
              .replace(/\s+/g, ' ')
              .trim();
      };

      const sortedInputTracks = [...tracks].sort((a, b) => {
          const popA = a.popularity || 0;
          const popB = b.popularity || 0;
          if (popB !== popA) {
              return popB - popA;
          }
          return (a.uri || "").localeCompare(b.uri || "");
      });

      sortedInputTracks.forEach(candidateTrack => {
          let isConsideredDuplicateOfAnExistingUnique = false;

          for (const existingUniqueTrack of finalUniqueTracks) {
              const candidateHasValidPlayCount = candidateTrack.playCount !== "N/A" &&
                                                candidateTrack.playCount !== 0 &&
                                                candidateTrack.playCount !== null &&
                                                candidateTrack.playCount !== undefined;
              const existingHasValidPlayCount = existingUniqueTrack.playCount !== "N/A" &&
                                                existingUniqueTrack.playCount !== 0 &&
                                                existingUniqueTrack.playCount !== null &&
                                                existingUniqueTrack.playCount !== undefined;

              const candidateRawTitle = candidateTrack.songTitle || candidateTrack.name || "Unknown Title";
              const candidateDuration = candidateTrack.durationMs;
              const candidateArtist = candidateTrack.allArtists || candidateTrack.artistName || "";

              const existingRawTitle = existingUniqueTrack.songTitle || existingUniqueTrack.name || "Unknown Title";
              const existingDuration = existingUniqueTrack.durationMs; 
              const existingArtist = existingUniqueTrack.allArtists || existingUniqueTrack.artistName || "";

              let areDuplicatesByNewRules = false;

              const normalizeAndSplitArtists = (artistStr) => {
                  const clean = (name) => name.toLowerCase().replace(/[.&]/g, '').replace(/\s+/g, ' ').trim();
                  return artistStr.split(',').map(a => clean(a.trim()));
              };
              
              const candidateArtistSet = new Set(normalizeAndSplitArtists(candidateArtist));
              const existingArtistSet = new Set(normalizeAndSplitArtists(existingArtist));
              
              const artistsOverlap = candidateArtist && existingArtist && 
                  ([...candidateArtistSet].some(artist => existingArtistSet.has(artist)));

              if (candidateHasValidPlayCount && existingHasValidPlayCount) {
                  if (Number(candidateTrack.playCount) === Number(existingUniqueTrack.playCount)) {
                      
                      if (!areDuplicatesByNewRules && 
                          candidateRawTitle.trim().toLowerCase() === existingRawTitle.trim().toLowerCase() &&
                          artistsOverlap) {
                          areDuplicatesByNewRules = true;
                      }

                      if (!areDuplicatesByNewRules && artistsOverlap) {
                          const hasVersionKeyword = versionRegex.test(candidateRawTitle) || versionRegex.test(existingRawTitle);
                          if (hasVersionKeyword) {
                              const cleanCandidateTitle = getCleanTitle(candidateRawTitle);
                              const cleanExistingTitle = getCleanTitle(existingRawTitle);
                              if (cleanCandidateTitle === cleanExistingTitle) {
                                  areDuplicatesByNewRules = true;
                              }
                          }
                      }

                      if (!areDuplicatesByNewRules && artistsOverlap) {
                          const durationDiff = Math.abs(candidateDuration - existingDuration);
                          if (durationDiff <= DURATION_THRESHOLD) {
                              areDuplicatesByNewRules = true;
                          }
                      }
                  }
              } else {
                  const normalizedCandidateTitle = getNormalizedTitle(candidateRawTitle);
                  const normalizedExistingTitle = getNormalizedTitle(existingRawTitle);

                  if (normalizedCandidateTitle === normalizedExistingTitle && artistsOverlap) {
                      if (candidateDuration === existingDuration) {
                          areDuplicatesByNewRules = true;
                      }
                  }
              }

              if (areDuplicatesByNewRules) {
                  isConsideredDuplicateOfAnExistingUnique = true;
                  break;
              }
          }

          if (isConsideredDuplicateOfAnExistingUnique) {
              finalRemovedTracks.push(candidateTrack);
          } else {
              finalUniqueTracks.push(candidateTrack);
          }
      });

      return { unique: finalUniqueTracks, removed: finalRemovedTracks };
  }

  async function handleScrobblesSorting(tracks, sortType, updateProgress) {
    if (sortType !== 'scrobbles' && sortType !== 'personalScrobbles') {
      throw new Error('Invalid sort type for scrobbles sorting');
    }
    if (sortType === 'personalScrobbles') {
      const lastFmUsername = loadLastFmUsername();
      if (!lastFmUsername) {
        throw new Error('Last.fm username required for personal scrobbles sorting');
      }
    }

    const fetchFunction = sortType === 'personalScrobbles'
      ? getTrackDetailsWithPersonalScrobbles
      : getTrackDetailsWithScrobbles;

    const tracksForScrobbleFetching = tracks.map(track => ({
      ...track,
      name: track.songTitle || track.name,
      artistName: track.artistName || (track.artists && track.artists[0]?.name),
      artists: track.artists || [{ name: track.artistName }]
    }));

    const tracksWithScrobbles = await processBatchesWithDelay(
      tracksForScrobbleFetching,
      50,
      1000,
      (progress) => {
        updateProgress(progress);
      },
      fetchFunction
    );

    if (tracksWithScrobbles.length === 0) {
      throw new Error(`No tracks found with ${sortType === 'personalScrobbles' ? 'personal ' : ''}Last.fm data to sort.`);
    }

    return tracksWithScrobbles;
  }

  async function handleLastScrobbledSorting(tracks, updateProgress) {
    const lastFmUsername = loadLastFmUsername();
    if (!lastFmUsername) {
      throw new Error('Last.fm username required for this sorting type');
    }

    const includeZeroScrobbles = localStorage.getItem("sort-play-include-zero-scrobbles") === "true";

    updateProgress(0);
    const scrobblesMap = await fetchRecentScrobblesMap((progress) => {
        updateProgress(Math.floor(progress * 0.90));
    });

    if (scrobblesMap.size === 0 && !includeZeroScrobbles) {
        throw new Error("Could not fetch any recent scrobbles from Last.fm.");
    }

    updateProgress(95);
    const tracksWithTimestamp = tracks.map(track => {
        const artist = (track.artistName || (track.artists && track.artists[0]?.name) || "").toLowerCase();
        const name = (track.songTitle || track.name || "").toLowerCase();
        const key = `${artist}|-|${name}`;
        return {
            ...track,
            lastScrobbledTimestamp: scrobblesMap.get(key) || 0,
        };
    });

    const uniqueTracksMap = new Map();
    const removedTracks = [];
    tracksWithTimestamp.forEach(track => {
        const key = `${(track.songTitle || track.name).toLowerCase()}|-|${(track.artistName || track.artists[0].name).toLowerCase()}`;
        const existing = uniqueTracksMap.get(key);

        if (!existing || track.lastScrobbledTimestamp > existing.lastScrobbledTimestamp) {
            if (existing) {
                removedTracks.push(existing);
            }
            uniqueTracksMap.set(key, track);
        } else {
            removedTracks.push(track);
        }
    });
    
    const uniqueTracks = Array.from(uniqueTracksMap.values());

    const scrobbledTracks = uniqueTracks.filter(track => track.lastScrobbledTimestamp > 0);
    const unscrobbledTracks = uniqueTracks.filter(track => track.lastScrobbledTimestamp === 0);

    const sortedScrobbledTracks = scrobbledTracks.sort((a, b) => {
        if (sortOrderState.lastScrobbled) {
            return a.lastScrobbledTimestamp - b.lastScrobbledTimestamp;
        }
        return b.lastScrobbledTimestamp - a.lastScrobbledTimestamp;
    });

    let sortedTracks;
    if (includeZeroScrobbles) {
        sortedTracks = [...sortedScrobbledTracks, ...unscrobbledTracks];
    } else {
        sortedTracks = sortedScrobbledTracks;
    }

    if (sortedTracks.length === 0) {
        if (includeZeroScrobbles) {
            throw new Error("No tracks found in this playlist.");
        } else {
            throw new Error("None of the tracks in this playlist appear in your recent Last.fm history.");
        }
    }
    
    updateProgress(100);
    return { sortedTracks, removedTracks };
  }

  async function fetchRecentScrobblesMap(updateProgress) {
    const username = loadLastFmUsername();
    if (!username) {
      throw new Error('Last.fm username is not set.');
    }

    const scrobblesMap = new Map();
    const limit = 200;
    const maxPages = 25;
    let currentPage = 1;

    updateProgress(0);

    while (currentPage <= maxPages) {
      const params = new URLSearchParams({
        method: 'user.getrecenttracks',
        user: username,
        limit: limit.toString(),
        page: currentPage.toString(),
        format: 'json'
      });
      
      try {
        const response = await fetchLfmWithGateway(params);
        if (!response.ok) {
            console.warn(`Last.fm API request for recent tracks failed on page ${currentPage}`);
            break; 
        }

        const data = await response.json();
        const tracks = data.recenttracks?.track;

        if (!tracks || tracks.length === 0) {
          break;
        }
        
        const processableTracks = tracks.filter(t => t.date && t.date.uts);

        for (const track of processableTracks) {
          const artist = track.artist['#text'].toLowerCase();
          const name = track.name.toLowerCase();
          const key = `${artist}|-|${name}`;
          
          if (!scrobblesMap.has(key)) {
            scrobblesMap.set(key, parseInt(track.date.uts, 10) * 1000);
          }
        }

        updateProgress(Math.floor((currentPage / maxPages) * 100));

        if (currentPage >= data.recenttracks['@attr'].totalPages) {
            break;
        }

        currentPage++;
      } catch (error) {
        console.error(`Error fetching page ${currentPage} of recent scrobbles:`, error);
        break; 
      }
    }
    
    updateProgress(100);
    return scrobblesMap;
  }

  menuButtons.forEach((element) => {
    if (element.tagName.toLowerCase() === "div") {
        return;
    }
    const buttonText = element.querySelector("span")?.innerText;
    const buttonStyle = buttonStyles.menuItems.find(
        (item) => item.text === buttonText
    );

    if (!buttonStyle) {
        return;
    }
    
    if (buttonStyle.hasInnerPlayButton) {
        const innerPlayButton = createInnerPlayButton(element);
        element.appendChild(innerPlayButton);
    }
    
    if (buttonStyle.isSetting) {
        element.addEventListener("click", (event) => {
            event.stopPropagation();
            showSettingsModal();
        });
    } else if (buttonStyle.sortType === "customFilter") {
        element.addEventListener("click", (event) => {
            event.stopPropagation();
            handleCustomFilter();
        });
    } else {
        const sortType = buttonStyle.sortType;
        element.addEventListener("click", async (event) => {
            event.stopPropagation();
            if (buttonStyle.onClick) {
                await buttonStyle.onClick(event);
            } else if (sortType === "genreFilter") {
                setButtonProcessing(true);
                mainButton.style.backgroundColor = buttonStyles.main.disabledBackgroundColor;
                mainButton.style.color = buttonStyles.main.disabledColor;
                mainButton.style.cursor = "default";
                svgElement.style.fill = buttonStyles.main.disabledColor;
                toggleMenu();
                closeAllMenus();
                menuButtons.forEach((button) => {
                    button.disabled = true;
                    if (button.tagName.toLowerCase() === 'button') {
                        button.style.backgroundColor = "transparent";
                    }
                });

                try {
                    const currentUri = getCurrentUri();
                    if (!currentUri) {
                        resetButtons();
                        Spicetify.showNotification("Please select a playlist first");
                        return;
                    }

                    let tracks;
                    if (URI.isPlaylistV1OrV2(currentUri)) {
                        const playlistId = currentUri.split(":")[2];
                        tracks = await getPlaylistTracks(playlistId);
                    } else if (URI.isArtist(currentUri)) {
                        tracks = await getArtistTracks(currentUri);
                    } else if (isLikedSongsPage(currentUri)) {
                        tracks = await getLikedSongs();
                    } else if (URI.isAlbum(currentUri)) {
                        const albumId = currentUri.split(":")[2];
                        tracks = await getAlbumTracks(albumId);
                    } else {
                        throw new Error("Invalid URI type");
                    }

                    if (!tracks || tracks.length === 0) {
                        throw new Error("No tracks found");
                    }

                    const { allGenres, trackGenreMap, tracksWithGenresCount } = await fetchAllTrackGenres(
                        tracks
                    );
                    await showGenreFilterModal(tracks, trackGenreMap, tracksWithGenresCount);
                } catch (error) {
                    console.error("Error during genre filtering:", error);
                    Spicetify.showNotification(
                        "An error occurred during the genre filtering process."
                    );
                } finally {
                    resetButtons();
                }
            } else {
                menuButtons.forEach((btn) => {
                    if (btn.tagName.toLowerCase() === "button" && !btn.disabled) {
                        btn.style.backgroundColor = "transparent";
                    }
                });
                await handleSortAndCreatePlaylist(sortType);
            }
        });
    }
  });

  
  function resetButtons() {
    setButtonProcessing(false);
    mainButton.innerText = "Sort Play"; 
    mainButton.appendChild(svgElement); 
    mainButton.style.backgroundColor = buttonStyles.main.backgroundColor;
    mainButton.style.cursor = "pointer";
    applyCurrentThemeColors(); 
    mainButton.style.filter = "brightness(1)";
    isButtonClicked = false;
    menuButtons.forEach((button) => {
      button.disabled = false;
    });
  }

  async function getBatchTrackStats(trackIds, updateProgress = () => {}) {
    if (trackIds.length === 0) {
        return {};
    }

    const results = {};
    const BATCH_SIZE = 100;
    const MAX_RETRIES = 3;
    const INITIAL_DELAY = 1000;
    const CONCURRENCY_LIMIT = 10;

    const batches = [];
    for (let i = 0; i < trackIds.length; i += BATCH_SIZE) {
        batches.push(trackIds.slice(i, i + BATCH_SIZE));
    }

    let tracksProcessed = 0;

    const processBatch = async (batchIds) => {
        let success = false;
        let retries = 0;
        let delay = INITIAL_DELAY;

        while (!success && retries < MAX_RETRIES) {
            try {
                const [audioFeaturesResponse, trackDetailsResponse] = await Promise.all([
                    Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/audio-features?ids=${batchIds.join(',')}`),
                    Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/tracks?ids=${batchIds.join(',')}`)
                ]);

                if (!audioFeaturesResponse?.audio_features || !trackDetailsResponse?.tracks) {
                    throw new Error('Incomplete data received from Spotify API for a batch.');
                }

                const pitchClasses = ["C", "C♯/D♭", "D", "D♯/E♭", "E", "F", "F♯/G♭", "G", "G♯/A♭", "A", "A♯/B♭", "B"];
                
                audioFeaturesResponse.audio_features.forEach((features, index) => {
                    if (features) {
                        const trackDetails = trackDetailsResponse.tracks[index];
                        results[features.id] = {
                            danceability: features.danceability ? Math.round(100 * features.danceability) : null,
                            energy: features.energy ? Math.round(100 * features.energy) : null,
                            key_raw: features.key,
                            mode: features.mode,
                            key: features.key === -1 ? "Undefined" : pitchClasses[features.key],
                            loudness: features.loudness ?? null,
                            speechiness: features.speechiness ? Math.round(100 * features.speechiness) : null,
                            acousticness: features.acousticness ? Math.round(100 * features.acousticness) : null,
                            instrumentalness: features.instrumentalness ? Math.round(100 * features.instrumentalness) : null,
                            liveness: features.liveness ? Math.round(100 * features.liveness) : null,
                            valence: features.valence ? Math.round(100 * features.valence) : null,
                            tempo: features.tempo ? Math.round(features.tempo) : null,
                            popularity: trackDetails?.popularity ?? null,
                            releaseDate: trackDetails?.album?.release_date ?? null
                        };
                    }
                });
                success = true;
            } catch (error) {
                retries++;
                if (retries < MAX_RETRIES) {
                    await new Promise(resolve => setTimeout(resolve, delay));
                    delay *= 2;
                } else {
                    console.error(`[Sort-Play] Failed to fetch batch track stats after ${MAX_RETRIES} attempts for a batch.`);
                }
            }
        }
        tracksProcessed += batchIds.length;
        const progress = Math.min(100, Math.floor((tracksProcessed / trackIds.length) * 100));
        updateProgress(progress);
    };

    for (let i = 0; i < batches.length; i += CONCURRENCY_LIMIT) {
        const concurrentBatch = batches.slice(i, i + CONCURRENCY_LIMIT);
        await Promise.all(concurrentBatch.map(batch => processBatch(batch)));
    }

    return results;
  }

  function getTracklistTrackUri(tracklistElement) {
    let values = Object.values(tracklistElement);
    if (!values || !values[0]?.pendingProps) {
        return null;
    }
    return (
        values[0]?.pendingProps?.children?.props?.value?.spec?._path?.[0]?.uri ||
        values[0]?.pendingProps?.children[0]?.props?.children?.props?.uri ||
        values[0]?.pendingProps?.children[0]?.props?.children?.props?.children?.props?.uri ||
        values[0]?.pendingProps?.children[0]?.props?.children?.props?.children?.props?.children?.props
            ?.uri ||
        values[0]?.pendingProps?.children[0]?.props?.children[0]?.props?.uri
    );
}

  const waitForElement = (selector) => {
    return new Promise((resolve) => {
      if (document.querySelector(selector)) {
        return resolve(document.querySelector(selector));
      }
      const observer = new MutationObserver(() => {
        if (document.querySelector(selector)) {
          observer.disconnect();
          resolve(document.querySelector(selector));
        }
      });
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    });
  };

  const CACHE_KEY_SCROBBLES = 'spotify-scrobbles-cache3';
  const CACHE_TIMESTAMP_KEY_SCROBBLES = 'spotify-scrobbles-cache-timestamp3';
  const CACHE_EXPIRY_DAYS_SCROBBLES = 7;

  function initializeScrobblesCache() {
    const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY_SCROBBLES);
    if (!timestamp) {
      localStorage.setItem(CACHE_TIMESTAMP_KEY_SCROBBLES, Date.now().toString());
      localStorage.setItem(CACHE_KEY_SCROBBLES, JSON.stringify({}));
      return;
    }

    const daysPassed = (Date.now() - parseInt(timestamp)) / (1000 * 60 * 60 * 24);
    if (daysPassed >= CACHE_EXPIRY_DAYS_SCROBBLES) {
      localStorage.setItem(CACHE_TIMESTAMP_KEY_SCROBBLES, Date.now().toString());
      localStorage.setItem(CACHE_KEY_SCROBBLES, JSON.stringify({}));
    }
  }

  function getCachedScrobbles(trackId) {
    try {
      const cache = JSON.parse(localStorage.getItem(CACHE_KEY_SCROBBLES) || '{}');
      return cache[trackId] !== undefined ? cache[trackId] : null;
    } catch (error) {
      console.error('Error reading from scrobbles cache:', error);
      return null;
    }
  }

  function setCachedScrobbles(trackId, scrobbleCount) {
    try {
        const cache = JSON.parse(localStorage.getItem(CACHE_KEY_SCROBBLES) || '{}');
        cache[trackId] = scrobbleCount;
        localStorage.setItem(CACHE_KEY_SCROBBLES, JSON.stringify(cache));
    } catch (error) {
        console.error('Error writing to scrobbles cache:', error);
    }
  }

  function initializePersonalScrobblesCache() {
    localStorage.setItem(CACHE_TIMESTAMP_KEY_PERSONAL_SCROBBLES, Date.now().toString());
    localStorage.setItem(CACHE_KEY_PERSONAL_SCROBBLES, JSON.stringify({}));
  }

  function checkAndClearExpiredPersonalScrobblesCache() {
    const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY_PERSONAL_SCROBBLES);
    if (timestamp) {
      const hoursPassed = (Date.now() - parseInt(timestamp)) / (1000 * 60 * 60);
      if (hoursPassed >= CACHE_EXPIRY_HOURS_PERSONAL_SCROBBLES) {
        localStorage.setItem(CACHE_TIMESTAMP_KEY_PERSONAL_SCROBBLES, Date.now().toString());
        localStorage.setItem(CACHE_KEY_PERSONAL_SCROBBLES, JSON.stringify({}));
      }
    }
  }
  
  function getCachedPersonalScrobbles(trackId) {
    try {
      const cache = JSON.parse(localStorage.getItem(CACHE_KEY_PERSONAL_SCROBBLES) || '{}');
      return cache[trackId] || null;
    } catch (error) {
      console.error('Error reading from personal scrobbles cache:', error);
      return null;
    }
  }

  function setCachedPersonalScrobbles(trackId, scrobbleCount, isPending) {
    try {
        const cache = JSON.parse(localStorage.getItem(CACHE_KEY_PERSONAL_SCROBBLES) || '{}');
        cache[trackId] = { count: scrobbleCount, pendingUpdate: isPending };
        localStorage.setItem(CACHE_KEY_PERSONAL_SCROBBLES, JSON.stringify(cache));
    } catch (error) {
        console.error('Error writing to personal scrobbles cache:', error);
    }
  }

  function flagCachedPersonalScrobbleForUpdate(trackId) {
    try {
      const cache = JSON.parse(localStorage.getItem(CACHE_KEY_PERSONAL_SCROBBLES) || '{}');
      if (cache[trackId]) {
        cache[trackId].pendingUpdate = true;
        localStorage.setItem(CACHE_KEY_PERSONAL_SCROBBLES, JSON.stringify(cache));
      }
    } catch (error) {
      console.error('Error flagging personal scrobble cache:', error);
    }
  }
  
  function initializeSongChangeWatcher() {
    if (!Spicetify || !Spicetify.Player) {
        setTimeout(initializeSongChangeWatcher, 100);
        return;
    }

    const handleSongChange = (uri) => {
        if (!uri) return;
        currentTrackUriForScrobbleCache = uri;
        const trackId = uri.split(":")[2];
        flagCachedPersonalScrobbleForUpdate(trackId);
    };

    const currentTrack = Spicetify.Player.data?.item;
    if (currentTrack) {
        handleSongChange(currentTrack.uri);
    }

    Spicetify.Player.addEventListener("songchange", (event) => {
        const newTrack = event?.data?.item;
        if (newTrack) {
            handleSongChange(newTrack.uri);
        }
    });
  }

  const RELEASE_DATE_CACHE_KEY = 'spotify-release-date-cache2';
  const RELEASE_DATE_CACHE_TIMESTAMP_KEY = 'spotify-release-date-cache-timestamp2';
  const RELEASE_DATE_CACHE_EXPIRY_DAYS = 10; 
  
  function initializeReleaseDateCache() {
    const timestamp = localStorage.getItem(RELEASE_DATE_CACHE_TIMESTAMP_KEY);
    if (!timestamp) {
      localStorage.setItem(RELEASE_DATE_CACHE_TIMESTAMP_KEY, Date.now().toString());
      localStorage.setItem(RELEASE_DATE_CACHE_KEY, JSON.stringify({}));
      return;
    }
  
    const daysPassed = (Date.now() - parseInt(timestamp)) / (1000 * 60 * 60 * 24);
    if (daysPassed >= RELEASE_DATE_CACHE_EXPIRY_DAYS) {
      localStorage.setItem(RELEASE_DATE_CACHE_TIMESTAMP_KEY, Date.now().toString());
      localStorage.setItem(RELEASE_DATE_CACHE_KEY, JSON.stringify({}));
    }
  }
  
  function getCachedReleaseDate(trackId) {
    try {
      const cache = JSON.parse(localStorage.getItem(RELEASE_DATE_CACHE_KEY) || '{}');
      return cache[trackId] !== undefined ? cache[trackId] : null;
    } catch (error) {
      console.error('Error reading from release date cache:', error);
      return null;
    }
  }
  
  function setCachedReleaseDate(trackId, rawReleaseDate) { 
    try {
      const cache = JSON.parse(localStorage.getItem(RELEASE_DATE_CACHE_KEY) || '{}');
      cache[trackId] = rawReleaseDate;
      localStorage.setItem(RELEASE_DATE_CACHE_KEY, JSON.stringify(cache));
    } catch (error) {
      console.error('Error writing to release date cache:', error);
    }
  }
  
  function formatReleaseDate(rawDate, format = 'YYYY-MM-DD') {
    if (!rawDate || rawDate === "_") {
        return "_";
    }

    let dateObj;
    let yearOnly = false;
    let monthYearOnly = false;

    if (typeof rawDate === 'number') { 
        dateObj = new Date(rawDate);
    } else if (typeof rawDate === 'string') {
        let dateStrToParse = rawDate;
        if (rawDate.length === 4) { 
             yearOnly = true;
             dateStrToParse = `${rawDate}-01-01`;
        } else if (rawDate.length === 7) {
             monthYearOnly = true;
             dateStrToParse = `${rawDate}-01`; 
        }
        dateObj = new Date(dateStrToParse);
    } else {
        return "_";
    }

    if (isNaN(dateObj.getTime())) {
        return "_";
    }

    const year = dateObj.getFullYear();
    const monthNumeric = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const dayNumeric = dateObj.getDate().toString().padStart(2, '0');
    const monthShort = dateObj.toLocaleString('default', { month: 'short' });

    if (yearOnly) {
        switch (format) {
            case 'YYYY': return year.toString();
            case 'MM-YYYY': return `??-${year}`;
            case 'YYYY-MM': return `${year}-??`;
            case 'MMM D, YYYY': return `???, ${year}`; 
            case 'D MMM, YYYY': return `???, ${year}`; 
            case 'YYYY, MMM D': return `${year}, ???`;
            default: return year.toString();
        }
    }

    if (monthYearOnly) {
        switch (format) {
            case 'YYYY': return year.toString();
            case 'MM-YYYY': return `${monthNumeric}-${year}`;
            case 'YYYY-MM': return `${year}-${monthNumeric}`;
            case 'MMM D, YYYY': return `${monthShort}, ${year}`; 
            case 'D MMM, YYYY': return `${monthShort}, ${year}`; 
            case 'YYYY, MMM D': return `${year}, ${monthShort}`;
            default: return `${year}-${monthNumeric}`;
        }
    }

    switch (format) {
        case 'YYYY-MM-DD':
            return `${year}-${monthNumeric}-${dayNumeric}`;
        case 'DD-MM-YYYY':
            return `${dayNumeric}-${monthNumeric}-${year}`;
        case 'MM-DD-YYYY':
            return `${monthNumeric}-${dayNumeric}-${year}`;
        case 'YYYY':
            return year.toString();
        case 'YYYY-MM':
            return `${year}-${monthNumeric}`;
        case 'MM-YYYY':
            return `${monthNumeric}-${year}`;
        case 'MMM D, YYYY':
            return `${monthShort} ${dateObj.getDate()}, ${year}`;
        case 'D MMM, YYYY':
            return `${dateObj.getDate()} ${monthShort}, ${year}`;
        case 'YYYY, MMM D':
            return `${year}, ${monthShort} ${dateObj.getDate()}`;
        default:
            return `${year}-${monthNumeric}-${dayNumeric}`;
    }
  }


  const CACHE_KEY = 'spotify-play-count-cache2';
  const CACHE_TIMESTAMP_KEY = 'spotify-play-count-cache-timestamp2';
  const CACHE_EXPIRY_HOURS = 6;

  function initializePlayCountCache() {
    const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
    if (!timestamp) {
      localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
      localStorage.setItem(CACHE_KEY, JSON.stringify({}));
      return;
    }

    const daysPassed = (Date.now() - parseInt(timestamp)) / (1000 * 60 * 60); 
    if (daysPassed >= CACHE_EXPIRY_HOURS) {
      localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
      localStorage.setItem(CACHE_KEY, JSON.stringify({}));
    }
  }

  function getCachedPlayCount(trackId) {
    try {
      const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
      return cache[trackId] || null;
    } catch (error) {
      console.error('Error reading from cache:', error);
      return null;
    }
  }

  function setCachedPlayCount(trackId, playCount) {
    try {
        const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
        cache[trackId] = playCount;
        localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    } catch (error) {
        console.error('Error writing to cache:', error);
    }
  }

  function getTrackDataObject(trackElement) {
    const reactPropsKey = Object.keys(trackElement).find(key => key.startsWith("__reactProps$"));
    if (!reactPropsKey) return null;

    const props = trackElement[reactPropsKey];
    if (!props) return null;

    const potentialPaths = [
        () => props.children?.props?.item,
        () => props.children?.[0]?.props?.item,
        () => props.children?.props?.value?.item,
        () => props.children?.[0]?.props?.children?.props?.item,
        () => props.children?.[0]?.props?.children?.[0]?.props?.item,
    ];

    for (const getPath of potentialPaths) {
        const trackData = getPath();
        if (trackData && trackData.uri && trackData.name && trackData.artists) {
            return trackData;
        }
    }
    
    return null;
  }

  async function loadAdditionalColumnData(tracklist_) {
    const currentUri = getCurrentUri();
    let columnConfigs = [];
    const audioFeatureTypes = ['key', 'tempo', 'energy', 'danceability', 'valence', 'djInfo', 'popularity'];

    if (URI.isPlaylistV1OrV2(currentUri) || isLikedSongsPage(currentUri) || isLocalFilesPage(currentUri)) {
        if (showSecondAdditionalColumn) {
            columnConfigs.push({ type: selectedSecondColumnType, dataSelector: ".sort-play-second-data" });
        }
        if (showAdditionalColumn) {
            columnConfigs.push({ type: selectedColumnType, dataSelector: ".sort-play-data" });
        }
    } else if (URI.isAlbum(currentUri)) {
        if (showAlbumColumn) columnConfigs.push({ type: selectedAlbumColumnType, dataSelector: ".sort-play-data" });
    } else if (URI.isArtist(currentUri)) {
        if (showArtistColumn) columnConfigs.push({ type: selectedArtistColumnType, dataSelector: ".sort-play-data" });
    }

    if (columnConfigs.length === 0) return;

    const allTrackRows = Array.from(tracklist_.getElementsByClassName("main-trackList-trackListRow"));
    const spotifyTracksToProcess = [];

    for (const trackElement of allTrackRows) {
        if (trackElement.classList.contains('sort-play-processing') || trackElement.hasAttribute('data-sp-fetch-failed')) {
            continue;
        }
        const trackUri = getTracklistTrackUri(trackElement);
        if (!trackUri) continue;

        if (Spicetify.URI.isLocal(trackUri)) {
            trackElement.classList.add('sort-play-processing');
            const trackData = getTrackDataObject(trackElement);

            if (trackData) {
                const rawArtistName = trackData.artists[0]?.name || "";
                let cleanedArtistName = rawArtistName;
                if (rawArtistName.includes(';')) {
                    cleanedArtistName = rawArtistName.split(';')[0].trim();
                }

                const localTrackInfo = {
                    name: trackData.name,
                    artistName: cleanedArtistName,
                    artists: [{ name: cleanedArtistName }],
                    uri: trackData.uri
                };

                for (const config of columnConfigs) {
                    const dataElement = trackElement.querySelector(config.dataSelector);
                    if (!dataElement || dataElement.dataset.spProcessed) continue;

                    try {
                        if (config.type === 'scrobbles') {
                            const result = await getTrackDetailsWithScrobbles(localTrackInfo);
                            updateDisplay(dataElement, result.scrobbles, config.type);
                        } else if (config.type === 'personalScrobbles') {
                            if (!loadLastFmUsername()) {
                                updateDisplay(dataElement, { error: "Set Last.fm username" }, config.type);
                            } else {
                                const result = await getTrackDetailsWithPersonalScrobbles(localTrackInfo);
                                const valueToDisplay = result.error ? { error: result.error } : result.personalScrobbles;
                                updateDisplay(dataElement, valueToDisplay, config.type);
                            }
                        } else {
                            updateDisplay(dataElement, "_", config.type);
                        }
                    } catch (e) {
                        updateDisplay(dataElement, "_", config.type);
                        trackElement.setAttribute('data-sp-fetch-failed', 'true');
                    }
                }
            }
            trackElement.classList.remove('sort-play-processing');
        } else if (trackUri.includes("track")) {
            const needsProcessing = columnConfigs.some(config => {
                const dataElement = trackElement.querySelector(config.dataSelector);
                return dataElement && !dataElement.dataset.spProcessed;
            });
            if (needsProcessing) {
                spotifyTracksToProcess.push(trackElement);
            }
        }
    }

    if (spotifyTracksToProcess.length === 0) return;

    if (columnConfigs.some(c => c.type === 'playCount')) initializePlayCountCache();
    if (columnConfigs.some(c => c.type === 'releaseDate')) initializeReleaseDateCache();
    if (columnConfigs.some(c => c.type === 'scrobbles')) initializeScrobblesCache();
    
    const BATCH_SIZE = 30;
    
    for (let i = 0; i < spotifyTracksToProcess.length; i += BATCH_SIZE) {
        const batch = spotifyTracksToProcess.slice(i, i + BATCH_SIZE);
        
        const needsAudioFeatures = columnConfigs.some(c => audioFeatureTypes.includes(c.type));
        
        if (needsAudioFeatures) {
            const trackIdsToFetch = [];
            const elementMap = new Map();

            for (const trackElement of batch) {
                const trackUri = getTracklistTrackUri(trackElement);
                const trackId = trackUri ? trackUri.split(":")[2] : null;
                if (!trackId) continue;

                const statsCacheModel = "stats-column";
                const cachedData = getTrackCache(trackId, true, false, statsCacheModel);
                if (cachedData) {
                    columnConfigs.forEach(config => {
                        const dataElement = trackElement.querySelector(config.dataSelector);
                        if (dataElement && audioFeatureTypes.includes(config.type)) {
                            const value = config.type === 'djInfo' ? cachedData : cachedData[config.type];
                            updateDisplay(dataElement, value, config.type);
                        }
                    });
                } else {
                    trackElement.classList.add('sort-play-processing');
                    trackIdsToFetch.push(trackId);
                    elementMap.set(trackId, trackElement);
                }
            }

            if (trackIdsToFetch.length > 0) {
                const batchStats = await getBatchTrackStats(trackIdsToFetch);
                for (const trackId of trackIdsToFetch) {
                    const trackElement = elementMap.get(trackId);
                    const stats = batchStats[trackId];
                    if (stats) {
                        const statsCacheModel = "stats-column";
                        setTrackCache(trackId, stats, true, false, statsCacheModel);
                        
                        columnConfigs.forEach(config => {
                            if (audioFeatureTypes.includes(config.type)) {
                                const dataElement = trackElement.querySelector(config.dataSelector);
                                const value = config.type === 'djInfo' ? stats : stats[config.type];
                                updateDisplay(dataElement, value, config.type);
                            }
                        });
                    } else {
                        columnConfigs.forEach(config => {
                            if (audioFeatureTypes.includes(config.type)) {
                                const dataElement = trackElement.querySelector(config.dataSelector);
                                updateDisplay(dataElement, "_", config.type);
                            }
                        });
                    }
                    if (trackElement) trackElement.classList.remove('sort-play-processing');
                }
            }
        }
        
        const nonAudioFeatureConfigs = columnConfigs.filter(c => !audioFeatureTypes.includes(c.type));
        if (nonAudioFeatureConfigs.length > 0) {
            const trackIdsToFetch = [];
            const elementMap = new Map();

            for (const trackElement of batch) {
                trackElement.classList.add('sort-play-processing');
                const trackUri = getTracklistTrackUri(trackElement);
                const trackId = trackUri ? trackUri.split(":")[2] : null;
                if (!trackId) {
                    trackElement.classList.remove('sort-play-processing');
                    continue;
                }

                let isCached = true;
                for (const config of nonAudioFeatureConfigs) {
                    const dataElement = trackElement.querySelector(config.dataSelector);
                    if (dataElement && (dataElement.textContent === "" || dataElement.textContent === "_")) {
                        let cachedValue = null;
                        if (config.type === 'playCount') {
                            cachedValue = getCachedPlayCount(trackId);
                        } else if (config.type === 'releaseDate') {
                            cachedValue = getCachedReleaseDate(trackId);
                        } else if (config.type === 'scrobbles') {
                            cachedValue = getCachedScrobbles(trackId);
                        } else if (config.type === 'personalScrobbles') {
                            const cachedData = getCachedPersonalScrobbles(trackId);
                            if (cachedData && !cachedData.pendingUpdate) {
                                cachedValue = cachedData.count;
                            }
                        }
                        
                        if (cachedValue !== null) {
                            updateDisplay(dataElement, cachedValue, config.type);
                        } else {
                            isCached = false;
                        }
                    }
                }

                if (!isCached) {
                    elementMap.set(trackId, trackElement);
                    trackIdsToFetch.push(trackId);
                } else {
                    trackElement.classList.remove('sort-play-processing');
                }
            }

            if (trackIdsToFetch.length > 0) {
                let success = false;
                let retries = 0;
                const maxRetries = 5;
                let delay = 2000;
                let trackDetailsResponse;

                while (!success && retries < maxRetries) {
                    try {
                        trackDetailsResponse = await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/tracks?ids=${trackIdsToFetch.join(',')}`);
                        if (trackDetailsResponse && trackDetailsResponse.tracks) success = true;
                        else throw new Error("Invalid data from Spotify API.");
                    } catch (error) {
                        retries++;
                        if (retries < maxRetries) await new Promise(resolve => setTimeout(resolve, delay *= 1.5));
                    }
                }

                if (success && trackDetailsResponse) {
                    const processingPromises = trackDetailsResponse.tracks.map(async (trackDetails) => {
                        if (!trackDetails) return;
                        const trackElement = elementMap.get(trackDetails.id);
                        if (!trackElement) return;

                        for (const config of nonAudioFeatureConfigs) {
                            const dataElement = trackElement.querySelector(config.dataSelector);
                            if (!dataElement || (dataElement.textContent !== "" && dataElement.textContent !== "_")) continue;
                            
                            try {
                                if (config.type === 'playCount') {
                                    const result = await getTrackDetailsWithPlayCount({ track: { album: { id: trackDetails.album.id }, id: trackDetails.id } });
                                    updateDisplay(dataElement, result.playCount, config.type);
                                    if (result.playCount !== null && result.playCount !== "N/A") setCachedPlayCount(trackDetails.id, result.playCount);
                                } else if (config.type === 'releaseDate') {
                                    const releaseDate = trackDetails.album.release_date;
                                    updateDisplay(dataElement, releaseDate, config.type);
                                    if (releaseDate) setCachedReleaseDate(trackDetails.id, releaseDate);
                                } else if (config.type === 'scrobbles' || config.type === 'personalScrobbles') {
                                    const trackName = trackDetails.name;
                                    const artistName = trackDetails.artists?.[0]?.name;
                                    if (!artistName || !trackName) throw new Error("Missing artist/track name.");

                                    if (config.type === 'scrobbles') {
                                        const result = await getTrackDetailsWithScrobbles({ name: trackName, artists: [{ name: artistName }] });
                                        updateDisplay(dataElement, result.scrobbles, config.type);
                                        if (result.scrobbles !== null) setCachedScrobbles(trackDetails.id, result.scrobbles);
                                    } else {
                                        if (!loadLastFmUsername()) updateDisplay(dataElement, "_", config.type);
                                        else {
                                            const result = await getTrackDetailsWithPersonalScrobbles(trackDetails);
                                            const valueToDisplay = result.error ? { error: result.error } : result.personalScrobbles;
                                            updateDisplay(dataElement, valueToDisplay, config.type);
                                        }
                                    }
                                }
                            } catch (e) {
                                updateDisplay(dataElement, "_", config.type);
                                trackElement.setAttribute('data-sp-fetch-failed', 'true');
                            }
                        }
                        trackElement.classList.remove('sort-play-processing');
                    });
                    await Promise.all(processingPromises);
                } else {
                    trackIdsToFetch.forEach(trackId => {
                        const trackElement = elementMap.get(trackId);
                        if (trackElement) {
                            trackElement.classList.remove('sort-play-processing');
                        }
                    });
                }
            }
        }
        if (i < spotifyTracksToProcess.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 200));
        }
    }
  }

  function updateDisplay(element, value, type) {
    if (!element) return;
    element.dataset.spProcessed = "true";

    let displayValue = "_"; 

    if (type === 'playCount') {
        if (value > 0 && !isNaN(value)) {
            displayValue = new Intl.NumberFormat('en-US').format(value);
        }
    } else if (type === 'personalScrobbles') {
        if (value && typeof value === 'object' && value.error) {
            element.innerHTML = `
                <span class="sort-play-failed-cell">
                    Failed
                    <span class="sort-play-tooltip">${value.error}</span>
                </span>
            `;
            return; 
        } else if (value === 0) {
            displayValue = "_";
        } else if (value > 0 && !isNaN(value)) {
            if (myScrobblesDisplayMode === 'sign') {
                displayValue = '\u2705';
            } else { 
                displayValue = new Intl.NumberFormat('en-US').format(value);
            }
        } else {
            displayValue = "Failed";
        }
    } else if (type === 'scrobbles') {
        if (value !== "_" && !isNaN(value) && value !== null && value !== undefined) {
            displayValue = new Intl.NumberFormat('en-US').format(value);
        }
    } else if (type === 'releaseDate') {
        displayValue = formatReleaseDate(value, releaseDateFormat);
    } else if (type === 'djInfo') {
        if (value && typeof value === 'object') {
            const parts = [];
            if (value.key && value.key !== 'Undefined') parts.push(value.key);
            if (value.tempo) parts.push(`${value.tempo}♫`);
            if (value.energy) parts.push(`E${value.energy}`);
            if (parts.length > 0) {
                displayValue = parts.join(' | ');
            }
        }
    } else if (['key', 'tempo', 'energy', 'danceability', 'valence', 'popularity'].includes(type)) {
        if (value !== null && value !== undefined) {
            displayValue = String(value);
        }
    }

    element.textContent = displayValue;
    element.style.fontSize = "14px";
    element.style.fontWeight = "400";
    element.style.color = "var(--spice-subtext)";
  }


  let isUpdatingTracklist = false;
  let tracklistObserver;
  let albumTracklistObserver;
  let artistTracklistObserver;
  
  async function updateTracklist() {
    const currentUri = getCurrentUri();
    if (!showAdditionalColumn || !currentUri || !(URI.isPlaylistV1OrV2(currentUri) || isLikedSongsPage(currentUri))) {
      return;
    }
  
    if (isUpdatingTracklist) return;
  
    try {
      isUpdatingTracklist = true;
  
      const tracklists = document.getElementsByClassName("main-trackList-indexable");
      if (!tracklists.length) return;
  
      for (const tracklist_ of tracklists) {
        if (!tracklist_) continue;
  
        await updateTracklistStructure(tracklist_);

        requestAnimationFrame(() => {
          loadAdditionalColumnData(tracklist_);
        });
      }
    } finally {
      isUpdatingTracklist = false;
    }
  }

  
  async function updateTracklistStructure(tracklist_) {
    const currentUri = getCurrentUri();
    if (!currentUri || !(URI.isPlaylistV1OrV2(currentUri) || isLikedSongsPage(currentUri))) return;

    await new Promise(resolve => requestAnimationFrame(resolve));

    const tracklistHeader = tracklist_.querySelector(".main-trackList-trackListHeaderRow");
    if (!tracklistHeader) {
      return;
    }

    const currentPlaylistName = getCurrentPlaylistName();
    const isExcludedPlaylist = excludedPlaylistNames.includes(currentPlaylistName);
    const shouldRemoveDateAdded = removeDateAdded && !isExcludedPlaylist;
    const gridCss = getGridCss(shouldRemoveDateAdded);

    const existingHeaderColumn = tracklistHeader.querySelector(".sort-play-column");
    const headerTextSpan = existingHeaderColumn?.querySelector("span");
    const existingSecondHeaderColumn = tracklistHeader.querySelector(".sort-play-second-column");
    const secondHeaderTextSpan = existingSecondHeaderColumn?.querySelector("span");

    let expectedHeaderText;
    switch (selectedColumnType) {
        case 'playCount': expectedHeaderText = "Plays"; break;
        case 'popularity': expectedHeaderText = "Popularity"; break;
        case 'releaseDate': expectedHeaderText = "Rel. Date"; break;
        case 'scrobbles': expectedHeaderText = "Scrobbles"; break;
        case 'personalScrobbles': expectedHeaderText = myScrobblesDisplayMode === 'sign' ? "Listened" : "My Scrobbles"; break;
        case 'djInfo': expectedHeaderText = "DJ Info"; break;
        case 'key': expectedHeaderText = "Key"; break;
        case 'tempo': expectedHeaderText = "BPM"; break;
        case 'energy': expectedHeaderText = "Energy"; break;
        case 'danceability': expectedHeaderText = "Dance"; break;
        case 'valence': expectedHeaderText = "Valence"; break;
        default: expectedHeaderText = "Plays";
    }
    const columnTypeChanged = existingHeaderColumn && headerTextSpan?.innerText !== expectedHeaderText;

    let expectedSecondHeaderText;
    switch (selectedSecondColumnType) {
        case 'playCount': expectedSecondHeaderText = "Plays"; break;
        case 'popularity': expectedSecondHeaderText = "Popularity"; break;
        case 'releaseDate': expectedSecondHeaderText = "Rel. Date"; break;
        case 'scrobbles': expectedSecondHeaderText = "Scrobbles"; break;
        case 'personalScrobbles': expectedSecondHeaderText = myScrobblesDisplayMode === 'sign' ? "Listened" : "My Scrobbles"; break;
        case 'djInfo': expectedSecondHeaderText = "DJ Info"; break;
        case 'key': expectedSecondHeaderText = "Key"; break;
        case 'tempo': expectedSecondHeaderText = "BPM"; break;
        case 'energy': expectedSecondHeaderText = "Energy"; break;
        case 'danceability': expectedSecondHeaderText = "Dance"; break;
        case 'valence': expectedSecondHeaderText = "Valence"; break;
        default: expectedSecondHeaderText = "Popularity";
    }
    const secondColumnTypeChanged = existingSecondHeaderColumn && secondHeaderTextSpan?.innerText !== expectedSecondHeaderText;

    if (showAdditionalColumn) {
        if (!existingHeaderColumn) {
            const lastColumn = tracklistHeader.querySelector(".main-trackList-rowSectionEnd");
            if (lastColumn) {
                const colIndexInt = parseInt(lastColumn.getAttribute("aria-colindex"));
                const newGridTemplate = colIndexInt === 4 ? gridCss.fiveColumnGridCss : colIndexInt === 5 ? gridCss.sixColumnGridCss : gridCss.sevenColumnGridCss;
                tracklistHeader.style.cssText = newGridTemplate;

                const insertionPoint = shouldRemoveDateAdded ? tracklistHeader.querySelector('[aria-colindex="4"]') : lastColumn;
                let headerColumn = document.createElement("div");
                headerColumn.className = "main-trackList-rowSectionVariable sort-play-column";
                headerColumn.setAttribute("role", "columnheader");
                headerColumn.style.cssText = "display: flex; justify-content: center;";
                headerColumn.setAttribute("aria-colindex", colIndexInt.toString());
                
                const btn = document.createElement("button");
                btn.className = "main-trackList-column main-trackList-sortable sort-play-header";
                const title = document.createElement("span");
                title.className = "TypeElement-mesto-type standalone-ellipsis-one-line";
                title.innerText = expectedHeaderText;
                btn.appendChild(title);
                headerColumn.appendChild(btn);

                if (insertionPoint) {
                    tracklistHeader.insertBefore(headerColumn, insertionPoint);
                    lastColumn.setAttribute("aria-colindex", (colIndexInt + 1).toString());
                }
            }
        } else if (columnTypeChanged) {
            if (headerTextSpan) headerTextSpan.innerText = expectedHeaderText;
            const allCells = tracklist_.querySelectorAll('.sort-play-data');
            allCells.forEach(cell => {
                cell.textContent = "";
                delete cell.dataset.spProcessed;
            });
        }
    } else { 
        if (existingHeaderColumn) {
            existingHeaderColumn.remove();
            const lastColumn = tracklistHeader.querySelector(".main-trackList-rowSectionEnd");
            if (lastColumn) {
                const colIndexInt = parseInt(lastColumn.getAttribute("aria-colindex"));
                lastColumn.setAttribute("aria-colindex", (colIndexInt - 1).toString());
                switch (colIndexInt - 1) {
                    case 4: tracklistHeader.style.cssText = "grid-template-columns: [index] 16px [first] 4fr [var1] 2fr [var2] minmax(120px,1fr) [last] minmax(120px,1fr)"; break;
                    case 5: tracklistHeader.style.cssText = "grid-template-columns: [index] 16px [first] 6fr [var1] 4fr [var2] 3fr [var3] minmax(120px,1fr) [last] minmax(120px,1fr)"; break;
                    case 6: tracklistHeader.style.cssText = "grid-template-columns: [index] 16px [first] 6fr [var1] 4fr [var2] 3fr [var3] minmax(120px,2fr) [var4] minmax(120px,1fr) [last] minmax(120px,1fr)"; break;
                }
            }
        }
    }

    if (showSecondAdditionalColumn) {
        if (!existingSecondHeaderColumn) {
            const lastColumn = tracklistHeader.querySelector(".main-trackList-rowSectionEnd");
            if (lastColumn) {
                const colIndexInt = parseInt(lastColumn.getAttribute("aria-colindex"));
                const newGridTemplate = colIndexInt === 5 ? gridCss.sixColumnGridCss_twoExtra : colIndexInt === 6 ? gridCss.sevenColumnGridCss_twoExtra : gridCss.sevenColumnGridCss_twoExtra;
                tracklistHeader.style.cssText = newGridTemplate;

                const firstColumnHeader = tracklistHeader.querySelector(".sort-play-column");
                const insertionPoint = firstColumnHeader || (shouldRemoveDateAdded ? tracklistHeader.querySelector('[aria-colindex="4"]') : lastColumn);
                
                let headerColumn = document.createElement("div");
                headerColumn.className = "main-trackList-rowSectionVariable sort-play-second-column";
                headerColumn.setAttribute("role", "columnheader");
                headerColumn.style.cssText = "display: flex; justify-content: center;";
                headerColumn.setAttribute("aria-colindex", (colIndexInt - (showAdditionalColumn ? 1 : 0)).toString());
                
                const btn = document.createElement("button");
                btn.className = "main-trackList-column main-trackList-sortable sort-play-header";
                const title = document.createElement("span");
                title.className = "TypeElement-mesto-type standalone-ellipsis-one-line";
                title.innerText = expectedSecondHeaderText;
                btn.appendChild(title);
                headerColumn.appendChild(btn);

                if (insertionPoint) {
                    tracklistHeader.insertBefore(headerColumn, insertionPoint);
                    if (firstColumnHeader) firstColumnHeader.setAttribute("aria-colindex", colIndexInt.toString());
                    lastColumn.setAttribute("aria-colindex", (colIndexInt + 1).toString());
                }
            }
        } else if (secondColumnTypeChanged) {
            if (secondHeaderTextSpan) secondHeaderTextSpan.innerText = expectedSecondHeaderText;
            const allCells = tracklist_.querySelectorAll('.sort-play-second-data');
            allCells.forEach(cell => {
                cell.textContent = "";
                delete cell.dataset.spProcessed;
            });
        }
    } else {
        if (existingSecondHeaderColumn) {
            existingSecondHeaderColumn.remove();
            const lastColumn = tracklistHeader.querySelector(".main-trackList-rowSectionEnd");
            if (lastColumn) {
                const colIndexInt = parseInt(lastColumn.getAttribute("aria-colindex"));
                lastColumn.setAttribute("aria-colindex", (colIndexInt - 1).toString());
                const newGridTemplate = colIndexInt - 1 === 4 ? gridCss.fiveColumnGridCss : colIndexInt - 1 === 5 ? gridCss.sixColumnGridCss : gridCss.sevenColumnGridCss;
                tracklistHeader.style.cssText = newGridTemplate;
            }
        }
    }

    const dateAddedHeader = tracklistHeader.querySelector('[aria-colindex="4"]');
    if (dateAddedHeader) {
        dateAddedHeader.style.display = shouldRemoveDateAdded ? 'none' : '';
    }

    const allRows = tracklist_.getElementsByClassName("main-trackList-trackListRow");
    for (const track of allRows) {
        const existingDataColumn = track.querySelector(".sort-play-data-column");
        const existingSecondDataColumn = track.querySelector(".sort-play-second-data-column");

        if (showAdditionalColumn) {
            if (!existingDataColumn) {
                const lastColumn = track.querySelector(".main-trackList-rowSectionEnd");
                if (lastColumn) {
                    const colIndexInt = parseInt(lastColumn.getAttribute("aria-colindex"));
                    const newGridTemplate = colIndexInt === 4 ? gridCss.fiveColumnGridCss : colIndexInt === 5 ? gridCss.sixColumnGridCss : gridCss.sevenColumnGridCss;
                    track.style.cssText = newGridTemplate;

                    let dataColumn = document.createElement("div");
                    dataColumn.className = "main-trackList-rowSectionVariable sort-play-data-column sort-play-column";
                    dataColumn.setAttribute("aria-colindex", colIndexInt.toString());
                    dataColumn.style.cssText = "display: flex; justify-content: center; align-items: center;";
                    dataColumn.innerHTML = `<span class="sort-play-data" style="font-size: 14px; font-weight: 400; color: var(--spice-subtext);"></span>`;

                    const insertionPoint = shouldRemoveDateAdded ? track.querySelector('[aria-colindex="4"]') : lastColumn;
                    if (insertionPoint) {
                        track.insertBefore(dataColumn, insertionPoint);
                        lastColumn.setAttribute("aria-colindex", (colIndexInt + 1).toString());
                    }
                }
            } else if (columnTypeChanged) {
                const dataSpan = existingDataColumn.querySelector('.sort-play-data');
                if (dataSpan) dataSpan.textContent = "";
            }
        } else { 
            if (existingDataColumn) {
                existingDataColumn.remove();
                const lastColumn = track.querySelector(".main-trackList-rowSectionEnd");
                if(lastColumn) {
                    const colIndexInt = parseInt(lastColumn.getAttribute("aria-colindex"));
                    lastColumn.setAttribute("aria-colindex", (colIndexInt - 1).toString());
                    switch (colIndexInt - 1) {
                         case 4: track.style.cssText = "grid-template-columns: [index] 16px [first] 4fr [var1] 2fr [var2] minmax(120px,1fr) [last] minmax(120px,1fr)"; break;
                         case 5: track.style.cssText = "grid-template-columns: [index] 16px [first] 6fr [var1] 4fr [var2] 3fr [var3] minmax(120px,1fr) [last] minmax(120px,1fr)"; break;
                         case 6: track.style.cssText = "grid-template-columns: [index] 16px [first] 6fr [var1] 4fr [var2] 3fr [var3] minmax(120px,2fr) [var4] minmax(120px,1fr) [last] minmax(120px,1fr)"; break;
                    }
                }
            }
        }

        if (showSecondAdditionalColumn) {
            if (!existingSecondDataColumn) {
                const lastColumn = track.querySelector(".main-trackList-rowSectionEnd");
                if (lastColumn) {
                    const colIndexInt = parseInt(lastColumn.getAttribute("aria-colindex"));
                    const newGridTemplate = colIndexInt === 5 ? gridCss.sixColumnGridCss_twoExtra : colIndexInt === 6 ? gridCss.sevenColumnGridCss_twoExtra : gridCss.sevenColumnGridCss_twoExtra;
                    track.style.cssText = newGridTemplate;

                    let dataColumn = document.createElement("div");
                    dataColumn.className = "main-trackList-rowSectionVariable sort-play-second-data-column sort-play-second-column";
                    dataColumn.setAttribute("aria-colindex", (colIndexInt - (showAdditionalColumn ? 1 : 0)).toString());
                    dataColumn.style.cssText = "display: flex; justify-content: center; align-items: center;";
                    dataColumn.innerHTML = `<span class="sort-play-second-data" style="font-size: 14px; font-weight: 400; color: var(--spice-subtext);"></span>`;

                    const firstColumnCell = track.querySelector(".sort-play-data-column");
                    const insertionPoint = firstColumnCell || (shouldRemoveDateAdded ? track.querySelector('[aria-colindex="4"]') : lastColumn);
                    if (insertionPoint) {
                        track.insertBefore(dataColumn, insertionPoint);
                        if (firstColumnCell) firstColumnCell.setAttribute("aria-colindex", colIndexInt.toString());
                        lastColumn.setAttribute("aria-colindex", (colIndexInt + 1).toString());
                    }
                }
            } else if (secondColumnTypeChanged) {
                const dataSpan = existingSecondDataColumn.querySelector('.sort-play-second-data');
                if (dataSpan) dataSpan.textContent = "";
            }
        } else {
            if (existingSecondDataColumn) {
                existingSecondDataColumn.remove();
                const lastColumn = track.querySelector(".main-trackList-rowSectionEnd");
                if(lastColumn) {
                    const colIndexInt = parseInt(lastColumn.getAttribute("aria-colindex"));
                    lastColumn.setAttribute("aria-colindex", (colIndexInt - 1).toString());
                    const newGridTemplate = colIndexInt - 1 === 4 ? gridCss.fiveColumnGridCss : colIndexInt - 1 === 5 ? gridCss.sixColumnGridCss : gridCss.sevenColumnGridCss;
                    track.style.cssText = newGridTemplate;
                }
            }
        }

        const dateAddedCell = track.querySelector('[aria-colindex="4"]');
        if (dateAddedCell) {
            dateAddedCell.style.display = shouldRemoveDateAdded ? 'none' : '';
        }
    }
  }

  
  const getGridCss = (removeDateAdded) => {
    if (removeDateAdded) {
      return {
        fiveColumnGridCss: "grid-template-columns: [index] 16px [first] 4fr [var1] 2fr [var2] 2fr [last] minmax(120px,1fr) !important",
        sixColumnGridCss: "grid-template-columns: [index] 16px [first] 5fr [var1] 3fr [var2] 2fr [var3] 2fr [last] minmax(120px,1fr) !important",
        sevenColumnGridCss: "grid-template-columns: [index] 16px [first] 5fr [var1] 3fr [var2] 2fr [var3] 2fr [var4] 2fr [last] minmax(120px,1fr) !important",
        sixColumnGridCss_twoExtra: "grid-template-columns: [index] 16px [first] 4fr [var1] 2fr [var2] 2fr [var3] 2fr [last] minmax(120px,1fr) !important",
        sevenColumnGridCss_twoExtra: "grid-template-columns: [index] 16px [first] 5fr [var1] 3fr [var2] 2fr [var3] 2fr [var4] 2fr [last] minmax(120px,1fr) !important",
      };
    }
    return {
      fiveColumnGridCss: "grid-template-columns: [index] 16px [first] 4fr [var1] 2fr [var2] 2fr [last] minmax(120px,1fr) !important",
      sixColumnGridCss: "grid-template-columns: [index] 16px [first] 5fr [var1] 3fr [var2] 2fr [var3] 2fr [last] minmax(120px,1fr) !important",
      sevenColumnGridCss: "grid-template-columns: [index] 16px [first] 5fr [var1] 3fr [var2] 2fr [var3] minmax(120px,1fr) [var4] 2fr [last] minmax(120px,1fr) !important",
      sixColumnGridCss_twoExtra: "grid-template-columns: [index] 16px [first] 4fr [var1] 2fr [var2] 2fr [var3] 2fr [last] minmax(120px,1fr) !important",
      sevenColumnGridCss_twoExtra: "grid-template-columns: [index] 16px [first] 5fr [var1] 3fr [var2] 2fr [var3] 2fr [var4] 2fr [last] minmax(120px,1fr) !important",
    };
  };

  function updateAlbumTracklist() {
    const tracklistContainer = document.querySelector(".main-trackList-trackList.main-trackList-indexable");
    if (!tracklistContainer) return;

    const currentUri = getCurrentUri();

    if (!showAlbumColumn || !currentUri || !URI.isAlbum(currentUri)) {
        const existingHeader = tracklistContainer.querySelector('.sort-play-album-col-header');
        if (existingHeader) {
            const headerRow = existingHeader.parentElement;
            const originalGridTemplate = "[index] 16px [first] 4fr [var1] 2fr [last] minmax(120px,1fr)";
            existingHeader.remove();
            if(headerRow) headerRow.style.gridTemplateColumns = originalGridTemplate;
            tracklistContainer.setAttribute('aria-colcount', '4');
            const allRows = tracklistContainer.querySelectorAll('.main-trackList-trackList .main-trackList-trackListRow');
            allRows.forEach(row => {
                const cell = row.querySelector('.sort-play-album-col');
                if (cell) cell.remove();
                row.style.gridTemplateColumns = originalGridTemplate;
            });
        }
        return;
    }

    const headerRow = tracklistContainer.querySelector('.main-trackList-trackListHeaderRow');
    if (!headerRow) return;

    let expectedHeaderText;
    switch (selectedAlbumColumnType) {
        case 'playCount': expectedHeaderText = "Plays"; break;
        case 'popularity': expectedHeaderText = "Popularity"; break;
        case 'releaseDate': expectedHeaderText = "Rel. Date"; break;
        case 'scrobbles': expectedHeaderText = "Scrobbles"; break;
        case 'personalScrobbles': expectedHeaderText = myScrobblesDisplayMode === 'sign' ? "Listened" : "My Scrobbles"; break;
        case 'djInfo': expectedHeaderText = "DJ Info"; break;
        case 'key': expectedHeaderText = "Key"; break;
        case 'tempo': expectedHeaderText = "BPM"; break;
        case 'energy': expectedHeaderText = "Energy"; break;
        case 'danceability': expectedHeaderText = "Dance"; break;
        case 'valence': expectedHeaderText = "Valence"; break;
        default: expectedHeaderText = "Plays";
    }

    const newGridTemplate = "[index] 16px [first] 6fr [var1] 3fr [var2] 3fr [last] minmax(120px,1fr)";
    const existingHeader = headerRow.querySelector('.sort-play-album-col-header');

    if (!existingHeader) {
        headerRow.style.gridTemplateColumns = newGridTemplate;
        tracklistContainer.setAttribute('aria-colcount', '5');
        const newHeaderCell = document.createElement('div');
        newHeaderCell.className = 'main-trackList-rowSectionVariable sort-play-album-col-header';
        newHeaderCell.innerHTML = `<button class="main-trackList-column"><span class="encore-text-body-small">${expectedHeaderText}</span></button>`;
        newHeaderCell.setAttribute('role', 'columnheader');
        newHeaderCell.setAttribute('aria-colindex', '4');
        newHeaderCell.style.justifyContent = 'center';

        const playsHeaderCell = headerRow.querySelector('[role="columnheader"][aria-colindex="3"]');
        if (playsHeaderCell) {
            playsHeaderCell.after(newHeaderCell);
            const lastHeaderCell = headerRow.querySelector('.main-trackList-rowSectionEnd');
            if (lastHeaderCell) lastHeaderCell.setAttribute('aria-colindex', '5');
        }
    } else {
        const headerTextSpan = existingHeader.querySelector('span');
        if (headerTextSpan && headerTextSpan.innerText !== expectedHeaderText) {
            headerTextSpan.innerText = expectedHeaderText;
            const allCells = tracklistContainer.querySelectorAll('.sort-play-album-col .sort-play-data');
            allCells.forEach(cell => {
                cell.textContent = "";
                delete cell.dataset.spProcessed;
            });
        }
    }
    
    const trackRows = tracklistContainer.querySelectorAll('.main-trackList-trackListRow');
    trackRows.forEach(row => {
        if (row.querySelector('.sort-play-album-col')) return;
        row.style.gridTemplateColumns = newGridTemplate;
        const newCell = document.createElement('div');
        newCell.className = 'main-trackList-rowSectionVariable sort-play-album-col';
        newCell.innerHTML = `<span class="sort-play-data encore-text-body-small encore-internal-color-text-subdued" data-encore-id="text"></span>`;
        newCell.setAttribute('role', 'gridcell');
        newCell.setAttribute('aria-colindex', '4');
        newCell.style.display = 'flex';
        newCell.style.alignItems = 'center';
        newCell.style.justifyContent = 'center';

        const playsCell = row.querySelector('[role="gridcell"][aria-colindex="3"]');
        if (playsCell) {
            playsCell.after(newCell);
            const lastCell = row.querySelector('.main-trackList-rowSectionEnd');
            if (lastCell) lastCell.setAttribute('aria-colindex', '5');
        }
    });

    loadAdditionalColumnData(tracklistContainer);
  }

  function updateArtistTracklist() {
    const tracklistContainer = document.querySelector('div.main-trackList-trackList[aria-label="popular tracks"]');
    if (!tracklistContainer) return;

    const currentUri = getCurrentUri();

    if (!showArtistColumn || !currentUri || !URI.isArtist(currentUri)) {
        const existingHeaderWrapper = tracklistContainer.querySelector('.sort-play-artist-header-wrapper');
        if (existingHeaderWrapper) {
            const trackRows = tracklistContainer.querySelectorAll('.main-trackList-trackListRow.main-trackList-trackListRowGrid');
            const originalGridTemplate = "[index] 16px [first] 4fr [var1] 2fr [last] minmax(120px,1fr)";
            existingHeaderWrapper.remove();
            tracklistContainer.setAttribute('aria-colcount', '4');
            trackRows.forEach(row => {
                const cell = row.querySelector('.sort-play-artist-col');
                if (cell) cell.remove();
                row.style.gridTemplateColumns = originalGridTemplate;
            });
        }
        return;
    }

    let expectedHeaderText;
    switch (selectedArtistColumnType) {
        case 'playCount': expectedHeaderText = "Plays"; break;
        case 'popularity': expectedHeaderText = "Popularity"; break;
        case 'releaseDate': expectedHeaderText = "Rel. Date"; break;
        case 'scrobbles': expectedHeaderText = "Scrobbles"; break;
        case 'personalScrobbles': expectedHeaderText = myScrobblesDisplayMode === 'sign' ? "Listened" : "My Scrobbles"; break;
        case 'djInfo': expectedHeaderText = "DJ Info"; break;
        case 'key': expectedHeaderText = "Key"; break;
        case 'tempo': expectedHeaderText = "BPM"; break;
        case 'energy': expectedHeaderText = "Energy"; break;
        case 'danceability': expectedHeaderText = "Dance"; break;
        case 'valence': expectedHeaderText = "Valence"; break;
        default: expectedHeaderText = "Plays";
    }
    
    const newGridTemplate = "[index] 16px [first] 6fr [var1] 3fr [var2] 3fr [last] minmax(120px,1fr)";
    const existingHeaderWrapper = tracklistContainer.querySelector('.sort-play-artist-header-wrapper');

    if (!existingHeaderWrapper) {
        tracklistContainer.setAttribute('aria-colcount', '5');
        const headerWrapper = document.createElement('div');
        headerWrapper.className = 'main-trackList-trackListHeader sort-play-artist-header-wrapper';
        headerWrapper.innerHTML = `<div class="main-trackList-trackListHeaderRow main-trackList-trackListRowGrid" role="row" style="grid-template-columns: ${newGridTemplate};">
            <div class="main-trackList-rowSectionIndex" role="columnheader" aria-colindex="1"><div>#</div></div>
            <div class="main-trackList-rowSectionStart" role="columnheader" aria-colindex="2"><div class="main-trackList-column"><span class="encore-text-body-small">Title</span></div></div>
            <div class="main-trackList-rowSectionVariable" role="columnheader" aria-colindex="3"><div><span class="encore-text-body-small">Plays</span></div></div>
            <div class="main-trackList-rowSectionVariable sort-play-artist-col-header" role="columnheader" aria-colindex="4" style="justify-content: center;"><button class="main-trackList-column"><span class="encore-text-body-small">${expectedHeaderText}</span></button></div>
            <div class="main-trackList-rowSectionEnd" role="columnheader" aria-colindex="5"><div aria-label="Duration" class="main-trackList-column main-trackList-durationHeader"><svg data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 16 16" class="Svg-sc-ytk21e-0 Svg-img-icon-small"><path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z"></path><path d="M8 3.25a.75.75 0 0 1 .75.75v3.25H11a.75.75 0 0 1 0 1.5H7.25V4A.75.75 0 0 1 8 3.25z"></path></svg></div></div>
        </div>`;
        headerWrapper.style.cssText = 'position: sticky; top: 0px; z-index: 2;';
        const rootlistWrapper = tracklistContainer.querySelector('.main-rootlist-wrapper');
        if (rootlistWrapper) {
            tracklistContainer.insertBefore(headerWrapper, rootlistWrapper);
        } else {
            tracklistContainer.prepend(headerWrapper);
        }
    } else {
        const headerTextSpan = existingHeaderWrapper.querySelector('.sort-play-artist-col-header span');
        if (headerTextSpan && headerTextSpan.innerText !== expectedHeaderText) {
            headerTextSpan.innerText = expectedHeaderText;
            const allCells = tracklistContainer.querySelectorAll('.sort-play-artist-col .sort-play-data');
            allCells.forEach(cell => {
                cell.textContent = "";
                delete cell.dataset.spProcessed;
            });
        }
    }

    const trackRows = tracklistContainer.querySelectorAll('.main-trackList-trackListRow.main-trackList-trackListRowGrid');
    trackRows.forEach(row => {
        if (row.querySelector('.sort-play-artist-col')) return;
        row.style.gridTemplateColumns = newGridTemplate;
        const newCell = document.createElement('div');
        newCell.className = 'main-trackList-rowSectionVariable sort-play-artist-col';
        newCell.innerHTML = `<span class="sort-play-data encore-text-body-small encore-internal-color-text-subdued" data-encore-id="text"></span>`;
        newCell.setAttribute('role', 'gridcell');
        newCell.setAttribute('aria-colindex', '4');
        newCell.style.display = 'flex';
        newCell.style.alignItems = 'center';
        newCell.style.justifyContent = 'center';

        const playsCell = row.querySelector('[role="gridcell"][aria-colindex="3"]');
        if (playsCell) {
            playsCell.after(newCell);
            const endSection = row.querySelector('.main-trackList-rowSectionEnd');
            if (endSection) endSection.setAttribute('aria-colindex', '5');
        }
    });

    loadAdditionalColumnData(tracklistContainer);
  }
  
  let updateDebounceTimeout;

  async function initializeTracklistObserver() {
    const currentUri = getCurrentUri();
    if (!currentUri || !(URI.isPlaylistV1OrV2(currentUri) || isLikedSongsPage(currentUri))) return;

    const tracklist = await waitForElement(".main-trackList-indexable");
    if (!tracklist) return;

    updateTracklist();

    if (tracklistObserver) tracklistObserver.disconnect();

    tracklistObserver = new MutationObserver(() => {
        clearTimeout(updateDebounceTimeout);
        updateDebounceTimeout = setTimeout(updateTracklist, 150);
    });
    
    const rowContainer = tracklist.querySelector(':scope > [role="presentation"]');
    if (rowContainer) {
        tracklistObserver.observe(rowContainer, { childList: true });
    } else {
        tracklistObserver.observe(tracklist, { childList: true, subtree: true });
    }
  }

  async function initializeAlbumTracklistObserver() {
    const currentUri = getCurrentUri();
    if (!currentUri || !URI.isAlbum(currentUri)) return;

    const tracklist = await waitForElement(".main-trackList-trackList.main-trackList-indexable");
    if (!tracklist) return;

    updateAlbumTracklist();

    if (albumTracklistObserver) albumTracklistObserver.disconnect();

    albumTracklistObserver = new MutationObserver(() => {
        clearTimeout(updateDebounceTimeout);
        updateDebounceTimeout = setTimeout(updateAlbumTracklist, 150);
    });
    
    albumTracklistObserver.observe(tracklist, {
      childList: true,
      subtree: true,
    });
  }

  async function initializeArtistTracklistObserver() {
    const currentUri = getCurrentUri();
    if (!currentUri || !URI.isArtist(currentUri)) return;

    const tracklist = await waitForElement('div.main-trackList-trackList[aria-label="popular tracks"]');
    if (!tracklist) return;

    updateArtistTracklist();

    if (artistTracklistObserver) artistTracklistObserver.disconnect();

    artistTracklistObserver = new MutationObserver(() => {
        clearTimeout(updateDebounceTimeout);
        updateDebounceTimeout = setTimeout(updateArtistTracklist, 150);
    });
    
    artistTracklistObserver.observe(tracklist, {
      childList: true,
      subtree: true,
    });
  }
    
  function insertButton() {
    const currentUri = getCurrentUri(); 
    if (!currentUri) return;
  
    if (URI.isPlaylistV1OrV2(currentUri)) {
      const playlistContainer = document.querySelector(".playlist-playlist-searchBoxContainer");
      if (playlistContainer && !playlistContainer.contains(mainButton)) {
        mainButton.style.marginLeft = ""; 
        mainButton.style.marginRight = "";
        if (playlistContainer.firstChild) {
          playlistContainer.insertBefore(mainButton, playlistContainer.firstChild);
        } else {
          playlistContainer.appendChild(mainButton);
        }
      }
    } else if (URI.isArtist(currentUri)) {
      const artistActionBar = document.querySelector(".main-actionBar-ActionBarRow");
      if (artistActionBar && !artistActionBar.contains(mainButton)) {
        mainButton.style.marginLeft = "auto"; 
        mainButton.style.marginRight = "31px"; 
        artistActionBar.appendChild(mainButton);
      }
    } else if (isLikedSongsPage(currentUri)) {
      const likedSongsContainer = document.querySelector(".playlist-playlist-searchBoxContainer");
      if (likedSongsContainer && !likedSongsContainer.contains(mainButton)) {
        mainButton.style.marginLeft = ""; 
        mainButton.style.marginRight = "";
        if (likedSongsContainer.firstChild) {
          likedSongsContainer.insertBefore(mainButton, likedSongsContainer.firstChild);
        } else {
          likedSongsContainer.appendChild(mainButton);
        }
      }
      } else if (isLocalFilesPage(currentUri)) {
        const localFilesActionBar = document.querySelector(".main-actionBar-ActionBarRow");
        if (localFilesActionBar) {
            const controlsContainer = localFilesActionBar.querySelector("div:last-child");
            if (controlsContainer && !controlsContainer.contains(mainButton)) {
                mainButton.style.marginLeft = ""; 
                mainButton.style.marginRight = "8px";
                if (controlsContainer.firstChild) {
                    controlsContainer.insertBefore(mainButton, controlsContainer.firstChild);
                } else {
                    controlsContainer.appendChild(mainButton);
                }
            }
        }
    } 
    else if (URI.isAlbum(currentUri)) {
        const listButton = document.querySelector(".x-sortBox-sortDropdown");

        if (listButton && listButton.parentElement) {
            const container = listButton.parentElement;
            if (!container.contains(mainButton)) {
                mainButton.style.marginLeft = "";
                mainButton.style.marginRight = "1px";
                container.insertBefore(mainButton, listButton);
            }
        } else {
            const albumActionBar = document.querySelector(".main-actionBar-ActionBarRow");
            if (albumActionBar && !albumActionBar.contains(mainButton)) {
                mainButton.style.marginLeft = "auto"; 
                mainButton.style.marginRight = "31px"; 
                albumActionBar.appendChild(mainButton);
            }
        }
    }
  }

  function getNativeMenuBackgroundColor() {
    const primaryClass = 'main-contextMenu-menu';
    const fallbackClass = 'wlb3dYO07PZuYfmNfmkS';
    let tempContainer = null;
    try {
      tempContainer = document.createElement('div');
      tempContainer.className = primaryClass;
      tempContainer.style.cssText = 'position: absolute; top: -9999px; left: -9999px; visibility: hidden;';
      document.body.appendChild(tempContainer);

      let bgColor = window.getComputedStyle(tempContainer).backgroundColor;

      if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
        return bgColor;
      }
      
      tempContainer.className = fallbackClass;
      bgColor = window.getComputedStyle(tempContainer).backgroundColor;

      if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
        return bgColor;
      }

      return '#282828';
    } catch (error) {
      return '#282828';
    } finally {
      if (tempContainer) {
        document.body.removeChild(tempContainer);
      }
    }
  }
  
  function applyCurrentThemeColors(elementToUpdate = null) {
    requestAnimationFrame(() => {
        if (!elementToUpdate) {
            const nativeButtonColor = getNativeTertiaryButtonColor();
            if (mainButton && !isProcessing) { 
                mainButton.style.color = nativeButtonColor;
                if (svgElement) svgElement.style.fill = nativeButtonColor;
            }
        }

        const allMenus = document.querySelectorAll('.main-contextMenu-menu.sort-play-font-scope');

        if (allMenus.length > 0) {
            const nativeMenuColor = getNativeMenuTextColor();

            allMenus.forEach(menu => {
                const childButtons = menu.querySelectorAll('button');
                childButtons.forEach(button => {
                    button.style.color = nativeMenuColor;
                });

                const childIcons = menu.querySelectorAll('svg');
                childIcons.forEach(svg => {
                    if (svg.style.fill !== 'rgb(30, 215, 96)') { 
                        svg.style.fill = nativeMenuColor;
                    }
                });
            });
        }
    });
  }
  const LIKE_BUTTON_ICON_NOT_LIKED = `<path d="M1.69 2A4.582 4.582 0 018 2.023 4.583 4.583 0 0111.88.817h.002a4.618 4.618 0 013.782 3.65v.003a4.543 4.543 0 01-1.011 3.84L9.35 14.629a1.765 1.765 0 01-2.093.464 1.762 1.762 0 01-.605-.463L1.348 8.309A4.582 4.582 0 011.689 2zm3.158.252A3.082 3.082 0 002.49 7.337l.005.005L7.8 13.664a.264.264 0 00.311.069.262.262 0 00.09-.069l5.312-6.33a3.043 3.043 0 00.68-2.573 3.118 3.118 0 00-2.551-2.463 3.079 3.079 0 00-2.612.816l-.007.007a1.501 1.501 0 01-2.045 0l-.009-.008a3.082 3.082 0 00-2.121-.861z"></path>`;
  const LIKE_BUTTON_ICON_LIKED = `<path d="M15.724 4.22A4.313 4.313 0 0012.192.814a4.269 4.269 0 00-3.622 1.13.837.837 0 01-1.14 0 4.272 4.272 0 00-6.21 5.855l5.916 7.05a1.128 1.128 0 001.727 0l5.916-7.05a4.228 4.228 0 00.945-3.577z"></path>`;
  const LIKE_BUTTON_ICON_ISRC_LIKED = `<path d="m15.92,3.56h0c-.36-1.81-1.8-3.2-3.62-3.49-1.35-.22-2.72.21-3.71,1.16-.16.15-.37.23-.58.23s-.42-.08-.58-.23c-.85-.82-1.95-1.23-3.04-1.23S2.09.45,1.23,1.33c-1.57,1.63-1.65,4.18-.17,5.9l6.06,7.22c.23.27.56.41.89.41h0c.26,0,.53-.09.74-.27.05-.04.1-.09.14-.14l6.06-7.22c.87-1.01,1.23-2.36.97-3.66h0Zm-7.91,9.39h0L2.31,6.18h0s0-.01,0-.01c-.45-.52-.68-1.18-.66-1.86s.29-1.33.77-1.82c.52-.54,1.22-.83,1.97-.83s1.39.27,1.9.77h.01s.01.02.01.02c.46.43,1.07.67,1.7.67v9.86h0Z"></path>`;
  
  function initializeLikeButtonFeature() {
    const styleId = 'sort-play-like-button-tooltip-style';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
            .like-button-tooltip {
                background-color: #282828;
                color: #ffffff;
                border-radius: 4px;
                padding: 4px 8px;
                font-size: 14px;
                font-family: 'SpotifyMixUI', 'CircularSp', 'Circular', 'Helvetica', 'Arial', sans-serif;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
                z-index: 1001;
                max-width: 300px;
                text-align: center;
                pointer-events: none;
                opacity: 0;
                transition: opacity 200ms ease-in-out;
            }

            .like-button-tooltip.visible {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }

    const visibilityStyleId = 'sort-play-like-button-visibility-style';
    if (!document.getElementById(visibilityStyleId)) {
        const style = document.createElement('style');
        style.id = visibilityStyleId;
        style.innerHTML = `
            .main-trackList-trackListRow .sort-play-like-button[aria-checked="true"],
            div[role="row"][aria-selected] .sort-play-like-button[aria-checked="true"] {
                opacity: 1 !important;
            }
        `;
        document.head.appendChild(style);
    }

    let likeButton_likedTracksIdsISRCs = new Map(); 
    let likeButton_likedTracksISRCs = new Set(likeButton_likedTracksIdsISRCs.values());
    var proxy_likeButton_likedTracksIdsISRCs;
    var likeButton_likedTracksChangeEvent = new CustomEvent('likeButton_likedTracksChange');

    async function likeButton_initiateLikedSongs() {
        if (!Spicetify.Platform?.LibraryAPI?.getTracks) {
            setTimeout(likeButton_initiateLikedSongs, 100);
            return;
        }

        let likedTracksData;
        try {
            likedTracksData = await Spicetify.Platform.LibraryAPI.getTracks({
                limit: Number.MAX_SAFE_INTEGER,
            });
        } catch (error) {
            console.error("[Sort-Play Like Button] Error fetching liked songs via LibraryAPI:", error);
            setTimeout(likeButton_initiateLikedSongs, 30000);
            return;
        }

        if (!likedTracksData || !likedTracksData.items || likedTracksData.items.length === 0) {
            setTimeout(likeButton_initiateLikedSongs, 5000);
            return;
        }

        let likedTracksIds = likedTracksData.items.map(item => item.uri.replace("spotify:track:", ""));

        let newLikedTracksIdsISRCs = new Map();
        let likedTracksIdsWithUnknownISRCs = [];

        likedTracksIds.forEach(trackId => {
            const trackIsrc = localStorage.getItem("sort-play-like-" + trackId)
            if (trackIsrc != null) {
                newLikedTracksIdsISRCs.set(trackId, trackIsrc)
            } else if (!trackId.startsWith("spotify:local:")) {
                likedTracksIdsWithUnknownISRCs.push(trackId);
            }
        });

        let promises = [];
        for (let i = 0; i < likedTracksIdsWithUnknownISRCs.length; i += 50) {
            let batch = likedTracksIdsWithUnknownISRCs.slice(i, i + 50);
            promises.push(
                Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/tracks?ids=${batch.join(",")}`).then(response => {
                    if (response && response.tracks) {
                        response.tracks.forEach(track => {
                            if (track && track.external_ids && track.external_ids.isrc) {
                                newLikedTracksIdsISRCs.set(track.id, track.external_ids.isrc);
                                localStorage.setItem("sort-play-like-" + track.id, track.external_ids.isrc);
                            }
                        });
                    }
                }).catch(error => {
                    console.error("[Sort-Play Like Button] Error fetching track details for ISRC:", error);
                })
            );
        }
        await Promise.all(promises);

        likeButton_likedTracksIdsISRCs = newLikedTracksIdsISRCs;
        likeButton_likedTracksISRCs = new Set(likeButton_likedTracksIdsISRCs.values());

        proxy_likeButton_likedTracksIdsISRCs = new Proxy(likeButton_likedTracksIdsISRCs, {
            get: function (target, property, receiver) {
                if (['set', 'delete'].includes(property) && typeof target[property] === 'function') {
                    return function (...args) {
                        const result = target[property].apply(target, args);
                        likeButton_likedTracksISRCs = new Set(likeButton_likedTracksIdsISRCs.values());
                        document.dispatchEvent(likeButton_likedTracksChangeEvent);
                        return result;
                    };
                }
                return Reflect.get(target, property, receiver);
            }
        });

        document.dispatchEvent(likeButton_likedTracksChangeEvent);
        setTimeout(likeButton_initiateLikedSongs, 30000);
    }

    const LikeButton = Spicetify.React.memo(function LikeButton({ uri, classList, size = 16, dynamicSizeSelector = null }) {
        const trackId = uri.replace("spotify:track:", "");
        const [currentSize, setCurrentSize] = Spicetify.React.useState(size);
        const [isrc, setISRC] = Spicetify.React.useState(localStorage.getItem("sort-play-like-" + trackId));
        const [isLiked, setIsLiked] = Spicetify.React.useState(likeButton_likedTracksIdsISRCs.has(trackId));
        const [hasISRCLiked, setHasISRCLiked] = Spicetify.React.useState(likeButton_likedTracksISRCs.has(isrc));
        const [isHovered, setIsHovered] = Spicetify.React.useState(false);
        const buttonRef = Spicetify.React.useRef(null);
    
        const [isTooltipVisible, setIsTooltipVisible] = Spicetify.React.useState(false);
        const tooltipTimeoutRef = Spicetify.React.useRef(null);
        const tooltipRef = Spicetify.React.useRef(null);
        const tooltipCheckIntervalRef = Spicetify.React.useRef(null);
    
        const tooltipContent = isLiked ? "Remove from Liked Songs" : hasISRCLiked ? "You've already liked another version." : "Add to Liked Songs";

        Spicetify.React.useEffect(() => {
            return () => {
                clearTimeout(tooltipTimeoutRef.current);
                clearInterval(tooltipCheckIntervalRef.current);
                const tooltipNode = tooltipRef.current;
                if (tooltipNode && tooltipNode.parentNode) {
                    tooltipNode.parentNode.removeChild(tooltipNode);
                }
            };
        }, []);

        Spicetify.React.useEffect(() => {
            if (isTooltipVisible) {
                if (buttonRef.current && tooltipRef.current) {
                    const buttonRect = buttonRef.current.getBoundingClientRect();
                    const tooltip = tooltipRef.current;
                    const tooltipRect = tooltip.getBoundingClientRect();
                    const viewportWidth = window.innerWidth;
                    const margin = 8;

                    tooltip.style.top = `${buttonRect.top - tooltipRect.height - 8}px`;
                    let idealLeft = buttonRect.left + (buttonRect.width / 2) - (tooltipRect.width / 2);
                    
                    if (idealLeft < margin) idealLeft = margin;
                    else if (idealLeft + tooltipRect.width > viewportWidth - margin) idealLeft = viewportWidth - tooltipRect.width - margin;

                    tooltip.style.left = `${idealLeft}px`;
                    
                    const timeoutId = setTimeout(() => tooltip.classList.add('visible'), 10);
                    
                    tooltipCheckIntervalRef.current = setInterval(() => {
                        if (!buttonRef.current || !document.body.contains(buttonRef.current)) {
                            setIsTooltipVisible(false);
                        }
                    }, 150);

                    return () => clearTimeout(timeoutId);
                }
            } else {
                clearInterval(tooltipCheckIntervalRef.current);
                if (tooltipRef.current) {
                    tooltipRef.current.classList.remove('visible');
                }
            }
        }, [isTooltipVisible]);
    
        Spicetify.React.useEffect(() => {
            if (!dynamicSizeSelector) return;

            const referenceElement = document.querySelector(dynamicSizeSelector);
            if (!referenceElement) return;

            const resizeObserver = new ResizeObserver(entries => {
                for (let entry of entries) {
                    const newSize = entry.contentRect.height || entry.contentRect.width;
                    if (newSize > 0) {
                        setCurrentSize(newSize);
                    }
                }
            });

            resizeObserver.observe(referenceElement);

            const initialSize = referenceElement.getBoundingClientRect().height;
            if (initialSize > 0) {
                setCurrentSize(initialSize);
            }

            return () => resizeObserver.disconnect();
        }, [dynamicSizeSelector]);


        Spicetify.React.useEffect(() => {
            async function initISRC() {
                try {
                    if (isrc == null && trackId) {
                        let track = await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/tracks/${trackId}`);
                        if (track && track.external_ids && track.external_ids.isrc) {
                            setISRC(track.external_ids.isrc);
                            localStorage.setItem("sort-play-like-" + track.id, track.external_ids.isrc);
                            setHasISRCLiked(likeButton_likedTracksISRCs.has(track.external_ids.isrc));
                        }
                    } else {
                        setHasISRCLiked(likeButton_likedTracksISRCs.has(isrc));
                    }
                } catch (error) {
                    console.error('[Sort-Play Like Button] Error fetching ISRC:', error);
                }
            };
            initISRC();
        }, [isLiked, hasISRCLiked, trackId]);
    
        const handleLikedTracksChange = () => {
            setIsLiked(likeButton_likedTracksIdsISRCs.has(trackId));
            setHasISRCLiked(likeButton_likedTracksISRCs.has(isrc));
        };
    
        Spicetify.React.useEffect(() => {
            document.addEventListener('likeButton_likedTracksChange', handleLikedTracksChange);
            return () => {
                document.removeEventListener('likeButton_likedTracksChange', handleLikedTracksChange);
            };
        }, [isrc, trackId]);
    
        const handleClick = async function () {
            if (!Spicetify.Platform?.LibraryAPI?.add || !Spicetify.Platform?.LibraryAPI?.remove) {
                Spicetify.showNotification("Library API not available.", true);
                console.error("[Sort-Play Like Button] Spicetify.Platform.LibraryAPI.add/remove is not available.");
                return;
            }
            if (isLiked) {
                try {
                    await Spicetify.Platform.LibraryAPI.remove({ uris: [uri] });
                    proxy_likeButton_likedTracksIdsISRCs.delete(trackId);
                } catch (error) {
                    console.error('[Sort-Play Like Button] Error unliking track with LibraryAPI:', error);
                    Spicetify.showNotification("Failed to unlike song.", true);
                }
            } else {
                try {
                    await Spicetify.Platform.LibraryAPI.add({ uris: [uri] });
                    if (isrc) {
                        proxy_likeButton_likedTracksIdsISRCs.set(trackId, isrc);
                    }
                } catch (error) {
                    console.error('[Sort-Play Like Button] Error liking track with LibraryAPI:', error);
                    Spicetify.showNotification("Failed to like song.", true);
                }
            }
        };
    
        const finalClassName = `${classList} sort-play-like-button`;

        return Spicetify.React.createElement(Spicetify.React.Fragment, null,
            Spicetify.React.createElement("button", {
                ref: buttonRef,
                className: finalClassName,
                title: "",
                "aria-label": tooltipContent,
                "aria-checked": isLiked || hasISRCLiked,
                onClick: handleClick,
                onMouseEnter: () => {
                    setIsHovered(true);
                    clearTimeout(tooltipTimeoutRef.current);
                    tooltipTimeoutRef.current = setTimeout(() => {
                        setIsTooltipVisible(true);
                    }, 250);
                },
                onMouseLeave: () => {
                    setIsHovered(false);
                    clearTimeout(tooltipTimeoutRef.current);
                    setIsTooltipVisible(false);
                },
                style: { marginRight: "12px" }
            }, Spicetify.React.createElement("span", {
                className: "Wrapper-sm-only Wrapper-small-only",
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }
            }, Spicetify.React.createElement("svg", {
                role: "img", height: currentSize, width: currentSize, viewBox: "0 0 16 16",
                className: (isLiked || hasISRCLiked) ? "Svg-sc-ytk21e-0 Svg-img-icon-small-textBrightAccent" : "Svg-sc-ytk21e-0 Svg-img-icon-small",
                style: {
                    fill: (isLiked || hasISRCLiked) ? "var(--text-bright-accent)" : "var(--text-subdued)",
                    filter: isHovered ? 'brightness(1.1)' : 'none',
                    transition: 'filter 0.1s ease-in-out'
                },
                dangerouslySetInnerHTML: {
                    __html: isLiked
                        ? LIKE_BUTTON_ICON_LIKED
                        : (hasISRCLiked
                            ? LIKE_BUTTON_ICON_ISRC_LIKED
                            : LIKE_BUTTON_ICON_NOT_LIKED)
                }
            }))),
            isTooltipVisible && Spicetify.ReactDOM.createPortal(
                Spicetify.React.createElement("div", {
                    ref: tooltipRef,
                    className: "like-button-tooltip",
                    style: { position: 'fixed' }
                }, tooltipContent),
                document.body
            )
        );
    });

    let mountLikeButton_debounceTimer = null;
    let mountLikeButton_isRunning = false;
    let mountLikeButton_failedAttempts = 0;
    
    async function mountLikeButton(isDebounced = false) {
        if (!isDebounced) {
            clearTimeout(mountLikeButton_debounceTimer);
            mountLikeButton_debounceTimer = setTimeout(() => {
                mountLikeButton(true);
            }, 300);
            return;
        }
    
        if (mountLikeButton_isRunning) {
            return;
        }
        mountLikeButton_isRunning = true;
    
        const MAX_RETRIES = 10;
        let retryDelay = 250;
    
        try {
            const uri = Spicetify.Player.data?.item?.uri || "";
            const nowPlayingWidget = document.querySelector(".main-nowPlayingWidget-nowPlaying");
            let container = nowPlayingWidget ? nowPlayingWidget.querySelector(".likeControl-wrapper") : null;

            if (!uri || !uri.startsWith("spotify:track:")) {
                if (container) {
                    Spicetify.ReactDOM.unmountComponentAtNode(container);
                }
                mountLikeButton_isRunning = false;
                return;
            }

            for (let i = 0; i < MAX_RETRIES; i++) {
                if (!nowPlayingWidget) {
                    console.warn(`[Sort-Play Like Button] Retry ${i + 1}: Now playing widget not found`);
                    await new Promise(resolve => setTimeout(resolve, retryDelay));
                    retryDelay = Math.min(retryDelay * 2, 3000);
                    continue;
                }
    
                const nativeLikeButton = nowPlayingWidget.querySelector('button[aria-label*="Liked Songs"], button[aria-label*="Add to playlist"]');
                if (!nativeLikeButton || !nativeLikeButton.parentNode) {
                    console.warn(`[Sort-Play Like Button] Retry ${i + 1}: Native like button not found or has no parent`);
                    await new Promise(resolve => setTimeout(resolve, retryDelay));
                    retryDelay = Math.min(retryDelay * 2, 3000);
                    continue;
                }
                
                container = nowPlayingWidget.querySelector(".likeControl-wrapper");
                
                if (container && container.dataset.renderedUri === uri && container.firstChild) {
                    mountLikeButton_failedAttempts = 0;
                    mountLikeButton_isRunning = false;
                    return;
                }
                
                if (container && container.dataset.renderedUri !== uri) {
                }
                
                if (!container) {
                    container = document.createElement("div");
                    container.className = "likeControl-wrapper";
                    
                    const currentNativeLikeButton = nowPlayingWidget.querySelector('button[aria-label*="Liked Songs"], button[aria-label*="Add to playlist"]');
                    if (!currentNativeLikeButton || !currentNativeLikeButton.parentNode) {
                        console.warn(`[Sort-Play Like Button] Retry ${i + 1}: Native button parent disappeared before insertion`);
                        await new Promise(resolve => setTimeout(resolve, retryDelay));
                        retryDelay = Math.min(retryDelay * 2, 3000);
                        continue;
                    }
                    
                    try {
                        currentNativeLikeButton.parentNode.insertBefore(container, currentNativeLikeButton.nextSibling);
                    } catch (error) {
                        console.error(`[Sort-Play Like Button] Retry ${i + 1}: Failed to insert like button wrapper`, error);
                        await new Promise(resolve => setTimeout(resolve, retryDelay));
                        retryDelay = Math.min(retryDelay * 2, 3000);
                        continue;
                    }
                }
                
                try {
                    const currentNativeLikeButton = nowPlayingWidget.querySelector('button[aria-label*="Liked Songs"], button[aria-label*="Add to playlist"]');
                    if (!currentNativeLikeButton) {
                        console.warn(`[Sort-Play Like Button] Retry ${i + 1}: Native button disappeared before render`);
                        await new Promise(resolve => setTimeout(resolve, retryDelay));
                        retryDelay = Math.min(retryDelay * 2, 3000);
                        continue;
                    }
                    
                    Spicetify.ReactDOM.render(
                        Spicetify.React.createElement(LikeButton, { 
                            uri: uri, 
                            key: uri, 
                            classList: currentNativeLikeButton.className 
                        }), 
                        container
                    );
                    
                    await new Promise(resolve => setTimeout(resolve, 50));
                    
                    if (!container.firstChild) {
                        console.error(`[Sort-Play Like Button] Retry ${i + 1}: React render completed but no child element found`);
                        await new Promise(resolve => setTimeout(resolve, retryDelay));
                        retryDelay = Math.min(retryDelay * 2, 3000);
                        continue;
                    }
                    
                    container.dataset.renderedUri = uri;
                    container.firstChild.style.marginRight = "0px";
                    
                    mountLikeButton_failedAttempts = 0;
                    mountLikeButton_isRunning = false;
                    return;
                    
                } catch (error) {
                    console.error(`[Sort-Play Like Button] Retry ${i + 1}: React render error`, error);
                    await new Promise(resolve => setTimeout(resolve, retryDelay));
                    retryDelay = Math.min(retryDelay * 2, 3000);
                    continue;
                }
            }
    
            mountLikeButton_failedAttempts++;
            console.error(`[Sort-Play Like Button] Failed to mount like button after ${MAX_RETRIES} retries. Failed attempts: ${mountLikeButton_failedAttempts}`);
            
            if (mountLikeButton_failedAttempts < 3) {
                console.log(`[Sort-Play Like Button] Scheduling retry in 2 seconds...`);
                setTimeout(() => mountLikeButton(true), 2000);
            }
        } finally {
            mountLikeButton_isRunning = false;
        }
    }

    async function mountLikeButtonNowPlayingView() {
        const MAX_RETRIES = 15;
        let retryDelay = 250;
    
        const uri = Spicetify.Player.data?.item?.uri || "";
        
        if (!uri || !uri.startsWith("spotify:track:")) {
            const nowPlayingView = document.querySelector(".main-nowPlayingView-contextItemInfo");
            const container = nowPlayingView ? nowPlayingView.querySelector(".likeControl-wrapper-npv") : null;
            if (container) {
                Spicetify.ReactDOM.unmountComponentAtNode(container);
            }
            return;
        }
    
        for (let i = 0; i < MAX_RETRIES; i++) {
            const nowPlayingView = document.querySelector(".main-nowPlayingView-contextItemInfo");
            
            if (!nowPlayingView) {
                await new Promise(resolve => setTimeout(resolve, retryDelay));
                retryDelay = Math.min(retryDelay * 2, 3000);
                continue;
            }
    
            const addToPlaylistButtonWrapper = nowPlayingView.querySelector('.CAVVGuPYPRDhrbGiFOc1');
            if (!addToPlaylistButtonWrapper || !addToPlaylistButtonWrapper.parentElement) {
                console.warn(`[Sort-Play Like Button NPV] Retry ${i + 1}: Add to playlist button wrapper not found or has no parent`);
                await new Promise(resolve => setTimeout(resolve, retryDelay));
                retryDelay = Math.min(retryDelay * 2, 3000);
                continue;
            }
    
            const templateButton = nowPlayingView.querySelector('button[aria-label="Copy link to Song"]') || nowPlayingView.querySelector('.CAVVGuPYPRDhrbGiFOc1 button');
            if (!templateButton) {
                console.warn(`[Sort-Play Like Button NPV] Retry ${i + 1}: Template button not found`);
                await new Promise(resolve => setTimeout(resolve, retryDelay));
                retryDelay = Math.min(retryDelay * 2, 3000);
                continue;
            }
    
            let container = nowPlayingView.querySelector(".likeControl-wrapper-npv");
            if (!container) {
                container = document.createElement("div");
                container.className = "likeControl-wrapper-npv";
                container.style.display = "contents";
                try {
                    addToPlaylistButtonWrapper.parentElement.insertBefore(container, addToPlaylistButtonWrapper);
                } catch (error) {
                    console.error(`[Sort-Play Like Button NPV] Retry ${i + 1}: Failed to insert like button wrapper`, error);
                    await new Promise(resolve => setTimeout(resolve, retryDelay));
                    retryDelay = Math.min(retryDelay * 2, 3000);
                    continue;
                }
            }
    
            if (container.dataset.renderedUri === uri && container.firstChild) {
                return;
            }
    
            const dynamicSizeSelector = '.CAVVGuPYPRDhrbGiFOc1 button svg';
    
            try {
                Spicetify.ReactDOM.render(
                    Spicetify.React.createElement(LikeButton, {
                        uri: uri,
                        key: uri,
                        classList: templateButton.className,
                        size: 21,
                        dynamicSizeSelector: dynamicSizeSelector
                    }),
                    container
                );
                
                await new Promise(resolve => setTimeout(resolve, 50));
                
                if (!container.firstChild) {
                    console.error(`[Sort-Play Like Button NPV] Retry ${i + 1}: React render completed but no child element found`);
                    await new Promise(resolve => setTimeout(resolve, retryDelay));
                    retryDelay = Math.min(retryDelay * 2, 3000);
                    continue;
                }
                
                container.dataset.renderedUri = uri;
                container.firstChild.style.marginRight = "0px";
                container.firstChild.style.marginLeft = "12px";
                
                return;
                
            } catch (error) {
                console.error(`[Sort-Play Like Button NPV] Retry ${i + 1}: React render error`, error);
                await new Promise(resolve => setTimeout(resolve, retryDelay));
                retryDelay = Math.min(retryDelay * 2, 3000);
                continue;
            }
        }
    
        console.error(`[Sort-Play Like Button NPV] Failed to mount like button in Now Playing View after ${MAX_RETRIES} retries.`);
    }
    
    (async function initialize() {
        await likeButton_initiateLikedSongs();
    
        while (!Spicetify?.Player?.data?.item || !document.querySelector(".main-nowPlayingWidget-nowPlaying")) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        await new Promise(resolve => setTimeout(resolve, 500));
    
        await mountLikeButton();
        await mountLikeButtonNowPlayingView();
    
        Spicetify.Player.addEventListener("songchange", () => {
            mountLikeButton();
            mountLikeButtonNowPlayingView();
        });
    })();

    function likeButton_findVal(obj, key, maxDepth = 15, visited = new Set()) {
        if (!obj || typeof obj !== 'object' || maxDepth <= 0 || visited.has(obj)) return undefined;
        visited.add(obj);
        if (obj.hasOwnProperty(key)) return obj[key];
        for (const k in obj) {
            if (obj.hasOwnProperty(k)) {
                const result = likeButton_findVal(obj[k], key, maxDepth - 1, visited);
                if (result !== undefined) return result;
            }
        }
        return undefined;
    }

    const likeButton_addLikeButtonToRow = (row) => {
        if (row.classList.contains("sort-play-like-button-injected")) return;
        const actionButtonsContainer = Array.from(row.querySelectorAll('div[role="gridcell"]')).pop();
        if (!actionButtonsContainer) return;
        if (actionButtonsContainer.querySelector(".likeControl-wrapper")) {
            row.classList.add("sort-play-like-button-injected");
            return;
        }
        const entryPoint = actionButtonsContainer.querySelector("button:not(:last-of-type)");
        if (!entryPoint) return;
        const reactPropsKey = Object.keys(row).find(key => key.startsWith("__reactProps$"));
        if (!reactPropsKey) return;
        const uri = likeButton_findVal(row[reactPropsKey], "uri");
        if (!uri || !uri.startsWith("spotify:track:")) return;
        row.classList.add("sort-play-like-button-injected");
        const likeButtonWrapper = document.createElement("div");
        likeButtonWrapper.className = "likeControl-wrapper";
        likeButtonWrapper.style.display = "contents";
        const likeButtonElement = entryPoint.parentElement.insertBefore(likeButtonWrapper, entryPoint);
        Spicetify.ReactDOM.render(Spicetify.React.createElement(LikeButton, { uri, classList: entryPoint.className }), likeButtonElement);
    };

    let likeButton_tracklistObserver;
    const likeButton_processTracklist = (mainView) => {
        const tracklist = mainView.querySelector(".main-trackList-indexable, div[data-testid='track-list'], div[aria-label='Songs search results']");
        if (tracklist) {
            tracklist.querySelectorAll('.main-trackList-trackListRow, div[role="row"][aria-selected]').forEach(likeButton_addLikeButtonToRow);
        }
    };

    let likeButton_observerInitialized = false;

    likeButton_connectObserver = () => {
        if (likeButton_observerInitialized) {
            return;
        }
                
        if (likeButton_tracklistObserver) {
            likeButton_tracklistObserver.disconnect();
        }
        const mainView = document.querySelector("main");
        if (!mainView) {
            setTimeout(likeButton_connectObserver, 250);
            return;
        }
    
        likeButton_processTracklist(mainView);
        mountLikeButton();
        mountLikeButtonNowPlayingView();
    
        likeButton_tracklistObserver = new MutationObserver((mutations) => {
            if (document.querySelector(".main-nowPlayingWidget-nowPlaying") && !document.querySelector(".likeControl-wrapper")) {
                mountLikeButton();
            }
            
            const nowPlayingView = document.querySelector(".main-nowPlayingView-contextItemInfo");
            if (nowPlayingView) {
                mountLikeButtonNowPlayingView();
            }
    
            for (const mutation of mutations) {
                if (mutation.target.closest && mutation.target.closest('.likeControl-wrapper-npv')) {
                    continue;
                }
                
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.classList && node.classList.contains('likeControl-wrapper-npv')) {
                            continue;
                        }
                        if (node.matches('.main-trackList-trackListRow, div[role="row"][aria-selected]')) {
                            likeButton_addLikeButtonToRow(node);
                        } else {
                            node.querySelectorAll('.main-trackList-trackListRow, div[role="row"][aria-selected]').forEach(likeButton_addLikeButtonToRow);
                        }
                    }
                }
            }
        });
    
        likeButton_tracklistObserver.observe(mainView, { childList: true, subtree: true });
        likeButton_observerInitialized = true;
      };
  }

  function onPageChange() {
    if (tracklistObserver) tracklistObserver.disconnect();
    if (albumTracklistObserver) albumTracklistObserver.disconnect();
    if (artistTracklistObserver) artistTracklistObserver.disconnect();
    
    insertButton();
    const currentUri = getCurrentUri();
    const path = Spicetify.Platform.History.location?.pathname;
    const isSearchPage = path && path.startsWith('/search');

    if (!currentUri && !isSearchPage) {
        return;
    }

    likeButton_connectObserver();

    if (currentUri) {
        if (URI.isPlaylistV1OrV2(currentUri) || isLikedSongsPage(currentUri)) {
            initializeTracklistObserver();
        } else if (URI.isAlbum(currentUri)) {
            initializeAlbumTracklistObserver();
        } else if (URI.isArtist(currentUri)) {
            initializeArtistTracklistObserver();
        }
    }
  }

  const mainPageObserver = new MutationObserver(onPageChange);

  mainPageObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });

  Spicetify.Platform.History.listen(onPageChange);

  const themeObserver = new MutationObserver(() => {
    requestAnimationFrame(() => {
      applyCurrentThemeColors();
    });
  });
  
  themeObserver.observe(document.body, {
    attributes: true,
    attributeFilter: ['class'],
  });

  const startupInterval = setInterval(() => {
    if (Spicetify.Player?.data) {
      clearInterval(startupInterval);
      applyCurrentThemeColors();
    }
  }, 100);

  loadSettings();
  fetchUserMarket();
  initializePlayCountCache();
  initializeReleaseDateCache();
  initializeScrobblesCache();
  initializePersonalScrobblesCache();
  initializePaletteAnalysisCache();

  if (showLikeButton) {
    initializeLikeButtonFeature();
  }
  
  startScheduler();
  initializeSongChangeWatcher();
  Spicetify.Player.addEventListener("songchange", displayNowPlayingData);
  displayNowPlayingData();
  console.log(`Sort-Play loaded`);
  onPageChange();
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = main;
  } else {
    await main();
  }
})();
