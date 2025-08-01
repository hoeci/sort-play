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

  const SORT_PLAY_VERSION = "5.1.9";

  const LFMApiKey = "***REMOVED***";
  let isProcessing = false;
  let showAdditionalColumn = false;
  let selectedColumnType = 'playCount';
  let releaseDateFormat = 'YYYY-MM-DD';
  let showAlbumColumn = false;
  let showArtistColumn = false; 
  let removeDateAdded = false;
  let playlistDeduplicate = true;
  let showRemovedDuplicates = false;
  let includeSongStats = true;
  let includeLyrics = false;
  let matchAllGenres  = false;
  let includeaudiofeatures = false;
  let addToQueueEnabled = true; 
  let createPlaylistAfterSort = true; 
  let sortCurrentPlaylistEnabled = false;
  let openPlaylistAfterSortEnabled = true;
  let placePlaylistsInFolder = false;
  let sortPlayFolderName = "Sort-Play Library";
  let myScrobblesDisplayMode = 'number';
  let selectedAlbumColumnType = 'releaseDate';
  let selectedArtistColumnType = 'releaseDate';
  let selectedAiModel = "gemini-2.5-flash";
  let topTracksLimit = 100;
  let discoveryPlaylistSize = 50;
  let newReleasesDaysLimit = 14;
  let followedReleasesAlbumLimit = 'all';
  let colorThiefLib = null;
  let colorSortMode = 'perceptual';
  let setDedicatedPlaylistCovers = true;
  const STORAGE_KEY_LASTFM_USERNAME = "sort-play-lastfm-username";
  const STORAGE_KEY_GENRE_FILTER_SORT = "sort-play-genre-filter-sort";
  const STORAGE_KEY_USER_SYSTEM_INSTRUCTION = "sort-play-user-system-instruction";
  const STORAGE_KEY_ADD_TO_QUEUE = "sort-play-add-to-queue";
  const STORAGE_KEY_CREATE_PLAYLIST = "sort-play-create-playlist";
  const STORAGE_KEY_SORT_CURRENT_PLAYLIST = "sort-play-sort-current-playlist";
  const STORAGE_KEY_OPEN_PLAYLIST_AFTER_SORT = "sort-play-open-playlist-after-sort";
  const STORAGE_KEY_PLACE_PLAYLISTS_IN_FOLDER = "sort-play-place-playlists-in-folder";
  const STORAGE_KEY_SORT_PLAY_FOLDER_NAME = "sort-play-folder-name";
  const STORAGE_KEY_UPDATE_BEHAVIOR_SETTINGS = "sort-play-update-behavior-settings";
  const STORAGE_KEY_DEDICATED_PLAYLIST_MAP = "sort-play-dedicated-playlist-map";
  const STORAGE_KEY_COLOR_SORT_MODE = "sort-play-color-sort-mode";
  const STORAGE_KEY_TOP_TRACKS_LIMIT = "sort-play-top-tracks-limit";
  const STORAGE_KEY_NEW_RELEASES_LIMIT = "sort-play-new-releases-limit";
  const STORAGE_KEY_FOLLOWED_RELEASES_LIMIT = "sort-play-followed-releases-limit";
  const STORAGE_KEY_DISCOVERY_PLAYLIST_SIZE = "sort-play-discovery-playlist-size";
  const STORAGE_KEY_SET_DEDICATED_PLAYLIST_COVERS = "sort-play-set-dedicated-playlist-covers";




  const DEDICATED_PLAYLIST_COVERS = {
    'topThisMonth': 'https://cdn.jsdelivr.net/gh/hoeci/sort-play@a60f56c9d251980034b8a77af1601bc9f8cb1352/assets/base-covers/top-m.png',
    'topLast6Months': 'https://cdn.jsdelivr.net/gh/hoeci/sort-play@a60f56c9d251980034b8a77af1601bc9f8cb1352/assets/base-covers/top-6.png',
    'topAllTime': 'https://cdn.jsdelivr.net/gh/hoeci/sort-play@a60f56c9d251980034b8a77af1601bc9f8cb1352/assets/base-covers/top-all.png',
    'followedReleasesChronological': 'https://cdn.jsdelivr.net/gh/hoeci/sort-play@a60f56c9d251980034b8a77af1601bc9f8cb1352/assets/base-covers/new-followed-full.png',
    'followedArtistPicks': 'https://cdn.jsdelivr.net/gh/hoeci/sort-play@a60f56c9d251980034b8a77af1601bc9f8cb1352/assets/base-covers/new-followed-pick.png',
    'newDiscoveryPicks': 'https://cdn.jsdelivr.net/gh/hoeci/sort-play@a60f56c9d251980034b8a77af1601bc9f8cb1352/assets/base-covers/new-picks.png',
    'recommendRecentVibe': 'https://cdn.jsdelivr.net/gh/hoeci/sort-play@a60f56c9d251980034b8a77af1601bc9f8cb1352/assets/base-covers/discovery-recent.png',
    'recommendAllTime': 'https://cdn.jsdelivr.net/gh/hoeci/sort-play@a60f56c9d251980034b8a77af1601bc9f8cb1352/assets/base-covers/discovery-all.png',
    'pureDiscovery': 'https://cdn.jsdelivr.net/gh/hoeci/sort-play@a60f56c9d251980034b8a77af1601bc9f8cb1352/assets/base-covers/discovery-pure.png',
  };

  const DEFAULT_USER_SYSTEM_INSTRUCTION = `You are a music expert tasked with providing a list of Spotify track URIs that best match a user request. Based on the provided playlist or artist discography. Carefully analyze and utilize all provided information about each track, including song statistics, lyrics, and any other available data, to make the best possible selections.
  - Prioritize tracks based on their relevance to the user's request, considering mood, themes, genres, and lyrical content.
  - Order the URIs by how closely each track aligns with the overall intent of the request.`;

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
    averageColor: false
  };

  function loadSettings() {
    showAdditionalColumn = localStorage.getItem("sort-play-show-additional-column") === "true";
    showAlbumColumn = localStorage.getItem("sort-play-show-album-column") === "true";
    showArtistColumn = localStorage.getItem("sort-play-show-artist-column") === "true";
    selectedColumnType = localStorage.getItem("sort-play-selected-column-type") || "playCount";
    selectedAlbumColumnType = localStorage.getItem("sort-play-selected-album-column-type") || "releaseDate";
    selectedArtistColumnType = localStorage.getItem("sort-play-selected-artist-column-type") || "releaseDate"; 
    releaseDateFormat = localStorage.getItem("sort-play-release-date-format") || 'YYYY-MM-DD';
    removeDateAdded = localStorage.getItem("sort-play-remove-date-added") === "true";
    playlistDeduplicate = localStorage.getItem("sort-play-playlist-deduplicate") !== "false";
    showRemovedDuplicates = localStorage.getItem("sort-play-show-removed-duplicates") === "true";
    includeSongStats = localStorage.getItem("sort-play-include-song-stats") !== "false";
    includeLyrics = localStorage.getItem("sort-play-include-lyrics") === "true";
    selectedAiModel = localStorage.getItem("sort-play-ai-model") || "gemini-2.5-flash";
    userSystemInstruction = localStorage.getItem(STORAGE_KEY_USER_SYSTEM_INSTRUCTION) || DEFAULT_USER_SYSTEM_INSTRUCTION;
    matchAllGenres = localStorage.getItem("sort-play-match-all-genres") === "true";
    includeaudiofeatures = localStorage.getItem("sort-play-include-audio-features") === "true";
    const addToQueueStored = localStorage.getItem(STORAGE_KEY_ADD_TO_QUEUE);
    addToQueueEnabled = addToQueueStored === null ? true : addToQueueStored === "true";
    createPlaylistAfterSort = localStorage.getItem(STORAGE_KEY_CREATE_PLAYLIST) !== "false";
    const sortCurrentPlaylistStored = localStorage.getItem(STORAGE_KEY_SORT_CURRENT_PLAYLIST);
    sortCurrentPlaylistEnabled = sortCurrentPlaylistStored === null ? false : sortCurrentPlaylistStored === "true";
    const openPlaylistStored = localStorage.getItem(STORAGE_KEY_OPEN_PLAYLIST_AFTER_SORT);
    openPlaylistAfterSortEnabled = openPlaylistStored === null ? true : openPlaylistStored === "true";
    myScrobblesDisplayMode = localStorage.getItem("sort-play-my-scrobbles-display-mode") || 'number';
    colorSortMode = localStorage.getItem(STORAGE_KEY_COLOR_SORT_MODE) || 'perceptual';
    topTracksLimit = parseInt(localStorage.getItem(STORAGE_KEY_TOP_TRACKS_LIMIT), 10) || 100;
    newReleasesDaysLimit = parseInt(localStorage.getItem(STORAGE_KEY_NEW_RELEASES_LIMIT), 10) || 14;
    followedReleasesAlbumLimit = localStorage.getItem(STORAGE_KEY_FOLLOWED_RELEASES_LIMIT) || 'all';
    discoveryPlaylistSize = parseInt(localStorage.getItem(STORAGE_KEY_DISCOVERY_PLAYLIST_SIZE), 10) || 50;
    placePlaylistsInFolder = localStorage.getItem(STORAGE_KEY_PLACE_PLAYLISTS_IN_FOLDER) === "true";
    sortPlayFolderName = localStorage.getItem(STORAGE_KEY_SORT_PLAY_FOLDER_NAME) || "Sort-Play Library";
    const setDedicatedCoversStored = localStorage.getItem(STORAGE_KEY_SET_DEDICATED_PLAYLIST_COVERS);
    setDedicatedPlaylistCovers = setDedicatedCoversStored === null ? true : setDedicatedCoversStored === "true";
  
    for (const sortType in sortOrderState) {
        const storedValue = localStorage.getItem(`sort-play-${sortType}-reverse`);
        if (storedValue !== null) {
            sortOrderState[sortType] = storedValue === "true";
        }
    }
  }
  
  function saveSettings() {
    localStorage.setItem("sort-play-show-additional-column", showAdditionalColumn); 
    localStorage.setItem("sort-play-show-album-column", showAlbumColumn);
    localStorage.setItem("sort-play-show-artist-column", showArtistColumn); 
    localStorage.setItem("sort-play-selected-column-type", selectedColumnType);
    localStorage.setItem("sort-play-selected-album-column-type", selectedAlbumColumnType);
    localStorage.setItem("sort-play-selected-artist-column-type", selectedArtistColumnType);
    localStorage.setItem("sort-play-release-date-format", releaseDateFormat);
    localStorage.setItem("sort-play-remove-date-added", removeDateAdded);
    localStorage.setItem("sort-play-playlist-deduplicate", playlistDeduplicate);
    localStorage.setItem("sort-play-show-removed-duplicates", showRemovedDuplicates);
    localStorage.setItem("sort-play-include-song-stats", includeSongStats);
    localStorage.setItem("sort-play-include-lyrics", includeLyrics);
    localStorage.setItem("sort-play-ai-model", selectedAiModel);
    localStorage.setItem(STORAGE_KEY_USER_SYSTEM_INSTRUCTION, userSystemInstruction);
    localStorage.setItem("sort-play-match-all-genres", matchAllGenres);
    localStorage.setItem("sort-play-include-audio-features", includeaudiofeatures);
    localStorage.setItem(STORAGE_KEY_ADD_TO_QUEUE, addToQueueEnabled);
    localStorage.setItem(STORAGE_KEY_CREATE_PLAYLIST, createPlaylistAfterSort);
    localStorage.setItem(STORAGE_KEY_SORT_CURRENT_PLAYLIST, sortCurrentPlaylistEnabled);
    localStorage.setItem(STORAGE_KEY_OPEN_PLAYLIST_AFTER_SORT, openPlaylistAfterSortEnabled);
    localStorage.setItem("sort-play-my-scrobbles-display-mode", myScrobblesDisplayMode);
    localStorage.setItem(STORAGE_KEY_COLOR_SORT_MODE, colorSortMode);
    localStorage.setItem(STORAGE_KEY_TOP_TRACKS_LIMIT, topTracksLimit);
    localStorage.setItem(STORAGE_KEY_NEW_RELEASES_LIMIT, newReleasesDaysLimit);
    localStorage.setItem(STORAGE_KEY_FOLLOWED_RELEASES_LIMIT, followedReleasesAlbumLimit);
    localStorage.setItem(STORAGE_KEY_DISCOVERY_PLAYLIST_SIZE, discoveryPlaylistSize);
    localStorage.setItem(STORAGE_KEY_PLACE_PLAYLISTS_IN_FOLDER, placePlaylistsInFolder);
    localStorage.setItem(STORAGE_KEY_SORT_PLAY_FOLDER_NAME, sortPlayFolderName);
    localStorage.setItem(STORAGE_KEY_SET_DEDICATED_PLAYLIST_COVERS, setDedicatedPlaylistCovers);

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
    }
    .sort-play-settings-footer .github-link-container {
        display: flex;
        justify-content: center;
        align-items: center;
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
        max-height: 225px;
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
        visibility: hidden; position: absolute; z-index: 1; background-color: #282828;
        color: white; padding: 8px 12px; border-radius: 4px; font-size: 14px;
        max-width: 240px; width: max-content; bottom: 100%; left: 50%;
        transform: translateX(-50%); margin-bottom: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        line-height: 1.4; word-wrap: break-word;
    }
    .custom-tooltip::after {
        content: ""; position: absolute; top: 100%; left: 50%; margin-left: -5px;
        border-width: 5px; border-style: solid; border-color: #282828 transparent transparent transparent;
    }
    .tooltip-container:hover .custom-tooltip { visibility: visible; }
    .version-tag { font-size: 14px; color: #888; margin-left: 12px; vertical-align: middle; }
    .sort-play-settings .switch.disabled .sliderx { opacity: 0.5; cursor: not-allowed; }
    .sort-play-settings .setting-row.forced .col.description { opacity: 0.7; }
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
                <span class="custom-tooltip">Adds tracks to queue after direct sorts (Play Count, Popularity, Date, LFM, Shuffle). Filters & AI Pick excluded.</span>
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
                <span class="custom-tooltip">If 'Create Playlist' is on, this sorts your owned playlist directly instead of making a new one.</span>
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
            Open Playlist After Sorting
            <span class="tooltip-container">
                <span style="color: #888; margin-left: 4px; font-size: 12px; cursor: help;">?</span>
                <span class="custom-tooltip">Automatically navigates to the created or modified playlist after sorting is complete.</span>
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

    <div class="setting-row" id="colorSortModeSetting">
        <label class="col description">
            Color Sort Mode
            <span class="tooltip-container">
                <span style="color: #888; margin-left: 4px; font-size: 12px; cursor: help;">?</span>
                <span class="custom-tooltip">"Perceptual" groups black & white albums first. "Hue Gradient" creates a pure rainbow effect.</span>
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

    <div class="setting-row" id="playlistBehaviorSettingRow">
        <label class="col description">
            Update Existing Playlists
            <span class="tooltip-container">
                <span style="color: #888; margin-left: 4px; font-size: 12px; cursor: help;">?</span>
                <span class="custom-tooltip">Instead of creating new playlists each time, update a single, persistent playlist for each type.</span>
            </span>
        </label>
        <div class="col action">
            <button id="playlistBehaviorSettingsBtn" class="column-settings-button" title="Configure Playlist Update Behavior">
                ${settingsSvg}
            </button>
        </div>
    </div>

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
            <select id="topTracksLimitSelect" style="max-width: 120px;">
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
            <select id="discoveryPlaylistSizeSelect" style="max-width: 120px;">
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

    <div style="color: white; font-weight: bold; font-size: 18px; margin-top: 10px;">
        Custom Filter
    </div>
    <div style="border-bottom: 1px solid #555; margin-top: -3px;"></div>

    <div class="setting-row" id="includeAudioFeatures">
        <label class="col description">Include Audio Features</label>
        <div class="col action">
            <label class="switch">
                <input type="checkbox" ${includeaudiofeatures ? 'checked' : ''}>
                <span class="sliderx"></span>
            </label>
        </div>
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
            <div class="github-link-container">
                <a href="https://github.com/hoeci/sort-play" target="_blank">Star on GitHub, report bugs, and suggest features!</a>
            </div>
        `;
        modalRootElement.appendChild(footerElement);
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
    const includeAudioFeaturesToggle = modalContainer.querySelector("#includeAudioFeatures input");
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
    const openPlaylistAfterSortSwitchLabel = modalContainer.querySelector("#openPlaylistAfterSortSwitchLabel");
    const openPlaylistAfterSortSettingRow = modalContainer.querySelector("#openPlaylistAfterSortSettingRow");
    const colorSortModeSelect = modalContainer.querySelector("#colorSortModeSelect");
    const topTracksLimitSelect = modalContainer.querySelector("#topTracksLimitSelect");
    const newReleasesLimitSelect = modalContainer.querySelector("#newReleasesLimitSelect");
    const followedReleasesLimitSelect = modalContainer.querySelector("#followedReleasesLimitSelect");
    const discoveryPlaylistSizeSelect = modalContainer.querySelector("#discoveryPlaylistSizeSelect");
    const placePlaylistsInFolderToggle = modalContainer.querySelector("#placePlaylistsInFolderToggle");
    const folderNameSettingsBtn = modalContainer.querySelector("#folderNameSettingsBtn");
    const playlistBehaviorSettingsBtn = modalContainer.querySelector("#playlistBehaviorSettingsBtn");
    const setDedicatedCoversToggle = modalContainer.querySelector("#setDedicatedCoversToggle");

    function updateOpenPlaylistAfterSortToggleState() {
      const isCreatePlaylistOn = createPlaylistToggle.checked;
      const isModifyCurrentPlaylistActive = sortCurrentPlaylistToggle.checked && !sortCurrentPlaylistToggle.disabled;
      const shouldBeEnabled = (isCreatePlaylistOn && !isModifyCurrentPlaylistActive) || isModifyCurrentPlaylistActive;
      openPlaylistAfterSortToggle.disabled = !shouldBeEnabled;
      openPlaylistAfterSortSwitchLabel.classList.toggle("disabled", !shouldBeEnabled);
      openPlaylistAfterSortSettingRow.classList.toggle("dependent-disabled", !shouldBeEnabled);
      openPlaylistAfterSortToggle.checked = openPlaylistAfterSortEnabled;
    }

    function updateSortCurrentPlaylistToggleState() {
        const isCreatePlaylistOn = createPlaylistToggle.checked;
        sortCurrentPlaylistToggle.disabled = !isCreatePlaylistOn;
        sortCurrentPlaylistSwitchLabel.classList.toggle("disabled", !isCreatePlaylistOn);
        sortCurrentPlaylistSettingRow.classList.toggle("dependent-disabled", !isCreatePlaylistOn);

        const isModifyCurrentOn = sortCurrentPlaylistToggle.checked && !sortCurrentPlaylistToggle.disabled;
        placePlaylistsInFolderToggle.disabled = isModifyCurrentOn;
        document.getElementById('placePlaylistsInFolderSwitchLabel').classList.toggle("disabled", isModifyCurrentOn);
        document.getElementById('placePlaylistsInFolderSettingRow').classList.toggle("dependent-disabled", isModifyCurrentOn);
        folderNameSettingsBtn.disabled = isModifyCurrentOn || !placePlaylistsInFolderToggle.checked;

        if (!isCreatePlaylistOn) {
            sortCurrentPlaylistToggle.checked = false;
        } else {
            sortCurrentPlaylistToggle.checked = sortCurrentPlaylistEnabled;
        }
        updateOpenPlaylistAfterSortToggleState();
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

    playlistBehaviorSettingsBtn.addEventListener("click", () => {
        showPlaylistBehaviorModal();
    });

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

    sortCurrentPlaylistToggle.addEventListener("change", () => {
        if (!sortCurrentPlaylistToggle.disabled) {
            sortCurrentPlaylistEnabled = sortCurrentPlaylistToggle.checked;
            updateOpenPlaylistAfterSortToggleState();
            saveSettings();
        }
    });

    openPlaylistAfterSortToggle.addEventListener("change", () => {
        if (!openPlaylistAfterSortToggle.disabled) {
            openPlaylistAfterSortEnabled = openPlaylistAfterSortToggle.checked;
            saveSettings();
        }
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

    removeDateAddedToggle.disabled = !showAdditionalColumn;
    removeDateAddedToggle.parentElement.classList.toggle("disabled", !showAdditionalColumn);
    columnTypeSelect.disabled = !showAdditionalColumn;
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
    updateAlbumColumnSettingsVisibility();
    updateArtistColumnSettingsVisibility();

    const allDropdownsForScroll = [
        dateFormatDropdownContainer, myScrobblesDropdownContainer,
        albumDateFormatDropdownContainer, albumMyScrobblesDropdownContainer,
        artistDateFormatDropdownContainer, artistMyScrobblesDropdownContainer
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
        removeDateAddedToggle.disabled = !showAdditionalColumn;
        removeDateAddedToggle.parentElement.classList.toggle("disabled", !showAdditionalColumn);
        if (!showAdditionalColumn) {
            removeDateAdded = false;
            removeDateAddedToggle.checked = false;
        }
        updatePlaylistColumnSettingsVisibility();
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

    const allDateFormatContainers = [dateFormatDropdownContainer, albumDateFormatDropdownContainer, artistDateFormatDropdownContainer];
    const allScrobbleContainers = [myScrobblesDropdownContainer, albumMyScrobblesDropdownContainer, artistMyScrobblesDropdownContainer];

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

            dropdown.style.visibility = 'hidden';
            dropdown.style.display = 'block';
            const dropdownRect = dropdown.getBoundingClientRect();
            dropdown.style.display = 'none';
            dropdown.style.visibility = 'visible';

            const buttonRect = button.getBoundingClientRect();
            const modal = document.querySelector(".main-embedWidgetGenerator-container");
            const modalRect = modal.getBoundingClientRect();

            const spaceAbove = buttonRect.top - modalRect.top;
            const spaceBelow = modalRect.bottom - buttonRect.bottom;
            const dropdownHeight = dropdownRect.height;
            const margin = 9;

            dropdown.style.top = 'auto';
            dropdown.style.bottom = 'auto';
            dropdown.style.marginTop = 'auto';
            dropdown.style.marginBottom = 'auto';

            if (spaceAbove >= dropdownHeight + margin) {
                dropdown.style.bottom = '100%';
                dropdown.style.marginBottom = `${margin}px`;
            } else if (spaceBelow >= dropdownHeight + margin) {
                dropdown.style.top = '100%';
                dropdown.style.marginTop = `${margin}px`;
            } else {
                dropdown.style.bottom = '100%';
                dropdown.style.marginBottom = `${margin}px`;
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
    includeAudioFeaturesToggle.addEventListener("change", () => {
        includeaudiofeatures = includeAudioFeaturesToggle.checked;
        saveSettings();
    });
  }

  function showPlaylistBehaviorModal() {
    const overlay = document.createElement("div");
    overlay.id = "sort-play-behavior-overlay";
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
    
    let updateBehaviorSettings = JSON.parse(localStorage.getItem(STORAGE_KEY_UPDATE_BEHAVIOR_SETTINGS) || '{}');

    const playlistTypes = [
        { key: 'newReleases', title: 'New Releases' },
        { key: 'followedArtistPicks', name: 'Followed Artist Picks' },
        { key: 'newDiscoveryPicks', name: 'New Music Picks' },
        { key: 'followedReleasesChronological', name: 'Followed Artist (Full)' },
        { key: 'discovery', title: 'Discovery' },
        { key: 'recommendRecentVibe', name: 'Recent Based' },
        { key: 'recommendAllTime', name: 'All-Time Based' },
        { key: 'pureDiscovery', name: 'Pure Discovery' },
        { key: 'topTracks', title: 'My Top Tracks' },
        { key: 'topThisMonth', name: 'Top This Month' },
        { key: 'topLast6Months', name: 'Top Last 6 Months' },
        { key: 'topAllTime', name: 'Top All-Time' }
    ];

    let settingsHtml = '';
    playlistTypes.forEach(playlist => {
        if (playlist.title) {
            settingsHtml += `<div style="color: white; font-weight: bold; font-size: 18px; margin-top: 15px; margin-bottom: 5px; border-bottom: 1px solid #555; padding-bottom: 5px;">${playlist.title}</div>`;
        } else {
            const isChecked = updateBehaviorSettings[playlist.key] || false;
            settingsHtml += `
                <div class="setting-row">
                    <label class="col description">${playlist.name}</label>
                    <div class="col action">
                        <label class="switch">
                            <input type="checkbox" id="update-toggle-${playlist.key}" ${isChecked ? 'checked' : ''}>
                            <span class="sliderx"></span>
                        </label>
                    </div>
                </div>
            `;
        }
    });

    modalContainer.innerHTML = `
      <style>
        .sort-play-behavior-modal .setting-row { display: flex; justify-content: space-between; align-items: center; padding: 6px 0; }
        .sort-play-behavior-modal .col.description { color: #c1c1c1; font-family: 'SpotifyMixUI' !important; }
        .sort-play-behavior-modal .col.action { display: flex; align-items: center; }
        .sort-play-behavior-modal .switch { position: relative; display: inline-block; width: 40px; height: 24px; flex-shrink: 0; }
        .sort-play-behavior-modal .switch input { opacity: 0; width: 0; height: 0; }
        .sort-play-behavior-modal .sliderx { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #484848; border-radius: 24px; transition: .2s; }
        .sort-play-behavior-modal .sliderx:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; border-radius: 50%; transition: .2s; }
        .sort-play-behavior-modal input:checked + .sliderx { background-color: #1DB954; }
        .sort-play-behavior-modal input:checked + .sliderx:before { transform: translateX(16px); }
      </style>
      <div class="main-trackCreditsModal-header">
          <h1 class="main-trackCreditsModal-title"><span style='font-size: 25px;'>Playlist Update Behavior</span></h1>
      </div>
      <div class="main-trackCreditsModal-mainSection sort-play-behavior-modal" style="padding: 22px 47px 20px !important; max-height: 60vh; flex-grow: 1;">
        <p style="color: #c1c1c1; font-size: 16px; margin-bottom: 25px;">Update one playlist instead of creating new ones for:</p>
        <div style="display: flex; justify-content: flex-end; margin-bottom: -40px;">
            <button id="selectAllTogglesBtn" class="main-buttons-button" style="background-color: #333333; color: white; padding: 2px 16px; border-radius: 20px; font-weight: 500; font-size: 13px; border: none; cursor: pointer;">
                Select All
            </button>
        </div>
        ${settingsHtml}
      </div>
      <div class="main-trackCreditsModal-originalCredits" style="padding: 15px 24px !important; border-top: 1px solid #282828; flex-shrink: 0;">
        <div style="display: flex; justify-content: flex-end;">
            <button id="closeBehaviorModal" class="main-buttons-button main-button-primary" 
                    style="background-color: #1ED760; color: black; padding: 8px 18px; border-radius: 20px; font-weight: 550; font-size: 13px; text-transform: uppercase; border: none; cursor: pointer;">
                Done
            </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(overlay);
    overlay.appendChild(modalContainer);

    playlistTypes.forEach(playlist => {
        if (!playlist.title) {
            const toggle = modalContainer.querySelector(`#update-toggle-${playlist.key}`);
            if(toggle) {
                toggle.addEventListener('change', () => {
                    updateBehaviorSettings[playlist.key] = toggle.checked;
                    localStorage.setItem(STORAGE_KEY_UPDATE_BEHAVIOR_SETTINGS, JSON.stringify(updateBehaviorSettings));
                });
            }
        }
    });

    const selectAllButton = modalContainer.querySelector("#selectAllTogglesBtn");
    if (selectAllButton) {
        selectAllButton.addEventListener("click", () => {
            const allToggles = modalContainer.querySelectorAll('.setting-row input[type="checkbox"]');
            const allAreChecked = Array.from(allToggles).every(toggle => toggle.checked);
            const newState = !allAreChecked;

            allToggles.forEach(toggle => {
                toggle.checked = newState;
                const key = toggle.id.replace('update-toggle-', '');
                updateBehaviorSettings[key] = newState;
            });
            localStorage.setItem(STORAGE_KEY_UPDATE_BEHAVIOR_SETTINGS, JSON.stringify(updateBehaviorSettings));
        });
        
        selectAllButton.addEventListener("mouseenter", () => {
            selectAllButton.style.backgroundColor = "#444444";
        });
        selectAllButton.addEventListener("mouseleave", () => {
            selectAllButton.style.backgroundColor = "#333333";
        });
    }

    const closeModal = () => overlay.remove();
    
    const doneButton = modalContainer.querySelector("#closeBehaviorModal");
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

    const createQueueItem = (isLikedSource) => ({ uri, uid = "" }) => ({
      contextTrack: {
          uri,
          uid,
          metadata: {
              is_queued: isLikedSource ? "true" : "false"
          }
      },
      removed: [],
      blocked: [],
      provider: isLikedSource ? "queue" : "context"
  });

  async function setQueueFromTracks(tracks, contextUri) {
    const { PlayerAPI } = Spicetify.Platform;
    if (!PlayerAPI || !PlayerAPI._queue || !PlayerAPI._queue._client || !PlayerAPI._state) {
        Spicetify.showNotification("Player API not available for queue manipulation.", true);
        console.error("Player API components missing for queue operation.");
        return;
    }

    if (!tracks || tracks.length === 0) {
        Spicetify.showNotification("No tracks to add to the queue.", true);
        return;
    }

    const { _queue, _client } = PlayerAPI._queue;
    const { prevTracks, queueRevision } = _queue;

    const isLiked = contextUri ? isLikedSongsPage(contextUri) : false;

    const nextTracksFormatted = tracks.map(createQueueItem(isLiked));

    try {
        await new Promise(resolve => setTimeout(resolve, 200)); 

        await _client.setQueue({
            nextTracks: nextTracksFormatted,
            prevTracks,
            queueRevision
        });
        
        await new Promise(resolve => setTimeout(resolve, 400)); 
        await PlayerAPI.skipToNext();
        await new Promise(resolve => setTimeout(resolve, 750)); 

        if (contextUri && !isLiked && PlayerAPI._state?.sessionId) {
          try {
              await PlayerAPI.updateContext(PlayerAPI._state.sessionId, { uri: contextUri, url: "context://" + contextUri });
          } catch (contextError) {
              console.warn("Failed to update player context:", contextError);
          }
        } else {
        }

        Spicetify.showNotification("Sorted tracks added to queue.");

    } catch (error) {
        console.error("Error setting queue:", error);
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
          "shuffle",
          "averageColor",
          "affinityBalanced",
          "affinityShortTerm",
          "affinityLongTerm",
          "affinityPowerHour",
          "affinityMellowMood",
          "affinityHiddenGems",
          "deduplicateOnly"
      ];
      return directSortTypes.includes(sortType);
  }

  async function handleAiPick(tracks) {
    try {
        const tracksWithPlayCounts = await enrichTracksWithPlayCounts(tracks, () => {});

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
                <option value="gemini-2.5-flash" ${selectedAiModel === "gemini-2.5-flash" ? "selected" : ""}>Gemini 2.5 Flash</option>
                <option value="gemini-2.5-flash-lite-preview-06-17" ${selectedAiModel === "gemini-2.5-flash-lite-preview-06-17" ? "selected" : ""}>Gemini 2.5 Flash-Lite Preview</option>
                <option value="gemini-2.0-flash" ${selectedAiModel === "gemini-2.0-flash" ? "selected" : ""}>Gemini 2.0 Flash</option>
                <option value="gemini-2.0-flash-lite" ${selectedAiModel === "gemini-2.0-flash-lite" ? "selected" : ""}>Gemini 2.0 Flash-Lite</option>
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
  
      setButtonProcessing(true);
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
              "\\(Color\\)",
              "\\(Genre Filter\\)",
              "\\(Custom Filter\\)",
              "\\(Personalized\\)",
              "\\(Power Hour\\)",
              "\\(Mellow Mood\\)",
              "\\(Hidden Gems\\)"
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
          
          await addPlaylistToLibrary(newPlaylist.uri);
  
          Spicetify.showNotification(`AI Pick playlist created!`);
          
          await navigateToPlaylist(newPlaylist);
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

  async function fetchLyricsFromLyricsOvh(artist, track, maxRetries = 3, baseDelay = 1000) {
    let attempt = 0;
    while (attempt < maxRetries) {
      try {
        const encodedArtist = encodeURIComponent(artist);
        const encodedTrack = encodeURIComponent(track);
        const url = `https://api.lyrics.ovh/v1/${encodedArtist}/${encodedTrack}`;
        
        const response = await fetch(url);
  
        if (response.status === 404) {
          return { error: "No lyrics found", uri: `spotify:track:${track}`};
        }
  
        if (!response.ok) {
          attempt++;
          const waitTime = baseDelay * Math.pow(2, attempt - 1);
          console.warn(`Retrying in ${waitTime}ms (attempt ${attempt}/${maxRetries})`);
          await delay(waitTime);
          continue;
        }
  
        const data = await response.json();
  
        if (data && data.lyrics) {
          return {
            unsynced: data.lyrics.split('\n').map(line => ({ text: line })),
            provider: "Lyrics.ovh",
            copyright: null,
          };
        } else {
          return { error: "No lyrics found in response", uri: `spotify:track:${track}`};
        }
        
      } catch (error) {
        attempt++;
  
        if (attempt === maxRetries) {
          console.error(`Failed after ${maxRetries} attempts:`, error);
          return { error: "Max retries exceeded", uri: `spotify:track:${track}` };
        }
  
        const waitTime = baseDelay * Math.pow(2, attempt - 1);
        console.warn(`Attempt ${attempt}/${maxRetries} failed, retrying in ${waitTime}ms`);
        await delay(waitTime);
      }
    }
  
    return { error: "Unknown error", uri: `spotify:track:${track}` };
  }

  async function queryGeminiWithPlaylistTracks(tracks, userPrompt, apiKey, maxRetries = 3, initialDelay = 1000, includeSongStats = true, includeLyrics = true, modelName) {
    clearOldCaches();
    let retries = 0;
    let delay = initialDelay;
    let enrichedTracksCache = [];
    let tracksToProcess = [];
    let tracksNeedingLyrics = [];
  
    for (const track of tracks) {
      const trackId = track.uri.split(":")[2];
      const cachedTrack = getTrackCache(trackId, includeSongStats, includeLyrics, modelName);
      
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
                const lyricsData = await fetchLyricsFromLyricsOvh(track.artistName || track.artist, track.songTitle || track.name || track.title);
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
  
        if (tracksNeedingLyrics.length > 0) {
          const processedLyrics = await processBatchWithRateLimit(
            tracksNeedingLyrics,
            20,
            100,
            async track => {
              const trackId = track.uri.split(":")[2];
              const enrichedTrack = { ...track.cachedData };

              const lyricsData = await fetchLyricsFromLyricsOvh(track.artistName || track.artist, track.songTitle || track.name || track.title);
              enrichedTrack.lyrics = lyricsData && lyricsData.unsynced 
                ? lyricsData.unsynced.map(line => line.text).join(' ') 
                : "Not included";
  
              setTrackCache(trackId, enrichedTrack, includeSongStats, includeLyrics, modelName);
  
              return enrichedTrack;
            }
          );
  
          enrichedTracksCache = [...enrichedTracksCache, ...processedLyrics];
        }
  
        const tracksWithStats = enrichedTracksCache.filter(track => track !== null);

        const tracksWithLyrics = tracksWithStats.filter(track => track.lyrics && track.lyrics !== "Not included").length;
        const tracksWithoutLyrics = tracksWithStats.filter(track => !track.lyrics || track.lyrics === "Not included").length;
        console.log(`Lyrics Statistics:
        - Tracks with lyrics: ${tracksWithLyrics}
        - Tracks without lyrics: ${tracksWithoutLyrics}
        - Total tracks: ${tracksWithStats.length}`);

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
          200,
          1000,
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
            200,
            1000,
            (progress) => {
                mainButton.innerText = `${75 + Math.floor(progress * 0.25)}%`; //75%
            },
            getTrackDetailsWithReleaseDateForFilter 
        );


        let tracksWithFeatures = tracksWithReleaseDates;

        if (includeaudiofeatures) {
            const tracksNeedingFeatures = tracksWithReleaseDates.filter(track => {
                const trackId = track.uri.split(":")[2];
                return !getTrackCache(trackId, true, false, selectedAiModel);
            });

            const fetchedTrackFeatures = await processBatchesWithDelay(
                tracksNeedingFeatures,
                6,
                700,
                (progress) => {
                    mainButton.innerText = `${75 + Math.floor(progress * 0.25)}%`; 
                },
                async (track) => {
                    const trackId = track.uri.split(":")[2];
                    const stats = await getTrackStats(trackId);
                    const enrichedTrack = {
                        ...track,
                        features: stats || {
                            danceability: null, energy: null, key: "Undefined", loudness: null,
                            speechiness: null, acousticness: null, instrumentalness: null,
                            liveness: null, valence: null, tempo: null,
                        },
                    };

                    setTrackCache(trackId, { stats: enrichedTrack.features }, true, false, selectedAiModel);
                    return enrichedTrack;
                }
            );

            tracksWithFeatures = tracksWithReleaseDates.map(track => {
                const trackId = track.uri.split(":")[2];
                const cachedTrack = getTrackCache(trackId, true, false, selectedAiModel);
                if (cachedTrack) {
                    return { ...track, features: cachedTrack.stats }; 
                }
                const fetchedTrack = fetchedTrackFeatures.find(ft => ft.uri === track.uri);
                return fetchedTrack ? { ...track, features: fetchedTrack.features } : track; 
            });
        }


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

    if (!includeaudiofeatures && activeRangeFilter.startsWith("features.")) {
        activeRangeFilter = "releaseDate";
        localStorage.setItem("sort-play-active-range-filter", "releaseDate");
    }
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
    `;
    if (includeaudiofeatures) {
        tableHeaders += `
            <th data-sort-key="features.energy">Energy</th>
            <th data-sort-key="features.danceability">Danceability</th>
            <th data-sort-key="features.valence">Valence</th>
            <th data-sort-key="features.tempo">Tempo</th>
            <th data-sort-key="features.key">Key</th>
            <th data-sort-key="features.loudness">Loudness</th>
            <th data-sort-key="features.acousticness">Acousticness</th>
            <th data-sort-key="features.instrumentalness">Instrumentalness</th>
            <th data-sort-key="features.liveness">Liveness</th>
        `;
    }
    tableHeaders += `<th class="sticky-col actions-col">Filter</th>`;

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

            if (includeaudiofeatures) {
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
            }
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
    function createKeywordTag(keyword, container, keywordSet) {
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
            updateTrackFilters();
            saveKeywords();

        });

        tag.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
        });

        const tagsContainer = container.querySelector(".keyword-tags-container");
        tagsContainer.appendChild(tag);
        tagsContainer.scrollTop = tagsContainer.scrollHeight;
    }

    function setupKeywordInput(container, keywordSet) {
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
                  createKeywordTag(keyword, container, keywordSet);
                  input.value = "";
                  updateTrackFilters();
                  saveKeywords();
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
            updateTrackFilters();
            saveKeywords();
        });
      }

      input.addEventListener("blur", () => {
          const keyword = input.value.trim().toLowerCase();
          if (keyword && !keywordSet.has(keyword)) {
              keywordSet.add(keyword);
              createKeywordTag(keyword, container, keywordSet);
              input.value = "";
          }
          if (keyword) {
              updateTrackFilters();
          }
          saveKeywords();
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
                        createKeywordTag(keyword, container, keywordSet);
                    });

                    updateTrackFilters();
                    saveKeywords();
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

    function saveKeywords() {
        localStorage.setItem("sort-play-title-album-keywords", JSON.stringify([...titleAlbumKeywords]));
        localStorage.setItem("sort-play-artist-keywords", JSON.stringify([...artistKeywords]));
    }

     function loadKeywords() {
      const savedTitleAlbumKeywords = localStorage.getItem("sort-play-title-album-keywords");
      const savedArtistKeywords = localStorage.getItem("sort-play-artist-keywords");

      if (savedTitleAlbumKeywords) {
        titleAlbumKeywords = new Set(JSON.parse(savedTitleAlbumKeywords));
        const titleAlbumContainer = modalContainer.querySelector("#titleAlbumKeywords");

        if(titleAlbumContainer) {
            titleAlbumKeywords.forEach(keyword => createKeywordTag(keyword, titleAlbumContainer, titleAlbumKeywords));
        }
      }

      if (savedArtistKeywords) {
        artistKeywords = new Set(JSON.parse(savedArtistKeywords));
        const artistContainer = modalContainer.querySelector("#artistKeywords");

        if(artistContainer){
            artistKeywords.forEach(keyword => createKeywordTag(keyword, artistContainer, artistKeywords));
        }
      }
    }

    function updateTrackFilters() {
        const keywordFilterEnabled = keywordFilterToggle.checked;
        const keepMatching = keepMatchingMode;
        const filterTitle = titleToggle.checked;
        const filterAlbum = albumToggle.checked;
        const filterArtist = artistToggle.checked;
        const rangeFilterEnabled = rangeFilterToggle.checked;
    
        const minRange = parseFormattedNumber(modalContainer.querySelector("#rangeMin").value) || minRangeValue;
        const maxRange = parseFormattedNumber(modalContainer.querySelector("#rangeMax").value) || maxRangeValue;
    
        localStorage.setItem("sort-play-keep-matching-mode", keepMatching);
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
                    if (includeaudiofeatures) {
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
                    } else {
                        track.isRemovedByRange = false;
                    }
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

        sliderx1.addEventListener("input", slideOne);
        sliderx2.addEventListener("input", slideTwo);
        minInput.addEventListener("input", debouncedUpdatesliderxs);
        maxInput.addEventListener("input", debouncedUpdatesliderxs);
        minInput.addEventListener("blur", updatesliderxs);
        maxInput.addEventListener("blur", updatesliderxs);
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

        function handleTrackMove(event) {
            if (!isDragging) {
                return;
            }
            handleTrackClick(event);
        }

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
              <! -- Stats will go here -->
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
                                  <option value="features.energy" ${activeRangeFilter === 'features.energy' ? 'selected' : ''} ${!includeaudiofeatures ? 'disabled' : ''}>Energy</option>
                                  <option value="features.danceability" ${activeRangeFilter === 'features.danceability' ? 'selected' : ''} ${!includeaudiofeatures ? 'disabled' : ''}>Danceability</option>
                                  <option value="features.valence" ${activeRangeFilter === 'features.valence' ? 'selected' : ''} ${!includeaudiofeatures ? 'disabled' : ''}>Valence</option>
                                  <option value="features.tempo" ${activeRangeFilter === 'features.tempo' ? 'selected' : ''} ${!includeaudiofeatures ? 'disabled' : ''}>Tempo</option>
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

    keepMatchingMode = localStorage.getItem("sort-play-keep-matching-mode") === "true";
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
    loadKeywords();
    setupKeywordInput(titleAlbumContainer, titleAlbumKeywords);
    setupKeywordInput(artistContainer, artistKeywords);

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
                "\\(Color\\)",
                "\\(Genre Filter\\)",
                "\\(Custom Filter\\)",
                "\\(Personalized\\)",
                "\\(Power Hour\\)",
                "\\(Mellow Mood\\)",
                "\\(Hidden Gems\\)"
            ];

            let suffixPattern = new RegExp(
                `\\s*(${possibleSuffixes.join("|")})\\s*`
            );

            while (suffixPattern.test(sourceName)) {
                sourceName = sourceName.replace(suffixPattern, "");
            }


            let baseDescription = `Filtered using Sort-Play`;
            if (URI.isArtist(sourceUri)) {
                baseDescription = `Tracks by ${sourceName} Filtered using Sort-Play`;
            }

            let playlistDescription = baseDescription;

            const playlistName = `${sourceName} (Custom Filter)`;

            try {
                const newPlaylist = await createPlaylist(playlistName, playlistDescription);
                mainButton.innerText = "Saving...";
                const trackUris = sortedTracksForPlaylist.map((track) => track.uri);
                await addTracksToPlaylist(newPlaylist.id, trackUris);

                await addPlaylistToLibrary(newPlaylist.uri);

                const sortTypeInfo = {
                    playCount: { fullName: "play count", shortName: "PlayCount" },
                    popularity: { fullName: "popularity", shortName: "Popularity" },
                    releaseDate: { fullName: "release date", shortName: "ReleaseDate" },
                    scrobbles: { fullName: "Last.fm scrobbles", shortName: "LFM Scrobbles" },
                    personalScrobbles: { fullName: "Last.fm personal scrobbles", shortName: "LFM My Scrobbles" },
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
                            <span class="sliderx"></span>
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
    
      const sortedGenres = filteredGenres.sort((a, b) => {
        const mainGenreIndexA = getMainGenreVariantIndex(a);
        const mainGenreIndexB = getMainGenreVariantIndex(b);
        const countA = genreCounts[a] || 0;
        const countB = genreCounts[b] || 0;
    
        const isAMain = mainGenreIndexA !== -1;
        const isBMain = mainGenreIndexB !== -1;
    
        if (isAMain && !isBMain) return -1;
        if (!isAMain && isBMain) return 1;
    
        if (isAMain && isBMain) {
            if (countB !== countA) {
                return countB - countA;
            }
            return mainGenreIndexA - mainGenreIndexB;
        }
    
        if (!isAMain && !isBMain) {
            if (countB !== countA) {
                return countB - countA;
            }
            return a.localeCompare(b);
        }
        
        return 0;
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

              await addPlaylistToLibrary(newPlaylist.uri);
  
              const sortTypeInfo = {
                  playCount: { fullName: "play count", shortName: "PlayCount" },
                  popularity: { fullName: "popularity", shortName: "Popularity" },
                  releaseDate: { fullName: "release date", shortName: "ReleaseDate" },
                  scrobbles: { fullName: "Last.fm scrobbles", shortName: "LFM Scrobbles" },
                  personalScrobbles: { fullName: "Last.fm personal scrobbles", shortName: "LFM My Scrobbles" },
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
          "\\(Color\\)",
          "\\(Genre Filter\\)",
          "\\(Custom Filter\\)",
          "\\(Personalized\\)",
          "\\(Power Hour\\)",
          "\\(Mellow Mood\\)",
          "\\(Hidden Gems\\)"
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
            const normalizedGenres = genres.map(normalizeGenre);
            const uniqueNormalizedGenres = [...new Set(normalizedGenres)];
  
            trackGenreMap.set(track.uri, uniqueNormalizedGenres);
            uniqueNormalizedGenres.forEach((genre) => allGenres.add(genre));
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
    .sort-play-font-scope,
    .sort-play-font-scope * {
      font-family: 'SpotifyMixUI', sans-serif !important;
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

  function getCurrentUri() {
    const path = Spicetify.Platform.History.location?.pathname;
    if (!path) return null;

    const segments = path.split('/').filter(segment => segment.length > 0);
    
    if (segments[0] === 'album' && segments[1]) {
        return `spotify:album:${segments[1]}`;
    }
    
    if (segments[0] === 'artist' && segments[1]) {
        return `spotify:artist:${segments[1]}`;
    }
    
    if (segments[0] === 'playlist' && segments[1]) {
        return `spotify:playlist:${segments[1]}`;
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
    setButtonProcessing(true);
  
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
                  albumName: track.albumOfTrack?.name || albumRes.data.albumUnion.name || "Unknown Album",
                  artistUris: (track.artists?.items || []).map(
                    (artist) => artist?.uri || "unknown"
                  ),
                  artistName:
                    (track.artists?.items || [])[0]?.profile?.name ||
                    "Unknown Artist",
                  allArtists: (track.artists?.items || []).map(artist => artist.profile?.name || "Unknown Artist").join(", "),
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
  
  async function setPlaylistImage(playlistId, base64Image, maxRetries = 3, initialDelay = 500) {
    let attempt = 0;
    let delay = initialDelay;

    while (attempt < maxRetries) {
        try {
            await Spicetify.CosmosAsync.put(
                `https://api.spotify.com/v1/playlists/${playlistId}/images`,
                base64Image.split("base64,")[1]
            );
            return; 
        } catch (error) {
            attempt++;
            const isExpectedJsonError = error instanceof SyntaxError && error.message.includes("Unexpected end of JSON input");
            
            if (isExpectedJsonError) {
                return;
            }

            console.warn(`Sort-Play: Error setting playlist image (Attempt ${attempt}/${maxRetries}):`, error);

            if (attempt >= maxRetries) {
                console.error("Sort-Play: Failed to set playlist image after all retries.");
                return;
            }

            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2;
        }
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

    const albumPromises = uniqueAlbumIds.map(async (albumId) => {
        try {
            const albumTracks = await getPlayCountsForAlbum(albumId);
            albumPlayCountData.set(albumId, new Map(albumTracks.map(t => [t.uri, t])));
        } catch (error) {
            console.error(`Failed to get play counts for album ${albumId}`, error);
            albumPlayCountData.set(albumId, new Map());
        } finally {
            processedAlbums++;
            if (totalAlbums > 0) {
                updateProgress(Math.floor((processedAlbums / totalAlbums) * 100));
            }
        }
    });

    await Promise.all(albumPromises);

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

        const enrichedData = {
            trackNumber: foundTrack ? foundTrack.trackNumber : 0,
            songTitle: track.name,
            albumName: track.albumName || track?.album?.name || (track?.track?.album?.name) || "Unknown Album",
            trackId: trackId,
            albumId: albumId,
            durationMs: track.durationMs || track.duration_ms || track?.track?.duration_ms,
            playCount: foundTrack ? foundTrack.playcount : "N/A",
            uri: trackUri,
            artistName: track.artistName || track?.artists?.[0]?.name,
            allArtists: track.allArtists || track?.artists?.map(a => a.name).join(", "),
        };
        return { ...track, ...enrichedData };
    });

    return enrichedTracks;
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
        const parentMenu = svg.closest('.main-contextMenu-menu');
        if (parentMenu) {
            const defaultColor = window.getComputedStyle(parentMenu).getPropertyValue('color');
            svg.style.fill = defaultColor;
        } else {
            svg.style.fill = '#ffffffe6';
        }
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

  const buttonStyles = {
    main: {
      backgroundColor: "transparent",
      color: "#FFFFFFB3",
      clickBackgroundColor: "transparent",
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
            hasInnerButton: true,
          },
          {
            backgroundColor: "transparent",
            color: "white",
            text: "Popularity",
            sortType: "popularity",
            hasInnerButton: true,
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
            text: "Scrobbles",
            sortType: "scrobbles",
            hasInnerButton: true,
          },
          {
            backgroundColor: "transparent",
            color: "white",
            text: "My Scrobbles",
            sortType: "personalScrobbles",
            hasInnerButton: true,
          },
          {
            backgroundColor: "transparent",
            color: "white",
            text: "Album Color",
            sortType: "averageColor",
            hasInnerButton: true,
          },
        ],
      },
      {
        type: "parent",
        text: "Personalized Sort",
        sortType: "affinityParent",
        children: [
          {
            type: "title",
            text: "Taste Profiles",
          },
          {
            backgroundColor: "transparent",
            color: "white",
            text: "Balanced",
            sortType: "affinityBalanced",
          },
          {
            backgroundColor: "transparent",
            color: "white",
            text: "Recent Vibe",
            sortType: "affinityShortTerm",
          },
          {
            backgroundColor: "transparent",
            color: "white",
            text: "All-Time Favorites",
            sortType: "affinityLongTerm",
          },
          {
            type: "title",
            text: "Mood Mixes",
          },
          {
            backgroundColor: "transparent",
            color: "white",
            text: "My Power Hour",
            sortType: "affinityPowerHour",
          },
          {
            backgroundColor: "transparent",
            color: "white",
            text: "My Mellow Mood",
            sortType: "affinityMellowMood",
          },
          {
            type: "title",
            text: "Discovery",
          },
          {
            backgroundColor: "transparent",
            color: "white",
            text: "My Hidden Gems",
            sortType: "affinityHiddenGems",
          },
        ],
      },
      {
        type: "parent",
        text: "Create Playlist",
        sortType: "createNewPlaylist",
        children: [
          {
            type: "title",
            text: "New Releases",
          },
          {
            backgroundColor: "transparent",
            color: "white",
            text: "Followed Artist Picks",
            sortType: "followedArtistPicks",
          },
          {
            backgroundColor: "transparent",
            color: "white",
            text: "New Music Picks",
            sortType: "newDiscoveryPicks",
          },
          {
            backgroundColor: "transparent",
            color: "white",
            text: "Followed Artist (Full)",
            sortType: "followedReleasesChronological",
          },
          {
            type: "title",
            text: "Discovery",
          },
          {
            backgroundColor: "transparent",
            color: "white",
            text: "Recent Based",
            sortType: "recommendRecentVibe",
          },
          {
            backgroundColor: "transparent",
            color: "white",
            text: "All-Time Based",
            sortType: "recommendAllTime",
          },
          {
            backgroundColor: "transparent",
            color: "white",
            text: "Pure Discovery",
            sortType: "pureDiscovery",
          },
          {
            type: "title",
            text: "My Top Tracks",
          },
          {
            backgroundColor: "transparent",
            color: "white",
            text: "Top This Month",
            sortType: "topThisMonth",
          },
          {
            backgroundColor: "transparent",
            color: "white",
            text: "Top Last 6 Months",
            sortType: "topLast6Months",
          },
          {
            backgroundColor: "transparent",
            color: "white",
            text: "Top All-Time",
            sortType: "topAllTime",
          },
        ],
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
        text: "Shuffle",
        sortType: "shuffle",
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
  
  const personalizedSortIconSvg = `
  <svg width="22px" height="21px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill="none" d="M10.5 21H4C4 17.4735 6.60771 14.5561 10 14.0709M16.4976 16.2119C15.7978 15.4328 14.6309 15.2232 13.7541 15.9367C12.8774 16.6501 12.7539 17.843 13.4425 18.6868C13.8312 19.1632 14.7548 19.9983 15.4854 20.6353C15.8319 20.9374 16.0051 21.0885 16.2147 21.1503C16.3934 21.203 16.6018 21.203 16.7805 21.1503C16.9901 21.0885 17.1633 20.9374 17.5098 20.6353C18.2404 19.9983 19.164 19.1632 19.5527 18.6868C20.2413 17.843 20.1329 16.6426 19.2411 15.9367C18.3492 15.2307 17.1974 15.4328 16.4976 16.2119ZM15 7C15 9.20914 13.2091 11 11 11C8.79086 11 7 9.20914 7 7C7 4.79086 8.79086 3 11 3C13.2091 3 15 4.79086 15 7Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
  
  const createPlaylistIconSvg = `
  <svg width="22px" height="21px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill="none" d="M16 5V18M16 18C16 19.1046 14.6569 20 13 20C11.3431 20 10 19.1046 10 18C10 16.8954 11.3431 16 13 16C14.6569 16 16 16.8954 16 18ZM4 5H12M4 9H12M4 13H8M16 4L20 3V7L16 8V4Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
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
      tempContainer.appendChild(tempButton);
      document.body.appendChild(tempContainer);

      tempButton.className = primaryClass;
      let textColor = window.getComputedStyle(tempButton).color;

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
      } else if (style.text === "Create Playlist") {
        iconSvgString = createPlaylistIconSvg;
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
          parentButton.style.backgroundColor = "rgba(var(--spice-rgb-selected-row), 0.1)";
          showSubMenu(parentButton);
        }
      });
      
      parentButton.addEventListener("mouseleave", (event) => {
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
        hideAllSubMenus();
      });
    
      button.addEventListener("mouseleave", () => {
        if (!button.disabled) {
          button.style.backgroundColor = "transparent";
        }
      });
      
      let iconSvgString;
      if (style.text === "Genre Filter") {
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

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
    if (isMenuOpen) {
      if (!areSubMenusCreated) {
        menuButtons.forEach(button => {
          if (button.dataset.isParent === 'true') {
            const style = buttonStyles.menuItems.find(item => item.sortType === button.dataset.sortType);
            if (style && style.children) {
              const subMenu = createSubMenu(style.children);
              document.body.appendChild(subMenu);
              button._submenu = subMenu;
            }
          }
        });
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
      
      menuContainer.addEventListener("mouseleave", handleMouseLeaveMenuArea);

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
    
    hideAllSubMenus();
    
    menuContainer.removeEventListener("mouseleave", handleMouseLeaveMenuArea);

    isButtonClicked = false;
    mainButton.style.filter = "brightness(1)";
  }
  
  function hideAllSubMenus() {
    document.querySelectorAll('.submenu').forEach(sm => sm.style.display = 'none');
  }

  function handleMouseLeaveMenuArea(event) {
    const toElement = event.relatedTarget;
    const isEnteringMainMenu = menuContainer.contains(toElement);
    const isEnteringSubMenu = toElement && (toElement.classList.contains('submenu') || toElement.closest('.submenu'));

    if (isEnteringMainMenu || isEnteringSubMenu) {
      return;
    }
    hideAllSubMenus();
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

    subMenu.addEventListener("mouseleave", handleMouseLeaveMenuArea);

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
    hideAllSubMenus();

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

  const setButtonProcessing = (processing) => {
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

  mainButton.addEventListener("click", (event) => {
    event.stopPropagation();
    if (isProcessing) {
      Spicetify.ReactDOM.render(
        Spicetify.React.createElement(Spicetify.ReactComponent.ConfirmDialog, {
          isOpen: true,
          titleText: "Stop and Reload Spotify?",
          descriptionText: "This will stop the current Sort-Play operation and reload Spotify. Unsaved changes may be lost.",
          confirmText: "Confirm",
          cancelText: "Cancel",
          onConfirm: () => {
            closeAllMenus();
            mainButton.style.backgroundColor = buttonStyles.main.backgroundColor;
            mainButton.innerText = "stopping...";
            setButtonProcessing(false);
            Spicetify.ReactDOM.unmountComponentAtNode(container);
            location.reload();
          },
          onClose: () => {
            Spicetify.ReactDOM.unmountComponentAtNode(container);
          },
          onOutside: () => {
            Spicetify.ReactDOM.unmountComponentAtNode(container);
          }
        }),
        container 
      );
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

  async function replacePlaylistTracks(playlistId, trackUris) {
    const BATCH_SIZE = 100;
    const validUris = trackUris.filter(uri => typeof uri === 'string' && uri.startsWith("spotify:track:"));
    
    const firstBatch = validUris.slice(0, BATCH_SIZE);
    try {
        await Spicetify.CosmosAsync.put(
            `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
            { uris: firstBatch }
        );
    } catch (error) {
        console.error(`Error replacing tracks in playlist ${playlistId} (first batch):`, error);
        throw error;
    }

    if (validUris.length > BATCH_SIZE) {
        const remainingUris = validUris.slice(BATCH_SIZE);
        await addTracksToPlaylist(playlistId, remainingUris);
    }
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

  async function movePlaylistToTop(playlistUri) {
    const { RootlistAPI } = Spicetify.Platform;
    if (!RootlistAPI) return;

    try {
        const rootlist = await RootlistAPI.getContents();
        const folder = placePlaylistsInFolder ? rootlist.items.find(item => item.type === 'folder' && item.name === sortPlayFolderName) : null;

        if (placePlaylistsInFolder && folder) {
            const isAlreadyInFolder = folder.items.some(item => item.uri === playlistUri);

            if (isAlreadyInFolder) {
                console.log(`Playlist ${playlistUri} is already in the correct folder. Skipping move.`);
                return;
            }
            
            await RootlistAPI.move({ uri: playlistUri }, { after: folder.uri });

        } else {
            await RootlistAPI.move({ uri: playlistUri }, { before: "start" });
        }
    } catch (error) {
        console.warn(`Could not move playlist ${playlistUri} to top.`, error);
    }
  }

  async function getActiveUserPlaylistUris() {
    try {
        const allPlaylists = [];
        let nextUrl = 'https://api.spotify.com/v1/me/playlists?limit=50';

        while (nextUrl) {
            const response = await Spicetify.CosmosAsync.get(nextUrl);
            if (response && response.items) {
                allPlaylists.push(...response.items);
                nextUrl = response.next;
            } else {
                nextUrl = null;
            }
        }
        
        const playlistUris = new Set(allPlaylists.map(p => p.uri));
        return playlistUris;

    } catch (error) {
        console.error("An error occurred while fetching user playlists for verification:", error);
        return new Set();
    }
  }

  function isDefaultMosaicCover(url) {
    if (!url) return false;
    return url.includes("mosaic.scdn.co");
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
        let addRequestBody = {
            operation: "add",
            uris: [playlistUri],
            before: "start",
        };

        if (placePlaylistsInFolder) {
            const folderUri = await findOrCreatePlaylistFolder(sortPlayFolderName);
            if (folderUri) {
                addRequestBody = { ...addRequestBody, after: folderUri, before: undefined };
            }
        }
        await CosmosAsync.post("sp://core-playlist/v1/rootlist", addRequestBody);
    } catch (error) {
        console.error("Error adding playlist to user's library:", error);
    }
  }

  async function getOrCreateDedicatedPlaylist(sortType, name, description, maxRetries = 5, initialDelay = 1000) {
    const updateBehaviorSettings = JSON.parse(localStorage.getItem(STORAGE_KEY_UPDATE_BEHAVIOR_SETTINGS) || '{}');
    const isUpdateEnabled = updateBehaviorSettings[sortType] || false;

    const releasePlaylistColor = '#3798a5';
    const discoveryPlaylistColor = '#8f46d7';
    const defaultUsernameColor = '#24bf70';

    const releasePlaylistTypes = ['followedReleasesChronological', 'followedArtistPicks', 'newDiscoveryPicks'];
    const discoveryPlaylistTypes = ['recommendRecentVibe', 'recommendAllTime', 'pureDiscovery'];

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
                try {
                    const playlistId = playlistUri.split(':')[2];
                    const playlistData = await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/playlists/${playlistId}`);

                    if (setDedicatedPlaylistCovers) {
                        try {
                            const user = await Spicetify.Platform.UserAPI.getUser();
                            let finalUserName = user.displayName;
                            const baseImageUrl = DEDICATED_PLAYLIST_COVERS[sortType] || DEDICATED_PLAYLIST_COVERS['default'];
                            const coverBase64 = await generatePlaylistCover(finalUserName, baseImageUrl, usernameColor);
                            await setPlaylistImage(playlistId, coverBase64);
                        } catch (coverError) {
                            console.error("Failed to update custom playlist cover:", coverError);
                        }
                    }

                    await movePlaylistToTop(playlistUri);
                    return { playlist: playlistData, wasUpdated: true };
                } catch (e) {
                    console.warn(`Error verifying linked playlist ${playlistUri}, creating a new one.`, e);
                }
            } else {
                delete dedicatedPlaylistMap[sortType];
                localStorage.setItem(STORAGE_KEY_DEDICATED_PLAYLIST_MAP, JSON.stringify(dedicatedPlaylistMap));
            }
        }
    }

    const newPlaylist = await createPlaylist(name, description, maxRetries, initialDelay);

    if (newPlaylist) {
        await new Promise(resolve => setTimeout(resolve, 500));

        if (setDedicatedPlaylistCovers) {
            try {
                const user = await Spicetify.Platform.UserAPI.getUser();
                let finalUserName = user.displayName;

                const baseImageUrl = DEDICATED_PLAYLIST_COVERS[sortType] || DEDICATED_PLAYLIST_COVERS['default'];
                const coverBase64 = await generatePlaylistCover(finalUserName, baseImageUrl, usernameColor);
                await setPlaylistImage(newPlaylist.id, coverBase64);
            } catch (coverError) {
                console.error("Failed to generate or set custom playlist cover:", coverError);
            }
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
        const user = await Spicetify.Platform.UserAPI.getUser();
        const createPlaylistUrl = `https://api.spotify.com/v1/users/${user.username}/playlists`;
        newPlaylist = await Spicetify.CosmosAsync.post(createPlaylistUrl, { 
            name, 
            description,
            public: false
        });

        if (!newPlaylist || !newPlaylist.uri) {
            throw new Error("Playlist creation via Web API did not return a valid playlist object.");
        }
    } catch (error) {
        console.error("Error during playlist creation via Web API:", error);
        Spicetify.showNotification("Failed to create playlist.", true);
        throw error;
    }
    
    return { ...newPlaylist, id: newPlaylist.uri.split(':')[2] };
  }

  async function navigateToPlaylist(playlistObject) {
    if (openPlaylistAfterSortEnabled && playlistObject && playlistObject.uri) { 
        const tempPath = "/library"; 
        Spicetify.Platform.History.push(tempPath);
        await new Promise(resolve => setTimeout(resolve, 450)); 
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


  function findPeaks(profileArray) {
      const totalWeight = profileArray.reduce((a, b) => a + b, 0);
      if (totalWeight === 0) return [];

      const PEAK_THRESHOLD = 0.02;

      const peaks = [];
      let currentPeak = null;

      for (let i = 0; i < profileArray.length; i++) {
          if (profileArray[i] > totalWeight * PEAK_THRESHOLD) {
              if (!currentPeak) {
                  currentPeak = { start: i, end: i, totalWeight: profileArray[i], maxBinValue: profileArray[i] };
              } else {
                  currentPeak.end = i;
                  currentPeak.totalWeight += profileArray[i];
                  currentPeak.maxBinValue = Math.max(currentPeak.maxBinValue, profileArray[i]);
              }
          } else {
              if (currentPeak) {
                  peaks.push(currentPeak);
                  currentPeak = null;
              }
          }
      }

      if (currentPeak) {
          peaks.push(currentPeak);
      }

      return peaks;
  }

  const AFFINITY_PROFILE_CACHE_KEY = "sort-play-affinity-profile-cache-v1-5";
  const AFFINITY_PROFILE_CACHE_TIMESTAMP_KEY = "sort-play-affinity-cache-timestamp-v1-5";
  const AFFINITY_CACHE_EXPIRY_DAYS = 50;

  function cleanupOldAffinityCaches() {
    const currentCacheKey = AFFINITY_PROFILE_CACHE_KEY;
    const currentTimestampKey = AFFINITY_PROFILE_CACHE_TIMESTAMP_KEY;

    const cachePrefix = "sort-play-affinity-profile-cache-";
    const timestampPrefix = "sort-play-affinity-cache-timestamp-";

    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) continue;

        if (key.startsWith(cachePrefix) && key !== currentCacheKey) {
            keysToRemove.push(key);
        }

        if (key.startsWith(timestampPrefix) && key !== currentTimestampKey) {
            keysToRemove.push(key);
        }
    }

    if (keysToRemove.length > 0) {
        console.log("Sort-Play: Cleaning up old affinity cache versions:", keysToRemove);
        keysToRemove.forEach(key => {
            try {
                localStorage.removeItem(key);
            } catch (e) {
                console.error(`Failed to remove old cache key: ${key}`, e);
            }
        });
    }
  }

  async function getAffinityProfileData(updateProgress) {
    cleanupOldAffinityCaches();

    updateProgress("Get liked...");
    const likedTracksData = await Spicetify.Platform.LibraryAPI.getTracks({ limit: 3000 });
    
    if (!likedTracksData || !likedTracksData.items || likedTracksData.items.length === 0) {
        throw new Error("No liked songs found to build a profile.");
    }
    const freshLikedSongs = likedTracksData.items;
    updateProgress("Load cache...");
    let cachedEnhancedSongs = [];
    const cacheTimestamp = localStorage.getItem(AFFINITY_PROFILE_CACHE_TIMESTAMP_KEY);
    const daysPassed = (Date.now() - parseInt(cacheTimestamp)) / (1000 * 60 * 60 * 24);

    if (cacheTimestamp && daysPassed < AFFINITY_CACHE_EXPIRY_DAYS) {
        try {
            cachedEnhancedSongs = JSON.parse(localStorage.getItem(AFFINITY_PROFILE_CACHE_KEY)) || [];
        } catch (e) {
            console.error("Failed to parse affinity cache.", e);
            cachedEnhancedSongs = [];
        }
    }

    const cachedSongsMap = new Map(cachedEnhancedSongs.map(song => [song.uri, song]));
    const newSongsToProcess = [];
    const existingStillRelevantSongs = [];

    freshLikedSongs.forEach(song => {
        if (cachedSongsMap.has(song.uri)) {
            existingStillRelevantSongs.push(cachedSongsMap.get(song.uri));
        } else {
            newSongsToProcess.push(song);
        }
    });

    let newlyEnhancedSongs = [];
    if (newSongsToProcess.length > 0) {
        updateProgress(`Get liked...`);
        
        const newTrackIds = newSongsToProcess.map(item => item.uri.split(':')[2]);
        const newArtistIds = [...new Set(newSongsToProcess.flatMap(item => item.artists.map(artist => artist.uri.split(':')[2])))];
        
        const audioFeaturesMap = new Map();
        const artistGenreMap = new Map();

        for (let i = 0; i < newTrackIds.length; i += 100) {
            const batch = newTrackIds.slice(i, i + 100);
            const response = await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/audio-features?ids=${batch.join(',')}`);
            if (response && response.audio_features) {
                response.audio_features.forEach(features => features && audioFeaturesMap.set(features.id, features));
            }
        }

        for (let i = 0; i < newArtistIds.length; i += 50) {
            const batch = newArtistIds.slice(i, i + 50);
            const response = await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/artists?ids=${batch.join(',')}`);
            if (response && response.artists) {
                response.artists.forEach(artist => artist && artistGenreMap.set(artist.id, artist.genres));
            }
        }
        
        newlyEnhancedSongs = newSongsToProcess.map(song => {
            const full_audio_features = audioFeaturesMap.get(song.uri.split(':')[2]);
            let lean_audio_features = null;

            if (full_audio_features) {
                lean_audio_features = {
                    energy: full_audio_features.energy,
                    danceability: full_audio_features.danceability,
                    valence: full_audio_features.valence,
                    acousticness: full_audio_features.acousticness,
                    instrumentalness: full_audio_features.instrumentalness,
                    speechiness: full_audio_features.speechiness,
                    tempo: full_audio_features.tempo,
                };
            }

            return {
                uri: song.uri,
                addedAt: song.addedAt,
                artistUris: song.artists.map(artist => artist.uri),
                audio_features: lean_audio_features,
                artist_genres: song.artists.flatMap(artist => artistGenreMap.get(artist.uri.split(':')[2]) || [])
            };
        });
    }

    let allEnhancedSongs = [...existingStillRelevantSongs, ...newlyEnhancedSongs];
    
    const freshLikedSongUris = new Set(freshLikedSongs.map(s => s.uri));
    
    let finalCacheData = allEnhancedSongs.filter(song => freshLikedSongUris.has(song.uri));

    if (finalCacheData.length > 3000) {
        finalCacheData.sort((a, b) => new Date(b.added_at).getTime() - new Date(a.added_at).getTime());
        finalCacheData = finalCacheData.slice(0, 3000);
    }
    
    updateProgress("Upd-cache...");
    try {
        localStorage.setItem(AFFINITY_PROFILE_CACHE_KEY, JSON.stringify(finalCacheData));

        if (!cacheTimestamp || daysPassed >= AFFINITY_CACHE_EXPIRY_DAYS) {
            localStorage.setItem(AFFINITY_PROFILE_CACHE_TIMESTAMP_KEY, Date.now().toString());
        }
    } catch (e) {
        if (e.name === 'QuotaExceededError') {
            console.error("Cache size is still too large even after aggressive pruning. Could not save affinity profile.", e);
            Spicetify.showNotification("Your liked songs library is too large to cache, personalized sort may be slow.", true);
        } else {
            console.error("An error occurred while saving the cache.", e);
        }
    }

    updateProgress("Get top...");
    const topItemsLimits = { short_term: 200, medium_term: 300, long_term: 550 };
    const timeRanges = ['short_term', 'medium_term', 'long_term'];
    const topItems = {};
    for (const range of timeRanges) {
        const limit = topItemsLimits[range];
        topItems[range] = {
            tracks: await getTopItems('tracks', range, limit),
            artists: await getTopItems('artists', range, limit)
        };
    }
    
    return { enhancedLikedSongs: finalCacheData, topItems };
  }
  
  function buildAffinityProfile(profileData, updateProgress, timeRangeScope = 'balanced') {
    updateProgress("Profiling...");
    let finalTimeScope = timeRangeScope;
    const { enhancedLikedSongs, topItems } = profileData;
    const timeRanges = ['short_term', 'medium_term', 'long_term'];

    let profileSourceSongs = enhancedLikedSongs;
    let multipliers;
    let recencyDecayFactor;

    switch (timeRangeScope) {
        case 'recent':
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setDate(sixMonthsAgo.getDate() - 180);
            profileSourceSongs = enhancedLikedSongs.filter(song => new Date(song.addedAt) > sixMonthsAgo);
            multipliers = { short_term: 4.0, medium_term: 1.0, long_term: 0.5 };
            recencyDecayFactor = 110;
            break;
        case 'all_time':
            multipliers = { short_term: 0.5, medium_term: 1.5, long_term: 3.5 };
            recencyDecayFactor = 10000;
            break;
        case 'energy':
            profileSourceSongs = enhancedLikedSongs.filter(song => 
                song.audio_features && song.audio_features.energy > 0.6 && song.audio_features.danceability > 0.5
            );
            multipliers = { long_term: 0.8, medium_term: 1.0, short_term: 1.8 };
            recencyDecayFactor = 500;
            break;
        case 'mellow':
            profileSourceSongs = enhancedLikedSongs.filter(song => 
                song.audio_features && song.audio_features.energy < 0.4 && song.audio_features.acousticness > 0.5
            );
            multipliers = { long_term: 0.8, medium_term: 1.0, short_term: 1.8 };
            recencyDecayFactor = 500;
            break;
        case 'balanced':
        default:
            multipliers = { long_term: 0.7, medium_term: 1.2, short_term: 2.0 };
            recencyDecayFactor = 600;
            break;
    }

    if (profileSourceSongs.length < 25) {
        console.warn(`[Sort-Play] Not enough songs for a '${timeRangeScope}' profile (${profileSourceSongs.length} found). Falling back to 'Balanced'.`);
        Spicetify.showNotification(`Not enough data for ${timeRangeScope} profile, using Balanced instead.`);
        profileSourceSongs = enhancedLikedSongs;
        multipliers = { long_term: 0.7, medium_term: 1.2, short_term: 2.0 };
        recencyDecayFactor = 600;
        finalTimeScope = 'balanced';
    }

    const topTrackPositions = { short_term: new Map(), medium_term: new Map(), long_term: new Map() };
    for (const range of timeRanges) {
        topItems[range].tracks.forEach((track, index) => {
            topTrackPositions[range].set(track.uri, index);
        });
    }

    const weightedSongs = profileSourceSongs.map(song => {
        let weight = 1.0;

        for (const range of timeRanges) {
            const position = topTrackPositions[range].get(song.uri);
            if (position !== undefined) { 
                const baseMultiplier = multipliers[range];
                if (baseMultiplier === 0) continue;

                let positionalMultiplier = 0;

                switch (range) {
                    case 'long_term':
                        if (position < 25) positionalMultiplier = 1.0;
                        else if (position < 50) positionalMultiplier = 0.95;
                        else if (position < 100) positionalMultiplier = 0.85;
                        else if (position < 200) positionalMultiplier = 0.70;
                        else if (position < 300) positionalMultiplier = 0.55;
                        else if (position < 400) positionalMultiplier = 0.40;
                        else positionalMultiplier = 0.25;
                        break;

                    case 'medium_term':
                        if (position < 25) positionalMultiplier = 1.0;
                        else if (position < 50) positionalMultiplier = 0.85;
                        else if (position < 100) positionalMultiplier = 0.68;
                        else if (position < 200) positionalMultiplier = 0.45;
                        else positionalMultiplier = 0.20;
                        break;
                        
                    case 'short_term':
                        if (position < 25) positionalMultiplier = 1.0;
                        else if (position < 50) positionalMultiplier = 0.85;
                        else if (position < 100) positionalMultiplier = 0.50;
                        else positionalMultiplier = 0.15;
                        break;
                }

                weight += baseMultiplier * positionalMultiplier;
            }
        }
        
        let days_since_added = (new Date() - new Date(song.addedAt)) / (1000 * 60 * 60 * 24);
        
        if (isNaN(days_since_added)) {
            days_since_added = 365 * 5; 
        }

        const date_weight = Math.exp(-days_since_added / recencyDecayFactor);
        const final_weight = weight * date_weight;
        
        return { ...song, final_weight };
    });

    const sonicProfile = {
        energy: Array(10).fill(0), danceability: Array(10).fill(0), valence: Array(10).fill(0),
        acousticness: Array(10).fill(0), instrumentalness: Array(10).fill(0), speechiness: Array(10).fill(0),
        tempo: Array(10).fill(0)
    };
    const genreProfile = {};
    const artistProfile = {};
    const min_tempo = 50, max_tempo = 200;

    weightedSongs.forEach(song => {
        if (song.audio_features) {
            const features = ['energy', 'danceability', 'valence', 'acousticness', 'instrumentalness', 'speechiness'];
            features.forEach(feature => {
                const value = song.audio_features[feature];
                if (typeof value === 'number') {
                    const bin = Math.min(9, Math.floor(value * 10));
                    sonicProfile[feature][bin] += song.final_weight;
                }
            });
            if (typeof song.audio_features.tempo === 'number') {
                const normalized_tempo = (song.audio_features.tempo - min_tempo) / (max_tempo - min_tempo);
                const tempo_bin = Math.min(9, Math.max(0, Math.floor(normalized_tempo * 10)));
                sonicProfile.tempo[tempo_bin] += song.final_weight;
            }
        }

        if (song.artist_genres) {
            song.artist_genres.forEach(genre => {
                genreProfile[genre] = (genreProfile[genre] || 0) + song.final_weight;
            });
        }

        if (song.artistUris) {
            song.artistUris.forEach(artistUri => {
                const artistId = artistUri.split(':')[2];
                artistProfile[artistId] = (artistProfile[artistId] || 0) + song.final_weight;
            });
        }
    });

    const peakSonicProfile = {};
    for (const feature in sonicProfile) {
        peakSonicProfile[feature] = findPeaks(sonicProfile[feature]);
    }

    const affinityProfile = { rawSonicProfile: sonicProfile, peakSonicProfile, genreProfile, artistProfile };
    return { affinityProfile, finalTimeScope };
  }

  function getPeakScore(value, peaks, rawProfile) {
    if (!peaks || peaks.length === 0) return 0;

    const bin = Math.min(9, Math.floor(value * 10));

    for (const peak of peaks) {
        if (bin >= peak.start && bin <= peak.end) {
            return rawProfile[bin] / peak.maxBinValue;
        }
    }

    return 0;
  }

  function getContinuousSimilarityBoost(featuresA, featuresB) {
    if (!featuresA || !featuresB) return 0.0;

    const MIN_BOOST = 4.0;
    const MAX_BOOST = 25.0;
    const MAX_ALLOWED_TEMPO_DIFF = 5.0;
    const MAX_ALLOWED_OTHER_DIFF = 0.10;

    const FEATURE_WEIGHTS = {
        tempo: 1.5,
        energy: 1.2,
        danceability: 1.2,
        valence: 1.0,
        acousticness: 0.8,
        instrumentalness: 0.7,
        speechiness: 0.6,
    };

    let totalWeightedScore = 0;
    let totalWeight = 0;

    const tempoDiff = Math.abs(featuresA.tempo - featuresB.tempo);
    if (tempoDiff > MAX_ALLOWED_TEMPO_DIFF) {
        return 0.0;
    }
    const tempoSimilarity = 1 - (tempoDiff / MAX_ALLOWED_TEMPO_DIFF);
    totalWeightedScore += tempoSimilarity * FEATURE_WEIGHTS.tempo;
    totalWeight += FEATURE_WEIGHTS.tempo;

    const otherFeatures = ['energy', 'danceability', 'valence', 'acousticness', 'instrumentalness', 'speechiness'];
    for (const feature of otherFeatures) {
        const diff = Math.abs(featuresA[feature] - featuresB[feature]);
        if (diff > MAX_ALLOWED_OTHER_DIFF) {
            return 0.0;
        }
        const similarity = 1 - (diff / MAX_ALLOWED_OTHER_DIFF);
        totalWeightedScore += similarity * FEATURE_WEIGHTS[feature];
        totalWeight += FEATURE_WEIGHTS[feature];
    }
    
    if (totalWeight === 0) return 0.0;
    const averageSimilarity = totalWeightedScore / totalWeight;

    const boost = MIN_BOOST + (MAX_BOOST - MIN_BOOST) * averageSimilarity;
    
    return boost;
  }


  async function scoreAndSortPlaylist(targetTracks, affinityProfile, profileData, updateProgress, timeRangeScope = 'balanced', preFetchedAudioFeatures) {
    updateProgress("Ranking...");
    const { rawSonicProfile, peakSonicProfile, genreProfile, artistProfile } = affinityProfile;

    const POPULARITY_WEIGHT = 2.0; 

    const getArtistUris = (track) => track.artistUris || (Array.isArray(track.artists) ? track.artists.map(a => a.uri) : []);

    const artistCounts = new Map();
    targetTracks.forEach(track => {
        const artistUris = getArtistUris(track);
        artistUris.forEach(uri => {
            const artistId = uri.split(':')[2];
            artistCounts.set(artistId, (artistCounts.get(artistId) || 0) + 1);
        });
    });

    const maxArtistCount = artistCounts.size > 0 ? Math.max(...artistCounts.values()) : 0;
    
    let sonicWeight, genreWeight, artistWeight;
    if (maxArtistCount > 10) {
        console.log("Sort-Play: High artist concentration detected. Applying sonic-focused weights.");
        sonicWeight = 0.85;
        genreWeight = 0.0;
        artistWeight = 0.15;
    } else {
        console.log("Sort-Play: Normal artist diversity. Applying balanced weights.");
        sonicWeight = 0.70;
        genreWeight = 0.1;
        artistWeight = 0.20;
    }

    const targetTrackIds = targetTracks.map(t => t.uri.split(':')[2]);
    const artistCache = new Map();
    const popularityMap = new Map();

    for (let i = 0; i < targetTrackIds.length; i += 50) {
        const batch = targetTrackIds.slice(i, i + 50);
        const response = await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/tracks?ids=${batch.join(',')}`);
        (response.tracks || []).forEach(track => track && popularityMap.set(track.id, track.popularity));
    }

    const targetArtistIds = [...new Set(targetTracks.flatMap(t => getArtistUris(t).map(uri => uri.split(':')[2])))];
    for (let i = 0; i < targetArtistIds.length; i += 50) {
        const batch = targetArtistIds.slice(i, i + 50);
        const response = await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/artists?ids=${batch.join(',')}`);
        (response.artists || []).forEach(artist => artist && artistCache.set(artist.id, artist.genres));
    }
    
    const releaseDateMap = new Map();
    for (let i = 0; i < targetTrackIds.length; i += 50) {
        const batch = targetTrackIds.slice(i, i+50);
        const response = await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/tracks?ids=${batch.join(',')}`);
        (response.tracks || []).forEach(track => {
            if (track && track.album && track.album.release_date) {
                releaseDateMap.set(track.id, track.album.release_date);
            }
        });
    }

    const likedSongsFeatures = profileData.enhancedLikedSongs
        .map(song => song.audio_features)
        .filter(features => features);

    const scoredTracks = targetTracks.map(track => {
        const trackId = track.uri.split(':')[2];
        const audio_features = preFetchedAudioFeatures.get(trackId);
        const artistUris = getArtistUris(track);
        const artist_genres = artistUris.flatMap(uri => artistCache.get(uri.split(':')[2]) || []);
        const popularity = popularityMap.get(trackId) || 0;

        let sonicScoreSum = 0;
        let genreScore = 0;
        let artistScore = 0;
        let featureCount = 0;

        if (audio_features) {
            const features = ['energy', 'danceability', 'valence', 'acousticness', 'instrumentalness', 'speechiness'];
            features.forEach(feature => {
                const value = audio_features[feature];
                if (typeof value === 'number' && peakSonicProfile[feature].length > 0) {
                    sonicScoreSum += getPeakScore(value, peakSonicProfile[feature], rawSonicProfile[feature]);
                    featureCount++;
                }
            });

            const min_tempo = 50, max_tempo = 200;
            if (typeof audio_features.tempo === 'number' && peakSonicProfile.tempo.length > 0) {
                const normalized_tempo = (audio_features.tempo - min_tempo) / (max_tempo - min_tempo);
                sonicScoreSum += getPeakScore(normalized_tempo, peakSonicProfile.tempo, rawSonicProfile.tempo);
                featureCount++;
            }
        }

        const rawSonicScore = featureCount > 0 ? (sonicScoreSum / featureCount) * 100 : 0;

        artist_genres.forEach(genre => {
            genreScore += (genreProfile[genre] || 0);
        });

        artistUris.forEach(uri => {
            const artistId = uri.split(':')[2];
            artistScore += (artistProfile[artistId] || 0);
        });



        let similarityBoost = 0.0;
        const MAX_BOOST = 25.0;

        if (audio_features) {
            for (const likedFeatures of likedSongsFeatures) {
                const currentBoost = getContinuousSimilarityBoost(audio_features, likedFeatures);
                
                if (currentBoost > similarityBoost) {
                    similarityBoost = currentBoost;
                }

                if (similarityBoost >= MAX_BOOST) {
                    break;
                }
            }
        }

        let affinityScore = (rawSonicScore * sonicWeight) + (genreScore * genreWeight) + (artistScore * artistWeight);

        let popularityBonus = 0;
        if (popularity > 40) {
            const popularity_factor = Math.min(1.0, (popularity - 40) / (90 - 40));
            popularityBonus = POPULARITY_WEIGHT * popularity_factor;
        }
        
        let finalScore = affinityScore + popularityBonus + similarityBoost;

        const releaseDateStr = releaseDateMap.get(trackId);
        if (releaseDateStr) {
            const releaseYear = parseInt(releaseDateStr.substring(0, 4));
            if (!isNaN(releaseYear)) {
                if (timeRangeScope === 'recent' && releaseYear >= new Date().getFullYear() - 2) {
                    finalScore *= 1.15; 
                } else if (timeRangeScope === 'all_time' && releaseYear < 2005) {
                    finalScore *= 1.10; 
                }
            }
        }
        
        if (timeRangeScope === 'energy') {
            if (!audio_features || audio_features.energy <= 0.65 || audio_features.danceability <= 0.5) {
                finalScore *= 0.25;
            }
        } else if (timeRangeScope === 'mellow') {
            if (!audio_features || audio_features.energy >= 0.4 || audio_features.acousticness <= 0.5 || audio_features.speechiness >= 0.33) {
                finalScore *= 0.25; 
            }
        }

        return { ...track, finalScore, popularity };
    });
    
    const sortedTracks = scoredTracks.sort((a, b) => b.finalScore - a.finalScore);

    let finalTracks = sortedTracks;
    if (timeRangeScope === 'energy' || timeRangeScope === 'mellow') {
        if (sortedTracks.length > 0) {
            const topScore = sortedTracks[0].finalScore;
            const scoreThreshold = topScore * 0.20;
            
            finalTracks = sortedTracks.filter(track => track.finalScore >= scoreThreshold);
        }
    }

    return finalTracks;
  }


  async function getAudioFeaturesForTracks(trackIds) {
    if (!trackIds || trackIds.length === 0) return [];
    const allAudioFeatures = [];
    for (let i = 0; i < trackIds.length; i += 100) {
        const batchIds = trackIds.slice(i, i + 100);
        try {
            const response = await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/audio-features?ids=${batchIds.join(',')}`);
            if (response.audio_features) {
                allAudioFeatures.push(...response.audio_features.filter(f => f));
            }
        } catch (error) {
            console.error("Failed to fetch a batch of audio features:", error);
        }
    }
    return allAudioFeatures;
  }

  async function buildAdvancedTasteProfile(songsToProfile) {
    if (!songsToProfile || songsToProfile.length === 0) return null;

    const tasteProfileTrackIds = songsToProfile.map(t => t.uri.split(':')[2]);
    const audioFeatures = await getAudioFeaturesForTracks(tasteProfileTrackIds);
    if (audioFeatures.length === 0) return null;

    const sonicProfile = {
        energy: Array(10).fill(0),
        danceability: Array(10).fill(0),
        valence: Array(10).fill(0),
    };

    audioFeatures.forEach(features => {
        if (!features) return;
        const featuresToBin = ['energy', 'danceability', 'valence'];
        featuresToBin.forEach(feature => {
            const value = features[feature];
            if (typeof value === 'number') {
                const bin = Math.min(9, Math.floor(value * 10));
                sonicProfile[feature][bin] += 1; 
            }
        });
    });

    const peakSonicProfile = {
        energy: findPeaks(sonicProfile.energy),
        danceability: findPeaks(sonicProfile.danceability),
        valence: findPeaks(sonicProfile.valence),
    };
    
    return peakSonicProfile;
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

  async function getComprehensiveKnownArtistsSet() {
    mainButton.innerText = "Filtering...";
    
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

  async function generatePersonalizedRecommendations(vibeType) {
    let playlistName = "";
    let playlistDescription = "";

    try {
        mainButton.innerText = "Get library...";
        const updateProgress = (message) => { mainButton.innerText = message; };
        const profileData = await getAffinityProfileData(updateProgress);
        const allLikedSongs = await getLikedSongs();
        const completeLikedSongUrisSet = new Set();
        const likedSongsFingerprintMap = new Map();

        allLikedSongs.forEach(song => {
            completeLikedSongUrisSet.add(song.uri);
            const title = song.name.toLowerCase().trim();
            if (!likedSongsFingerprintMap.has(title)) {
                likedSongsFingerprintMap.set(title, new Set());
            }
            const artistUrisForTitle = likedSongsFingerprintMap.get(title);
            song.artistUris.forEach(uri => artistUrisForTitle.add(uri));
        });

        let targetFeatures = {};
        
        if (vibeType === 'pureDiscovery') {
            playlistName = "Pure Discovery";
            
            mainButton.innerText = "Filtering...";
            const knownArtistIds = await getComprehensiveKnownArtistsSet();
            const topArtistsForSeeding = await getTopItems('artists', 'long_term', 100);
            const topTracksForSeeding = await getTopItems('tracks', 'long_term', 50);

            if (topArtistsForSeeding.length === 0 || topTracksForSeeding.length === 0) {
                throw new Error("Need more listening history to build a discovery profile.");
            }

            mainButton.innerText = "Related...";
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

            const chosenUnknownArtists = shuffleArray(unknownRelatedArtists).slice(0, 3);
            const chosenSeedTracks = shuffleArray(topTracksForSeeding).slice(0, 2);
            
            const seed_artists = chosenUnknownArtists.map(a => a.id);
            const seed_tracks = chosenSeedTracks.map(t => t.id);
            
            mainButton.innerText = "Profiling..."; 
            const tasteProfile = await buildAdvancedTasteProfile(shuffleArray(profileData.enhancedLikedSongs).slice(0, 200));
            if (tasteProfile) {
                const featuresToTarget = ['energy', 'danceability', 'valence'];
                for (const feature of featuresToTarget) {
                    if (tasteProfile[feature].length > 0) {
                        const randomPeak = tasteProfile[feature][Math.floor(Math.random() * tasteProfile[feature].length)];
                        const targetValue = (randomPeak.start + randomPeak.end) / 2 / 10;
                        targetFeatures[`target_${feature}`] = targetValue;
                    }
                }
            }

            playlistDescription = "Discover new music from artists related to your all-time favorites. Created by Sort-Play.";

            mainButton.innerText = "Get recs...";
            const params = new URLSearchParams({ limit: 100 });
            if (seed_artists.length > 0) params.append('seed_artists', [...new Set(seed_artists)].join(','));
            if (seed_tracks.length > 0) params.append('seed_tracks', [...new Set(seed_tracks)].join(','));
            for (const [key, value] of Object.entries(targetFeatures)) {
                if (value !== undefined && !isNaN(value)) params.append(key, value.toFixed(3));
            }
            const recommendations = await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/recommendations?${params.toString()}`);
            
            if (!recommendations?.tracks?.length) throw new Error("Spotify didn't return any recommendations. Try again!");
            
            mainButton.innerText = "Excluding...";
            let newRecommendedTracks = recommendations.tracks.filter(track => {
                if (completeLikedSongUrisSet.has(track.uri)) {
                    return false;
                }
                const title = track.name.toLowerCase().trim();
                const likedArtistUrisForTitle = likedSongsFingerprintMap.get(title);
                if (!likedArtistUrisForTitle) {
                    return true; 
                }
                const recommendedArtistUris = track.artists.map(a => a.uri);
                const hasCommonArtist = recommendedArtistUris.some(uri => likedArtistUrisForTitle.has(uri));
                if (hasCommonArtist) {
                    return false; 
                }

                return true;
            }).filter(track => track.artists.every(artist => !knownArtistIds.has(artist.id)));
            
            if (newRecommendedTracks.length === 0) throw new Error("All recommended tracks were already known to you. Great taste!");
            
            const trackUris = newRecommendedTracks.slice(0, discoveryPlaylistSize).map(track => track.uri);
            
            mainButton.innerText = "Creating...";
            const { playlist: newPlaylist, wasUpdated } = await getOrCreateDedicatedPlaylist(vibeType, playlistName, playlistDescription);
            
            if (wasUpdated) {
                await replacePlaylistTracks(newPlaylist.id, trackUris);
            } else {
                await addTracksToPlaylist(newPlaylist.id, trackUris);
            }
            
            Spicetify.showNotification(`Playlist "${playlistName}" ${wasUpdated ? 'updated' : 'created'} successfully!`);

            if (openPlaylistAfterSortEnabled && newPlaylist.uri) { 
                const tempPath = "/library"; 
                Spicetify.Platform.History.push(tempPath);
                await new Promise(resolve => setTimeout(resolve, 450)); 
                const newPlaylistPath = Spicetify.URI.fromString(newPlaylist.uri).toURLPath(true);
                if (newPlaylistPath) Spicetify.Platform.History.push(newPlaylistPath);
            }
            return;
        } 

        let time_range = 'medium_term';
        let contrast_time_range = 'long_term';
        let top_pool_size = 100;
        let songsToProfile = [];

        if (vibeType === 'recommendRecentVibe') {
            playlistName = "Discovery: Recent Taste";
            time_range = 'short_term';
            contrast_time_range = 'long_term';
            if (profileData.enhancedLikedSongs.length < 20) throw new Error("Not enough liked songs for a recent profile.");
            songsToProfile = profileData.enhancedLikedSongs.slice(0, 100);
        } else if (vibeType === 'recommendAllTime') {
            playlistName = "Discovery: All-Time Taste";
            time_range = 'long_term';
            contrast_time_range = 'short_term';
            if (profileData.enhancedLikedSongs.length < 50) throw new Error("Not enough liked songs for an all-time profile.");
            songsToProfile = shuffleArray(profileData.enhancedLikedSongs).slice(0, 200);
        }

        mainButton.innerText = "Get top...";
        const [topArtists, topTracks, contrastTopTracks] = await Promise.all([
            getTopItems('artists', time_range, top_pool_size),
            getTopItems('tracks', time_range, top_pool_size),
            getTopItems('tracks', contrast_time_range, 1)
        ]);

        if (topArtists.length < 10 || topTracks.length < 10) {
            throw new Error("Not enough listening history for diverse recommendations.");
        }
        
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
            likedSongSeedUris = shuffleArray(profileData.enhancedLikedSongs.slice(0, 10)).slice(0, 5).map(t => t.uri.split(':')[2]);
        } else {
            likedSongSeedUris = shuffleArray(profileData.enhancedLikedSongs.slice(-100)).slice(0, 5).map(t => t.uri.split(':')[2]);
        }

        const smartSongSeeds = new Set();
        if (vibeType === 'recommendAllTime') {
            smartSongSeeds.add(shuffleArray(topTracks.slice(0, 20))[0]);
        } else {
            smartSongSeeds.add(shuffleArray(topTracks.slice(0, 5))[0]);
        }
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

        mainButton.innerText = "Profiling...";
        const tasteProfile = await buildAdvancedTasteProfile(songsToProfile);
        if (tasteProfile) {
            const featuresToTarget = ['energy', 'danceability', 'valence'];
            for (const feature of featuresToTarget) {
                if (tasteProfile[feature].length > 0) {
                    const randomPeak = tasteProfile[feature][Math.floor(Math.random() * tasteProfile[feature].length)];
                    const targetValue = (randomPeak.start + randomPeak.end) / 2 / 10;
                    targetFeatures[`target_${feature}`] = targetValue;
                }
            }
        }
        if (vibeType === 'recommendAllTime') {
            if (Math.random() < 0.4) {
                targetFeatures.target_popularity = Math.floor(Math.random() * 25) + 20;
            }
        }

        playlistDescription = vibeType === 'recommendRecentVibe' 
            ? "A diverse mix based on your recent taste. Created by Sort-Play." 
            : "A diverse mix based on your all-time taste. Created by Sort-Play.";

        mainButton.innerText = "Get recs...";
        const recommendationBatches = [];
        const NUM_CALLS = 6;
        
        for (let i = 0; i < NUM_CALLS; i++) {
            mainButton.innerText = "Get recs...";
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
            for (const [key, value] of Object.entries(targetFeatures)) {
                if (value !== undefined && !isNaN(value)) params.append(key, value.toFixed(3));
            }

            try {
                const recsResponse = await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/recommendations?${params.toString()}`);
                if (recsResponse?.tracks?.length > 0) {
                    recommendationBatches.push(recsResponse.tracks);
                }
            } catch (e) {
                console.warn(`Recommendation call ${i+1} failed.`, e);
            }
            await new Promise(resolve => setTimeout(resolve, 250));
        }

        if (recommendationBatches.length === 0) {
            throw new Error("Spotify didn't return any recommendations. Try again!");
        }

        mainButton.innerText = "Mixing...";
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
            if (seenUris.has(track.uri)) {
                return false;
            } else {
                seenUris.add(track.uri);
                return true;
            }
        });

        mainButton.innerText = "Excluding...";
        let newRecommendedTracks = uniqueMixedTracks.filter(track => {
            if (completeLikedSongUrisSet.has(track.uri)) {
                return false;
            }
            const title = track.name.toLowerCase().trim();
            const likedArtistUrisForTitle = likedSongsFingerprintMap.get(title);
            if (!likedArtistUrisForTitle) {
                return true; 
            }
            const recommendedArtistUris = track.artists.map(a => a.uri);
            const hasCommonArtist = recommendedArtistUris.some(uri => likedArtistUrisForTitle.has(uri));
            if (hasCommonArtist) {
                return false;
            }

            return true;
        });

        if (newRecommendedTracks.length === 0) throw new Error("All recommended tracks were already known to you. Great taste!");
        
        const trackUris = newRecommendedTracks.slice(0, discoveryPlaylistSize).map(track => track.uri);
        
        mainButton.innerText = "Creating...";
        const { playlist: newPlaylist, wasUpdated } = await getOrCreateDedicatedPlaylist(vibeType, playlistName, playlistDescription);
        
        if (wasUpdated) {
            await replacePlaylistTracks(newPlaylist.id, trackUris);
        } else {
            await addTracksToPlaylist(newPlaylist.id, trackUris);
        }

        Spicetify.showNotification(`Playlist "${playlistName}" ${wasUpdated ? 'updated' : 'created'} successfully!`);

        if (openPlaylistAfterSortEnabled && newPlaylist.uri) { 
            const tempPath = "/library"; 
            Spicetify.Platform.History.push(tempPath);
            await new Promise(resolve => setTimeout(resolve, 450)); 
            const newPlaylistPath = Spicetify.URI.fromString(newPlaylist.uri).toURLPath(true);
            if (newPlaylistPath) Spicetify.Platform.History.push(newPlaylistPath);
        }

    } catch (error) {
        console.error(`Error in generatePersonalizedRecommendations (${vibeType}):`, error);
        Spicetify.showNotification(error.message, true);
    } finally {
        resetButtons();
    }
  }

  async function generateFollowedReleasesChronological() {
    const { GraphQL, CosmosAsync } = Spicetify;
    setButtonProcessing(true);
    mainButton.style.backgroundColor = buttonStyles.main.disabledBackgroundColor;
    mainButton.style.color = buttonStyles.main.disabledColor;
    mainButton.style.cursor = "default";
    svgElement.style.fill = buttonStyles.main.disabledColor;
    menuButtons.forEach((button) => (button.disabled = true));
    toggleMenu();
    closeAllMenus();

    try {
        const updateProgress = (message) => { mainButton.innerText = message; };

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
                const variables = { uri: artist.uri, order: "DATE_DESC", offset: 0, limit: 10 };
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
        let genuinelyNewTracks = [];
        const albumUris = allNewReleases.map(album => album.uri);

        for (let i = 0; i < albumUris.length; i += 20) {
            const albumIdBatch = albumUris.slice(i, i + 20).map(uri => uri.split(':')[2]);
            const albumsData = await CosmosAsync.get(`https://api.spotify.com/v1/albums?ids=${albumIdBatch.join(',')}`);
            if (albumsData.albums) {
                for (const album of albumsData.albums) {
                    if (album && album.tracks && album.tracks.items) {
                        const trackReleaseDate = new Date(album.release_date);
                        if (trackReleaseDate < dateLimit) continue;

                        const augmentedTracks = album.tracks.items.map(track => ({
                            ...track,
                            album: {
                                release_date: album.release_date,
                                name: album.name,
                                uri: album.uri,
                                id: album.id
                            }
                        }));

                        let tracksFromAlbum = augmentedTracks;
                        if (followedReleasesAlbumLimit !== 'all') {
                            tracksFromAlbum = tracksFromAlbum.slice(0, parseInt(followedReleasesAlbumLimit, 10));
                        }
                        genuinelyNewTracks.push(...tracksFromAlbum);
                    }
                }
            }
        }
        
        if (genuinelyNewTracks.length === 0) {
            throw new Error("Could not fetch any tracks from the new releases.");
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
            await new Promise(resolve => setTimeout(resolve, 450)); 
            const newPlaylistPath = Spicetify.URI.fromString(newPlaylist.uri).toURLPath(true);
            if (newPlaylistPath) Spicetify.Platform.History.push(newPlaylistPath);
        }

    } catch (error) {
        console.error("Error generating Chronological Followed Releases:", error);
        Spicetify.showNotification(error.message, true);
    } finally {
        resetButtons();
    }
  }

  async function generateFollowedArtistPicks() {
    const { GraphQL, CosmosAsync } = Spicetify;
    setButtonProcessing(true);
    mainButton.style.backgroundColor = buttonStyles.main.disabledBackgroundColor;
    mainButton.style.color = buttonStyles.main.disabledColor;
    mainButton.style.cursor = "default";
    svgElement.style.fill = buttonStyles.main.disabledColor;
    menuButtons.forEach((button) => (button.disabled = true));
    toggleMenu();
    closeAllMenus();

    try {
        const updateProgress = (message) => { mainButton.innerText = message; };

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
                const variables = { uri: artist.uri, order: "DATE_DESC", offset: 0, limit: 5 };
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
            throw new Error("No new releases found in the last 14 days.");
        }

        updateProgress(`Get tracks...`);
        let genuinelyNewTracks = [];
        const albumUris = allNewReleases.map(album => album.uri);

        for (let i = 0; i < albumUris.length; i += 20) {
            const albumBatchUris = albumUris.slice(i, i + 20);
            const albumsData = await CosmosAsync.get(`https://api.spotify.com/v1/albums?ids=${albumBatchUris.map(uri => uri.split(':')[2]).join(',')}`);
            
            if (albumsData.albums) {
                for (const album of albumsData.albums) {
                    if (album && album.tracks && album.tracks.items) {
                        const trackReleaseDate = new Date(album.release_date);
                        if (trackReleaseDate < dateLimit) continue;
                        
                        const augmentedTracks = album.tracks.items.map(track => ({
                            ...track,
                            album: {
                                release_date: album.release_date,
                                name: album.name,
                                uri: album.uri,
                                id: album.id
                            },
                            allArtists: track.artists.map(a => a.name).join(', '),
                            artistUris: track.artists.map(a => a.uri),
                            durationMilis: track.duration_ms,
                        }));
                        genuinelyNewTracks.push(...augmentedTracks);
                    }
                }
            }
        }
        
        if (genuinelyNewTracks.length === 0) {
            throw new Error("Could not fetch any tracks from the new releases.");
        }

        const MAX_TRACKS_TO_PROCESS = 1000;
        let tracksToProcess = [...new Map(genuinelyNewTracks.map(item => [item.uri, item])).values()];

        if (tracksToProcess.length > MAX_TRACKS_TO_PROCESS) {
            tracksToProcess.sort((a, b) => new Date(b.album.release_date) - new Date(a.album.release_date));
            tracksToProcess = tracksToProcess.slice(0, MAX_TRACKS_TO_PROCESS);
        }
    
        updateProgress("Enriching...");
        const tracksWithPlayCounts = await enrichTracksWithPlayCounts(tracksToProcess, () => {});
    
        const tracksWithIdsForPop = await processBatchesWithDelay(
            tracksWithPlayCounts, 200, 1000,
            () => {},
            collectTrackIdsForPopularity
        );
        const tracksWithPopularity = await fetchPopularityForMultipleTracks(
            tracksWithIdsForPop,
            () => {}
        );
    
        updateProgress("Deduplicating...");
        const { unique: uniqueTracks, removed: removedDuplicates } = deduplicateTracks(tracksWithPopularity);

        if (uniqueTracks.length === 0) {
            throw new Error("No unique new tracks found after deduplication.");
        }
        
        tracksToProcess = uniqueTracks;
    
        const profileData = await getAffinityProfileData(updateProgress);
        const affinityProfile = buildAffinityProfile(profileData, updateProgress, 'balanced').affinityProfile;
        
        const audioFeaturesForScoring = await getAudioFeaturesForTracks(tracksToProcess.map(t => t.uri.split(':')[2]));
        const audioFeaturesMapForScoring = new Map(audioFeaturesForScoring.map(f => [f.id, f]));

        const scoredTracks = await scoreAndSortPlaylist(tracksToProcess, affinityProfile, profileData, updateProgress, 'balanced', audioFeaturesMapForScoring);
    
        if (scoredTracks.length === 0) {
            throw new Error("No tracks matched your affinity profile.");
        }
        
        updateProgress("Balancing...");
        
        const tracksByAlbum = scoredTracks.reduce((acc, track) => {
            const albumUri = track.album.uri;
            if (!acc[albumUri]) acc[albumUri] = [];
            acc[albumUri].push(track);
            return acc;
        }, {});

        let candidateTracks = [];
        for (const albumUri in tracksByAlbum) {
            const topTracksFromAlbum = tracksByAlbum[albumUri]
                .sort((a, b) => b.finalScore - a.finalScore)
                .slice(0, 2);
            candidateTracks.push(...topTracksFromAlbum);
        }
        candidateTracks.sort((a, b) => b.finalScore - a.finalScore);

        const FINAL_PLAYLIST_SIZE = 200;
        const candidateTrackIds = candidateTracks.map(t => t.uri.split(':')[2]);
        const audioFeatures = await getAudioFeaturesForTracks(candidateTrackIds);
        const audioFeaturesMap = new Map(audioFeatures.map(f => [f.id, f]));
        
        const energyProfile = affinityProfile.rawSonicProfile.energy;
        const totalWeight = energyProfile.reduce((a, b) => a + b, 0);
        const lowEnergyWeight = energyProfile.slice(0, 4).reduce((a, b) => a + b, 0);
        const mediumEnergyWeight = energyProfile.slice(4, 7).reduce((a, b) => a + b, 0);
        const highEnergyWeight = energyProfile.slice(7, 10).reduce((a, b) => a + b, 0);

        const lowRatio = totalWeight > 0 ? lowEnergyWeight / totalWeight : 0.33;
        const mediumRatio = totalWeight > 0 ? mediumEnergyWeight / totalWeight : 0.34;
        const highRatio = totalWeight > 0 ? highEnergyWeight / totalWeight : 0.33;

        let targetLow = Math.round(FINAL_PLAYLIST_SIZE * lowRatio);
        let targetMedium = Math.round(FINAL_PLAYLIST_SIZE * mediumRatio);
        let targetHigh = Math.round(FINAL_PLAYLIST_SIZE * highRatio);
        
        let totalTarget = targetLow + targetMedium + targetHigh;
        while(totalTarget !== FINAL_PLAYLIST_SIZE) {
            if (totalTarget > FINAL_PLAYLIST_SIZE) targetMedium--;
            else targetHigh++;
            totalTarget = targetLow + targetMedium + targetHigh;
        }

        const lowEnergyBin = [], mediumEnergyBin = [], highEnergyBin = [];
        for(const track of candidateTracks) {
            const features = audioFeaturesMap.get(track.uri.split(':')[2]);
            if (features) {
                if (features.energy < 0.4) lowEnergyBin.push(track);
                else if (features.energy <= 0.7) mediumEnergyBin.push(track);
                else highEnergyBin.push(track);
            }
        }

        const artistCountMap = new Map();
        const albumCountMap = new Map();
        const topTracks = [];
        const MAX_SONGS_PER_ARTIST = 3;
        const MAX_SONGS_PER_ALBUM = 3;

        const binPointers = { low: 0, medium: 0, high: 0 };
        const binArrays = { low: lowEnergyBin, medium: mediumEnergyBin, high: highEnergyBin };
        const binTargets = { low: targetLow, medium: targetMedium, high: targetHigh };
        const binCounts = { low: 0, medium: 0, high: 0 };

        while (topTracks.length < FINAL_PLAYLIST_SIZE) {
            let trackAddedInCycle = false;
            const pickOrder = ['high', 'medium', 'low'].sort((a,b) => (binCounts[b] / binTargets[b]) - (binCounts[a] / binTargets[a]));

            for (const binName of pickOrder) {
                if (topTracks.length >= FINAL_PLAYLIST_SIZE) break;
                while (binArrays[binName].length > binPointers[binName] && binCounts[binName] < binTargets[binName]) {
                    const track = binArrays[binName][binPointers[binName]];
                    binPointers[binName]++;

                    const primaryArtistUri = track.artists[0].uri;
                    const albumUri = track.album.uri;
                    const artistCount = artistCountMap.get(primaryArtistUri) || 0;
                    const albumCount = albumCountMap.get(albumUri) || 0;

                    if (artistCount < MAX_SONGS_PER_ARTIST && albumCount < MAX_SONGS_PER_ALBUM) {
                        topTracks.push(track);
                        artistCountMap.set(primaryArtistUri, artistCount + 1);
                        albumCountMap.set(albumUri, albumCount + 1);
                        binCounts[binName]++;
                        trackAddedInCycle = true;
                        break;
                    }
                }
            }
             if (!trackAddedInCycle) {
                break;
            }
        }
        
        const trackUris = topTracks.map(track => track.uri);
        const playlistName = "Followed Artists: Fresh Picks";
        const playlistDescription = `The latest releases from artists you follow, personalized for your taste. Created by Sort-Play.`;
        
        updateProgress("Creating...");
        const { playlist: newPlaylist, wasUpdated } = await getOrCreateDedicatedPlaylist('followedArtistPicks', playlistName, playlistDescription);
        
        updateProgress("Saving...");
        if (wasUpdated) {
            await replacePlaylistTracks(newPlaylist.id, trackUris);
        } else {
            await addTracksToPlaylist(newPlaylist.id, trackUris);
        }
        
        Spicetify.showNotification(`Playlist "${playlistName}" ${wasUpdated ? 'updated' : 'created'} with ${topTracks.length} tracks!`);

        if (openPlaylistAfterSortEnabled && newPlaylist.uri) { 
            const tempPath = "/library"; 
            Spicetify.Platform.History.push(tempPath);
            await new Promise(resolve => setTimeout(resolve, 450)); 
            const newPlaylistPath = Spicetify.URI.fromString(newPlaylist.uri).toURLPath(true);
            if (newPlaylistPath) Spicetify.Platform.History.push(newPlaylistPath);
        }

    } catch (error) {
        console.error("Error generating Followed Artist Picks:", error);
        Spicetify.showNotification(error.message, true);
    } finally {
        resetButtons();
    }
  }


  async function generateNewDiscoveryPicks() {
    const { GraphQL, CosmosAsync } = Spicetify;
    setButtonProcessing(true);
    mainButton.style.backgroundColor = buttonStyles.main.disabledBackgroundColor;
    mainButton.style.color = buttonStyles.main.disabledColor;
    mainButton.style.cursor = "default";
    svgElement.style.fill = buttonStyles.main.disabledColor;
    menuButtons.forEach((button) => (button.disabled = true));
    toggleMenu();
    closeAllMenus();

    try {
        const updateProgress = (message) => { mainButton.innerText = message; };

        updateProgress("Scanning...");

        const formatItem = (item) => {
            const artists = Array.isArray(item.artists) ? item.artists.map(a => a.name).join(', ') : 'N/A';
            return { uri: item.uri, name: item.name, artists, release_date: item.release_date, id: item.id };
        };

        async function fetchBrowseNewReleases() {
            const browseAlbums = [];
            let nextUrl = 'https://api.spotify.com/v1/browse/new-releases?limit=50';
            while (nextUrl) {
                try {
                    const res = await CosmosAsync.get(nextUrl);
                    if (res.albums?.items) {
                        browseAlbums.push(...res.albums.items.map(formatItem));
                        nextUrl = res.albums.next;
                    } else nextUrl = null;
                } catch (e) { console.warn("Error fetching Browse releases:", e); nextUrl = null; }
            }
            return browseAlbums;
        }

        async function fetchSearchNewAlbums() {
            const searchAlbums = [];
            let nextUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(`year:${new Date().getFullYear()}`)}&type=album&limit=50`;
            while (nextUrl && searchAlbums.length < 1000) {
                try {
                    const res = await CosmosAsync.get(nextUrl);
                    if (res.albums?.items) {
                        searchAlbums.push(...res.albums.items);
                        nextUrl = res.albums.next;
                    } else nextUrl = null;
                } catch (e) { console.warn("Error fetching Search releases:", e); nextUrl = null; }
            }
            const twoMonthsAgo = new Date(new Date().getFullYear(), new Date().getMonth() - 2, 1);
            return searchAlbums.filter(album => new Date(album.release_date) >= twoMonthsAgo).map(formatItem);
        }

        const [browseResults, searchResults] = await Promise.all([
            fetchBrowseNewReleases(),
            fetchSearchNewAlbums()
        ]);

        const combinedResults = [...browseResults, ...searchResults];
        const uniqueAlbums = Array.from(new Map(combinedResults.map(item => [item.uri, item])).values());
        
        if (uniqueAlbums.length === 0) {
            throw new Error("Could not find any new releases from Spotify's sources.");
        }

        updateProgress(`Get tracks...`);
        let initialTracks = [];
        const albumIds = uniqueAlbums.map(album => album.id);

        for (let i = 0; i < albumIds.length; i += 20) {
            const albumIdBatch = albumIds.slice(i, i + 20);
            const albumsData = await CosmosAsync.get(`https://api.spotify.com/v1/albums?ids=${albumIdBatch.join(',')}`);
            if (albumsData.albums) {
                for (const album of albumsData.albums) {
                    if (album && album.tracks && album.tracks.items) {
                        initialTracks.push(...album.tracks.items);
                    }
                }
            }
        }
        
        if (initialTracks.length === 0) {
            throw new Error("Could not fetch any tracks from the new releases.");
        }

        updateProgress("Verifying...");
        const dateLimit = new Date();
        dateLimit.setUTCHours(0, 0, 0, 0);
        dateLimit.setUTCDate(dateLimit.getUTCDate() - (newReleasesDaysLimit - 1));
        let genuinelyNewTracks = [];
        const initialTrackIds = initialTracks.map(t => t.id).filter(Boolean);

        for (let i = 0; i < initialTrackIds.length; i += 50) {
            const trackIdBatch = initialTrackIds.slice(i, i + 50);
            const fullTrackData = await CosmosAsync.get(`https://api.spotify.com/v1/tracks?ids=${trackIdBatch.join(',')}`);
            if (fullTrackData.tracks) {
                for (const track of fullTrackData.tracks) {
                    if (track && track.album && track.album.release_date) {
                        const trackReleaseDate = new Date(track.album.release_date);
                        if (trackReleaseDate >= dateLimit) {
                            genuinelyNewTracks.push({
                                ...track,
                                allArtists: track.artists.map(a => a.name).join(', '),
                                artistUris: track.artists.map(a => a.uri),
                                durationMilis: track.duration_ms,
                            });
                        }
                    }
                }
            }
        }

        if (genuinelyNewTracks.length === 0) {
            throw new Error("No genuinely new tracks found after filtering out old songs.");
        }

        const MAX_TRACKS_TO_PROCESS = 1000;
        let tracksToProcess = [...new Map(genuinelyNewTracks.map(item => [item.uri, item])).values()];

        if (tracksToProcess.length > MAX_TRACKS_TO_PROCESS) {
            tracksToProcess.sort((a, b) => new Date(b.album.release_date) - new Date(a.album.release_date));
            tracksToProcess = tracksToProcess.slice(0, MAX_TRACKS_TO_PROCESS);
        }

        const profileData = await getAffinityProfileData(updateProgress);
        const affinityProfile = buildAffinityProfile(profileData, updateProgress, 'balanced').affinityProfile;
        
        const audioFeaturesForScoring = await getAudioFeaturesForTracks(tracksToProcess.map(t => t.uri.split(':')[2]));
        const audioFeaturesMapForScoring = new Map(audioFeaturesForScoring.map(f => [f.id, f]));

        const scoredTracks = await scoreAndSortPlaylist(tracksToProcess, affinityProfile, profileData, updateProgress, 'balanced', audioFeaturesMapForScoring);
        
        if (scoredTracks.length === 0) {
            throw new Error("No tracks matched your affinity profile.");
        }

        updateProgress("Balancing...");

        const tracksByAlbum = scoredTracks.reduce((acc, track) => {
            const albumUri = track.album.uri;
            if (!acc[albumUri]) acc[albumUri] = [];
            acc[albumUri].push(track);
            return acc;
        }, {});

        let candidateTracks = [];
        for (const albumUri in tracksByAlbum) {
            const bestTrackFromAlbum = tracksByAlbum[albumUri].sort((a, b) => b.finalScore - a.finalScore)[0];
            candidateTracks.push(bestTrackFromAlbum);
        }
        candidateTracks.sort((a, b) => b.finalScore - a.finalScore);

        const FINAL_PLAYLIST_SIZE = 100;
        const candidateTrackIds = candidateTracks.map(t => t.uri.split(':')[2]);
        const audioFeatures = await getAudioFeaturesForTracks(candidateTrackIds);
        const audioFeaturesMap = new Map(audioFeatures.map(f => [f.id, f]));
        
        const energyProfile = affinityProfile.rawSonicProfile.energy;
        const totalWeight = energyProfile.reduce((a, b) => a + b, 0);
        const lowEnergyWeight = energyProfile.slice(0, 4).reduce((a, b) => a + b, 0);
        const mediumEnergyWeight = energyProfile.slice(4, 7).reduce((a, b) => a + b, 0);
        const highEnergyWeight = energyProfile.slice(7, 10).reduce((a, b) => a + b, 0);

        const lowRatio = totalWeight > 0 ? lowEnergyWeight / totalWeight : 0.33;
        const mediumRatio = totalWeight > 0 ? mediumEnergyWeight / totalWeight : 0.34;
        const highRatio = totalWeight > 0 ? highEnergyWeight / totalWeight : 0.33;

        let targetLow = Math.round(FINAL_PLAYLIST_SIZE * lowRatio);
        let targetMedium = Math.round(FINAL_PLAYLIST_SIZE * mediumRatio);
        let targetHigh = Math.round(FINAL_PLAYLIST_SIZE * highRatio);
        
        let totalTarget = targetLow + targetMedium + targetHigh;
        while(totalTarget !== FINAL_PLAYLIST_SIZE) {
            if (totalTarget > FINAL_PLAYLIST_SIZE) targetMedium--;
            else targetHigh++;
            totalTarget = targetLow + targetMedium + targetHigh;
        }

        const lowEnergyBin = [], mediumEnergyBin = [], highEnergyBin = [];
        for(const track of candidateTracks) {
            const features = audioFeaturesMap.get(track.uri.split(':')[2]);
            if (features) {
                if (features.energy < 0.4) lowEnergyBin.push(track);
                else if (features.energy <= 0.7) mediumEnergyBin.push(track);
                else highEnergyBin.push(track);
            }
        }

        const artistCountMap = new Map();
        const albumCountMap = new Map();
        const topTracks = [];
        const MAX_SONGS_PER_ARTIST = 3;
        const MAX_SONGS_PER_ALBUM = 1;

        const binPointers = { low: 0, medium: 0, high: 0 };
        const binArrays = { low: lowEnergyBin, medium: mediumEnergyBin, high: highEnergyBin };
        const binTargets = { low: targetLow, medium: targetMedium, high: targetHigh };
        const binCounts = { low: 0, medium: 0, high: 0 };

        while (topTracks.length < FINAL_PLAYLIST_SIZE) {
            let trackAddedInCycle = false;
            const pickOrder = ['high', 'medium', 'low'].sort((a,b) => (binCounts[b] / binTargets[b]) - (binCounts[a] / binTargets[a]));

            for (const binName of pickOrder) {
                if (topTracks.length >= FINAL_PLAYLIST_SIZE) break;
                while (binArrays[binName].length > binPointers[binName] && binCounts[binName] < binTargets[binName]) {
                    const track = binArrays[binName][binPointers[binName]];
                    binPointers[binName]++;
                    const primaryArtistUri = track.artists[0].uri;
                    const albumUri = track.album.uri;
                    const artistCount = artistCountMap.get(primaryArtistUri) || 0;
                    const albumCount = albumCountMap.get(albumUri) || 0;
                    if (artistCount < MAX_SONGS_PER_ARTIST && albumCount < MAX_SONGS_PER_ALBUM) {
                        topTracks.push(track);
                        artistCountMap.set(primaryArtistUri, artistCount + 1);
                        albumCountMap.set(albumUri, albumCount + 1);
                        binCounts[binName]++;
                        trackAddedInCycle = true;
                        break;
                    }
                }
            }
             if (!trackAddedInCycle) break;
        }
        
        const trackUris = topTracks.map(track => track.uri);
        const playlistName = "New Music Picks";
        const playlistDescription = `A personalized mix of new music from across Spotify, tailored to your taste by Sort-Play.`;
        
        updateProgress("Creating...");
        const { playlist: newPlaylist, wasUpdated } = await getOrCreateDedicatedPlaylist('newDiscoveryPicks', playlistName, playlistDescription);
        
        updateProgress("Saving...");
        if (wasUpdated) {
            await replacePlaylistTracks(newPlaylist.id, trackUris);
        } else {
            await addTracksToPlaylist(newPlaylist.id, trackUris);
        }
        
        Spicetify.showNotification(`Playlist "${playlistName}" ${wasUpdated ? 'updated' : 'created'} with ${topTracks.length} tracks!`);

        if (openPlaylistAfterSortEnabled && newPlaylist.uri) { 
            const tempPath = "/library"; 
            Spicetify.Platform.History.push(tempPath);
            await new Promise(resolve => setTimeout(resolve, 450)); 
            const newPlaylistPath = Spicetify.URI.fromString(newPlaylist.uri).toURLPath(true);
            if (newPlaylistPath) Spicetify.Platform.History.push(newPlaylistPath);
        }

    } catch (error) {
        console.error("Error generating New Discovery Picks:", error);
        Spicetify.showNotification(error.message, true);
    } finally {
        resetButtons();
    }
  }

  async function handleSortAndCreatePlaylist(sortType) {
    if (sortType === "sortByParent" || sortType === "affinityParent" || sortType === "createNewPlaylist") {
      return;
    }

    const topTrackSortTypes = {
        topThisMonth:    { time_range: 'short_term',  name: 'This Month',      description: 'from this month' },
        topLast6Months:  { time_range: 'medium_term', name: 'Last 6 Months',   description: 'from the last 6 months' },
        topAllTime:      { time_range: 'long_term',   name: 'All-Time',        description: 'of all time' }
    };

    const recommendationSortTypes = ['recommendRecentVibe', 'recommendAllTime', 'pureDiscovery', 'followedArtistPicks', 'newDiscoveryPicks', 'followedReleasesChronological'];
    if (recommendationSortTypes.includes(sortType)) {
        if (sortType === 'followedArtistPicks') {
            await generateFollowedArtistPicks();
        } else if (sortType === 'newDiscoveryPicks') {
            await generateNewDiscoveryPicks();
        } else if (sortType === 'followedReleasesChronological') {
            await generateFollowedReleasesChronological();
        } else {
            setButtonProcessing(true);
            mainButton.style.backgroundColor = buttonStyles.main.disabledBackgroundColor;
            mainButton.style.color = buttonStyles.main.disabledColor;
            mainButton.style.cursor = "default";
            svgElement.style.fill = buttonStyles.main.disabledColor;
            menuButtons.forEach((button) => (button.disabled = true));
            toggleMenu();
            closeAllMenus();
            await generatePersonalizedRecommendations(sortType);
        }
        return; 
    }
    
    if (topTrackSortTypes[sortType]) {
        setButtonProcessing(true);
        mainButton.style.backgroundColor = buttonStyles.main.disabledBackgroundColor;
        mainButton.style.color = buttonStyles.main.disabledColor;
        mainButton.style.cursor = "default";
        svgElement.style.fill = buttonStyles.main.disabledColor;
        menuButtons.forEach((button) => (button.disabled = true));
        toggleMenu();
        closeAllMenus();
        
        try {
            mainButton.innerText = "Fetching...";
            const topTracksData = await getTopItems('tracks', topTrackSortTypes[sortType].time_range, topTracksLimit);
            
            if (!topTracksData || topTracksData.length === 0) {
                Spicetify.showNotification(`No top tracks found for "${topTrackSortTypes[sortType].name}".`, true);
                resetButtons();
                return;
            }

            const trackUris = topTracksData.map(track => track.uri);
            const playlistName = `My Top Tracks: ${topTrackSortTypes[sortType].name}`;
            const playlistDescription = `Your top tracks ${topTrackSortTypes[sortType].description}, created by Sort-Play.`;
            
            mainButton.innerText = "Creating...";
            const { playlist: newPlaylist, wasUpdated } = await getOrCreateDedicatedPlaylist(sortType, playlistName, playlistDescription);
            
            mainButton.innerText = "Saving...";
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
            resetButtons();
        }
        return; 
    }

    setButtonProcessing(true);
    mainButton.style.backgroundColor = buttonStyles.main.disabledBackgroundColor;
    mainButton.style.color = buttonStyles.main.disabledColor;
    mainButton.style.cursor = "default";
    svgElement.style.fill = buttonStyles.main.disabledColor;
    menuButtons.forEach((button) => (button.disabled = true));
    toggleMenu();
    closeAllMenus();

    const initialPagePath = Spicetify.Platform.History.location.pathname; 

    try {
      const currentUriAtStart = getCurrentUri(); 
      if (!currentUriAtStart) {
        resetButtons();
        Spicetify.showNotification("Please select a playlist or artist first");
        return;
      }

      let tracks;
      let isArtistPage = false;
      let currentPlaylistDetails = null;
      let sourcePlaylistCoverUrl = null;
      let sourceNameForDialog = "Current Playlist"; 

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
      } else {
        throw new Error('Invalid playlist or artist page');
      }

      if (!tracks || tracks.length === 0) {
          Spicetify.showNotification('No tracks found to sort');
          resetButtons();
          return;
      }

      const user = await Spicetify.Platform.UserAPI.getUser();
      let canModifyCurrentPlaylist = sortCurrentPlaylistEnabled &&
                                       createPlaylistAfterSort && 
                                       isDirectSortType(sortType) &&
                                       URI.isPlaylistV1OrV2(currentUriAtStart) &&
                                       !isArtistPage &&
                                       !isLikedSongsPage(currentUriAtStart) &&
                                       currentPlaylistDetails &&
                                       currentPlaylistDetails.owner &&
                                       currentPlaylistDetails.owner.id === user.username;

      if (sortType === 'affinityPowerHour' || sortType === 'affinityMellowMood') {
          canModifyCurrentPlaylist = false;
      }

      if (canModifyCurrentPlaylist) {
        const proceedWithModification = await new Promise((resolve) => {
            Spicetify.ReactDOM.render(
                Spicetify.React.createElement(Spicetify.ReactComponent.ConfirmDialog, {
                    isOpen: true,
                    titleText: "Sort Current Playlist?",
                    descriptionText: `This will replace all tracks in "${sourceNameForDialog}" with the sorted version. This action cannot be undone. Are you sure?`,
                    confirmText: "Confirm & Sort",
                    cancelText: "Cancel",
                    onConfirm: () => {
                        Spicetify.ReactDOM.unmountComponentAtNode(container);
                        resolve(true);
                    },
                    onClose: () => {
                        Spicetify.ReactDOM.unmountComponentAtNode(container);
                        resolve(false);
                    },
                    onOutside: () => {
                        Spicetify.ReactDOM.unmountComponentAtNode(container);
                        resolve(false);
                    }
                }),
                container
            );
        });

        if (!proceedWithModification) {
            Spicetify.showNotification("Sorting current playlist cancelled.");
            resetButtons();
            return;
        }
      }

      let sortedTracks;
      let uniqueTracks;
      let removedTracks = [];
      let playlistUriForQueue = currentUriAtStart; 
      let playlistWasModifiedOrCreated = false;
      let newPlaylistObjectForNavigation = null; 
      let modifiedPlaylistOriginalPath = null;
      
      const isAffinitySort = ['affinityBalanced', 'affinityShortTerm', 'affinityLongTerm', 'affinityPowerHour', 'affinityMellowMood', 'affinityHiddenGems'].includes(sortType);

      if (isAffinitySort) {
        const updateProgress = (message) => { mainButton.innerText = message; };
        try {
            updateProgress("Analyzing...");
            const trackIds = tracks.map(t => t.uri.split(':')[2]);
            const audioFeatures = await getAudioFeaturesForTracks(trackIds);
            const audioFeaturesMap = new Map(audioFeatures.map(f => [f.id, f]));

            let hasPotentialCandidates = false;
            if (sortType === 'affinityPowerHour') {
                hasPotentialCandidates = tracks.some(track => {
                    const features = audioFeaturesMap.get(track.uri.split(':')[2]);
                    return features && features.energy > 0.65 && features.danceability > 0.5;
                });
            } else if (sortType === 'affinityMellowMood') {
                hasPotentialCandidates = tracks.some(track => {
                    const features = audioFeaturesMap.get(track.uri.split(':')[2]);
                    return features && features.energy < 0.4 && features.acousticness > 0.5 && features.speechiness < 0.33;
                });
            } else {
                hasPotentialCandidates = true; 
            }

            if (!hasPotentialCandidates) {
                Spicetify.showNotification("This playlist contains no tracks suitable for this mood mix.");
                resetButtons();
                return;
            }

            const profileData = await getAffinityProfileData(updateProgress);
            
            let timeScope;
            switch(sortType) {
                case 'affinityShortTerm': timeScope = 'recent'; break;
                case 'affinityLongTerm': timeScope = 'all_time'; break;
                case 'affinityPowerHour': timeScope = 'energy'; break;
                case 'affinityMellowMood': timeScope = 'mellow'; break;
                case 'affinityBalanced':
                case 'affinityHiddenGems':
                default: timeScope = 'balanced'; break;
            }
            const { affinityProfile, finalTimeScope } = buildAffinityProfile(profileData, updateProgress, timeScope);
            
            sortedTracks = await scoreAndSortPlaylist(tracks, affinityProfile, profileData, updateProgress, finalTimeScope, audioFeaturesMap);
            
            if (sortType === 'affinityHiddenGems') {
                if (sortedTracks.length > 0) {
                    sortedTracks.forEach(track => {
                        const popularityScore = track.popularity || 0;
                        const discoveryScore = track.finalScore / Math.log10(popularityScore + 2);
                        track.discoveryScore = discoveryScore;
                    });
                    sortedTracks.sort((a, b) => b.discoveryScore - a.discoveryScore);
                }
            }

            uniqueTracks = sortedTracks; 
            removedTracks = [];
            mainButton.innerText = "100%";
        } catch (error) {
            Spicetify.showNotification(error.message, true);
            resetButtons();
            return;
        }
      } else {
        mainButton.innerText = "0%";

        const tracksWithPlayCounts = await enrichTracksWithPlayCounts(
          tracks, (progress) => { mainButton.innerText = `${Math.floor(progress * 0.20)}%`; }
        );
        const tracksWithIds = await processBatchesWithDelay(
          tracksWithPlayCounts, 200, 1000, (progress) => { mainButton.innerText = `${20 + Math.floor(progress * 0.20)}%`; }, collectTrackIdsForPopularity
        );
        const tracksWithPopularity = await fetchPopularityForMultipleTracks(
          tracksWithIds, (progress) => { mainButton.innerText = `${40 + Math.floor(progress * 0.20)}%`; }
        );

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
              tracksWithPopularity, 200, 1000, (progress) => { mainButton.innerText = `${60 + Math.floor(progress * 0.20)}%`; }, getTrackDetailsWithReleaseDate
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
                          mainButton.innerText = `${60 + Math.floor(overallProgress * 0.40)}%`;
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
                          mainButton.innerText = `${60 + Math.floor(cachedPortion + uncachedPortion)}%`;
                      },
                      getTrackDetailsWithPaletteAnalysis
                  );
                  tracksWithColor.push(...uncachedResults);
              }

              tracksForDeduplication = tracksWithColor;
          } else {
            tracksForDeduplication = tracksWithPopularity;
          }
          
          const deduplicationResult = deduplicateTracks(tracksForDeduplication);
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
            sortedTracks = shuffleArray(uniqueTracks);
          } else if (sortType === "deduplicateOnly") {
            if (removedTracks.length === 0) {
                Spicetify.showNotification("No duplicate tracks found.");
                resetButtons();
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
          mainButton.innerText = "100%";

        } else if (sortType === "scrobbles" || sortType === "personalScrobbles") {
            try {
                const result = await handleScrobblesSorting(
                  tracks, sortType, (progress) => { mainButton.innerText = `${60 + Math.floor(progress * 0.30)}%`; }
                );
                sortedTracks = result.sortedTracks;
                removedTracks = result.removedTracks;
                const totalTracksProgress = sortedTracks.length;
                sortedTracks.forEach((_, index) => {
                  const progress = 90 + Math.floor(((index + 1) / totalTracksProgress) * 10);
                  mainButton.innerText = `${progress}%`;
                });
                mainButton.innerText = "100%";
              } catch (error) {
                resetButtons();
                Spicetify.showNotification(error.message);
                return;
              }
        } else if (sortType === "aiPick") {
          const { uniqueTracks: aiUniqueTracks, removedTracks: removedTracksFromAi } = await handleAiPick(
            tracks, (progress) => { mainButton.innerText = `${60 + Math.floor(progress * 0.30)}%`; }
          );
          removedTracks = removedTracksFromAi;
          if (aiUniqueTracks.length === 0) {
            resetButtons();
            Spicetify.showNotification("No tracks available for AI to pick from.");
            return;
          }
          let artistImageUrl = null;
          if (isArtistPage) {
            try {
              artistImageUrl = await getArtistImageUrl(currentUriAtStart.split(":")[2]);
            } catch (error) { console.error("Error fetching artist image URL:", error); }
          }
          await showAiPickModal(aiUniqueTracks, artistImageUrl);
          return;
        }
      }
      
      if (createPlaylistAfterSort && isDirectSortType(sortType)) {
        if (!sortedTracks || sortedTracks.length === 0) {
            if (sortType === 'affinityPowerHour' || sortType === 'affinityMellowMood') {
                Spicetify.showNotification("No tracks matched the criteria for this personalized sort.");
            } else {
                console.log("No tracks left after sorting/filtering to create/modify playlist.");
                if (!addToQueueEnabled) {
                    Spicetify.showNotification("No tracks to process for playlist.");
                }
            }
            resetButtons();
            return;
        }
        
        const sourceUriForNaming = currentUriAtStart; 
        let finalSourceName;
        if (URI.isArtist(sourceUriForNaming)) {
            finalSourceName = await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/artists/${sourceUriForNaming.split(":")[2]}`).then((r) => r.name);
        } else if (isLikedSongsPage(sourceUriForNaming)) {
            finalSourceName = "Liked Songs";
        } else {
            finalSourceName = currentPlaylistDetails?.name || "Current Playlist";
        }
        const possibleSuffixes = [
            "\\(PlayCount\\)",
            "\\(Popularity\\)",
            "\\(ReleaseDate\\)",
            "\\(LFM Scrobbles\\)",
            "\\(LFM My Scrobbles\\)",
            "\\(Shuffle\\)",
            "\\(AI Pick\\)",
            "\\(Color\\)",
            "\\(Genre Filter\\)",
            "\\(Custom Filter\\)",
            "\\(Personalized\\)",
            "\\(Power Hour\\)",
            "\\(Mellow Mood\\)",
            "\\(Hidden Gems\\)"
        ];
        
        let suffixPattern = new RegExp(`\\s*(${possibleSuffixes.join("|")})\\s*`);
        while (suffixPattern.test(finalSourceName)) {
          finalSourceName = finalSourceName.replace(suffixPattern, "");
        }
        const sortTypeInfo = {
          playCount: { fullName: "play count", shortName: "PlayCount" },
          popularity: { fullName: "popularity", shortName: "Popularity" },
          releaseDate: { fullName: "release date", shortName: "ReleaseDate" },
          scrobbles: { fullName: "Last.fm scrobbles", shortName: "LFM Scrobbles" },
          personalScrobbles: { fullName: "Last.fm personal scrobbles", shortName: "LFM My Scrobbles" },
          shuffle: { fullName: "shuffle", shortName: "Shuffle" },
          averageColor: { fullName: "album color", shortName: "Color" },
          deduplicateOnly: { fullName: "deduplication", shortName: "Deduplicated" },
          affinityBalanced: { fullName: "your taste", shortName: "Personalized" },
          affinityShortTerm: { fullName: "your recent vibe", shortName: "Personalized" },
          affinityLongTerm: { fullName: "your all-time favorites", shortName: "Personalized" },
          affinityPowerHour: { fullName: "your power hour", shortName: "Power Hour" },
          affinityMellowMood: { fullName: "your mellow mood", shortName: "Mellow Mood" },
          affinityHiddenGems: { fullName: "your hidden gems", shortName: "Hidden Gems" }
        }[sortType];

        if (canModifyCurrentPlaylist) {
            const playlistIdToModify = currentUriAtStart.split(":")[2];
            modifiedPlaylistOriginalPath = initialPagePath; 

            try {
                const newPlaylistName = `${finalSourceName} (${sortTypeInfo.shortName})`;
                const newPlaylistDescription = `Sorted by ${sortTypeInfo.fullName} using Sort-Play`;

                try {
                    await Spicetify.CosmosAsync.put(
                        `https://api.spotify.com/v1/playlists/${playlistIdToModify}`,
                        {
                            name: newPlaylistName,
                            description: newPlaylistDescription,
                        }
                    );
                } catch (error) {
                    const isExpectedJsonError = error instanceof SyntaxError && error.message.includes("Unexpected end of JSON input");
                    if (!isExpectedJsonError) {
                        console.warn("An unexpected error occurred while updating playlist details. Proceeding with track replacement.", error);
                    }
                }

                mainButton.innerText = "Saving...";
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
              }
              mainButton.innerText = "Creating...";
              const newPlaylist = await createPlaylist(`${finalSourceName} (${sortTypeInfo.shortName})`, playlistDescription);
              
              await new Promise(resolve => setTimeout(resolve, 1250));
              
              playlistUriForQueue = newPlaylist.uri;
              newPlaylistObjectForNavigation = newPlaylist; 
              playlistWasModifiedOrCreated = true;
              mainButton.innerText = "Saving...";
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
                  const base64Image = await toBase64(sourcePlaylistCoverUrl);
                  await setPlaylistImage(newPlaylist.id, base64Image);
                } catch (error) {
                  console.warn("Could not apply original playlist cover:", error);
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
                  await new Promise(resolve => setTimeout(resolve, 400));
                  Spicetify.Platform.History.push(modifiedPlaylistOriginalPath); 
              } else {
              }
          } else if (openPlaylistAfterSortEnabled && newPlaylistObjectForNavigation && newPlaylistObjectForNavigation.uri) { 
              const tempPath = "/library"; 
              Spicetify.Platform.History.push(tempPath);
              await new Promise(resolve => setTimeout(resolve, 450)); 
              const newPlaylistPath = Spicetify.URI.fromString(newPlaylistObjectForNavigation.uri).toURLPath(true);
              if (newPlaylistPath) {
                Spicetify.Platform.History.push(newPlaylistPath);
              } else {
                console.warn("Could not determine path for new playlist URI:", newPlaylistObjectForNavigation.uri);
              }
          }
      }


    } catch (error) {
      console.error("Error during sorting process:", error);
      Spicetify.showNotification(`An error occurred during the sorting process: ${error.message}`);
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
  

  function deduplicateTracks(tracks) {
      const currentUri = getCurrentUri();
      if (!playlistDeduplicate && URI.isPlaylistV1OrV2(currentUri)) {
          return { unique: tracks, removed: [] };
      }

      const DURATION_THRESHOLD = 2000; 
      const finalUniqueTracks = [];
      const finalRemovedTracks = [];

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
              const candidateNormalizedTitle = candidateRawTitle.trim().toLowerCase().replace(/['’ʼ]/g, "'").replace(/[^a-z0-9\s]/g, "");
              const candidateFirstWord = candidateNormalizedTitle.split(/\s+/)[0];
              const candidateDuration = candidateTrack.durationMs;

              const existingRawTitle = existingUniqueTrack.songTitle || existingUniqueTrack.name || "Unknown Title";
              const existingNormalizedTitle = existingRawTitle.trim().toLowerCase().replace(/['’ʼ]/g, "'").replace(/[^a-z0-9\s]/g, "");
              const existingFirstWord = existingNormalizedTitle.split(/\s+/)[0];
              const existingDuration = existingUniqueTrack.durationMs; 

              let areDuplicatesByNewRules = false;

              if (candidateHasValidPlayCount && existingHasValidPlayCount) {
                  if (Number(candidateTrack.playCount) === Number(existingUniqueTrack.playCount)) {
                      const durationDiff = Math.abs(candidateDuration - existingDuration);
                      if (candidateFirstWord === existingFirstWord) {
                          if (durationDiff <= DURATION_THRESHOLD) {
                              areDuplicatesByNewRules = true;
                          }
                      } else {
                          if (durationDiff <= DURATION_THRESHOLD) {
                              areDuplicatesByNewRules = true;
                          }
                      }
                  }
              } else if (!candidateHasValidPlayCount && !existingHasValidPlayCount) {
                  if (candidateNormalizedTitle === existingNormalizedTitle && candidateDuration === existingDuration) {
                      areDuplicatesByNewRules = true;
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

    const tracksWithPlayCounts = await enrichTracksWithPlayCounts(
      tracks,
      (progress) => {
        updateProgress(Math.floor(progress * 0.25));
      }
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
        .sort((a, b) => sortOrderState.personalScrobbles ? (a.personalScrobbles ?? 0) - (b.personalScrobbles ?? 0) : (b.personalScrobbles ?? 0) - (a.personalScrobbles ?? 0));
    } else {
      sortedTracks = tracksWithScrobbles
        .filter((track) => track.scrobbles !== null)
        .sort((a, b) => sortOrderState.scrobbles ? a.scrobbles - b.scrobbles : b.scrobbles - a.scrobbles); 
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

  async function getBatchTrackStats(trackIds) {
    if (trackIds.length === 0) {
        return {};
    }

    const results = {};
    try {
        const audioFeaturesResponse = await Spicetify.CosmosAsync.get(
            `https://api.spotify.com/v1/audio-features?ids=${trackIds.join(',')}`
        );
        const trackDetailsResponse = await Spicetify.CosmosAsync.get(
            `https://api.spotify.com/v1/tracks?ids=${trackIds.join(',')}`
        );

        if (!audioFeaturesResponse?.audio_features || !trackDetailsResponse?.tracks) {
            console.warn('Failed to fetch batch track data');
            return {};
        }

        const pitchClasses = ["C", "C♯/D♭", "D", "D♯/E♭", "E", "F", "F♯/G♭", "G", "G♯/A♭", "A", "A♯/B♭", "B"];
        
        audioFeaturesResponse.audio_features.forEach((features, index) => {
            if (features) {
                const trackDetails = trackDetailsResponse.tracks[index];
                results[features.id] = {
                    danceability: features.danceability ? Math.round(100 * features.danceability) : null,
                    energy: features.energy ? Math.round(100 * features.energy) : null,
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

    } catch (error) {
        console.error('Error fetching batch track stats:', error);
    }
    return results;
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

  async function loadAdditionalColumnData(tracklist_) {
    const currentUri = getCurrentUri();
    let isColumnEnabled = false;
    let activeColumnType = 'playCount';
    const audioFeatureTypes = ['key', 'tempo', 'energy', 'danceability', 'valence', 'djInfo', 'popularity'];

    if (URI.isPlaylistV1OrV2(currentUri) || isLikedSongsPage(currentUri)) {
        isColumnEnabled = showAdditionalColumn;
        activeColumnType = selectedColumnType;
    } else if (URI.isAlbum(currentUri)) {
        isColumnEnabled = showAlbumColumn;
        activeColumnType = selectedAlbumColumnType;
    } else if (URI.isArtist(currentUri)) {
        isColumnEnabled = showArtistColumn;
        activeColumnType = selectedArtistColumnType;
    }

    if (!isColumnEnabled) return;

    const tracksToProcess = Array.from(tracklist_.getElementsByClassName("main-trackList-trackListRow"))
        .filter(track => {
            if (track.classList.contains('sort-play-processing') || track.hasAttribute('data-sp-fetch-failed')) {
                return false;
            }
            const dataElement = track.querySelector(".sort-play-data");
            const trackUri = getTracklistTrackUri(track);
            const isTrack = trackUri && trackUri.includes("track");
            return dataElement && (dataElement.textContent === "" || dataElement.textContent === "_") && isTrack && trackUri;
        });
    
    if (tracksToProcess.length === 0) return;

    if (activeColumnType === 'playCount') initializePlayCountCache();
    else if (activeColumnType === 'releaseDate') initializeReleaseDateCache();
    else if (activeColumnType === 'scrobbles') initializeScrobblesCache();
    
    const BATCH_SIZE = 50;
    
    for (let i = 0; i < tracksToProcess.length; i += BATCH_SIZE) {
        const batch = tracksToProcess.slice(i, i + BATCH_SIZE);
        
        if (audioFeatureTypes.includes(activeColumnType)) {
            const trackIdsToFetch = [];
            const elementMap = new Map();

            for (const trackElement of batch) {
                trackElement.classList.add('sort-play-processing');
                const trackUri = getTracklistTrackUri(trackElement);
                const trackId = trackUri ? trackUri.split(":")[2] : null;
                const dataElement = trackElement.querySelector(".sort-play-data");
                if (!trackId || !dataElement) continue;

                const statsCacheModel = "stats-column";
                const cachedData = getTrackCache(trackId, true, false, statsCacheModel);
                let needsFetching = true;

                if (cachedData) {
                    if (activeColumnType === 'djInfo' && cachedData.key !== undefined) {
                        updateDisplay(dataElement, cachedData, 'djInfo');
                        needsFetching = false;
                    } else if (cachedData[activeColumnType] !== undefined) {
                        updateDisplay(dataElement, cachedData[activeColumnType], activeColumnType);
                        needsFetching = false;
                    }
                }

                if (needsFetching) {
                    trackIdsToFetch.push(trackId);
                    elementMap.set(trackId, dataElement);
                } else {
                    trackElement.classList.remove('sort-play-processing');
                }
            }

            if (trackIdsToFetch.length > 0) {
                const batchStats = await getBatchTrackStats(trackIdsToFetch);
                for (const trackId of trackIdsToFetch) {
                    const dataElement = elementMap.get(trackId);
                    const stats = batchStats[trackId];
                    if (stats) {
                        const value = activeColumnType === 'djInfo' ? stats : stats[activeColumnType];
                        updateDisplay(dataElement, value, activeColumnType);
                        const statsCacheModel = "stats-column";
                        const currentCache = getTrackCache(trackId, true, false, statsCacheModel) || {};
                        const newCache = { ...currentCache, ...stats };
                        setTrackCache(trackId, newCache, true, false, statsCacheModel);
                    } else {
                        updateDisplay(dataElement, "_", activeColumnType);
                    }
                    const trackElement = dataElement.closest('.main-trackList-trackListRow');
                    if (trackElement) trackElement.classList.remove('sort-play-processing');
                }
            }
        } else {
            const trackIdsToFetch = [];
            const elementMap = new Map();

            for (const trackElement of batch) {
                trackElement.classList.add('sort-play-processing');
                const trackUri = getTracklistTrackUri(trackElement);
                const trackId = trackUri ? trackUri.split(":")[2] : null;
                const dataElement = trackElement.querySelector(".sort-play-data");
                if (!trackId || !dataElement) {
                    trackElement.classList.remove('sort-play-processing');
                    continue;
                }

                let isCached = false;
                if (activeColumnType === 'playCount') {
                    const cachedCount = getCachedPlayCount(trackId);
                    if (cachedCount !== null) {
                        updateDisplay(dataElement, cachedCount, activeColumnType);
                        isCached = true;
                    }
                } else if (activeColumnType === 'releaseDate') {
                    const cachedDate = getCachedReleaseDate(trackId);
                    if (cachedDate !== null) {
                        updateDisplay(dataElement, cachedDate, activeColumnType);
                        isCached = true;
                    }
                } else if (activeColumnType === 'scrobbles') {
                    const cachedScrobbles = getCachedScrobbles(trackId);
                     if (cachedScrobbles !== null) {
                        updateDisplay(dataElement, cachedScrobbles, activeColumnType);
                        isCached = true;
                    }
                }

                if (isCached) {
                    trackElement.classList.remove('sort-play-processing');
                } else {
                    elementMap.set(trackId, { trackElement, dataElement });
                    trackIdsToFetch.push(trackId);
                }
            }

            if (trackIdsToFetch.length > 0) {
                let success = false;
                let retries = 0;
                const maxRetries = 3;
                let delay = 500;
                let trackDetailsResponse;

                while (!success && retries < maxRetries) {
                    try {
                        trackDetailsResponse = await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/tracks?ids=${trackIdsToFetch.join(',')}`);
                        
                        if (trackDetailsResponse && trackDetailsResponse.tracks) {
                            success = true;
                        } else {
                            throw new Error("Spotify API request for track details failed or returned invalid data.");
                        }
                    } catch (error) {
                        retries++;
                        console.warn(`Sort-Play: Error fetching track details batch (Attempt ${retries}/${maxRetries}):`, error);
                        if (retries < maxRetries) {
                            await new Promise(resolve => setTimeout(resolve, delay));
                            delay *= 2;
                        }
                    }
                }

                if (success && trackDetailsResponse) {
                    const processingPromises = trackDetailsResponse.tracks.map(async (trackDetails) => {
                        if (!trackDetails) return;

                        const { trackElement, dataElement } = elementMap.get(trackDetails.id) || {};
                        if (!trackElement || !dataElement) return;

                        try {
                            if (activeColumnType === 'playCount') {
                                const result = await getTrackDetailsWithPlayCount({ track: { album: { id: trackDetails.album.id }, id: trackDetails.id } });
                                updateDisplay(dataElement, result.playCount, activeColumnType);
                                if (result.playCount !== null && result.playCount !== "N/A") setCachedPlayCount(trackDetails.id, result.playCount);
                            } else if (activeColumnType === 'releaseDate') {
                                const releaseDate = trackDetails.album.release_date;
                                updateDisplay(dataElement, releaseDate, activeColumnType);
                                if (releaseDate) setCachedReleaseDate(trackDetails.id, releaseDate);
                            } else if (activeColumnType === 'scrobbles' || activeColumnType === 'personalScrobbles') {
                                const trackName = trackDetails.name;
                                const artistName = trackDetails.artists?.[0]?.name;
                                if (!artistName || !trackName) throw new Error("Missing artist/track name.");

                                if (activeColumnType === 'scrobbles') {
                                    const result = await getTrackDetailsWithScrobbles({ name: trackName, artists: [{ name: artistName }] });
                                    updateDisplay(dataElement, result.scrobbles, activeColumnType);
                                    if (result.scrobbles !== null) setCachedScrobbles(trackDetails.id, result.scrobbles);
                                } else {
                                    if (!loadLastFmUsername()) {
                                        updateDisplay(dataElement, "_", activeColumnType);
                                    } else {
                                        const result = await getTrackDetailsWithPersonalScrobbles({ name: trackName, artists: [{ name: artistName }] });
                                        updateDisplay(dataElement, result.personalScrobbles, activeColumnType);
                                    }
                                }
                            }
                        } catch (e) {
                            updateDisplay(dataElement, "_", activeColumnType);
                            trackElement.setAttribute('data-sp-fetch-failed', 'true');
                        } finally {
                            trackElement.classList.remove('sort-play-processing');
                        }
                    });
                    await Promise.all(processingPromises);
                } else {
                    console.error(`Sort-Play: Failed to fetch batch track details after ${maxRetries} attempts.`);
                    trackIdsToFetch.forEach(trackId => {
                        const { trackElement, dataElement } = elementMap.get(trackId) || {};
                        if (trackElement && dataElement) {
                            updateDisplay(dataElement, "_", activeColumnType);
                            trackElement.setAttribute('data-sp-fetch-failed', 'true');
                            trackElement.classList.remove('sort-play-processing');
                        }
                    });
                }
            }
        }
        if (i < tracksToProcess.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 200));
        }
    }
  }


  function updateDisplay(element, value, type) {
    if (!element) return;

    let displayValue = "_"; 

    if (type === 'playCount') {
        if (value > 0 && !isNaN(value)) {
            displayValue = new Intl.NumberFormat('en-US').format(value);
        }
    } else if (type === 'personalScrobbles') {
        if (value > 0 && !isNaN(value)) {
            if (myScrobblesDisplayMode === 'sign') {
                displayValue = '\u2705';
            } else { 
                displayValue = new Intl.NumberFormat('en-US').format(value);
            }
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
                headerColumn.style.display = "flex";
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

    const dateAddedHeader = tracklistHeader.querySelector('[aria-colindex="4"]');
    if (dateAddedHeader) {
        dateAddedHeader.style.display = shouldRemoveDateAdded ? 'none' : '';
    }

    const allRows = tracklist_.getElementsByClassName("main-trackList-trackListRow");
    for (const track of allRows) {
        const existingDataColumn = track.querySelector(".sort-play-data-column");

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

        const dateAddedCell = track.querySelector('[aria-colindex="4"]');
        if (dateAddedCell) {
            dateAddedCell.style.display = shouldRemoveDateAdded ? 'none' : '';
        }
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
            allCells.forEach(cell => cell.textContent = "");
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
            allCells.forEach(cell => cell.textContent = "");
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
    } 
    else if (URI.isAlbum(currentUri)) {
        const newContainer = document.querySelector(".yLmA5f7x65en2MdKbIhX");

        if (newContainer) {
            const sortDropdown = newContainer.querySelector(".x-sortBox-sortDropdown");
            if (sortDropdown && !newContainer.contains(mainButton)) {
                mainButton.style.marginLeft = "";
                mainButton.style.marginRight = "8px";
                newContainer.insertBefore(mainButton, sortDropdown);
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

  function onPageChange() {
    if (tracklistObserver) tracklistObserver.disconnect();
    if (albumTracklistObserver) albumTracklistObserver.disconnect();
    if (artistTracklistObserver) artistTracklistObserver.disconnect();
    
    insertButton();
    const currentUri = getCurrentUri();
    if (!currentUri) return;
    
    if (URI.isPlaylistV1OrV2(currentUri) || isLikedSongsPage(currentUri)) {
        initializeTracklistObserver();
    } else if (URI.isAlbum(currentUri)) {
        initializeAlbumTracklistObserver();
    } else if (URI.isArtist(currentUri)) {
        initializeArtistTracklistObserver();
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
  initializePlayCountCache();
  initializeReleaseDateCache();
  initializeScrobblesCache();
  initializePaletteAnalysisCache();
  console.log(`Sort-Play loaded`);
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = main;
  } else {
    await main();
  }
})();
