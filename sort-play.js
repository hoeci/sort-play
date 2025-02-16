(async function () {
  async function main() {
  const { React, ReactDOM, URI, GraphQL, Platform } = Spicetify;
  if (!React || !ReactDOM || !GraphQL || !Platform) {
    setTimeout(main, 10);
    return;
  }

  const SORT_PLAY_VERSION = "3.1.1";

  const { PlaylistAPI } = Platform;

  const LFMApiKey = "***REMOVED***";
  
  const STORAGE_KEY_LASTFM_USERNAME = "sort-play-lastfm-username";

  let columnPlayCount = false;
  let removeDateAdded = false;
  let playlistDeduplicate = true;
  let showRemovedDuplicates = false;
  let includeSongStats = true;
  let includeLyrics = true;
  let matchAllGenres  = false;
  let selectedAiModel = "gemini-2.0-flash-exp";
  const STORAGE_KEY_GENRE_FILTER_SORT = "sort-play-genre-filter-sort";
  
  const STORAGE_KEY_USER_SYSTEM_INSTRUCTION = "sort-play-user-system-instruction";

  const DEFAULT_USER_SYSTEM_INSTRUCTION = `You are a music expert tasked with providing a list of Spotify track URIs that best match a user request. Based on the provided playlist or artist discography. Carefully analyze and utilize all provided information about each track, including song statistics, lyrics, and any other available data, to make the best possible selections.
  - Prioritize tracks based on their relevance to the user's request, considering mood, themes, genres, and lyrical content.
  - Order the URIs by how closely each track aligns with the overall intent of the request.`;

  const FIXED_SYSTEM_INSTRUCTION = `
  Output:
  - Only provide a raw list of Spotify track URIs (e.g., spotify:track:123, spotify:track:456).
  - Do not include any additional text, explanations, or formatting.`;

  function loadSettings() {
    columnPlayCount = localStorage.getItem("sort-play-column-play-count") === "true";
    removeDateAdded = localStorage.getItem("sort-play-remove-date-added") === "true";
    playlistDeduplicate = localStorage.getItem("sort-play-playlist-deduplicate") !== "false";
    showRemovedDuplicates = localStorage.getItem("sort-play-show-removed-duplicates") === "true";
    includeSongStats = localStorage.getItem("sort-play-include-song-stats") !== "false";
    includeLyrics = localStorage.getItem("sort-play-include-lyrics") !== "false";
    selectedAiModel = localStorage.getItem("sort-play-ai-model") || "gemini-2.0-flash-exp";
    userSystemInstruction = localStorage.getItem(STORAGE_KEY_USER_SYSTEM_INSTRUCTION) || DEFAULT_USER_SYSTEM_INSTRUCTION;
    matchAllGenres = localStorage.getItem("sort-play-match-all-genres") === "true";
  }
  function saveSettings() {
    localStorage.setItem("sort-play-column-play-count", columnPlayCount);
    localStorage.setItem("sort-play-remove-date-added", removeDateAdded);
    localStorage.setItem("sort-play-playlist-deduplicate", playlistDeduplicate);
    localStorage.setItem("sort-play-show-removed-duplicates", showRemovedDuplicates);
    localStorage.setItem("sort-play-include-song-stats", includeSongStats);
    localStorage.setItem("sort-play-include-lyrics", includeLyrics);
    localStorage.setItem("sort-play-ai-model", selectedAiModel);
    localStorage.setItem(STORAGE_KEY_USER_SYSTEM_INSTRUCTION, userSystemInstruction);
    localStorage.setItem("sort-play-match-all-genres", matchAllGenres);
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
  
    try {
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
      manageCacheSize();
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        clearOldCaches();
        try {
          localStorage.setItem(cacheKey, JSON.stringify(cacheData));
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
  
  function manageCacheSize() {
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
  
    if (cacheSize > AI_DATA_MAX_CACHE_SIZE_BYTES) {
      cacheItems.sort((a, b) => a.timestamp - b.timestamp);
      
      let removedSize = 0;
      for (const item of cacheItems) {
        localStorage.removeItem(item.key);
        removedSize += item.size;
        if (cacheSize - removedSize <= AI_DATA_MAX_CACHE_SIZE_BYTES) {
          break;
        }
      }
    }
  }

  const DefaultGeminiApiKeys = [
    "***REMOVED***",
    "***REMOVED***",
    "***REMOVED***",
    "***REMOVED***"
  ];
  
  function getRandomDefaultApiKey() {
    const randomIndex = Math.floor(Math.random() * DefaultGeminiApiKeys.length);
    return DefaultGeminiApiKeys[randomIndex];
  }
  
  let googleAiSdk = null;
  async function loadGoogleAI() {
    if (googleAiSdk) {
      return googleAiSdk;
    }
    
    try {
      const response = await fetch("https://cdn.jsdelivr.net/npm/@google/generative-ai@0.21.0/dist/index.min.js");
      const sdkText = await response.text();
      const moduleScope = {};
      const wrappedCode = `
        (function(exports) {
          ${sdkText}
          return exports;
        })(this);
      `;
      const sdkExports = new Function(wrappedCode).call(moduleScope);
      googleAiSdk = moduleScope.GoogleGenerativeAI || moduleScope.GenerativeAI;
      if (!googleAiSdk) {
        throw new Error('SDK constructor not found in loaded script');
      }
      
      return googleAiSdk;
    } catch (error) {
      console.error('Error loading SDK:', error);
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
    
    if (isMenuOpen) {
      toggleMenu();
      isButtonClicked = false;
      mainButton.style.backgroundColor = buttonStyles.main.backgroundColor;
      mainButton.style.color = buttonStyles.main.color;
      svgElement.style.fill = buttonStyles.main.color;
      mainButton.style.filter = "brightness(1)";
    }

    const modalContainerElement = document.querySelector(".main-popupModal-container");
    if (modalContainerElement) {
      modalContainerElement.style.zIndex = "2000";
    }
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

  function showSettingsModal() {
    const modalContainer = document.createElement("div");
    modalContainer.className = "sort-play-settings";
    modalContainer.innerHTML = `
    <style>
    .main-embedWidgetGenerator-container {
      width: 550px !important;
      border-radius: 30px;
      overflow: hidden; 
    }
    .GenericModal__overlay .GenericModal {
      border-radius: 30px;
      overflow: hidden;
    }
    .main-trackCreditsModal-mainSection {
      overflow-y: hidden !important;
      padding: 16px 32px 0 32px;
    }
    .main-trackCreditsModal-header {
      padding: 27px 32px 12px !important;
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
    }
    .sort-play-settings .setting-row .col.action {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      text-align: right;
    }

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
    .sort-play-settings .main-popupModal-content {
        overflow-y: auto;
    }
    .sort-play-settings .switch {
        position: relative;
        display: inline-block;
        width: 40px;
        height: 24px;
    }
    .sort-play-settings .switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }
    .sort-play-settings .slider {
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
    .sort-play-settings .slider:before {
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
    .sort-play-settings input:checked + .slider {
        background-color: #1DB954;
    }
    .sort-play-settings input:checked + .slider:before {
        transform: translateX(16px);
    }
    .sort-play-settings .switch.disabled .slider {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .tooltip-container {
      position: relative;
      display: inline-block;
    }
    
    .custom-tooltip {
        visibility: hidden;
        position: absolute;
        z-index: 1;
        background-color: #282828;
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
        border-color: #282828 transparent transparent transparent;
    }
    
    .tooltip-container:hover .custom-tooltip {
        visibility: visible;
    }
    .version-tag {
      font-size: 14px;
      color: #888;
      margin-left: 12px;
      vertical-align: middle;
    }
    </style>
    <div style="display: flex; flex-direction: column; gap: 12px;">

    <div style="color: white; font-weight: bold; font-size: 18px; margin-top: 10px;">
        Playlist Column Options
    </div>
    <div style="border-bottom: 1px solid #555; margin-top: -3px;"></div>
  
    <div class="setting-row" id="columnPlayCount">
          <label class="col description">
              Play Count Column in Playlist
              <span class="tooltip-container">
                  <span style="color: #888; margin-left: 4px; font-size: 12px; cursor: help;">?</span>
                  <span class="custom-tooltip">Play counts are cached for 2 days</span>
              </span>
          </label>
        <div class="col action">
            <label class="switch">
                <input type="checkbox" ${columnPlayCount ? 'checked' : ''}>
                <span class="slider"></span>
            </label>
        </div>
    </div>
    <div class="setting-row" id="removeDateAdded">
        <label class="col description">Remove "Date Added" Column</label>
        <div class="col action">
            <label class="switch">
                <input type="checkbox" ${removeDateAdded ? 'checked' : ''}>
                <span class="slider"></span>
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
                <span class="slider"></span>
            </label>
        </div>
    </div>
    <div class="setting-row" id="showRemovedDuplicates">
        <label class="col description">Show Removed Duplicates</label>
        <div class="col action">
            <label class="switch">
                <input type="checkbox" ${showRemovedDuplicates ? 'checked' : ''}>
                <span class="slider"></span>
            </label>
        </div>
    </div>

    <div class="setting-row" id="githubLink" style="margin-top: 10px; justify-content: center;">
        <label class="col description" style="text-align: center; width: auto; float: none; padding: 0;">
            <a href="https://github.com/hoeci/sort-play" style="color: #1ED760; font-size: 14px; text-decoration: none;" target="_blank">Star on GitHub, report bugs, and suggest features!</a>
        </label>
    </div>
    </div>
    `;

    Spicetify.PopupModal.display({
        title: `<span style='font-size: 30px;'>Sort-Play Settings <span class='version-tag'>v${SORT_PLAY_VERSION}</span></span>`,
        content: modalContainer,
        isLarge: true,
    });

    if (isMenuOpen) {
        toggleMenu();
        isButtonClicked = false;
        mainButton.style.backgroundColor = buttonStyles.main.backgroundColor;
        mainButton.style.color = buttonStyles.main.color;
        svgElement.style.fill = buttonStyles.main.color;
        mainButton.style.filter = "brightness(1)";
    }

    const modalContainerElement = document.querySelector(".main-popupModal-container");
    if (modalContainerElement) {
        modalContainerElement.style.zIndex = "2000";
    }

    const columnPlayCountToggle = modalContainer.querySelector("#columnPlayCount input");
    const removeDateAddedToggle = modalContainer.querySelector("#removeDateAdded input");
    const playlistDeduplicateToggle = modalContainer.querySelector("#playlistDeduplicate input");
    const showRemovedDuplicatesToggle = modalContainer.querySelector("#showRemovedDuplicates input");

    removeDateAddedToggle.disabled = !columnPlayCount;
    removeDateAddedToggle.parentElement.classList.toggle("disabled", !columnPlayCount);

    setTimeout(() => {
        const sliders = modalContainer.querySelectorAll('.slider');
        sliders.forEach(slider => {
            slider.style.transition = '.3s';
        });
    }, 50);

    columnPlayCountToggle.addEventListener("change", () => {
        columnPlayCount = columnPlayCountToggle.checked;
        removeDateAddedToggle.disabled = !columnPlayCount;
        removeDateAddedToggle.parentElement.classList.toggle("disabled", !columnPlayCount);
        if (!columnPlayCount) {
            const oldRemoveDateAdded = removeDateAdded;
            removeDateAdded = false;
            removeDateAddedToggle.checked = false;
            saveSettings();
            removeDateAdded = oldRemoveDateAdded;
            saveSettings();
        } else {
            saveSettings();
        }
        updateTracklist();
    });

    removeDateAddedToggle.addEventListener("change", () => {
        if (columnPlayCount) {
            removeDateAdded = removeDateAddedToggle.checked;
            saveSettings();
            updateTracklist();
        }
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

  async function handleAiPick(tracks) {
    try {
        const tracksWithPlayCounts = await processBatchesWithDelay(
            tracks,
            200,
            1000,
            () => {},
            getTrackDetailsWithPlayCount
        );

        const tracksWithIds = await processBatchesWithDelay(
            tracksWithPlayCounts,
            200,
            1000,
            () => {},
            collectTrackIdsForPopularity
        );

        const tracksWithPopularity = await fetchPopularityForMultipleTracks(
            tracksWithIds,
            () => {}
        );

        let uniqueTracks;
        let removedTracks = [];
        const currentUri = getCurrentUri();

        if (!playlistDeduplicate && URI.isPlaylistV1OrV2(currentUri)) {
            uniqueTracks = tracksWithPopularity;
        } else {
            const deduplicationResult = deduplicateTracks(tracksWithPopularity);
            uniqueTracks = deduplicationResult.unique;
            removedTracks = deduplicationResult.removed;
        }

        return { uniqueTracks, removedTracks };
    } catch (error) {
        console.error("Error in handleAiPick:", error);
        throw error;
    }
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
        .ai-pick-modal .slider {
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
        .ai-pick-modal .slider:before {
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
        .ai-pick-modal input:checked + .slider {
          background-color: #1DB954;
        }
        .ai-pick-modal input:checked + .slider:before {
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
          font-size: 14px;
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
          background: transparent;
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
          background-color: #282828;
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
          border-color: #282828 transparent transparent transparent;
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
                  <span class="slider"></span>
                </label>
              </div>
            </div>
            
            <div class="setting-row" id="includeLyrics">
              <label class="description">Song Lyrics</label>
              <div class="action">
                <label class="switch">
                  <input type="checkbox" ${includeLyrics ? 'checked' : ''}>
                  <span class="slider"></span>
                </label>
              </div>
            </div>
          </div>
      
          <div class="settings-left-wrapper">
            <div class="model-row">
              <label style="color: white; display: block; margin-bottom: 9px; font-weight: bold; font-size: 14px;">AI Model:<span class="tooltip-container">
                <span style="color: #888; margin-left: 4px; font-size: 12px; cursor: help;">?</span>
                <span class="custom-tooltip">Free API Limits:<br>
                - Flash: 1M tokens/min<br>
                - Pro: 32K tokens/min<br><br>
                Pro models are best for up to ~180 songs (no lyrics included).
                </span></label>
              <select id="aiModel">
                <option value="gemini-2.0-pro-exp-02-05" ${selectedAiModel === "gemini-2.0-pro-exp-02-05" ? "selected" : ""}>Gemini 2.0 Pro Experimental</option>
                <option value="gemini-2.0-flash" ${selectedAiModel === "gemini-2.0-flash" ? "selected" : ""}>Gemini 2.0 Flash</option>
                <option value="gemini-2.0-flash-lite-preview-02-05" ${selectedAiModel === "gemini-2.0-flash-lite-preview-02-05" ? "selected" : ""}>Gemini 2.0 Flash-Lite Preview</option>
                <option value="gemini-2.0-flash-exp" ${selectedAiModel === "gemini-2.0-flash-exp" ? "selected" : ""}>Gemini 2.0 Flash Exp</option>
                <option value="gemini-1.5-pro" ${selectedAiModel === "gemini-1.5-pro" ? "selected" : ""}>Gemini 1.5 Pro</option>
                <option value="gemini-1.5-flash" ${selectedAiModel === "gemini-1.5-flash" ? "selected" : ""}>Gemini 1.5 Flash</option>
                <option value="gemini-1.5-flash-8b" ${selectedAiModel === "gemini-1.5-flash-8b" ? "selected" : ""}>Gemini 1.5 Flash-8B</option>
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
        userSystemInstruction = DEFAULT_USER_SYSTEM_INSTRUCTION;
        textArea.value = DEFAULT_USER_SYSTEM_INSTRUCTION;
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
      Spicetify.showNotification("System instruction saved");
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
  
      mainButton.disabled = true;
      mainButton.style.backgroundColor = buttonStyles.main.disabledBackgroundColor;
      mainButton.style.color = buttonStyles.main.disabledColor;
      mainButton.style.cursor = "default";
      svgElement.style.fill = buttonStyles.main.disabledColor;
      menuButtons.forEach((button) => (button.disabled = true));
  
      mainButton.innerHTML = '<div class="loader"></div>';
  
      try {
        const userApiKey = localStorage.getItem("sort-play-gemini-api-key") || getRandomDefaultApiKey();
  
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
  
        if (aiResponse && aiResponse.length > 0) {
          const sourceUri = getCurrentUri();
          const isArtistPage = URI.isArtist(sourceUri); 
          let sourceName;
          
          if (URI.isArtist(sourceUri)) {
              sourceName = await Spicetify.CosmosAsync.get(
                  `https://api.spotify.com/v1/artists/${sourceUri.split(":")[2]}`
              ).then((r) => r.name);
          } else if (isLikedSongsPage(sourceUri)) {
              sourceName = "Liked Songs";
          } else {
              sourceName = await Spicetify.CosmosAsync.get(
                  `https://api.spotify.com/v1/playlists/${sourceUri.split(":")[2]}`
              ).then((r) => r.name);
          }
  
          const possibleSuffixes = [
            "\\(PlayCount\\)",
            "\\(Popularity\\)",
            "\\(ReleaseDate\\)",
            "\\(LFM Scrobbles\\)",
            "\\(LFM My Scrobbles\\)",
            "\\(Shuffle\\)",
            "\\(AI Pick\\)",
          ];
          let suffixPattern = new RegExp(
            `\\s*(${possibleSuffixes.join("|")})\\s*`
          );
          while (suffixPattern.test(sourceName)) {
            sourceName = sourceName.replace(suffixPattern, "");
          }

          let playlistDescription;
          if (isArtistPage) {
            playlistDescription = `Tracks by ${sourceName}, picked by AI using Sort-Play for request: "${userPrompt}"`;
          } else {
            playlistDescription = `Tracks picked by AI using Sort-Play for request: "${userPrompt}"`;
          }
  
          const newPlaylist = await createPlaylist(
            `${sourceName} (AI Pick)`,
            playlistDescription 
          );
  
          const trackUris = aiResponse;
          await addTracksToPlaylist(newPlaylist.id, trackUris);
  
          Spicetify.showNotification(`AI Pick playlist created!`);
        } else {
          Spicetify.showNotification("AI did not return any track URIs.", true);
        }
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
  
  async function getTrackStats(trackId, maxRetries = 3, baseDelay = 1000) {
    let attempt = 0;
    
    while (attempt < maxRetries) {
      try {
        const audioFeaturesResponse = await Spicetify.CosmosAsync.get(
          `https://api.spotify.com/v1/audio-features/${trackId}`
        );
        
        const trackDetailsResponse = await Spicetify.CosmosAsync.get(
          `https://api.spotify.com/v1/tracks/${trackId}`
        );
  
        if (audioFeaturesResponse?.code === 429 || trackDetailsResponse?.code === 429) {
          attempt++;
          const waitTime = baseDelay * Math.pow(2, attempt - 1);
          console.warn(`Rate limit hit for track ${trackId}, retrying in ${waitTime}ms (attempt ${attempt}/${maxRetries})`);
          await delay(waitTime);
          continue;
        }
  
        if (audioFeaturesResponse?.code || trackDetailsResponse?.code) {
          console.warn(`Error responses:`, {
            audioFeatures: audioFeaturesResponse,
            trackDetails: trackDetailsResponse
          });
          throw new Error('Failed to fetch track data');
        }
  
        if (!audioFeaturesResponse || !trackDetailsResponse) {
          console.warn(`Missing data for track ${trackId}`);
          return null;
        }
  
        const pitchClasses = ["C", "C♯/D♭", "D", "D♯/E♭", "E", "F", "F♯/G♭", "G", "G♯/A♭", "A", "A♯/B♭", "B"];
        const keyText = audioFeaturesResponse.key === -1 ? "Undefined" : pitchClasses[audioFeaturesResponse.key];
  
        return {
          danceability: audioFeaturesResponse?.danceability ? Math.round(100 * audioFeaturesResponse.danceability) : null,
          energy: audioFeaturesResponse?.energy ? Math.round(100 * audioFeaturesResponse.energy) : null,
          key: keyText,
          loudness: audioFeaturesResponse?.loudness ?? null,
          speechiness: audioFeaturesResponse?.speechiness ? Math.round(100 * audioFeaturesResponse.speechiness) : null,
          acousticness: audioFeaturesResponse?.acousticness ? Math.round(100 * audioFeaturesResponse.acousticness) : null,
          instrumentalness: audioFeaturesResponse?.instrumentalness ? Math.round(100 * audioFeaturesResponse.instrumentalness) : null,
          liveness: audioFeaturesResponse?.liveness ? Math.round(100 * audioFeaturesResponse.liveness) : null,
          valence: audioFeaturesResponse?.valence ? Math.round(100 * audioFeaturesResponse.valence) : null,
          tempo: audioFeaturesResponse?.tempo ? Math.round(audioFeaturesResponse.tempo) : null,
          popularity: trackDetailsResponse?.popularity ?? null,
          releaseDate: trackDetailsResponse?.album?.release_date ?? null
        };
      } catch (error) {
        attempt++;
        
        if (attempt === maxRetries) {
          console.error(`Failed to fetch stats for track ${trackId} after ${maxRetries} attempts:`, error);
          return null;
        }
        
        const waitTime = baseDelay * Math.pow(2, attempt - 1);
        console.warn(`Attempt ${attempt}/${maxRetries} failed for track ${trackId}, retrying in ${waitTime}ms`);
        await delay(waitTime);
      }
    }
    
    return null;
  }

  async function fetchLyricsFromSpotify(trackId) {
    const result = {
      karaoke: null,
      synced: null,
      unsynced: null,
      provider: "Spotify",
      copyright: null,
    };
  
    const baseURL = "https://spclient.wg.spotify.com/color-lyrics/v2/track/";
    let body;
    try {
      body = await Spicetify.CosmosAsync.get(`${baseURL + trackId}?format=json&vocalRemoval=false&market=from_token`);
    } catch {
      return { error: "Request error", uri: `spotify:track:${trackId}` };
    }
  
    const lyrics = body.lyrics;
    if (!lyrics) {
      return { error: "No lyrics", uri: `spotify:track:${trackId}` };
    }
  
    const lines = lyrics.lines;
    if (lyrics.syncType === "LINE_SYNCED") {
      result.synced = lines.map((line) => ({
        startTime: line.startTimeMs,
        text: line.words,
      }));
      result.unsynced = result.synced;
    } else {
      result.unsynced = lines.map((line) => ({
        text: line.words,
      }));
    }
  
    result.provider = lyrics.provider;
  
    return result;
  }

  async function queryGeminiWithPlaylistTracks(tracks, userPrompt, apiKey, maxRetries = 3, initialDelay = 1000, includeSongStats = true, includeLyrics = true, modelName) {
    clearOldCaches();
    let retries = 0;
    let delay = initialDelay;
    let enrichedTracksCache = [];
    let tracksToProcess = [];

    for (const track of tracks) {
      const trackId = track.uri.split(":")[2];
      const cachedTrack = getTrackCache(trackId, includeSongStats, includeLyrics, modelName);
      
      if (cachedTrack) {
        enrichedTracksCache.push(cachedTrack);
      } else {
        tracksToProcess.push(track);
      }
    }
  
    while (retries < maxRetries) {
      try {
        if (tracksToProcess.length > 0) {
          const processedTracks = await processBatchWithRateLimit(
            tracksToProcess,
            6,
            700,
            async track => {
              const trackId = track.uri.split(":")[2];
              
              let stats = null;
              let playCount = null;
  
              if (includeSongStats) {
                stats = await getTrackStats(trackId);
                stats = stats || {
                  danceability: null,
                  energy: null,
                  key: "Undefined",
                  loudness: null,
                  speechiness: null,
                  acousticness: null,
                  instrumentalness: null,
                  liveness: null,
                  valence: null,
                  tempo: null,
                  popularity: null,
                  releaseDate: null
                };
                
                try {
                  const albumId = track.albumId || track.track?.album?.id;
                  if (albumId) {
                    const albumTracksWithPlayCounts = await getPlayCountsForAlbum(albumId);
                    const foundTrack = albumTracksWithPlayCounts.find(
                      (albumTrack) => albumTrack.uri === track.uri
                    );
                    if (foundTrack) {
                      playCount = foundTrack.playcount;
                    } else {
                      console.warn(`Could not find playcount for track ${track.uri} in album ${albumId}`);
                      playCount = "N/A";
                    }
                  } else {
                    console.warn(`Could not get album ID for track: ${track.uri}`);
                    playCount = "N/A";
                  }
                } catch (error) {
                  console.error(`Error getting playcount for track ${track.uri}: ${error}`);
                  playCount = "N/A";
                }
              }
              
              let lyrics = "Not included";
              if (includeLyrics) {
                const lyricsData = await fetchLyricsFromSpotify(trackId);
                lyrics = lyricsData && lyricsData.unsynced ? lyricsData.unsynced.map(line => line.text).join(' ') : "Not included";
              }
              
              const enrichedTrack = {
                song_title: track.songTitle || track.name || track.title,
                artist: track.artistName || track.artist,
                album: track.albumName,
                uri: track.uri
              };
  
              if (includeSongStats) {
                enrichedTrack.stats = {
                  popularity: stats.popularity,
                  playCount: playCount,
                  releaseDate: stats.releaseDate,
                  danceability: stats.danceability,
                  energy: stats.energy,
                  valence: stats.valence,
                  tempo: stats.tempo,
                  key: stats.key,
                  loudness: stats.loudness,
                  speechiness: stats.speechiness,
                  acousticness: stats.acousticness,
                  liveness: stats.liveness,
                  instrumentalness: stats.instrumentalness,
                };
              }
  
              if (includeLyrics) {
                enrichedTrack.lyrics = lyrics;
              }

              setTrackCache(trackId, enrichedTrack, includeSongStats, includeLyrics, modelName);
              
              return enrichedTrack;
            }
          );
  
          enrichedTracksCache = [...enrichedTracksCache, ...processedTracks];
        }
  
        const tracksWithStats = enrichedTracksCache.filter(track => track !== null);
  
        const GoogleAI = await loadGoogleAI();
      
        if (!GoogleAI) {
          throw new Error('Failed to load Google AI SDK');
        }
  
        const genAI = new GoogleAI(apiKey);
        const model = genAI.getGenerativeModel({ model: modelName });
  
        const userSystemInstruction = localStorage.getItem(STORAGE_KEY_USER_SYSTEM_INSTRUCTION) || DEFAULT_USER_SYSTEM_INSTRUCTION;
        const combinedSystemInstruction = `${userSystemInstruction}\n${FIXED_SYSTEM_INSTRUCTION}`;
    
        const userMessage = `Playlist Tracks:\n${JSON.stringify(tracksWithStats, null, 2)}\n\nUser Request: ${userPrompt}\n\nGIVE PICKED TRACK URI's`;
  
        const parts = [
          { text: combinedSystemInstruction },
          { text: userMessage } 
        ];
  
        const result = await model.generateContentStream({
          contents: [{ role: "user", parts }],
          generationConfig: {
            temperature: 0.9,
            topK: 1,
            topP: 1,
            maxOutputTokens: 2048,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_NONE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_NONE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_NONE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_NONE"
            },
            {
              category: "HARM_CATEGORY_CIVIC_INTEGRITY",
              threshold: "BLOCK_NONE"
            }
          ]
        });
  
        let responseText = '';
        for await (const chunk of result.stream) {
          responseText += chunk.text();
        }
    
        if (result.response?.promptFeedback?.blockReason) {
          throw new Error(`Blocked for ${result.response.promptFeedback.blockReason}`);
        }
  
        const uriRegex = /spotify:track:[a-zA-Z0-9]+/g;
        let matches = responseText.match(uriRegex);
  
        if (!matches) {
          console.log("No Spotify track URIs found in AI response.");
          return [];
        }
        
        matches = matches.filter(uri => uri.length === 22 + "spotify:track:".length);
  
        if (matches.length === 0) {
          console.log("No Valid Spotify track URIs found in AI response after filtering.");
          return [];
        }
  
        return matches;
        
      } catch (error) {
        console.error(`Error during Gemini request (Attempt ${retries + 1}):`, error);
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
      }
      .GenericModal__overlay .GenericModal {
        border-radius: 30px;
        overflow: hidden;
      }
      .main-trackCreditsModal-mainSection {
        overflow-y: hidden !important;
      }
      .main-trackCreditsModal-header {
        padding: 27px 32px 12px !important;
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

    if (isMenuOpen) {
      toggleMenu();
      isButtonClicked = false;
      mainButton.style.backgroundColor = buttonStyles.main.backgroundColor;
      mainButton.style.color = buttonStyles.main.color;
      svgElement.style.fill = buttonStyles.main.color;
      mainButton.style.filter = "brightness(1)";

      const geminiApiKeyButton = menuButtons.find(
        (btn) => btn.querySelector("span")?.innerText === "AI Pick"
      )?.querySelector("button:nth-child(2)");
      if (geminiApiKeyButton) {
        const svg = geminiApiKeyButton.querySelector("svg");
        if (svg) {
          svg.style.fill = "#ffffffe6";
        }
      }
      const aiPickButton = menuButtons.find(
        (btn) => btn.querySelector("span")?.innerText === "AI Pick"
      );
      if (aiPickButton) {
        aiPickButton.style.backgroundColor = "transparent";
      }
    }

    const modalContainerElement = document.querySelector(".main-popupModal-container");
    if (modalContainerElement) {
      modalContainerElement.style.zIndex = "2000";
    }
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


  async function showGenreFilterModal(tracks, trackGenreMap) {
    const allGenres = new Set();
    trackGenreMap.forEach((genres) => {
      genres.forEach((genre) => allGenres.add(genre));
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
    .genre-filter-modal .main-popupModal-content {
      overflow-y: auto;
    }
    .genre-filter-modal .genre-button {
      padding: 6px 16px;
      margin: 4px;
      border-radius: 20px;
      border: none;
      cursor: pointer;
      background-color: #343434;
      color: white;
      font-weight: 500;
      font-size: 14px;
      transition: all 0.04s ease;
    }
    .genre-filter-modal .genre-button.selected {
      background-color: #1ED760;
      color: black;
    }
    .genre-filter-modal .search-bar {
      width: 77%;
      padding-top: 10px;
      padding-right: 15px;
      padding-bottom: 10px;
      padding-left: 15px;
      border-radius: 20px;
      border: 1px solid #282828;
      background: #282828;
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
      max-height: 300px;
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
      background: transparent;
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
    .genre-filter-modal .slider {
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
    .genre-filter-modal .slider:before {
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
    .genre-filter-modal input:checked + .slider {
        background-color: #1DB954;
    }
    .genre-filter-modal input:checked + .slider:before {
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
      background-color: #282828;
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
        border-color: #282828 transparent transparent transparent;
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
            <input type="text" class="search-bar" placeholder="Search genres...">
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
                            <span class="slider"></span>
                        </label>
                    </div>
                </div>
            </div>
            <div class="settings-left-wrapper">
                <div class="settings-title">Sort Type:</div>
                <div class="setting-row">
                    <select class="sort-type-select">
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

    if (isMenuOpen) {
      toggleMenu();
      isButtonClicked = false;
      mainButton.style.backgroundColor = buttonStyles.main.backgroundColor;
      mainButton.style.color = buttonStyles.main.color;
      svgElement.style.fill = buttonStyles.main.color;
      mainButton.style.filter = "brightness(1)";
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

    const matchAllGenresToggle = modalContainer.querySelector("#matchAllGenresToggle");
    const genreContainer = modalContainer.querySelector(".genre-container");
    const searchBar = modalContainer.querySelector(".search-bar");
    const sortTypeSelect = modalContainer.querySelector(".sort-type-select");
    const createPlaylistButton = modalContainer.querySelector(".create-playlist-button");
    const selectAllButton = modalContainer.querySelector(".select-all-button");

    const totalTracksStat = modalContainer.querySelector("#total-tracks-stat");
    const filteredTracksStat = modalContainer.querySelector("#filtered-tracks-stat");

    const lastSelectedSort = localStorage.getItem(STORAGE_KEY_GENRE_FILTER_SORT) || "playCount";
    sortTypeSelect.value = lastSelectedSort;

    sortTypeSelect.addEventListener("change", () => {
      localStorage.setItem(STORAGE_KEY_GENRE_FILTER_SORT, sortTypeSelect.value);
    });

    matchAllGenresToggle.addEventListener("change", () => {
      matchAllGenres = matchAllGenresToggle.checked;
      saveSettings();
    });
    const mainGenres = [
      "pop",
      "hip hop",
      "rap",
      "rock",
      "synthpop",
      "electronic",
      "r&b",
      "dance",
      "classical",
      "country",
      "latin",
      "alternative",
      "indie",
      "jazz",
      "k-pop",
      "metal",
      "heavy metal",
      "folk",
      "reggae",
      "blues",
      "funk",
      "punk",
      "soul",
      "pop rock",
      "edm",
      "house",
      "disco",
      "ambient",
      "synthwave",
      "hard rock",
      "techno",
      "experimental",
      "trance",
      "dubstep",
      "drum and bass",
      "lofi",
      "contemporary r&b",
      "new age",
      "epic",
      "epiccore",
      "acoustic",
      "funk"
    ];
    
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
    
      const genreCounts = {};
      trackGenreMap.forEach((genres) => {
        genres.forEach((genre) => {
          if (filteredGenres.includes(genre)) {
            genreCounts[genre] = (genreCounts[genre] || 0) + 1;
          }
        });
      });
    
      const groupedGenres = {};
      filteredGenres.forEach((genre) => {
        const count = genreCounts[genre] || 0;
        if (!groupedGenres[count]) {
          groupedGenres[count] = [];
        }
        groupedGenres[count].push(genre);
      });
    
      const sortedCounts = Object.keys(groupedGenres).sort((a, b) => b - a);
    
      let sortedGenres = [];
      sortedCounts.forEach((count) => {
        const group = groupedGenres[count].sort((a, b) => {
          const mainGenreIndexA = getMainGenreVariantIndex(a);
          const mainGenreIndexB = getMainGenreVariantIndex(b);
    
          if (mainGenreIndexA !== -1 && mainGenreIndexB !== -1) {
            return mainGenreIndexA - mainGenreIndexB;
          } else if (mainGenreIndexA !== -1) {
            return -1; 
          } else if (mainGenreIndexB !== -1) {
            return 1; 
          } else {
            return a.localeCompare(b); 
          }
        });
        sortedGenres = sortedGenres.concat(group);
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
          genreButton.textContent = genre;
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
    
    function getMainGenreVariantIndex(genre) {
      const lowerGenre = genre.toLowerCase();
      for (let i = 0; i < mainGenres.length; i++) {
        const mainGenreLower = mainGenres[i].toLowerCase();
        if (lowerGenre.includes(mainGenreLower) || mainGenreLower.includes(lowerGenre)) {
          return i; 
        }
      }
      return -1;
    }

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
              const newPlaylist = await createPlaylist(playlistName, playlistDescription);
              mainButton.innerText = "Saving...";
  
              const trackUris = sortedTracks.map((track) => track.uri);
              await addTracksToPlaylist(newPlaylist.id, trackUris);
  
              const sortTypeInfo = {  // Put this here for easy access
                  playCount: { fullName: "play count", shortName: "PlayCount" },
                  popularity: { fullName: "popularity", shortName: "Popularity" },
                  releaseDate: { fullName: "release date", shortName: "ReleaseDate" },
                  scrobbles: { fullName: "Last.fm scrobbles", shortName: "LFM Scrobbles" },
                  personalScrobbles: { fullName: "Last.fm personal scrobbles", shortName: "LFM My Scrobbles" },
                  shuffle: { fullName: "shuffle", shortName: "Shuffle" },
                  aiPick: { fullName: "AI pick", shortName: "AI Pick" },
              }[sortType];
              Spicetify.showNotification(
                  `Playlist created with ${sortTypeInfo.fullName} and genre filter!`
              );
          } catch (error) {
              console.error("Error creating or updating playlist:", error);
              Spicetify.showNotification(
                  `An error occurred while creating or updating the playlist. Please check your internet connection and try again.`
              );
          } finally {
              resetButtons();
          }
      }
  
  
      // --- Get source name ---
      const sourceUri = getCurrentUri();
      let sourceName;
      if (URI.isArtist(sourceUri)) {
          sourceName = await Spicetify.CosmosAsync.get(
              `https://api.spotify.com/v1/artists/${sourceUri.split(":")[2]}`
          ).then((r) => r.name);
      } else if (isLikedSongsPage(sourceUri)) {
          sourceName = "Liked Songs";
      } else {
          sourceName = await Spicetify.CosmosAsync.get(
              `https://api.spotify.com/v1/playlists/${sourceUri.split(":")[2]}`
          ).then((r) => r.name);
      }
      const possibleSuffixes = [
          "\\(PlayCount\\)",
          "\\(Popularity\\)",
          "\\(ReleaseDate\\)",
          "\\(LFM Scrobbles\\)",
          "\\(LFM My Scrobbles\\)",
          "\\(Shuffle\\)",
          "\\(AI Pick\\)",
          "\\(Genre Filter\\)",
      ];
  
      let suffixPattern = new RegExp(
          `\\s*(${possibleSuffixes.join("|")})\\s*`
      );
  
      while (suffixPattern.test(sourceName)) {
          sourceName = sourceName.replace(suffixPattern, "");
      }
  
  
      let baseDescription = `Filtered using Sort-Play by genres: `;
      if (URI.isArtist(sourceUri)) {
          baseDescription = `Tracks by ${sourceName} ` + baseDescription;
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
  
  
      if (sortType === "playCount" || sortType === "popularity" || sortType === "shuffle" || sortType === "releaseDate") {
          mainButton.disabled = true;
          mainButton.style.backgroundColor = buttonStyles.main.disabledBackgroundColor;
          mainButton.style.color = buttonStyles.main.disabledColor;
          mainButton.style.cursor = "default";
          svgElement.style.fill = buttonStyles.main.disabledColor;
          menuButtons.forEach((button) => (button.disabled = true));
          mainButton.innerHTML = "0%";
  
          const tracksWithPlayCounts = await processBatchesWithDelay(
              filteredTracks,
              200,
              1000,
              (progress) => {
                  mainButton.innerText = `${Math.floor(progress * 0.20)}%`;
              },
              getTrackDetailsWithPlayCount
          );
          const tracksWithIds = await processBatchesWithDelay(
              tracksWithPlayCounts,
              200,
              1000,
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
                  200,
                  1000,
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
                  .sort((a, b) => b.playCount - a.playCount);
          } else if (sortType === "popularity") {
              sortedTracks = uniqueTracks
                  .filter((track) => track.popularity !== null)
                  .sort((a, b) => b.popularity - a.popularity);
          } else if (sortType === "releaseDate") {
              sortedTracks = uniqueTracks
                  .filter((track) => track.releaseDate !== null)
                  .sort((a, b) => {
                      return releaseDateReverse
                          ? a.releaseDate - b.releaseDate
                          : b.releaseDate - a.releaseDate;
                  });
          } else if (sortType === "shuffle") {
              sortedTracks = shuffleArray(uniqueTracks);
          }
  
          mainButton.innerText = "100%";
  
          await createAndPopulatePlaylist(sortedTracks, playlistName, playlistDescription);
  
  
      } else if (sortType === "scrobbles" || sortType === "personalScrobbles") {
          try {
              mainButton.disabled = true;
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


  const GENRE_MAPPINGS = {
    "classical": ["classical", "classics", "classical music", "orchestral", "orchestral music", "symphony", "symphonic", "symphonies", "baroque", "classic", "classical's", "orchestra", "orchestras", "baroque's"],
    "rock": ["rock", "rocks", "rock & roll", "rock and roll", "rock n roll", "rocknroll", "rock n' roll", "rockmusic", "rock's", "rockin", "rockin'", "rock music"],
    "electronic": ["electronic", "electronica", "electro", "electronics", "electronic music", "electronico", "electronik", "electronic's", "electro's", "electronicas"],
    "hip hop": ["hip hop", "hiphop", "hip-hop", "hip-hop music", "hip-hops", "hip hop's"],
    "rap": ["rap", "raps", "rapper", "rappers"],
    "jazz": ["jazz", "jazzy", "jazzmusic", "jazz's", "jazzier", "jazziest"],
    "pop": ["pop", "pop music", "popmusic", "pop's", "pops"],
    "r&b": ["r&b", "rnb", "r&b's", "rnb's", "r & b", "rhythm and blues", "rhythm & blues", "r and b"],
    "metal": ["metal", "heavy metal", "metals", "metalcore", "metal rock", "metalmusic", "metal's", "metallic", "metalhead"],
    "blues": ["blues", "bluesy", "bluesmusic", "blues'", "bluesier", "bluesiest"],
    "folk": ["folk", "folklore", "folksy", "folkmusic", "folk's", "folkie", "folkier"],
    "country": ["country", "country music", "countrymusic", "country & western music", "country's"],
    "soul": ["soul", "soul music", "soulmusic", "soul's", "soulful", "souly"],
    "funk": ["funk", "funky", "funkmusic", "funk's", "funkier", "funkiest"],
    "reggae": ["reggae", "reggae music", "reggaemusic", "reggae's"],
    "disco": ["disco", "disco music", "discomusic", "disco's", "discos"],
    "alternative": ["alternative", "alt", "alternativemusic", "alternative's", "alternatives"],
    "indie": ["indie", "indiemusic", "indie's", "indies"],
    "dance": ["dance", "dance music", "dancemusic", "dance's", "dances", "dancey"],
    "ambient": ["ambient", "ambient music", "atmospheric", "ambientmusic", "ambient's", "ambients"],
    "synthwave": ["synthwave", "synth wave", "synth-wave", "retrowave", "outrun", "futuresynth", "synthwave's"],
    "synthpop": ["synthpop", "synth pop", "synth-pop"],
    "punk": ["punk", "punkmusic", "punk's", "punks", "punky"],
    "Opera": ["opera", "operatic", "arias", "libretto"],
    "house": ["house", "house music", "deep house", "housemusic", "house's"],
    "techno": ["techno", "techno music", "tech", "technomusic", "techno's"],
    "acoustic": ["acoustic", "acoustics", "acousticmusic", "acoustic's"],
    "experimental": ["experimental", "experiment", "experimental electronic", "experimentalmusic", "experimental's", "experiments"],
    "latin": ["latin", "latino", "latina", "latinmusic", "latin's", "latinos", "latinas"],
    "trance": ["trance", "trance music", "trancemusic", "trance's", "trancing", "psytrance"],
    "dubstep": ["dubstep", "dub step", "dubstepmusic", "dubstep's", "dub-step", "brostep"],
    "drum and bass": ["drum and bass", "drum & bass", "dnb", "d&b", "drum n bass", "drumandbass"],
    "edm": ["edm", "electronic dance music", "electronic dance", "edm music", "edmmusic", "edm's"],
    "lofi": ["lofi", "lo-fi", "lo fi", "lofimusic", "lofi music", "lo-fi music"],
    "new age": ["new age", "newage", "new-age", "new age music", "newagemusic", "new-age music"],
    "epic": ["epic", "epic music", "epicmusic", "epic's"],
    "epiccore": ["epiccore", "epic core", "epic-core"],
    "hard rock": ["hard rock", "hardrock", "hard-rock", "hard rock music", "hardrockmusic", "hard rock's"],
    "pop rock": ["pop rock", "poprock", "pop-rock", "pop rock music", "poprockmusic", "pop rock's"],
    "contemporary r&b": ["contemporary r&b", "contemporary rnb", "modern r&b", "modern rnb", "contemporary rhythm and blues", "contemporary r and b"],
    "soundtrack": ["soundtrack", "score", "film score", "movie music", "tv music", "game music", "ost", "original soundtrack", "ost", "game score", "film music", "original score", "original motion picture soundtrack", "theme music" ]
  };

  const GENRE_CACHE_KEY_PREFIX = 'sort-play-genre-cache-';
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
    batchDelay: 100,
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
            return await callSpotifyApiWithRateLimit(fn);
        } catch (error) {
            lastError = error;
            let waitTime = retryDelay * Math.pow(2, attempt); 
            waitTime += Math.random() * retryDelay;          
            waitTime = Math.min(waitTime, 60000);            

            if (error.status === 429) {
                waitTime = parseInt(error.headers?.["retry-after"] || waitTime);
            }
            
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
  
      batchResults.forEach((result) => {
        if (result.status === 'fulfilled') {
          const { track, genres } = result.value;
          const normalizedGenres = genres.map(normalizeGenre);
          const uniqueNormalizedGenres = [...new Set(normalizedGenres)];
  
          trackGenreMap.set(track.uri, uniqueNormalizedGenres);
          uniqueNormalizedGenres.forEach((genre) => allGenres.add(genre));
  
          if (uniqueNormalizedGenres.length > 0) {
            tracksWithGenresCount++;
          }
        } else {
          console.warn(
            `Failed to process track ${
              result.reason.track?.name || "Unknown"
            }:`,
            result.reason
          );
        }
      });
  
      const endTime = Date.now(); 
      const elapsedTime = endTime - startTime;
      const delayMs = Math.max(0, CONFIG.batchDelay - elapsedTime);
  
      const progress = Math.round(
        (((i + 1) * CONFIG.batchSize) / totalTracks) * 100
      );
      updateProgress(progress); 
  
      if (i < batches.length - 1) {
         console.log(`Completed batch ${i + 1}/${batches.length}. Waiting...`); 
        await new Promise((resolve) => setTimeout(resolve, delayMs));
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
        api_key: CONFIG.lastfm.apiKey,
        artist: artist,
        track: track,
        format: 'json'
      });
  
      const trackResponse = await withRetry(
        () => fetch(`${CONFIG.lastfm.baseUrl}?${trackParams}`, {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'SpicetifyGenreExtension/1.0'
          }
        }),
        CONFIG.lastfm.retryAttempts,
        CONFIG.lastfm.retryDelay
      );
  
      const trackData = await trackResponse.json();
      let genres = trackData?.track?.toptags?.tag?.map(tag => tag.name.toLowerCase()) || [];
  
      if (genres.length > 0) {
        lastfmCache.set(cacheKey, genres);
        return genres;
      }
  
      if (genres.length === 0 && spotifyGenres.size === 0) { 
          const artistParams = new URLSearchParams({
            method: 'artist.getInfo',
            api_key: CONFIG.lastfm.apiKey,
            artist: artist,
            format: 'json'
          });
    
          const artistResponse = await withRetry(
            () => fetch(`${CONFIG.lastfm.baseUrl}?${artistParams}`, {
              headers: {
                'Accept': 'application/json',
                'User-Agent': 'SpicetifyGenreExtension/1.0'
              }
            }),
            CONFIG.lastfm.retryAttempts,
            CONFIG.lastfm.retryDelay
          );
    
          const artistData = await artistResponse.json();
          genres = artistData?.artist?.tags?.tag?.map(tag => tag.name.toLowerCase()) || [];
      }

      lastfmCache.set(cacheKey, genres);
      return genres;
    } catch (error) {
      console.warn(`Last.fm fetch failed for ${artist} - ${track}:`, error);
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
        const combinedGenres = new Set([...spotifyGenres, ...filteredLastfmGenres]);

        if (combinedGenres.size > 0) {
            setCachedTrackGenres(trackId, Array.from(combinedGenres));
        } else if (!isRecent) {
            setCachedTrackGenres(trackId, []);
        }

        return Array.from(combinedGenres);

    } catch (error) {
        console.error(`Error fetching details for track ID ${trackId}:`, error);
        return [];
    }
  }
  
  const REVERSE_GENRE_MAPPING = {};
  Object.entries(GENRE_MAPPINGS).forEach(([mainGenre, variants]) => {
    variants.forEach(variant => {
      REVERSE_GENRE_MAPPING[variant] = mainGenre;
    });
    REVERSE_GENRE_MAPPING[mainGenre] = mainGenre;
  });
  
  function normalizeGenre(genre) {
    const lowerGenre = genre.toLowerCase().trim();
    return REVERSE_GENRE_MAPPING[lowerGenre] || lowerGenre;
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
    const normalizedSelectedGenres = selectedGenres.map(normalizeGenre);
      if(matchAllGenres){
      return tracks.filter((track) => {
        const trackGenres = trackGenreMap.get(track.uri);
        return normalizedSelectedGenres.every((selectedGenre) => 
          trackGenres?.includes(selectedGenre)
        );
      });
    } else {
      return tracks.filter((track) => {
        const trackGenres = trackGenreMap.get(track.uri);
        return normalizedSelectedGenres.some((selectedGenre) => 
          trackGenres?.includes(selectedGenre)
        );
      });
    }
  }


  const styleElement = document.createElement("style");
  styleElement.innerHTML = `
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
    const uriObj = Spicetify.URI.fromString(uri);
    return uriObj.type === Spicetify.URI.Type.COLLECTION && uriObj.category === "tracks";
  }

  function getCurrentUri() {
    const path = Spicetify.Platform.History.location?.pathname;
    if (!path) return null;

    const segments = path.split('/').filter(segment => segment.length > 0);
    
    if (segments.includes('artist')) {
        const artistId = segments[segments.length - 1];
        return `spotify:artist:${artistId}`;
    }
    
    if (segments.includes('playlist')) {
        const playlistId = segments[segments.length - 1];
        return `spotify:playlist:${playlistId}`;
    }
    
    if (segments.includes('collection') && segments.includes('tracks')) {
        return "spotify:collection:tracks";
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
        durationMilis: item.duration.milliseconds,
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

    } catch (error) {
      console.error("Error fetching liked songs:", error);
      Spicetify.showNotification("Failed to fetch liked songs.", true);
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
                    return !URI.isLocalTrack(track.uri);
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

  async function getArtistTracks(artistUri) {
    const { Locale, GraphQL } = Spicetify;
  
    const queryArtistOverview = {
      name: "queryArtistOverview",
      operation: "query",
      sha256Hash: "35648a112beb1794e39ab931365f6ae4a8d45e65396d641eeda94e4003d41497",
    };
  
    const queryArtistAppearsOn = {
      name: "queryArtistAppearsOn",
      operation: "query",
      sha256Hash: "9a4bb7a20d6720fe52d7b47bc001cfa91940ddf5e7113761460b4a288d18a4c1",
    };
  
    mainButton.innerHTML = '<div class="loader"></div>';
    mainButton.disabled = true;
  
    try {
      const artistData = await GraphQL.Request(queryArtistOverview, {
        uri: artistUri,
        locale: Locale.getLocale(),
        includePrerelease: false,
      });
  
      if (artistData.errors) throw new Error(artistData.errors[0].message);
      const artistName = artistData.data.artistUnion.profile.name;
      const artistId = artistUri.split(":")[2];
  
      const appearsOnData = await GraphQL.Request(queryArtistAppearsOn, {
        uri: artistUri,
        offset: 0,
        limit: 200,
      });
  
      if (appearsOnData.errors) throw new Error(appearsOnData.errors[0].message);
  
      const allAlbumIds = new Set();
      let nextUrl = `https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album,single,appears_on,compilation&limit=50`;
  
      do {
        const albumRes = await Spicetify.CosmosAsync.get(nextUrl);
        if (!albumRes.items) break;
  
        albumRes.items.forEach((album) => {
          allAlbumIds.add(album.id);
        });
  
        nextUrl = albumRes.next;
      } while (nextUrl);
  
      const appearsOnAlbums = appearsOnData.data.artistUnion.relatedContent.appearsOn.items.flatMap(
        ({ releases }) => releases.items
      );
      appearsOnAlbums.forEach((release) => {
        if (release?.uri) {
          const albumId = release.uri.split(":")[2];
          allAlbumIds.add(albumId);
        }
      });
  
      async function fetchTracksFromAlbum(albumId, retries = 5, delay = 1000) {
        const albumUri = `spotify:album:${albumId}`;
        
        for (let attempt = 1; attempt <= retries; attempt++) {
          try {
            const albumRes = await GraphQL.Request(
              GraphQL.Definitions.getAlbum,
              {
                uri: albumUri,
                locale: Locale.getLocale(),
                offset: 0,
                limit: 500,
              }
            );
  
            let tracks = [];
            if (albumRes.data?.albumUnion?.tracks) {
              tracks = albumRes.data.albumUnion.tracks.items;
            } else if (albumRes.data?.albumUnion?.tracksV2) {
              tracks = albumRes.data.albumUnion.tracksV2.items;
            } else {
              return [];
            }
  
            return tracks
              .filter((item) => {
                if (!item?.track?.playability?.playable) return false;
                const trackArtists = item.track.artists?.items || [];
                return trackArtists.some(artist => 
                  artist?.profile?.name === artistName ||
                  artist?.uri === artistUri
                );
              })
              .map((item) => {
                const track = item.track;
                return {
                  uri: track.uri,
                  uid: track.uid,
                  name: track.name,
                  albumUri: track.albumOfTrack?.uri || albumUri,
                  albumName: track.albumOfTrack?.name || "Unknown Album",
                  artistUris: (track.artists?.items || []).map(
                    (artist) => artist?.uri || "unknown"
                  ),
                  artistName:
                    (track.artists?.items || [])[0]?.profile?.name ||
                    "Unknown Artist",
                  durationMilis: track.duration?.totalMilliseconds || 0,
                  playcount: 0,
                  popularity: 0,
                  releaseDate: 0,
                  track: {
                    album: {
                      id: albumId,
                    },
                    name: track.name,
                    duration_ms: track.duration?.totalMilliseconds || 0,
                    id: track.uri.split(":")[2],
                  },
                };
              });
          } catch (err) {
            if (attempt < retries) {
              await new Promise((resolve) => setTimeout(resolve, delay));
              delay *= 2;
            } else {
              console.error(`Failed to fetch tracks for album ${albumId}:`, err);
              return [];
            }
          }
        }
      }
  
      const allTracks = [];
      const batchSize = 5;
      const allAlbumIdArray = Array.from(allAlbumIds);
      
      for (let i = 0; i < allAlbumIdArray.length; i += batchSize) {
        const batch = allAlbumIdArray.slice(i, i + batchSize);
        const batchTracks = await Promise.all(
          batch.map(albumId => fetchTracksFromAlbum(albumId))
        );
        allTracks.push(...batchTracks.flat());
      }
  
      const uniqueTracks = allTracks.filter(
        (track, index, self) => index === self.findIndex((t) => t.uri === track.uri)
      );
  
      return uniqueTracks;
  
    } catch (error) {
      console.error("Error fetching artist tracks:", error);
      throw error;
    } finally {
      mainButton.innerText = "Sort Play";
      mainButton.appendChild(svgElement);
    }
  }
  
  async function getArtistImageUrl(artistId) {
    const artistData = await Spicetify.CosmosAsync.get(
      `https://api.spotify.com/v1/artists/${artistId}`
    );
    return artistData.images[0]?.url;
  }
  
  async function setPlaylistImage(playlistId, base64Image) {
    try {
      const response = await Spicetify.CosmosAsync.put(
        `https://api.spotify.com/v1/playlists/${playlistId}/images`,
        base64Image.split("base64,")[1]
      );
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Spotify API request failed with status ${response.status}: ${errorText}`
        );
      }
  
    } catch (error) {
      console.error("Error setting playlist image:", error);
    }
  }

  async function toBase64(imageUrl) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.height = img.naturalHeight;
        canvas.width = img.naturalWidth;
        ctx.drawImage(img, 0, 0);
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
        trackNumber: 0,
        songTitle: track.name, 
        albumName: track.albumName || (track.album && track.album.name) ||  "Unknown Album",
        trackId: track.track.id,
        albumId: albumId,
        durationMs: track.track.duration_ms,
        playCount: playCount,
        uri: `spotify:track:${track.track.id}`,
        artistName: track.artistName 
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

        const encodedArtist = encodeURIComponent(artistName);
        const encodedTrack = encodeURIComponent(trackName);
        const lastFmUrl = `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${LFMApiKey}&artist=${encodedArtist}&track=${encodedTrack}&format=json`;

        const response = await fetch(lastFmUrl);

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
    const username = loadLastFmUsername();
    if (!username) {
      return {
        ...track,
        personalScrobbles: null,
      };
    }

    const maxRetries = 5;
    const initialDelay = 1000; 
    let retries = 0;
    let delay = initialDelay;

    while (retries < maxRetries) {
      try {
        const artistName = track.artists
          ? track.artists[0]?.name || track.artistName
          : track.artistName;

        if (!artistName || !track.name) {
          console.warn("Missing artist name or track name:", track);
          return {
            ...track,
            personalScrobbles: null,
          };
        }

        const encodedArtist = encodeURIComponent(artistName);
        const encodedTrack = encodeURIComponent(track.name);
        const lastFmUrl = `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${LFMApiKey}&artist=${encodedArtist}&track=${encodedTrack}&username=${username}&format=json`;
        
        const response = await fetch(lastFmUrl);

        if (!response.ok) {
          throw new Error(`Last.fm API request failed with status ${response.status}`);  
        }

        const data = await response.json();

        if (data.error) {
          if (data.error === 6) {
            if (
              localStorage.getItem("sort-play-include-zero-scrobbles") === "true"
            ) {
              console.warn(
                `User ${username} has no scrobbles for artist ${artistName} (track ${track.name}). Treating as 0 scrobbles.`
              );
              return {
                ...track,
                personalScrobbles: 0,
              };
            } else {
              console.warn(
                `User ${username} not found or has no scrobbles for artist ${artistName}.`
              );
              return {
                ...track,
                personalScrobbles: null,
              };
            }
          } else {
            throw new Error(`Last.fm API error: ${data.message}`); 
          }
        } else {
            const personalScrobbles = data.track && data.track.userplaycount
            ? parseInt(data.track.userplaycount)
            : 0;

            return {
            ...track,
            personalScrobbles: personalScrobbles,
            };
        }
      } catch (error) {
        console.error(
          `Error fetching personal scrobbles for track ${track.name} (Attempt ${
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
            `Failed to fetch personal scrobbles for track ${track.name} after ${maxRetries} attempts.`
          );
          return {
            ...track,
            personalScrobbles: null,
          };
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
      }
      .GenericModal__overlay .GenericModal {
        border-radius: 30px;
        overflow: hidden;
      }
      .main-trackCreditsModal-mainSection {
        overflow-y: hidden !important;
      }
      .main-buttons-button:hover {
        filter: brightness(1.2); 
      }
      .main-trackCreditsModal-header {
        padding: 27px 32px 12px !important;
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

  const buttonStyles = {
    main: {
      backgroundColor: "transparent",
      color: "#FFFFFFB3",
      hoverColor: "white",
      clickBackgroundColor: "transparent",
      clickColor: "#FFFFFFB3",
      disabledBackgroundColor: "#FFFFFFB3",
      disabledColor: "#666",
    },
    menuItems: [
      {
        type: "parent",
        text: "Sort By",
        sortType: "sortByParent", 
        hasInnerButton: true,
        children: [
          {
            backgroundColor: "transparent",
            color: "white",
            text: "Play Count",
            sortType: "playCount",
          },
          {
            backgroundColor: "transparent",
            color: "white",
            text: "Popularity",
            sortType: "popularity",
          },
          {
            backgroundColor: "transparent",
            color: "white",
            text: "Release Date",
            sortType: "releaseDate",
            hasInnerButton: true
          },
          {
            backgroundColor: "transparent",
            color: "white",
            text: "Shuffle",
            sortType: "shuffle",
          },
          {
            backgroundColor: "transparent",
            color: "white",
            text: "Scrobbles",
            sortType: "scrobbles",
          },
          {
            backgroundColor: "transparent",
            color: "white",
            text: "My Scrobbles",
            sortType: "personalScrobbles",
            hasInnerButton: true,
          },
        ],
      },
      {
        backgroundColor: "transparent",
        color: "white",
        text: "AI Pick",
        sortType: "aiPick",
        hasInnerButton: true,
        onClick: async function (event) {
          event.stopPropagation();
          const userApiKey = localStorage.getItem("sort-play-gemini-api-key");
          if (!userApiKey || DefaultGeminiApiKeys.includes(userApiKey)) {  
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
        text: "Genre Filter",
        sortType: "genreFilter",
        hasInnerButton: true,
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
  const buttonContainer = document.createElement("div");
  buttonContainer.style.position = "relative";
  buttonContainer.style.display = "inline-block";
  buttonContainer.style.width = "100px";
  const mainButton = document.createElement("button");
  mainButton.title = "sort-play extension";
  mainButton.className = "Button-sc-qlcn5g-0 Button-small-buttonTertiary-useBrowserDefaultFocusStyle";
  mainButton.innerText = "Sort Play"; 
  mainButton.style.backgroundColor = buttonStyles.main.backgroundColor;
  mainButton.style.color = buttonStyles.main.color;
  mainButton.style.borderRadius = "16px";
  mainButton.style.border = "none";
  mainButton.style.padding = "4px 10px";
  mainButton.style.fontWeight = "400";
  mainButton.style.fontSize = "14px";
  mainButton.style.height = "32px";  
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
    if (!mainButton.disabled) {
      mainButton.style.cursor = "pointer";
      mainButton.style.color = buttonStyles.main.hoverColor;
      svgElement.style.fill = buttonStyles.main.hoverColor;
    }
  });
  mainButton.addEventListener("mouseleave", () => {
    if (!mainButton.disabled) {
      mainButton.style.color = isButtonClicked ? buttonStyles.main.clickColor : buttonStyles.main.color;
      svgElement.style.fill = isButtonClicked ? buttonStyles.main.clickColor : buttonStyles.main.color;
    }
  });

  function getRawContextMenuStyle() {
    const style = document.createElement('style');
    document.head.appendChild(style);
    
    const sheets = document.styleSheets;
    
    for (let sheet of sheets) {
        try {
            const rules = sheet.cssRules || sheet.rules;
            for (let rule of rules) {
                if (rule.selectorText === '.main-contextMenu-menu') {
                    return rule.style.backgroundColor;
                }
            }
        } catch (e) {
            continue;
        }
    }
    
    const tempElement = document.createElement("div");
    tempElement.className = "main-contextMenu-menu";
    document.body.appendChild(tempElement);
    
    const styles = window.getComputedStyle(tempElement);
    const backgroundColor = styles.getPropertyValue('background-color');
    
    document.body.removeChild(tempElement);
    return backgroundColor;
  }


  function createBackgroundObserver(menuElement) {
    menuElement.style.removeProperty('background-color');
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const rawStyle = getRawContextMenuStyle();
          if (rawStyle.includes('var(--spice-rgb-card)')) {
            menuElement.style.removeProperty('background-color');
          }
        }
      });
    });
  
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });
  
    menuElement._backgroundObserver = observer;
  
    setTimeout(() => {
      cleanupBackgroundObserver(menuElement);
    }, 15000);
  
    return observer;
  }
  
  function cleanupBackgroundObserver(element) {
    if (element._backgroundObserver) {
      element._backgroundObserver.disconnect();
      delete element._backgroundObserver;
    }
  }

  const menuContainer = document.createElement("div");
  menuContainer.style.position = "fixed";
  menuContainer.style.display = "none";
  menuContainer.style.flexDirection = "column";
  menuContainer.style.zIndex = "1";
  menuContainer.style.padding = "4px 4px";
  menuContainer.style.transform = "translateX(-50%)";
  menuContainer.style.borderRadius = "4px";
  menuContainer.style.boxShadow = "rgba(0, 0, 0, 0.3) 0px 16px 24px 0px";
  menuContainer.classList.add('main-contextMenu-menu');
  createBackgroundObserver(menuContainer);

  let releaseDateReverse = localStorage.getItem("sort-play-release-date-reverse") === "true";
  
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
      parentButton.style.color = "#ffffffe6";
      parentButton.style.border = "none";
      parentButton.style.borderRadius = "2px";
      parentButton.style.margin = "0";
      parentButton.style.padding = "4px 10px";
      parentButton.style.fontWeight = "400";
      parentButton.style.fontSize = "0.875rem";
      parentButton.style.height = "44px";
      parentButton.style.width = "155px";
      parentButton.style.textAlign = "center";
      parentButton.style.opacity = "0";
      parentButton.style.transform = "translateY(-10px)";
      parentButton.style.position = "relative";
      parentButton.style.display = "flex";
      parentButton.style.alignItems = "center";
      parentButton.style.justifyContent = "space-between";
      parentButton.dataset.isParent = 'true';

      const buttonTextSpan = document.createElement("span");
      buttonTextSpan.innerText = style.text;
      parentButton.appendChild(buttonTextSpan);
     
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("viewBox", "0 0 16 16");
      svg.setAttribute("width", "16px");
      svg.setAttribute("height", "16px");
      svg.style.fill = "currentcolor";
      svg.style.transform = "translateX(2px)";
    
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", "M6 14l6-6-6-6v12z");
      
      svg.appendChild(path);
      parentButton.appendChild(svg);

      parentButton.addEventListener("mouseenter", () => {
        if (!parentButton.disabled) {
          parentButton.style.backgroundColor = "#3e3e3e";
          openSubMenu(parentButton, style.children);
        }
      });

      parentButton.addEventListener("mouseleave", () => {
        if (!parentButton.disabled) {
          parentButton.style.backgroundColor = "transparent";
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
      button.style.color = "#ffffffe6";
      button.style.border = "none";
      button.style.borderRadius = "2px";
      button.style.margin = "0"; 
      button.style.padding = "4px 10px";
      button.style.fontWeight = "400";
      button.style.fontSize = "0.875rem";
      button.style.height = "44px";
      button.style.width = "155px"; 
      button.style.textAlign = "center";
      button.style.opacity = "0";
      button.style.transform = "translateY(-10px)";
      button.style.position = "relative"; 
      button.style.display = "flex";  
      button.style.alignItems = "center";  
      button.style.justifyContent = "space-between";  

      button.addEventListener("mouseenter", () => {
        if (!button.disabled) {
          button.style.backgroundColor = "#3e3e3e";
        }
      });
    
      button.addEventListener("mouseleave", () => {
        if (!button.disabled) {
          button.style.backgroundColor = "transparent";
        }
      });
    
      const buttonTextSpan = document.createElement("span");
      buttonTextSpan.innerText = style.text;
      button.appendChild(buttonTextSpan);
      

      if (style.hasInnerButton) {
        if (style.text === "Release Date") {
            const innerButton = document.createElement("button");
            innerButton.title = "Toggle Order (Newest/Oldest First)";
            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute("viewBox", "0 0 16 16");
            svg.setAttribute("width", "50%");
            svg.setAttribute("height", "50%");
            svg.style.fill = "#ffffffe6";  

            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", releaseDateReverse ? "M.998 8.81A.749.749 0 0 1 .47 7.53L7.99 0l7.522 7.53a.75.75 0 1 1-1.06 1.06L8.74 2.87v12.38a.75.75 0 1 1-1.498 0V2.87L1.528 8.59a.751.751 0 0 1-.53.22z" : "M.998 7.19A.749.749 0 0 0 .47 8.47L7.99 16l7.522-7.53a.75.75 0 1 0-1.06-1.06L8.74 13.13V.75a.75.75 0 1 0-1.498 0v12.38L1.528 7.41a.749.749 0 0 0-.53-.22z");

            svg.appendChild(path);
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
              svg.style.fill = "#ffffffe6";  
            });

            innerButton.addEventListener("click", (event) => {
              event.stopPropagation();
              releaseDateReverse = !releaseDateReverse;
              localStorage.setItem("sort-play-release-date-reverse", releaseDateReverse);
              path.setAttribute("d", releaseDateReverse ? "M.998 8.81A.749.749 0 0 1 .47 7.53L7.99 0l7.522 7.53a.75.75 0 1 1-1.06 1.06L8.74 2.87v12.38a.75.75 0 1 1-1.498 0V2.87L1.528 8.59a.751.751 0 0 1-.53.22z" : "M.998 7.19A.749.749 0 0 0 .47 8.47L7.99 16l7.522-7.53a.75.75 0 1 0-1.06-1.06L8.74 13.13V.75a.75.75 0 1 0-1.498 0v12.38L1.528 7.41a.749.749 0 0 0-.53-.22z");
            });
            
            button.appendChild(innerButton);
        }
        else if (style.text === "AI Pick") {
          const innerButton = document.createElement("button");
          innerButton.title = "Set Gemini API Key";
          innerButton.style.cssText = `
            background-color: transparent;
            border: none;
            border-radius: 2px;
            padding: 0;
            cursor: pointer;
            position: absolute;
            right: 0px; 
            top: 50%;
            transform: translateY(-48%);
            display: flex;
            align-items: center;
            justify-content: center;
            width: 30px;
            height: 30px;
          `; 

          const parser = new DOMParser();
          const svgDoc = parser.parseFromString(settingsSvg, "image/svg+xml");
          const svgElement = svgDoc.documentElement;
          svgElement.setAttribute("width", "50%");
          svgElement.setAttribute("height", "50%");
          svgElement.style.fill = "#ffffffe6";
    
          innerButton.appendChild(svgElement);
    
          innerButton.addEventListener("mouseenter", () => {
            svgElement.style.fill = "#1ED760";
          });
    
          innerButton.addEventListener("mouseleave", () => {
            svgElement.style.fill = "#ffffffe6";
          });
    
          innerButton.addEventListener("click", (event) => {
            event.stopPropagation();
            showGeminiApiKeyModal();
          });
    
          button.appendChild(innerButton);
        }
        else if (style.text === "My Scrobbles") {
          const innerButton = document.createElement("button");
          innerButton.title = "Set Last.fm Username";
          innerButton.style.cssText = `
            background-color: transparent;
            border: none;
            border-radius: 2px;
            padding: 0;
            cursor: pointer;
            position: absolute;
            right: 0px; 
            top: 50%;
            transform: translateY(-48%);
            display: flex;
            align-items: center;
            justify-content: center;
            width: 30px;
            height: 30px;
          `; 

          const parser = new DOMParser();
          const svgDoc = parser.parseFromString(settingsSvg, "image/svg+xml");
          const svgElement = svgDoc.documentElement;
          svgElement.setAttribute("width", "50%");
          svgElement.setAttribute("height", "50%");
          svgElement.style.fill = "#ffffffe6";
    
          innerButton.appendChild(svgElement);
    
          innerButton.addEventListener("mouseenter", () => {
            svgElement.style.fill = "#1ED760";
          });
    
          innerButton.addEventListener("mouseleave", () => {
            svgElement.style.fill = "#ffffffe6";
          });
    
          innerButton.addEventListener("click", (event) => {
            event.stopPropagation();
            showLastFmUsernameModal();
          });
    
          button.appendChild(innerButton);
        }
      }

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

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
    if (isMenuOpen) {
      const buttonRect = mainButton.getBoundingClientRect();
      const { height: headerHeight, bottom: headerBottom } = getHeaderInfo();
      
      if (buttonRect.top <= headerHeight || buttonRect.bottom <= headerBottom) {
        isMenuOpen = false;
        return;
      }
      
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const menuHeight = menuButtons.length * 34 + 16;
      const spaceBelow = window.innerHeight - buttonRect.bottom;
      
      let topPosition = buttonRect.bottom + scrollTop + 8;
      if (spaceBelow < menuHeight) {
        topPosition = buttonRect.top + scrollTop - menuHeight - 8;
        if (topPosition < scrollTop + headerHeight) {
          isMenuOpen = false;
          return;
        }
      }
      
      const menuWidth = 163; 
      const buttonCenter = buttonRect.left + (buttonRect.width / 2);
      const leftPosition = buttonCenter - (menuWidth / 2);
      
      menuContainer.style.top = `${topPosition}px`;
      menuContainer.style.left = `${leftPosition}px`;
      menuContainer.style.transform = "none";
      menuContainer.style.display = "flex";
      
      document.body.appendChild(menuContainer);
      menuButtons.forEach((button) => {
        button.style.opacity = "1";
        button.style.transform = "translateY(0)";
      });
    } else {
      menuContainer.style.display = "none";
      if (menuContainer.parentElement === document.body) {
        document.body.removeChild(menuContainer);
      }
      
      const submenus = document.querySelectorAll('.submenu');
      submenus.forEach(submenu => {
        if (submenu.parentElement) {
          submenu.parentElement.removeChild(submenu);
        }
      });
    }
  }

  function closeAllMenus() {
    isMenuOpen = false;
    menuContainer.style.display = "none";
    if (menuContainer.parentElement === document.body) {
      document.body.removeChild(menuContainer);
    }
    
    const submenus = document.querySelectorAll('.submenu');
    submenus.forEach(submenu => {
      if (submenu.parentElement) {
        cleanupBackgroundObserver(submenu);
        submenu.parentElement.removeChild(submenu);
      }
    });
  }
  
  function openSubMenu(parentButton, items) {
    const existingSubmenus = document.querySelectorAll('.submenu');
    existingSubmenus.forEach(submenu => {
        if (submenu.parentElement && submenu !== parentButton.querySelector('.submenu')) {
            cleanupBackgroundObserver(submenu);
            submenu.parentElement.removeChild(submenu);
        }
    });

    let subMenu = parentButton.querySelector('.submenu');
    
    if (subMenu) {
        return;
    }

    subMenu = document.createElement("div");
    subMenu.classList.add("submenu");
    subMenu.classList.add('main-contextMenu-menu');
    subMenu.style.position = "absolute";
    subMenu.style.display = "flex";
    subMenu.style.flexDirection = "column";
    subMenu.style.zIndex = "2000";
    subMenu.style.padding = "4px 4px";
    subMenu.style.borderRadius = "4px";
    subMenu.style.boxShadow = "0 16px 24px rgba(var(--spice-rgb-shadow), .3), 0 6px 8px rgba(var(--spice-rgb-shadow), .2)";

    createBackgroundObserver(subMenu);

    const parentRect = parentButton.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const spaceRight = window.innerWidth - parentRect.right;
    const subMenuWidth = 163;

    if (spaceRight < subMenuWidth) {
        subMenu.style.left = `${parentRect.left - subMenuWidth}px`;
    } else {
        subMenu.style.left = `${parentRect.right}px`;
    }

    subMenu.style.top = `${parentRect.top + scrollTop}px`;

    const handleSubMenuRemoval = () => {
        if (subMenu.parentElement) {
            cleanupBackgroundObserver(subMenu);
            subMenu.parentElement.removeChild(subMenu);
            parentButton.classList.remove('submenu-open');
            parentButton.style.backgroundColor = "transparent";
        }
    };

    parentButton.classList.add('submenu-open');

    const menuContainer = document.createElement('div');
    menuContainer.style.position = 'absolute';
    menuContainer.style.top = '0';
    menuContainer.style.left = '0';
    menuContainer.style.right = '0';
    menuContainer.style.bottom = '0';

    subMenu.addEventListener('mouseenter', () => {
        parentButton.style.backgroundColor = "#3e3e3e";
    });

    subMenu.addEventListener('mouseleave', (event) => {
        const toElement = event.relatedTarget;
        if (!parentButton.contains(toElement)) {
            parentButton.style.backgroundColor = "transparent";
        }
    });

    parentButton.addEventListener('mouseleave', (event) => {
        const toElement = event.relatedTarget;
        if (!subMenu.contains(toElement)) {
            parentButton.style.backgroundColor = "transparent";
            handleSubMenuRemoval();
        }
    });

    document.addEventListener('click', (event) => {
        if (!subMenu.contains(event.target) && !parentButton.contains(event.target)) {
            handleSubMenuRemoval();
        }
    });

    menuButtons.forEach(mainMenuButton => {
        mainMenuButton.addEventListener('mouseenter', () => {
            if (mainMenuButton !== parentButton && subMenu.parentElement) {
                handleSubMenuRemoval();
            }
        });
    });
    items.forEach((item) => {
      const button = document.createElement("button");
      button.style.backgroundColor = item.backgroundColor;
      button.style.color = item.color;
      button.style.border = "none";
      button.style.borderRadius = "2px";
      button.style.margin = "0";
      button.style.padding = "4px 10px";
      button.style.fontWeight = "400";
      button.style.fontSize = "0.875rem";
      button.style.height = "44px";
      button.style.width = "155px";
      button.style.textAlign = "center";
      button.style.position = "relative";
      button.style.display = "flex";
      button.style.alignItems = "center";
      button.style.justifyContent = "space-between";
      button.innerText = item.text;
      button.addEventListener("mouseenter", () => {
        button.style.backgroundColor = "#3e3e3e";
      });
  
      button.addEventListener("mouseleave", () => {
        button.style.backgroundColor = item.backgroundColor;
      });
  
      if (item.hasInnerButton) {
        if (item.text === "Release Date") {
          const innerButton = document.createElement("button");
          innerButton.title = "Toggle Order (Newest/Oldest First)";
          const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
          svg.setAttribute("viewBox", "0 0 16 16");
          svg.setAttribute("width", "50%");
          svg.setAttribute("height", "50%");
          svg.style.fill = "#ffffffe6";
  
          const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
          path.setAttribute("d", releaseDateReverse ? "M.998 8.81A.749.749 0 0 1 .47 7.53L7.99 0l7.522 7.53a.75.75 0 1 1-1.06 1.06L8.74 2.87v12.38a.75.75 0 1 1-1.498 0V2.87L1.528 8.59a.751.751 0 0 1-.53.22z" : "M.998 7.19A.749.749 0 0 0 .47 8.47L7.99 16l7.522-7.53a.75.75 0 1 0-1.06-1.06L8.74 13.13V.75a.75.75 0 1 0-1.498 0v12.38L1.528 7.41a.749.749 0 0 0-.53-.22z");
  
          svg.appendChild(path);
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
            svg.style.fill = "#ffffffe6";
          });
  
          innerButton.addEventListener("click", (event) => {
            event.stopPropagation();
            releaseDateReverse = !releaseDateReverse;
            localStorage.setItem("sort-play-release-date-reverse", releaseDateReverse);
            path.setAttribute("d", releaseDateReverse ? "M.998 8.81A.749.749 0 0 1 .47 7.53L7.99 0l7.522 7.53a.75.75 0 1 1-1.06 1.06L8.74 2.87v12.38a.75.75 0 1 1-1.498 0V2.87L1.528 8.59a.751.751 0 0 1-.53.22z" : "M.998 7.19A.749.749 0 0 0 .47 8.47L7.99 16l7.522-7.53a.75.75 0 1 0-1.06-1.06L8.74 13.13V.75a.75.75 0 1 0-1.498 0v12.38L1.528 7.41a.749.749 0 0 0-.53-.22z");
          });
  
          button.appendChild(innerButton);
        } else if (item.text === "My Scrobbles") {
          const innerButton = document.createElement("button");
          innerButton.title = "Set Last.fm Username";
          innerButton.style.cssText = `
            background-color: transparent;
            border: none;
            border-radius: 2px;
            padding: 0;
            cursor: pointer;
            position: absolute;
            right: 0px; 
            top: 50%;
            transform: translateY(-48%);
            display: flex;
            align-items: center;
            justify-content: center;
            width: 30px;
            height: 30px;
          `;
  
          const parser = new DOMParser();
          const svgDoc = parser.parseFromString(settingsSvg, "image/svg+xml");
          const svgElement = svgDoc.documentElement;
          svgElement.setAttribute("width", "50%");
          svgElement.setAttribute("height", "50%");
          svgElement.style.fill = "#ffffffe6";
  
          innerButton.appendChild(svgElement);
  
          innerButton.addEventListener("mouseenter", () => {
            svgElement.style.fill = "#1ED760";
          });
  
          innerButton.addEventListener("mouseleave", () => {
            svgElement.style.fill = "#ffffffe6";
          });
  
          innerButton.addEventListener("click", (event) => {
            event.stopPropagation();
            showLastFmUsernameModal();
          });
  
          button.appendChild(innerButton);
        }
      }
  
      button.addEventListener("click", async (event) => {
        event.stopPropagation();
        if (item.onClick) {
          await item.onClick(event);
        } else {
          await handleSortAndCreatePlaylist(item.sortType);
        }
        
        parentButton.style.backgroundColor = "transparent";
      });
  
      subMenu.appendChild(button);
    });
  
    parentButton.appendChild(subMenu);
    document.body.appendChild(subMenu);
  }
  window.addEventListener('resize', closeAllMenus);

  window.addEventListener('scroll', closeAllMenus);

  mainButton.addEventListener("click", (event) => {
    event.stopPropagation();
    if (!mainButton.disabled) {
      isButtonClicked = !isButtonClicked;
      
      if (isButtonClicked) {
        mainButton.style.backgroundColor = buttonStyles.main.clickBackgroundColor;
        mainButton.style.color = buttonStyles.main.clickColor;
        svgElement.style.fill = buttonStyles.main.clickColor;
      } else {
        mainButton.style.backgroundColor = buttonStyles.main.backgroundColor;
        mainButton.style.color = buttonStyles.main.color;
        svgElement.style.fill = buttonStyles.main.color;
      }
  
      if (!isMenuOpen) {
        toggleMenu();
      } else {
        closeAllMenus();
      }
    }
  });
  
  document.addEventListener("click", (event) => {
    if (isMenuOpen && !mainButton.contains(event.target) && !menuContainer.contains(event.target)) {
      toggleMenu();
      isButtonClicked = false;
      mainButton.style.backgroundColor = buttonStyles.main.backgroundColor;
      mainButton.style.color = buttonStyles.main.color;
      svgElement.style.fill = buttonStyles.main.color;
      mainButton.style.filter = "brightness(1)";
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
    const { height: headerHeight, bottom: headerBottom } = getHeaderInfo();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const menuHeight = menuButtons.length * 34 + 16;
    const menuWidth = 163; 
    
    if (buttonRect.top <= headerHeight || buttonRect.bottom <= headerBottom) {
      closeAllMenus();
      return;
    }
    
    const spaceBelow = window.innerHeight - buttonRect.bottom;
    let topPosition = buttonRect.bottom + scrollTop + 8;
    
    if (spaceBelow < menuHeight) {
      topPosition = buttonRect.top + scrollTop - menuHeight - 8;
      if (topPosition < scrollTop + headerHeight) {
        closeAllMenus();
        return;
      }
    }
    
    const buttonCenter = buttonRect.left + (buttonRect.width / 2);
    const leftPosition = buttonCenter - (menuWidth / 2);
    
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

  async function addTracksToPlaylist(playlistId, trackUris, maxRetries = 5, initialDelay = 1000) {
    const BATCH_SIZE = 100;
    const playlistUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
    const validAndUniqueUris = [
      ...new Set(
        trackUris.filter(
          (uri) =>
            typeof uri === "string" &&
            uri.startsWith("spotify:track:") &&
            uri.length > "spotify:track:".length
        )
      ),
    ];

    if (validAndUniqueUris.length < trackUris.length) {
      console.warn(
        "Some track URIs were invalid or duplicates and have been removed."
      );
    }

    for (let i = 0; i < validAndUniqueUris.length; i += BATCH_SIZE) {
      const batch = validAndUniqueUris.slice(i, i + BATCH_SIZE);
      let retries = 0;
      let currentDelay = initialDelay;

      while (retries <= maxRetries) {
        try {
          await Spicetify.CosmosAsync.post(playlistUrl, {
            uris: batch,
          });
          break; 
        } catch (error) {
          console.error(
            `Error adding batch ${
              i / BATCH_SIZE + 1
            } to playlist (Attempt ${retries + 1}):`,
            error
          );
          if (retries === maxRetries) {
            throw new Error(
              `Failed to add batch ${
                i / BATCH_SIZE + 1
              } after ${maxRetries} retries.`,
              error
            );
          }

          retries++;
          await new Promise((resolve) => setTimeout(resolve, currentDelay));
          currentDelay *= 2;  
        }
      }
    }
  }

  async function setPlaylistVisibility(playlist, visibleForAll) {
    await Spicetify.Platform.PlaylistPermissionsAPI.setBasePermission(
        playlist,
        visibleForAll ? "VIEWER" : "BLOCKED"
    );
  }

  async function createPlaylist(
    name = "Sorted by Play Count",
    description = "Created with Spotify Playlist Sorter",
    maxRetries = 5,
    initialDelay = 1000
  ) {
    const user = await Spicetify.Platform.UserAPI.getUser();
    const createPlaylistUrl = `https://api.spotify.com/v1/users/${user.username}/playlists`;
    let retries = 0;
    let currentDelay = initialDelay;
    let newPlaylist = null;

    while (retries <= maxRetries) {
        try {
            newPlaylist = await Spicetify.CosmosAsync.post(createPlaylistUrl, {
                name: name,
                description: description
            });
            await setPlaylistVisibility(newPlaylist.uri, false);

            return newPlaylist;
        } catch (error) {
            console.error(`Error creating playlist (Attempt ${retries + 1}):`, error);

            if (retries === maxRetries) {
                throw new Error(`Failed to create playlist after ${maxRetries} retries.`, error);
            }

            retries++;
            await new Promise((resolve) => setTimeout(resolve, currentDelay));
            currentDelay *= 2;
        }
    }
  }

  async function handleSortAndCreatePlaylist(sortType) {
    if (sortType === "sortByParent") { 
      return;  
    }
    mainButton.disabled = true;
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
      let isArtistPage = false;

      if (URI.isPlaylistV1OrV2(currentUri)) {
        const playlistId = currentUri.split(":")[2];
        tracks = await getPlaylistTracks(playlistId);
      } else if (URI.isArtist(currentUri)) {
        tracks = await getArtistTracks(currentUri);
        isArtistPage = true;
      } else if (isLikedSongsPage(currentUri)) {
        tracks = await getLikedSongs();
      } else {
        throw new Error('Invalid playlist or artist page');
      }

      if (!tracks || tracks.length === 0) {
          throw new Error('No tracks found to sort');
      }
  
      if (!tracks || tracks.length === 0) {
        resetButtons();
        Spicetify.showNotification("Could not fetch tracks. Please try again.");
        return;
      }
      mainButton.innerText = "0%";
  
      const tracksWithPlayCounts = await processBatchesWithDelay(
        tracks,
        200,
        1000,
        (progress) => {
          mainButton.innerText = `${Math.floor(progress * 0.20)}%`;
        },
        getTrackDetailsWithPlayCount
      );
      const tracksWithIds = await processBatchesWithDelay(
        tracksWithPlayCounts,
        200,
        1000,
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
  
      let sortedTracks;
      let uniqueTracks;
      let removedTracks = [];
  
      if (
        sortType === "playCount" ||
        sortType === "popularity" ||
        sortType === "shuffle" ||
        sortType === "releaseDate"
      ) {
        if (sortType === "releaseDate") {
          const tracksWithReleaseDates = await processBatchesWithDelay(
            tracksWithPopularity,
            200,
            1000,
            (progress) => {
              mainButton.innerText = `${60 + Math.floor(progress * 0.20)}%`;
            },
            getTrackDetailsWithReleaseDate
          );
          uniqueTracks = deduplicateTracks(tracksWithReleaseDates).unique;
          removedTracks = deduplicateTracks(tracksWithReleaseDates).removed;
        } else {
          uniqueTracks = deduplicateTracks(tracksWithPopularity).unique;
          removedTracks = deduplicateTracks(tracksWithPopularity).removed;
        }
  
        if (sortType === "playCount") {
          sortedTracks = uniqueTracks
            .filter((track) => track.playCount !== "N/A")
            .sort((a, b) => b.playCount - a.playCount);
        } else if (sortType === "popularity") {
          sortedTracks = uniqueTracks
            .filter((track) => track.popularity !== null)
            .sort((a, b) => b.popularity - a.popularity);
        } else if (sortType === "releaseDate") {
          sortedTracks = uniqueTracks
            .filter((track) => track.releaseDate !== null)
            .sort((a, b) => {
              return releaseDateReverse
                ? a.releaseDate - b.releaseDate
                : b.releaseDate - a.releaseDate;
            });
        } else if (sortType === "shuffle") {
          sortedTracks = shuffleArray(uniqueTracks);
        }
  
        if (sortedTracks.length === 0) {
          resetButtons();
          Spicetify.showNotification(`No tracks found with ${sortType} data.`);
          return;
        }
  
        mainButton.innerText = "100%";
      } else if (sortType === "scrobbles" || sortType === "personalScrobbles") {
        try {
          const result = await handleScrobblesSorting(
            tracks,
            sortType,
            (progress) => {
              mainButton.innerText = `${60 + Math.floor(progress * 0.30)}%`;
            }
          );
          sortedTracks = result.sortedTracks;
          removedTracks = result.removedTracks;
          const totalTracks = sortedTracks.length;
          sortedTracks.forEach((_, index) => {
            const progress = 90 + Math.floor(((index + 1) / totalTracks) * 10);
            mainButton.innerText = `${progress}%`;
          });
        } catch (error) {
          resetButtons();
          Spicetify.showNotification(error.message);
          return;
        }
      } else if (sortType === "aiPick") {
        const { uniqueTracks, removedTracks: removedTracksFromAi } = await handleAiPick(
          tracks,
          (progress) => {
            mainButton.innerText = `${60 + Math.floor(progress * 0.30)}%`;
          }
        );
        removedTracks = removedTracksFromAi;
  
        if (uniqueTracks.length === 0) {
          resetButtons();
          Spicetify.showNotification("No tracks available for AI to pick from.");
          return;
        }
  
        let artistImageUrl = null;
        if (isArtistPage) {
          try {
            artistImageUrl = await getArtistImageUrl(sourceUri.split(":")[2]);
          } catch (error) {
            console.error("Error fetching artist image URL:", error);
          }
        }
  
        await showAiPickModal(uniqueTracks, artistImageUrl); 
        return;
      }
  
      const sourceUri = currentUri;
      let sourceName;
      
      if (URI.isArtist(sourceUri)) {
          sourceName = await Spicetify.CosmosAsync.get(
              `https://api.spotify.com/v1/artists/${sourceUri.split(":")[2]}`
          ).then((r) => r.name);
      } else if (isLikedSongsPage(sourceUri)) {
          sourceName = "Liked Songs";
      } else {
          sourceName = await Spicetify.CosmosAsync.get(
              `https://api.spotify.com/v1/playlists/${sourceUri.split(":")[2]}`
          ).then((r) => r.name);
      }
      
      const possibleSuffixes = [
        "\\(PlayCount\\)",
        "\\(Popularity\\)",
        "\\(ReleaseDate\\)",
        "\\(LFM Scrobbles\\)",
        "\\(LFM My Scrobbles\\)",
        "\\(Shuffle\\)",
        "\\(AI Pick\\)",
      ];

      let suffixPattern = new RegExp(
        `\\s*(${possibleSuffixes.join("|")})\\s*`
      );
      
      while (suffixPattern.test(sourceName)) {
        sourceName = sourceName.replace(suffixPattern, "");
      }

      const sortTypeInfo = {
        playCount: { fullName: "play count", shortName: "PlayCount" },
        popularity: { fullName: "popularity", shortName: "Popularity" },
        releaseDate: { fullName: "release date", shortName: "ReleaseDate" },
        scrobbles: { fullName: "Last.fm scrobbles", shortName: "LFM Scrobbles" },
        personalScrobbles: {
          fullName: "Last.fm personal scrobbles",
          shortName: "LFM My Scrobbles",
        },
        shuffle: { fullName: "shuffle", shortName: "Shuffle" },
        aiPick: { fullName: "AI pick", shortName: "AI Pick" },
      }[sortType];
      
      try {
        if (showRemovedDuplicates && removedTracks.length > 0 && !isArtistPage) {
          showRemovedTracksModal(removedTracks);
        }

        let playlistDescription = `Sorted by ${sortTypeInfo.fullName} using Sort-Play`;

        if(isArtistPage) {
          playlistDescription = `Discography of ${sourceName}: created and sorted by ${sortTypeInfo.fullName} using Sort-Play`
        }

        const newPlaylist = await createPlaylist(
          `${sourceName} (${sortTypeInfo.shortName})`,
          playlistDescription
        );
        mainButton.innerText = "Saving...";
        if (isArtistPage && sortType !== "aiPick") {
          try {
            const artistImageUrl = await getArtistImageUrl(sourceUri.split(":")[2]);
            if (artistImageUrl) {
              const base64Image = await toBase64(artistImageUrl);
              await setPlaylistImage(newPlaylist.id, base64Image);
            }
          } catch (error) {
            console.error("Error setting playlist image:", error);
          }
        }
        const trackUris = sortedTracks.map((track) => track.uri);
        await addTracksToPlaylist(newPlaylist.id, trackUris);
  
        Spicetify.showNotification(`Playlist sorted by ${sortTypeInfo.fullName}!`);
      } catch (error) {
        console.error("Error creating or updating playlist:", error);
        Spicetify.showNotification(
          `An error occurred while creating or updating the playlist. Please check your internet connection and try again.`
        );
      }
    } catch (error) {
      console.error("Error during sorting process:", error);
      Spicetify.showNotification(`An error occurred during the sorting process.`);
    } finally {
      resetButtons();
    }
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
  

  function deduplicateTracks(tracks) {
    const currentUri = getCurrentUri();
    if (!playlistDeduplicate && URI.isPlaylistV1OrV2(currentUri)) {
      return { unique: tracks, removed: [] };
    }
  
    const duplicateGroups = new Map();
  
    tracks.forEach((track) => {
      const hasValidPlayCount = track.playCount !== "N/A" && track.playCount !== 0;
      const primaryKey = `${track.playCount}-${track.durationMilis}`;
      const secondaryKey = `${track.songTitle}-${track.durationMilis}`;
      const key = hasValidPlayCount ? primaryKey : secondaryKey;
  
      if (!duplicateGroups.has(key)) {
        duplicateGroups.set(key, []);
      }
      duplicateGroups.get(key).push(track);
    });
  
    const uniqueTracks = [];
    const removedTracks = [];
    duplicateGroups.forEach((group) => {
      if (group.length > 1) {
        const validPlayCountTracks = group.filter(
          (track) => track.playCount !== "N/A" && track.playCount !== 0
        );
        const noOrZeroPlayCountTracks = group.filter(
          (track) => track.playCount === "N/A" || track.playCount === 0
        );
  
        let trackToKeep;
        if (validPlayCountTracks.length > 0) {
          validPlayCountTracks.sort(
            (a, b) => (b.popularity || 0) - (a.popularity || 0)
          );
          trackToKeep = validPlayCountTracks[0];
        } else if (noOrZeroPlayCountTracks.length > 0) {
          noOrZeroPlayCountTracks.sort(
            (a, b) => (b.popularity || 0) - (a.popularity || 0)
          );
          trackToKeep = noOrZeroPlayCountTracks[0];
        }
  
        uniqueTracks.push(trackToKeep);
        removedTracks.push(...group.filter(track => track !== trackToKeep));
      } else {
        uniqueTracks.push(group[0]);
      }
    });
  
    return { unique: uniqueTracks, removed: removedTracks };
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
  
    const tracksWithPlayCounts = await processBatchesWithDelay(
      tracks,
      200,
      1000,
      (progress) => {
        updateProgress(Math.floor(progress * 0.25)); 
      },
      getTrackDetailsWithPlayCount 
    );
  
    const tracksWithIds = await processBatchesWithDelay(
      tracksWithPlayCounts,
      200,
      1000,
      (progress) => {
        updateProgress(Math.floor(25+progress * 0.25));
      },
      collectTrackIdsForPopularity
    );
  
    const tracksWithPopularity = await fetchPopularityForMultipleTracks(
      tracksWithIds,
      (progress) => {
        updateProgress(Math.floor(50+progress * 0.1));
      }
    );
  
    let uniqueTracks;
    let removedTracks = [];
    const currentUri = getCurrentUri();
    
    if (!playlistDeduplicate && URI.isPlaylistV1OrV2(currentUri)) {
      uniqueTracks = tracksWithPopularity;
    } else {
      const deduplicationResult = deduplicateTracks(tracksWithPopularity);
      uniqueTracks = deduplicationResult.unique;
      removedTracks = deduplicationResult.removed;
      const duplicateGroups = new Map();
      tracksWithPopularity.forEach((track) => {
        const hasValidPlayCount = track.playCount !== "N/A" && track.playCount !== 0;
        const primaryKey = `${track.playCount}-${track.durationMilis}`;
        const secondaryKey = `${track.songTitle}-${track.durationMilis}`;  
        const key = hasValidPlayCount ? primaryKey : secondaryKey;
  
        if (!duplicateGroups.has(key)) {
          duplicateGroups.set(key, []);
        }
        duplicateGroups.get(key).push(track);
      });
      
      uniqueTracks = [];
      duplicateGroups.forEach((group) => {
        if (group.length > 1) {
          const validPlayCountTracks = group.filter(
            (track) => track.playCount !== "N/A" && track.playCount !== 0
          );
          const noOrZeroPlayCountTracks = group.filter(
            (track) => track.playCount === "N/A" || track.playCount === 0
          );
  
          if (validPlayCountTracks.length > 0) {
            validPlayCountTracks.sort(
              (a, b) => (b.popularity || 0) - (a.popularity || 0)
            );
            uniqueTracks.push(validPlayCountTracks[0]);
          } else if (noOrZeroPlayCountTracks.length > 0) {
            noOrZeroPlayCountTracks.sort(
              (a, b) => (b.popularity || 0) - (a.popularity || 0)
            );
            uniqueTracks.push(noOrZeroPlayCountTracks[0]);
          }
        } else {
          uniqueTracks.push(group[0]);
        }
      });
    }
  
    const fetchFunction = sortType === 'personalScrobbles' 
      ? getTrackDetailsWithPersonalScrobbles 
      : getTrackDetailsWithScrobbles;
  
    const tracksForScrobbleFetching = uniqueTracks.map(track => ({
      ...track,
      name: track.songTitle,
      artists: [{ name: track.artistName }] 
    }));
  
    const tracksWithScrobbles = await processBatchesWithDelay(
      tracksForScrobbleFetching,
      50,
      1000,
      (progress) => {
        updateProgress(Math.floor(75+progress*0.25));
      },
      fetchFunction
    );
  
    let sortedTracks;
    if (sortType === 'personalScrobbles') {
      const includeZeroScrobbles = localStorage.getItem("sort-play-include-zero-scrobbles") === "true";
      sortedTracks = tracksWithScrobbles
        .filter((track) => includeZeroScrobbles || track.personalScrobbles > 0)
        .sort((a, b) => (b.personalScrobbles ?? 0) - (a.personalScrobbles ?? 0));
    } else {
      sortedTracks = tracksWithScrobbles
        .filter((track) => track.scrobbles !== null)
        .sort((a, b) => b.scrobbles - a.scrobbles);
    }
  
    if (sortedTracks.length === 0) {
      throw new Error(`No tracks found with ${sortType === 'personalScrobbles' ? 'personal ' : ''}Last.fm data to sort.`);
    }
  
    return { sortedTracks, removedTracks };
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

    if (buttonStyle.isSetting) {
      element.addEventListener("click", (event) => {
        event.stopPropagation();
        showSettingsModal();
      });
    } else {
      const sortType = buttonStyle.sortType;
      element.addEventListener("click", async (event) => {
        event.stopPropagation();
        if (buttonStyle.onClick) {
          await buttonStyle.onClick(event);
        } else if (sortType === "genreFilter") {
          mainButton.disabled = true;
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
            }else {
              throw new Error("Invalid URI type");
            }

            if (!tracks || tracks.length === 0) {
              throw new Error("No tracks found");
            }

            const { allGenres, trackGenreMap, tracksWithGenresCount} = await fetchAllTrackGenres(
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
    mainButton.disabled = false;
    mainButton.innerText = "Sort Play"; 
    mainButton.appendChild(svgElement); 
    mainButton.style.backgroundColor = buttonStyles.main.backgroundColor;
    mainButton.style.cursor = "pointer";
    mainButton.style.color = buttonStyles.main.color;
    svgElement.style.fill = buttonStyles.main.color; 
    mainButton.style.filter = "brightness(1)";
    isButtonClicked = false;
    menuButtons.forEach((button) => {
      button.disabled = false;
    });
  }

  function getTracklistTrackUri(tracklistElement) {
      let values = Object.values(tracklistElement);
      if (!values) {
          console.log("Error: Could not get tracklist element");
          return null;
      }
      return (
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

  const CACHE_KEY = 'spotify-play-count-cache';
  const CACHE_TIMESTAMP_KEY = 'spotify-play-count-cache-timestamp';
  const CACHE_EXPIRY_DAYS = 2;

  function initializeCache() {
    const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
    if (!timestamp) {
      localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
      localStorage.setItem(CACHE_KEY, JSON.stringify({}));
      return;
    }

    const daysPassed = (Date.now() - parseInt(timestamp)) / (1000 * 60 * 60 * 24);
    if (daysPassed >= CACHE_EXPIRY_DAYS) {
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

  async function loadPlayCounts(tracklist_) {
    initializeCache();

    const tracks = Array.from(tracklist_.getElementsByClassName("main-trackList-trackListRow"))
        .filter(track => {
            const playCountElement = track.querySelector(".sort-play-playcount");
            const trackUri = getTracklistTrackUri(track);
            const isTrack = trackUri && trackUri.includes("track");
            return playCountElement && playCountElement.textContent === "" && isTrack && trackUri;
        });
        
    const BATCH_SIZE = 10;
    for (let i = 0; i < tracks.length; i += BATCH_SIZE) {
        const batch = tracks.slice(i, i + BATCH_SIZE);
        await Promise.all(batch.map(async (track) => {
            try {
                const playCountElement = track.querySelector(".sort-play-playcount");
                if (!playCountElement) return;

                const trackUri = getTracklistTrackUri(track);
                if (!trackUri) {
                    playCountElement.textContent = "_";
                    return;
                }

                const trackId = trackUri.split(":")[2];

                const cachedCount = getCachedPlayCount(trackId);
                if (cachedCount !== null) {
                    updatePlayCountDisplay(playCountElement, cachedCount);
                    return;
                }

                const albumLinkElement = track.querySelector(
                    ".main-trackList-rowSectionVariable:nth-child(3) a.standalone-ellipsis-one-line"
                );

                if (!albumLinkElement?.href) {
                    updatePlayCountDisplay(playCountElement, "_");
                    setCachedPlayCount(trackId, "_");
                    return;
                }

                const albumId = albumLinkElement.href.split("/album/")[1];
                if (!albumId) {
                    updatePlayCountDisplay(playCountElement, "_");
                    setCachedPlayCount(trackId, "_");
                    return;
                }

                const trackDetails = {
                    uri: trackUri,
                    name: track.querySelector(".main-trackList-rowTitle")?.textContent || "",
                    albumUri: `spotify:album:${albumId}`,
                    track: { album: { id: albumId }, id: trackId }
                };

                const result = await Promise.race([
                    getTrackDetailsWithPlayCount(trackDetails),
                    new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
                ]);

                if (result?.playCount === null || result?.playCount === 0) {
                    updatePlayCountDisplay(playCountElement, "_");
                    setCachedPlayCount(trackId, "_");
                } else {
                    updatePlayCountDisplay(playCountElement, result.playCount);
                    setCachedPlayCount(trackId, result.playCount);
                }

            } catch (error) {
                console.error("Error processing track:", error);
                const playCountElement = track.querySelector(".sort-play-playcount");
                if (playCountElement) {
                    updatePlayCountDisplay(playCountElement, "_");
                }
            }
        }));
    }
  }

  function updatePlayCountDisplay(element, count) {
    if (!element) return;
    if (count !== "_" && (isNaN(count) || count === null || count === undefined)) {
        element.textContent = "_";
    } else {
        element.textContent = count === "_" ? "_" : new Intl.NumberFormat('en-US').format(count);
    }
    
    element.style.fontSize = "14px";
    element.style.fontWeight = "400";
    element.style.color = "var(--spice-subtext)";
  }


  let isUpdatingTracklist = false;
  let tracklistObserver;
  async function updateTracklist() {
    if (isUpdatingTracklist || !columnPlayCount) return;

    const currentUri = getCurrentUri();
    if (!currentUri || !(URI.isPlaylistV1OrV2(currentUri) || isLikedSongsPage(currentUri))) return;
  
    try {
      isUpdatingTracklist = true;
  
      const tracklists = document.getElementsByClassName("main-trackList-indexable");
      if (!tracklists.length) return;
  
      for (const tracklist_ of tracklists) {
        if (!tracklist_) continue;

        await updateTracklistStructure(tracklist_);

        requestAnimationFrame(() => {
          loadPlayCounts(tracklist_);
        });
      }
    } finally {
      isUpdatingTracklist = false;
    }
  }
  
  async function updateTracklistStructure(tracklist_) {
    const currentUri = getCurrentUri();
    if (!currentUri || !(URI.isPlaylistV1OrV2(currentUri) || isLikedSongsPage(currentUri))) return;
    
    const currentPlaylistName = getCurrentPlaylistName();
    const isExcludedPlaylist = excludedPlaylistNames.includes(currentPlaylistName);
    const shouldRemoveDateAdded = removeDateAdded && !isExcludedPlaylist;
  
    const gridCss = getGridCss(shouldRemoveDateAdded);
  
    const tracklistHeader = tracklist_.querySelector(".main-trackList-trackListHeaderRow");
    if (tracklistHeader && !tracklistHeader.querySelector(".sort-play-header")) {
      const hasPlaysColumn = !!tracklistHeader.querySelector(".main-trackList-playsHeader");
      if (hasPlaysColumn) return; 

      let lastColumn = tracklistHeader.querySelector(".main-trackList-rowSectionEnd");
      let colIndexInt = parseInt(lastColumn.getAttribute("aria-colindex"));
  
      switch (colIndexInt) {
        case 4: tracklistHeader.setAttribute("style", gridCss.fiveColumnGridCss); break;
        case 5: tracklistHeader.setAttribute("style", gridCss.sixColumnGridCss); break;
        case 6: tracklistHeader.setAttribute("style", gridCss.sevenColumnGridCss); break;
      }
  
      const headerInsertionPoint = !shouldRemoveDateAdded
        ? lastColumn
        : tracklistHeader.querySelector('[aria-colindex="4"]');
      
      lastColumn.setAttribute("aria-colindex", (colIndexInt + 1).toString());
      let headerColumn = document.createElement("div");
      headerColumn.style.display = "flex";
      headerColumn.classList.add("main-trackList-rowSectionVariable");
      headerColumn.classList.add("sort-play-column");
      headerColumn.role = "columnheader";
      tracklistHeader.insertBefore(headerColumn, headerInsertionPoint);
  
      var btn = document.createElement("button");
      btn.classList.add("main-trackList-column");
      btn.classList.add("main-trackList-sortable");
      btn.classList.add("sort-play-header");
      var title = document.createElement("span");
      title.classList.add("TypeElement-mesto-type");
      title.classList.add("standalone-ellipsis-one-line");
      title.innerText = "Plays";
      btn.appendChild(title);
      headerColumn.appendChild(btn);
    }
  
    const tracks = tracklist_.getElementsByClassName("main-trackList-trackListRow");
    for (const track of tracks) {
      if (track.querySelector(".sort-play-playcount-column")) continue;
      
      const tracklistHeader = tracklist_.querySelector(".main-trackList-trackListHeaderRow");
      const hasPlaysColumn = !!tracklistHeader.querySelector(".main-trackList-playsHeader");
      if (hasPlaysColumn) continue;

      let lastColumn = track.querySelector(".main-trackList-rowSectionEnd");
      if (!lastColumn) continue;
      
      let colIndexInt = parseInt(lastColumn.getAttribute("aria-colindex"));
  
      switch (colIndexInt) {
        case 4: track.setAttribute("style", gridCss.fiveColumnGridCss); break;
        case 5: track.setAttribute("style", gridCss.sixColumnGridCss); break;
        case 6: track.setAttribute("style", gridCss.sevenColumnGridCss); break;
      }
  
      const insertionPoint = !shouldRemoveDateAdded
        ? lastColumn
        : track.querySelector('[aria-colindex="4"]');
      
      lastColumn.setAttribute("aria-colindex", (colIndexInt + 1).toString());
      
      let playCountColumn = document.createElement("div");
      playCountColumn.setAttribute("aria-colindex", colIndexInt.toString());
      playCountColumn.style.display = "flex";
      playCountColumn.style.justifyContent = "center";
      playCountColumn.style.alignItems = "center";
      playCountColumn.classList.add("main-trackList-rowSectionVariable");
      playCountColumn.classList.add("sort-play-playcount-column");
      playCountColumn.classList.add("sort-play-column");
  
      const playCountElement = document.createElement("span");
      playCountElement.classList.add("sort-play-playcount");
      playCountElement.textContent = "";
      playCountElement.style.fontSize = "14px";
      playCountElement.style.fontWeight = "400";
      playCountElement.style.color = "var(--spice-subtext)";
      playCountColumn.appendChild(playCountElement);
      
      track.insertBefore(playCountColumn, insertionPoint);
    }
  }
  
  const getGridCss = (removeDateAdded) => {
    if (removeDateAdded) {
      return {
        fiveColumnGridCss: "grid-template-columns: [index] 16px [first] 4fr [var1] 2fr [spacer] -300px [var2] 2fr [last] minmax(120px,1fr) !important",
        sixColumnGridCss: "grid-template-columns: [index] 16px [first] 5fr [var1] 3fr [var2] 2fr [spacer] -300px [var3] 2fr [last] minmax(120px,1fr) !important",
        sevenColumnGridCss: "grid-template-columns: [index] 16px [first] 5fr [var1] 3fr [var2] 2fr [var3] minmax(120px,1fr) [spacer] -300px [var4] 2fr [last] minmax(120px,1fr) !important"
      };
    }
    return {
      fiveColumnGridCss: "grid-template-columns: [index] 16px [first] 4fr [var1] 2fr [var2] 2fr [last] minmax(120px,1fr) !important",
      sixColumnGridCss: "grid-template-columns: [index] 16px [first] 5fr [var1] 3fr [var2] 2fr [var3] 2fr [last] minmax(120px,1fr) !important",
      sevenColumnGridCss: "grid-template-columns: [index] 16px [first] 5fr [var1] 3fr [var2] 2fr [var3] minmax(120px,1fr) [var4] 2fr [last] minmax(120px,1fr) !important"
    };
  };

  let updateDebounceTimeout;
  tracklistObserver = new MutationObserver(async (mutations) => {
    clearTimeout(updateDebounceTimeout);
    updateDebounceTimeout = setTimeout(() => {
      for (const mutation of mutations) {
        for (const addedNode of mutation.addedNodes) {
          if (addedNode.classList?.contains("main-trackList-indexable")) {
            updateTracklist();
            return;
          }
        }
      }
      updateTracklist();
    }, 100);
  });
    
  async function initializeTracklistObserver() {
    const currentUri = getCurrentUri();
    if (!currentUri || !(URI.isPlaylistV1OrV2(currentUri) || isLikedSongsPage(currentUri))) return;

    const tracklist = await waitForElement(".main-trackList-indexable");
    if (!tracklist) return;

    updateTracklist();
    tracklistObserver.observe(tracklist.parentElement, {
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
    } else if (currentUri === "spotify:collection:tracks") {
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
    }
  }
  
  insertButton();

  const observer = new MutationObserver(() => {
    const currentUri = getCurrentUri();
    if (currentUri && (URI.isPlaylistV1OrV2(currentUri) || URI.isArtist(currentUri) || isLikedSongsPage(currentUri))) {
      if (!document.body.contains(mainButton)) {
        insertButton();
      }

      if (URI.isPlaylistV1OrV2(currentUri) || isLikedSongsPage(currentUri)) {
          initializeTracklistObserver();
      }
    }
  });

    observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
    loadSettings();
    initializeCache();
    console.log(`Sort-Play loaded`);
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = main;
  } else {
    await main();
  }
})();
