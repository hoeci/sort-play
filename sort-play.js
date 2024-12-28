(async function () {
  if (!Spicetify.React || !Spicetify.ReactDOM || !Spicetify.GraphQL || !Spicetify.Platform) {
    setTimeout(arguments.callee, 10);
    return;
  }

  // Import necessary functions and objects from sort-plus.js
  const { URI } = Spicetify;
  const { PlaylistAPI } = Spicetify.Platform;

  const albumDataCache = {};

  // Map to track in-flight album data requests
  const inFlightAlbumRequests = {};

  // Function to get current playlist ID
  function getCurrentPlaylistId() {
    const playlistURI = Spicetify.Platform.History.location?.pathname;
    if (playlistURI && playlistURI.startsWith("/playlist/")) {
      return playlistURI.split("/")[2];
    }
    return null;
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
  
  // Function to get playlist tracks using Spicetify internal API  
  const getPlaylistTracksSpicetify = async (playlistId) => {
    const playlistUri = `spotify:playlist:${playlistId}`;
    const playlistContents = await fetchPlaylistContents(playlistUri);
    const parsedTracks = playlistContents
      .filter((track) => !URI.isLocalTrack(track.uri))
      .map(parsePlaylistAPITrack);
    return parsedTracks;
  };

  // Modified getPlaylistTracks to handle both public and private playlists
  async function getPlaylistTracks(playlistId) {
    try {
        // First, try fetching using Spicetify's internal API (for private playlists)
        const tracks = await getPlaylistTracksSpicetify(playlistId);
        if (tracks.length > 0) {
            console.log("Fetched tracks using Spicetify's internal API (likely a private playlist).");
            return tracks;
        }
    } catch (error) {
        console.warn("Failed to fetch tracks using Spicetify's internal API. Trying public API...", error);
    }
    return [];
}

  async function getPlayCountsForAlbum(albumId, retries = 10, retryDelay = 2000) {
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
        ); 
      } else {
        console.error(
          `Failed to get details for track ${track.track.uri} after multiple retries.`
        );
        return null;  
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
    const BATCH_SIZE = 100;
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

    // Create a new playlist
    async function createPlaylist(
        name = "Sorted by Play Count",
        description = "Created with Spotify Playlist Sorter"
    ) {
        const user = await Spicetify.Platform.UserAPI.getUser();
        const createPlaylistUrl = `https://api.spotify.com/v1/users/${user.username}/playlists`;

        const response = await Spicetify.CosmosAsync.post(
        createPlaylistUrl,
        {
            name: name,
            public: true,
            description: description,
        }
        );

        return response;
    }

    // Event listener to handle playlist sorting
    button.addEventListener("click", async (event) => {
        event.stopPropagation();
        console.log("Button clicked!");

        button.disabled = true;
        const animationInterval = animateButtonText(button);

        try {
            const playlistId = getCurrentPlaylistId();

            if (playlistId) {
                let tracks = [];
                // Try fetching with Spicetify's method primarily
                tracks = await getPlaylistTracks(playlistId);

                // Handle cases where tracks couldn't be fetched
                if (tracks.length === 0) {
                    clearInterval(animationInterval);
                    resetSortButton();
                    Spicetify.showNotification("Could not fetch playlist tracks. Check if the playlist is accessible.");
                    return;
                }

                console.log(`Found ${tracks.length} tracks in the playlist.`);
                clearInterval(animationInterval);
                button.innerText = "0%";

                // Process tracks in batches with delay
                const tracksWithDetails = await processBatchesWithDelay(tracks);
                console.log("Fetched play counts for all tracks.");

                // Filter out tracks with "N/A" play counts and sort by play count
                const sortedTracks = tracksWithDetails
                    .filter((track) => track.playCount !== "N/A")
                    .sort((a, b) => b.playCount - a.playCount);

                if (sortedTracks.length === 0) {
                    clearInterval(animationInterval);
                    resetSortButton();
                    Spicetify.showNotification("No tracks found with play count data to sort.");
                    return;
                }

                // Create a new playlist
                const sourcePlaylist = await Spicetify.CosmosAsync.get(
                    `https://api.spotify.com/v1/playlists/${playlistId}`
                );

                const newPlaylist = await createPlaylist(
                    `(Sorted) ${sourcePlaylist.name}`,
                    "Sorted by play count using sort-play-plus"
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
            clearInterval(animationInterval);
            resetSortButton();
        }
    });

    // Helper function to reset the sort button
    function resetSortButton() {
        button.disabled = false;
        button.innerText = "Sort";
        button.style.backgroundColor = initialBackgroundColor;
        button.style.color = initialTextColor;
        button.style.cursor = "pointer";
    }

  // Function to find the insertion point dynamically
  function findInsertionPoint() {
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
