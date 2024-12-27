(async function () {
  if (!Spicetify.React || !Spicetify.ReactDOM || !Spicetify.GraphQL) {
    setTimeout(arguments.callee, 10);
    return;
  }

  // Storage keys for API credentials
  const STORAGE_KEY_CLIENT_ID = "spotify_sorter_client_id";
  const STORAGE_KEY_CLIENT_SECRET = "spotify_sorter_client_secret";

  // Function to save credentials to localStorage
  function saveCredentials(clientId, clientSecret) {
    localStorage.setItem(STORAGE_KEY_CLIENT_ID, clientId);
    localStorage.setItem(STORAGE_KEY_CLIENT_SECRET, clientSecret);
  }

  // Function to load credentials from localStorage
  function loadCredentials() {
    return {
      clientId: localStorage.getItem(STORAGE_KEY_CLIENT_ID),
      clientSecret: localStorage.getItem(STORAGE_KEY_CLIENT_SECRET),
    };
  }

  // Function to validate credentials by attempting to get an access token
  async function validateCredentials(clientId, clientSecret) {
    try {
      const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Basic " + btoa(clientId + ":" + clientSecret),
        },
        body: "grant_type=client_credentials",
      });

      const data = await result.json();
      if (!data.access_token) {
        return { valid: false, error: "Invalid credentials" };
      }
      return { valid: true };
    } catch (error) {
      return { valid: false, error: "Failed to validate credentials" };
    }
  }

  // Function to delete credentials from localStorage
  function deleteCredentials() {
    localStorage.removeItem(STORAGE_KEY_CLIENT_ID);
    localStorage.removeItem(STORAGE_KEY_CLIENT_SECRET);
  }
  
  // Function to create API credentials modal
  function showCredentialsModal() {
    const modalContainer = document.createElement("div");
    const savedCreds = loadCredentials();

    modalContainer.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 15px;">
        <div style="display: flex; flex-direction: column; gap: 5px;">
          <label for="clientId">Client ID:</label>
          <input type="text" id="clientId" value="${savedCreds.clientId || ""}" 
                style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #282828; background: #282828; color: white;">
        </div>
        <div style="display: flex; flex-direction: column; gap: 5px;">
          <label for="clientSecret">Client Secret:</label>
          <input type="text" id="clientSecret" value="${savedCreds.clientSecret || ""}" 
                style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #282828; background: #282828; color: white;">
        </div>
        <div style="margin-bottom: 10px;">
          <a href="https://developer.spotify.com/documentation/web-api/quick-start" target="_blank" style="color: #1ED760; text-decoration: underline;">
            Need help setting up the Spotify API?
          </a>
        </div>
        <div id="credentialError" style="color: #ff4444; font-size: 12px; display: none;">
          Invalid credentials. Please check your Client ID and Client Secret.
        </div>
        <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 10px;">
          <button id="cancelApiCreds" class="main-buttons-button" 
                  style="width: 83px; padding: 8px 16px; border-radius: 20px; border: none; cursor: pointer; background-color: #333333; color: white; font-weight: 550; font-size: 13px; text-transform: uppercase; transition: all 0.04s ease;">
            Cancel
          </button>
          <button id="saveApiCreds" class="main-buttons-button main-button-primary" 
                  style="padding: 8px 18px; border-radius: 20px; border: none; cursor: pointer; background-color: #1ED760; color: black; font-weight: 550; font-size: 13px; text-transform: uppercase; transition: all 0.04s ease;">
            Save
          </button>
        </div>
      </div>
    `;

    // Show the modal
    Spicetify.PopupModal.display({
      title: "<span style='font-size: 25px;'>Spotify API Credentials</span>",
      content: modalContainer,
    });

    // Add hover effects for buttons
    const saveButton = document.getElementById("saveApiCreds");
    const cancelButton = document.getElementById("cancelApiCreds");

    // Save button hover effects
    saveButton.addEventListener("mouseenter", () => {
      saveButton.style.backgroundColor = "#3BE377"; 
      saveButton.style.transform = "scale(1.03)";
    });
    saveButton.addEventListener("mouseleave", () => {
      saveButton.style.backgroundColor = "#1ED760";  
      saveButton.style.transform = "scale(1)";
    });

    // Cancel button hover effects
    cancelButton.addEventListener("mouseenter", () => {
      cancelButton.style.backgroundColor = "#444444";  
      cancelButton.style.transform = "scale(1.03)";
    });
    cancelButton.addEventListener("mouseleave", () => {
      cancelButton.style.backgroundColor = "#333333";  
      cancelButton.style.transform = "scale(1)";
    });

    // Function to show error message
    function showError(message) {
      const errorDiv = document.getElementById("credentialError");
      errorDiv.textContent = message;
      errorDiv.style.display = "block";
    }

    // Function to hide error message
    function hideError() {
      const errorDiv = document.getElementById("credentialError");
      errorDiv.style.display = "none";
    }

    // Function to re-enable button
    function enableButton() {
      button.disabled = false;
      button.style.backgroundColor = initialBackgroundColor;
      button.style.color = initialTextColor;
      button.style.cursor = "pointer";
    }

    // Add event listeners for save/cancel actions
    saveButton.addEventListener("click", async () => {
      const clientId = document.getElementById("clientId").value.trim();
      const clientSecret = document.getElementById("clientSecret").value.trim();

      if (!clientId || !clientSecret) {
        showError("Please enter both Client ID and Client Secret");
        return;
      }

      // Disable save button and show loading state
      saveButton.disabled = true;
      saveButton.style.backgroundColor = "#B3B3B3";
      saveButton.style.cursor = "default";
      saveButton.textContent = "Validating...";
      hideError();

      try {
        const validationResult = await validateCredentials(clientId, clientSecret);
        
        if (validationResult.valid) {
          saveCredentials(clientId, clientSecret);
          Spicetify.PopupModal.hide();
          Spicetify.showNotification("API credentials saved successfully!");
          enableButton();
        } else {
          showError(validationResult.error);
          saveButton.disabled = false;
          saveButton.style.backgroundColor = "#1ED760";
          saveButton.style.cursor = "pointer";
          saveButton.textContent = "Save";
        }
      } catch (error) {
        showError("Failed to validate credentials. Please try again.");
        saveButton.disabled = false;
        saveButton.style.backgroundColor = "#1ED760";
        saveButton.style.cursor = "pointer";
        saveButton.textContent = "Save";
      }
    });

    cancelButton.addEventListener("click", () => {
      Spicetify.PopupModal.hide();
      enableButton();
    });
  }

  // Function to create and display the confirmation dialog for deleting API keys
  function showDeleteConfirmationDialog() {
    const dialogProps = {
      confirmText: "Delete",
      cancelText: "Cancel",
      confirmLabel: "Delete API Credentials",
      onConfirm: () => {
        deleteCredentials();
        Spicetify.showNotification("API credentials deleted successfully!");
      },
      onClose: () => {
        // Handle dialog close (if needed)
      },
    };

    const dialogContent = Spicetify.React.createElement(
      "div",
      null,
      Spicetify.React.createElement(
        "p",
        null,
        dialogProps.descriptionText
      )
    );

    const confirmButton = Spicetify.React.createElement(
      "button",
      {
        className: "main-buttons-button main-button-primary",
        onClick: () => {
          dialogProps.onConfirm();
          Spicetify.PopupModal.hide();
        },
        style: {
          padding: "8px 18px",
          borderRadius: "20px",
          border: "none",
          cursor: "pointer",
          backgroundColor: "#FF4444",
          color: "white",
          fontWeight: "550",
          fontSize: "13px",
          textTransform: "uppercase",
          transition: "all 0.04s ease",
        },
        onMouseEnter: (e) => {
          e.target.style.backgroundColor = "#CC0000";
          e.target.style.transform = "scale(1.03)";
        },
        onMouseLeave: (e) => {
          e.target.style.backgroundColor = "#FF4444";
          e.target.style.transform = "scale(1)";
        },
      },
      dialogProps.confirmText
    );

    const cancelButton = Spicetify.React.createElement(
      "button",
      {
        className: "main-buttons-button",
        onClick: () => {
          dialogProps.onClose();
          Spicetify.PopupModal.hide();
        },
        style: {
          width: "83px",
          padding: "8px 16px",
          borderRadius: "20px",
          border: "none",
          cursor: "pointer",
          backgroundColor: "#333333",
          color: "white",
          fontWeight: "550",
          fontSize: "13px",
          textTransform: "uppercase",
          transition: "all 0.04s ease",
        },
        onMouseEnter: (e) => {
          e.target.style.backgroundColor = "#444444";
          e.target.style.transform = "scale(1.03)";
        },
        onMouseLeave: (e) => {
          e.target.style.backgroundColor = "#333333";
          e.target.style.transform = "scale(1)";
        },
      },
      dialogProps.cancelText
    );

    const buttonsContainer = Spicetify.React.createElement(
      "div",
      {
        style: {
          display: "flex",
          gap: "10px",
          justifyContent: "flex-end",
          marginTop: "10px",
        },
      },
      cancelButton,
      confirmButton
    );

    Spicetify.PopupModal.display({
      title: "<span style='font-size: 25px;'>Delete API Credentials?</span>", 
      content: Spicetify.React.createElement(
        "div",
        null,
        dialogContent,
        buttonsContainer
      ),
    });
  }

  // Modify the context menu item to use the confirmation dialog:
  const menuItemDelete = document.createElement("div");
  menuItemDelete.innerText = "Delete Spotify API Keys";
  menuItemDelete.style.cssText = `
    padding: 8px 12px;
    cursor: pointer;
    color: white;
  `;
  menuItemDelete.addEventListener("mouseenter", () => {
    menuItemDelete.style.backgroundColor = "#333";
  });
  menuItemDelete.addEventListener("mouseleave", () => {
    menuItemDelete.style.backgroundColor = "transparent";
  });
  menuItemDelete.addEventListener("click", () => {
    contextMenu.style.display = "none";
    showDeleteConfirmationDialog();
  });
  
  const albumDataCache = {};

  // Map to track in-flight album data requests
  const inFlightAlbumRequests = {};

  // Function to get access token
  async function getAccessToken() {
    const creds = loadCredentials();
    if (!creds.clientId || !creds.clientSecret) {
      throw new Error("API credentials not found");
    }

    const result = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " + btoa(creds.clientId + ":" + creds.clientSecret),
      },
      body: "grant_type=client_credentials",
    });

    const data = await result.json();
    if (!data.access_token) {
      throw new Error("Invalid API credentials");
    }
    return data.access_token;
  }

  // Function to get current playlist ID
  function getCurrentPlaylistId() {
    const playlistURI = Spicetify.Platform.History.location?.pathname;
    if (playlistURI && playlistURI.startsWith("/playlist/")) {
      return playlistURI.split("/")[2];
    }
    return null;
  }

  // Function to get playlist tracks using Spotify API
  async function getPlaylistTracks(playlistId, accessToken) {
    let offset = 0;
    let allTracks = [];
    let keepFetching = true;

    while (keepFetching) {
      const response = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks?offset=${offset}&limit=100`,
        {
          headers: {
            Authorization: "Bearer " + accessToken,
          },
        }
      );

      if (!response.ok) {
        console.error(
          "Failed to fetch playlist tracks:",
          response.status,
          await response.text()
        );
        return [];
      }

      const data = await response.json();
      allTracks = allTracks.concat(data.items);
      offset += 100;

      if (!data.next) {
        keepFetching = false;
      }
    }

    return allTracks;
  }

  // Function to create a new playlist
  async function createPlaylist(
    name = "Sorted by Play Count",
    description = "Created with Spotify Playlist Sorter"
  ) {
    const createPlaylistUrl = "https://api.spotify.com/v1/me/playlists";

    const response = await Spicetify.CosmosAsync.post(
      createPlaylistUrl,
      JSON.stringify({
        name: name,
        public: true,
        description: description,
      })
    );

    return response;
  }

  async function getPlayCountsForAlbum(albumId, retries = 10, retryDelay = 2000) {
    // Check if album data is already in cache
    if (albumDataCache[albumId]) {
      console.log(`Using cached data for album ID: ${albumId}`);
      return albumDataCache[albumId];
    }

    // Use a promise to allow waiting for in-flight requests
    if (!inFlightAlbumRequests[albumId]) {
      inFlightAlbumRequests[albumId] = new Promise(async (resolve, reject) => {
        const { Locale, GraphQL } = Spicetify;

        for (let attempt = 1; attempt <= retries; attempt++) {
          try {
            console.log(
              `Fetching album data for ID: ${albumId} (Attempt ${attempt}/${retries})`
            );
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

            // Check for tracksV2 structure first, then fall back to tracks
            const tracks = res.data.albumUnion.tracksV2 || res.data.albumUnion.tracks;
            if (!tracks?.items) {
              throw new Error(
                `No track items found in album data for album ID: ${albumId}`
              );
            }

            const albumTracks = tracks.items
              .map((item) => {
                // In the new structure, track data is nested under item.track
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

            // Cache result and resolve
            albumDataCache[albumId] = albumTracks;
            resolve(albumTracks);
            return;
          } catch (error) {
            console.error(
              `Error fetching album ID ${albumId} on attempt ${attempt}:`,
              error
            );

            if (attempt < retries) {
              console.warn(
                `Retrying fetch for album ID ${albumId} in ${
                  retryDelay / 1000
                } seconds...`
              );
              await new Promise((resolve) => setTimeout(resolve, retryDelay));
              retryDelay *= 2; 
            } else {
              console.error(
                `Failed to fetch album data for album ID ${albumId} after ${retries} attempts.`
              );
              reject(error);
            }
          }
        }
      });
    } else {
      console.log(`Waiting for existing request for album ID: ${albumId}`);
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

  // Function to get track details along with play count  
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
        songTitle: track.track.name,
        albumName: track.track.album.name,
        trackId: track.track.id,
        albumId: albumId,
        durationMs: track.track.duration_ms,
        playCount: playCount,
        uri: `spotify:track:${track.track.id}`,
      };
    } catch (error) {
      console.error(
        `Error getting details for track ${track.track.uri} (album ${albumId}):`,
        error
      );

      if (retries > 0) {
        console.warn(
          `Retrying track ${track.track.uri} in ${
            retryDelay / 1000
          } seconds... (${retries} retries left)`
        );
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        return getTrackDetailsWithPlayCount(
          track,
          retries - 1,
          retryDelay * 2
        ); // Exponential backoff
      } else {
        console.error(
          `Failed to get details for track ${track.track.uri} after multiple retries.`
        );
        return null; // Indicate failure
      }
    }
  }

  // Create the button
  const button = document.createElement("button");
  button.className =
    "Button-sc-qlcn5g-0 Button-small-buttonTertiary-useBrowserDefaultFocusStyle";
  button.innerText = "Sort";
  button.disabled = false;

  // Initial (not clicked)
  const initialBackgroundColor = "#1ED760";
  const initialTextColor = "black";
  button.style.backgroundColor = initialBackgroundColor;
  button.style.color = initialTextColor;
  button.style.borderRadius = "16px";
  button.style.border = "none";
  button.style.padding = "4px 10px";
  button.style.fontWeight = "550";
  button.style.fontSize = "13px";
  button.style.textTransform = "uppercase";
  button.style.transition = "all 0.04s ease";
  button.style.marginLeft = "5px";
  button.style.marginRight = "5px";
  button.style.width = "75px";

  // Function to animate the button text with dots
  function animateButtonText(button) {
    const animationChars = " • • • ";
    let charIndex = 0;

    const animationInterval = setInterval(() => {
      charIndex = (charIndex + 1) % (animationChars.length + 1);
      button.innerText = animationChars.substring(0, charIndex);
    }, 150);

    return animationInterval;
  }

  // Hover (not clicked)
  button.addEventListener("mouseenter", () => {
    if (!button.disabled) {
      button.style.backgroundColor = "#3BE377";
      button.style.transform = "scale(1.03)";
      button.style.cursor = "pointer";
    }
  });

  button.addEventListener("mouseleave", () => {
    if (!button.disabled) {
      button.style.backgroundColor = initialBackgroundColor;
      button.style.transform = "scale(1)";
    }
  });

  // Clicked (working)
  button.addEventListener("click", () => {
    button.style.backgroundColor = "#B3B3B3"; 
    button.style.color = "#666"; 
    button.style.cursor = "default";
    button.disabled = true; 
  });

  // Helper function to process tracks in batches (with individual track retries)
  async function processBatchesWithDelay(tracks, batchSize = 200, delayMs = 1000) {
    const results = [];
    const batches = [];
    let processedTrackCount = 0; 

    // Split tracks into batches
    for (let i = 0; i < tracks.length; i += batchSize) {
      batches.push(tracks.slice(i, i + batchSize));
    }

    // Process each batch with delay
    for (let i = 0; i < batches.length; i++) {
      console.log(`Processing batch ${i + 1}/${batches.length}`);

      const batchResults = await Promise.allSettled(
        // Use Promise.allSettled
        batches[i].map((track) => getTrackDetailsWithPlayCount(track))
      );

      // Check the status of each promise
      batchResults.forEach((result) => {
        if (result.status === "fulfilled" && result.value !== null) {
          results.push(result.value); 
          processedTrackCount++;
        } else {
          console.warn("A track in the batch failed to process.");
        }

        // Update progress after each track
        button.innerText = `${Math.round(
          (processedTrackCount / tracks.length) * 100
        )}%`;
      });

      // Add delay between batches
      if (i < batches.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }

    return results;
  }

  // Function to add tracks to a playlist
  async function addTracksToPlaylist(playlistId, trackUris) {
    const BATCH_SIZE = 100; // Max is 100
    const playlistUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;

    // Filter out invalid URIs and remove duplicates
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

      try {
        await Spicetify.CosmosAsync.post(playlistUrl, {
          uris: batch,
        });
        console.log(`Added batch ${i / BATCH_SIZE + 1} to playlist`);
      } catch (error) {
        console.error(
          `Error adding batch ${i / BATCH_SIZE + 1} to playlist:`,
          error
        );
      }
    }
  }

  // Create the context menu
  const contextMenu = document.createElement("div");
  contextMenu.className = "context-menu";
  contextMenu.style.cssText = `
    position: fixed;
    background: #282828;
    border: 1px solid #333;
    border-radius: 4px;
    padding: 4px;
    display: none;
    z-index: 1000;
  `;

  const menuItem = document.createElement("div");
  menuItem.innerText = "Change Spotify API";
  menuItem.style.cssText = `
    padding: 8px 12px;
    cursor: pointer;
    color: white;
  `;
  menuItem.addEventListener('mouseenter', () => {
    menuItem.style.backgroundColor = '#333';
  });
  menuItem.addEventListener('mouseleave', () => {
    menuItem.style.backgroundColor = 'transparent';
  });
  menuItem.addEventListener("click", () => {
    contextMenu.style.display = "none";
    showCredentialsModal();
  });

  contextMenu.appendChild(menuItem);
  contextMenu.appendChild(menuItemDelete);
  document.body.appendChild(contextMenu);

  // Add context menu handler to button
  button.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    contextMenu.style.display = "block";
    contextMenu.style.left = `${event.pageX}px`;
    contextMenu.style.top = `${event.pageY}px`;
  });

  // Hide context menu when clicking elsewhere
  document.addEventListener("click", () => {
    contextMenu.style.display = "none";
  });

  // Event listener for the button
  button.addEventListener("click", async (event) => {
    event.stopPropagation();
    console.log("Button clicked!");

    // Check if credentials exist
    const creds = loadCredentials();
    if (!creds.clientId || !creds.clientSecret) {
      button.disabled = true; 
      button.style.backgroundColor = "#B3B3B3"; 
      button.style.color = "#666";
      button.style.cursor = "default"; 
      showCredentialsModal();
      return;
    }

    button.disabled = true;
    const animationInterval = animateButtonText(button);
    try {
      const clientAccessToken = await getAccessToken();
      const playlistId = getCurrentPlaylistId();

      if (playlistId) {
        // Get all tracks from the current playlist
        const tracks = await getPlaylistTracks(playlistId, clientAccessToken);

        // Handle 404 error (likely private playlist)
        if (tracks.length === 0) {
          clearInterval(animationInterval);
          button.disabled = false;
          button.innerText = "Sort";
          button.style.backgroundColor = initialBackgroundColor;
          button.style.color = initialTextColor;
          button.style.cursor = "pointer";
          Spicetify.showNotification("You can't sort private playlists");
          return;
        }

        console.log(`Found ${tracks.length} tracks in the playlist.`);

        // Stop the animation *before* starting batch processing
        clearInterval(animationInterval);
        button.innerText = "0%"; // Initialize to 0%

        // Process tracks in batches with delay
        const tracksWithDetails = await processBatchesWithDelay(tracks);
        console.log("Fetched play counts for all tracks.");

        // Filter out tracks with "N/A" play counts and sort by play count
        const sortedTracks = tracksWithDetails
          .filter((track) => track.playCount !== "N/A")
          .sort((a, b) => b.playCount - a.playCount);
        
        // Check if there are any valid tracks to sort
        if (sortedTracks.length === 0) {
            clearInterval(animationInterval);
            button.disabled = false;
            button.innerText = "Sort";
            button.style.backgroundColor = initialBackgroundColor;
            button.style.color = initialTextColor;
            button.style.cursor = "pointer";
            Spicetify.showNotification("No tracks found with play count data to sort.");
            return;
        }

        // Create a new playlist
        const sourcePlaylist = await Spicetify.CosmosAsync.get(
          `https://api.spotify.com/v1/playlists/${playlistId}`
        );
        const newPlaylist = await createPlaylist(
          `(Sorted) ${sourcePlaylist.name}`,
          "Sorted by play count using sort-play"
        );
        console.log("Created new playlist:", newPlaylist.name);

        // Add sorted tracks to the new playlist in batches
        button.innerText = "Saving";
        const trackUris = sortedTracks.map((track) => track.uri);
        await addTracksToPlaylist(newPlaylist.id, trackUris);
        console.log("Added all tracks to new playlist");

        // Show success notification
        Spicetify.showNotification("Playlist sorted!");

        // Log track details
        sortedTracks.forEach((track, index) => {
          track.trackNumber = index + 1;
          console.log(
            `Track Number: ${track.trackNumber} - Song: ${track.songTitle}, Album: ${track.albumName}, Play Count: ${track.playCount}`
          );
        });
      } else {
        console.error("Could not find current playlist ID.");
        Spicetify.showNotification("Please select a playlist first");
      }
    } catch (error) {
      console.error("Error:", error);
      Spicetify.showNotification("An error occurred");
    } finally {
      // Ensure button is reset even if there's an error
      clearInterval(animationInterval);
      button.disabled = false;
      button.innerText = "Sort";
      button.style.backgroundColor = initialBackgroundColor;
      button.style.color = initialTextColor;
      button.style.cursor = "pointer"; 
    }
  });

  // Function to find the insertion point dynamically
  function findInsertionPoint() {
    // Selector remains the same, targeting the container
    const searchBoxContainer = document.querySelector(
      ".playlist-playlist-searchBoxContainer"
    );
    return searchBoxContainer;
  }

  // Function to insert the button
  function insertButton() {
    const insertionPoint = findInsertionPoint();
    if (insertionPoint) {
      try {
        // Insert before the first child if it exists
        if (insertionPoint.firstChild) {
          insertionPoint.insertBefore(button, insertionPoint.firstChild);
        } else {
          insertionPoint.appendChild(button);
        }
      } catch (error) {
        console.error("Error inserting button:", error);
      }
    } 
  }
  insertButton();

  // MutationObserver to re-insert the button if the ActionBar is re-rendered
  const observer = new MutationObserver(() => {
    if (!document.contains(button)) {
      insertButton();
    }
  });

  // Start observing changes in the body
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  console.log(`Spotify extension loaded`);
})();