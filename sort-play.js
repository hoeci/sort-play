(async function () {
  async function main() {
      const { React, ReactDOM, URI, GraphQL, Platform } = Spicetify;
      if (!React || !ReactDOM || !GraphQL || !Platform) {
          setTimeout(main, 10);
          return;
      }

      const { PlaylistAPI } = Platform;

  const LFMApiKey = "***REMOVED***";
  const STORAGE_KEY_LASTFM_USERNAME = "sort-play-lastfm-username";

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
    });

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
    /* Button styles */
    .Button-sc-qlcn5g-0.Button-small-buttonTertiary-useBrowserDefaultFocusStyle {
      cursor: default;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 5px;
    }
  `;
  document.head.appendChild(styleElement);

  const albumDataCache = {};
  const inFlightAlbumRequests = {};
  const albumReleaseDateCache = {};
  const albumTracksDataCache = {};
  const inFlightAlbumReleaseDateRequests = {};

  function getCurrentUri() {
    const path = Spicetify.Platform.History.location?.pathname;
    if (!path) return null;

    if (path.startsWith("/playlist/")) {
      return `spotify:playlist:${path.split("/")[2]}`;
    } else if (path.startsWith("/artist/")) {
      return `spotify:artist:${path.split("/")[2]}`;
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

  const getPlaylistTracksSpicetify = async (playlistId) => {
    const playlistUri = `spotify:playlist:${playlistId}`;
    const retries = 5;
    let delay = 1000;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const playlistContents = await fetchPlaylistContents(playlistUri);
        const parsedTracks = playlistContents
          .filter((track) => !URI.isLocalTrack(track.uri))
          .map(parsePlaylistAPITrack);
        return parsedTracks;
      } catch (error) {
        console.error(
          `Error fetching playlist tracks (Attempt ${attempt}/${retries}):`,
          error
        );
        if (attempt < retries) {
          console.warn(`Retrying in ${delay / 1000} seconds...`);
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
      const tracks = await getPlaylistTracksSpicetify(playlistId);
      if (tracks.length > 0) {
        return tracks;
      }
    } catch (error) {
        console.error(
          "Failed to fetch tracks using Spicetify's internal API:",
          error
        );
        Spicetify.showNotification(
          "Failed to fetch playlist tracks. Please check your connection and try again.",
          true 
        );
      }

    return [];
  }

  async function getArtistTracks(artistUri) {
    const { Locale, GraphQL } = Spicetify;
  
    const queryArtistDiscographyAll = {
      name: "queryArtistDiscographyAll",
      operation: "query",
      sha256Hash: "9380995a9d4663cbcb5113fef3c6aabf70ae6d407ba61793fd01e2a1dd6929b0",
    };
  
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
  
      const [discography, appearsOn] = await Promise.all([
        GraphQL.Request(queryArtistDiscographyAll, {
          uri: artistUri,
          offset: 0,
          limit: 600,
        }),
        GraphQL.Request(queryArtistAppearsOn, {
          uri: artistUri,
          offset: 0,
          limit: 200,
        }),
      ]);
  
      if (discography.errors) throw new Error(discography.errors[0].message);
      if (appearsOn.errors) throw new Error(appearsOn.errors[0].message);
  
      const allReleases = discography.data.artistUnion.discography.all.items.flatMap(
        ({ releases }) => releases.items
      );
  
      const appearsOnReleases = appearsOn.data.artistUnion.relatedContent.appearsOn.items.flatMap(
        ({ releases }) => releases.items
      );
  
      const combinedReleases = [...allReleases, ...appearsOnReleases];
  
      async function fetchTracksFromRelease(release, retries = 5, delay = 1000) {
        if (!release?.uri) return [];

        for (let attempt = 1; attempt <= retries; attempt++) {
          try {
            const albumRes = await GraphQL.Request(
              GraphQL.Definitions.getAlbum,
              {
                uri: release.uri,
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
                  albumUri: track.albumOfTrack?.uri || release.uri,
                  albumName: track.albumOfTrack?.name || release.name || "Unknown Album",
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
                      id: (track.albumOfTrack?.uri || release.uri || "").split(":")[2] || "unknown",
                    },
                    name: track.name,
                    duration_ms: track.duration?.totalMilliseconds || 0,
                    id: track.uri.split(":")[2],
                  },
                };
              });
          } catch (err) {
            console.error(`Error fetching release ${release.uri} (Attempt ${attempt}):`, err);
            if (attempt < retries) {
              console.warn(`Retrying in ${delay / 1000} seconds...`);
              await new Promise((resolve) => setTimeout(resolve, delay));
              delay *= 2;
            } else {
              console.error(`Failed to fetch release ${release.uri} after ${retries} attempts.`);
              return [];
            }
          }
        }
      }
      
      const allTracks = [];
      const batchSize = 5;
      for (let i = 0; i < combinedReleases.length; i += batchSize) {
        const batch = combinedReleases.slice(i, i + batchSize);
        const batchTracks = await Promise.all(
          batch.map(release => fetchTracksFromRelease(release))
        );
        allTracks.push(...batchTracks.flat());
      }
      const uniqueTracks = allTracks.filter(
        (track, index, self) =>
          index === self.findIndex((t) => t.uri === track.uri)
      );
  
      return uniqueTracks;
    } catch (error) {
      console.error("Error fetching artist tracks:", error);
      throw error;
    } finally {
      mainButton.innerText = "Sort by";
      mainButton.appendChild(svgElement);
    }
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
            console.error(`Error fetching release date for album ID ${albumId} on attempt ${attempt}:`, error);

            if (attempt < retries) {
              console.warn(`Retrying fetch for album ID ${albumId} in ${retryDelay / 1000} seconds...`);
              await new Promise((resolve) => setTimeout(resolve, retryDelay));
              retryDelay *= 2;
            } else {
              console.error(`Failed to fetch release date for album ID ${albumId} after ${retries} attempts.`);
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
        console.warn(
          `Retrying track ${track.name} in ${
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
            console.warn(
              `Could not fetch details for batch: ${batch.join(",")} (Attempt ${
                retries + 1
              })`
            );
          }
        } catch (error) {
          console.error(
            `Error fetching batch ${batch.join(",")} (Attempt ${
              retries + 1
            }):`,
            error
          );
        }

        if (!success) {
          retries++;
          if (retries < maxRetries) {
            console.warn(
              `Retrying batch ${batch.join(",")} in ${delay / 1000} seconds...`
            );
            await new Promise((resolve) => setTimeout(resolve, delay));
            delay *= 2; 
          } else {
            console.error(
              `Failed to fetch popularity for batch ${batch.join(
                ","
              )} after ${maxRetries} attempts.`
            );
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
          console.warn(`Retrying in ${delay / 1000} seconds...`);
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
          console.warn(
            `Last.fm API request failed with status ${response.status} for track: ${track.name} (Attempt ${retries + 1})`
          );
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
            console.warn(
              `Last.fm API error for track ${track.name} (Attempt ${retries + 1}): ${data.message}`
            );
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
          console.warn(`Retrying in ${delay / 1000} seconds...`);
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
        backgroundColor: "#282828",
        color: "white",
        text: "Play Count",
        sortType: "playCount",
      },
      {
        backgroundColor: "#282828",
        color: "white",
        text: "Popularity",
        sortType: "popularity",
      },
      {
        backgroundColor: "#282828",
        color: "white",
        text: "Release date",
        sortType: "releaseDate",
        hasInnerButton: true
      },
      {
        backgroundColor: "#282828",
        color: "white",
        text: "Shuffle",
        sortType: "shuffle",
      },
      {
        backgroundColor: "#282828",
        color: "white",
        text: "Scrobbles",
        sortType: "scrobbles",
      },
      {
        backgroundColor: "#282828",
        color: "white",
        text: "My Scrobbles",
        sortType: "personalScrobbles",
        hasInnerButton: true,
      },
    ],
  };

  const buttonContainer = document.createElement("div");
  buttonContainer.style.position = "relative";
  buttonContainer.style.display = "inline-block";

  const mainButton = document.createElement("button");
  mainButton.title = "sort-play extension";
  mainButton.className = "Button-sc-qlcn5g-0 Button-small-buttonTertiary-useBrowserDefaultFocusStyle";
  mainButton.innerText = "Sort by"; 
  mainButton.style.backgroundColor = buttonStyles.main.backgroundColor;
  mainButton.style.color = buttonStyles.main.color;
  mainButton.style.borderRadius = "16px";
  mainButton.style.border = "none";
  mainButton.style.padding = "4px 10px";
  mainButton.style.fontWeight = "400";
  mainButton.style.fontSize = "14px";
  mainButton.style.height = "32px";  
  mainButton.style.overflow = "hidden";
  mainButton.style.width = "90px";
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

  function getContextMenuBackgroundColor() {
    const tempElement = document.createElement("div");
    tempElement.className = "main-contextMenu-menu";
    document.body.appendChild(tempElement);
  
    const computedStyle = window.getComputedStyle(tempElement);
    const backgroundColor = computedStyle.backgroundColor;
  
    document.body.removeChild(tempElement);
    return backgroundColor;
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


  menuContainer.style.backgroundColor = getContextMenuBackgroundColor();

  const menuBackgroundObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
          if (mutation.attributeName === 'class') {
              menuContainer.style.backgroundColor = getContextMenuBackgroundColor();
          }
      });
  });

  menuBackgroundObserver.observe(document.body, {
    attributes: true,
    attributeFilter: ['class']
  });

  setTimeout(() => {
    menuBackgroundObserver.disconnect();
  }, 15000);

  const themeCheckInterval = setInterval(() => {
    const currentColor = getContextMenuBackgroundColor();
    if (currentColor !== menuContainer.style.backgroundColor) {
        menuContainer.style.backgroundColor = currentColor;
    }
  }, 1000);

  setTimeout(() => {
    clearInterval(themeCheckInterval);
  }, 15000);

  let releaseDateReverse = localStorage.getItem("sort-play-release-date-reverse") === "true";
  
  const menuButtons = buttonStyles.menuItems.map((style) => {
    const button = document.createElement("button");
    button.style.backgroundColor = "transparent";
    button.style.color = "#ffffffe6";
    button.style.border = "none";
    button.style.borderRadius = "2px";
    button.style.margin = "0"; 
    button.style.padding = "4px 10px";
    button.style.fontWeight = "400";
    button.style.fontSize = "14px";
    button.style.height = "40px";
    button.style.width = "140px"; 
    button.style.textAlign = "center";
    button.style.opacity = "0";
    button.style.transform = "translateY(-10px)";
    button.style.cursor = "pointer";
    button.style.position = "relative"; 
    button.style.display = "flex";  
    button.style.alignItems = "center";  
    button.style.justifyContent = "space-between";  

    button.addEventListener("mouseenter", () => {
      if (!button.disabled) {
        button.style.backgroundColor = "#3e3e3e"
      }
    });

    button.addEventListener("mouseleave", () => {
      if (!button.disabled) {
        button.style.backgroundColor = "transparent"
      }
    });

    const buttonTextSpan = document.createElement("span");
    buttonTextSpan.innerText = style.text;
    button.appendChild(buttonTextSpan);
    
    const settingsSvg = `<?xml version="1.0" encoding="utf-8"?>
    <!DOCTYPE svg>
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 256 256" enable-background="new 0 0 256 256" xml:space="preserve">
    <g><g><path d="M244.1,105.9c-0.4-2.9-2.6-5.5-5.6-6.3c-10.7-3.3-19.9-10.7-25.8-20.7c-5.9-10.4-7.8-21.4-5.2-32.9c0.7-2.9-0.4-6.3-2.6-8.1c-11.4-9.9-24-17-37.7-21.8c-2.9-0.7-5.9,0-8.1,1.9c-8.5,7.8-19.5,12.2-31,12.2s-22.5-4.4-31-12.2c-2.2-2.2-5.2-2.6-8.1-1.9C75.3,20.6,62.8,28,51.3,38c-2.2,2.2-3.3,5.2-2.6,8.1c2.6,11.1,0.7,22.5-5.2,32.9c-5.9,10-14.8,17.4-26.2,21c-2.9,0.7-5.2,3.3-5.5,6.3c-1.1,8.1-1.9,15.1-1.9,21.8c0,7,0.4,13.7,1.9,21.8c0.4,3,2.6,5.2,5.5,6.3c11.1,3.7,20.3,11.1,26.2,21.1c5.9,10,7.8,21.8,5.2,32.5c-0.7,2.9,0.4,6.3,2.6,8.1c11.4,10,24,17,37.7,21.8c0.7,0.4,1.9,0.4,2.6,0.4c1.9,0,4-0.7,4.8-1.9c8.5-7.7,19.6-12.2,31-12.2s22.5,4.4,31,12.2c2.2,1.9,5.5,2.6,8.5,1.5c14.4-5.2,26.9-12.6,37.7-21.8c2.2-2.2,3.3-5.2,2.6-8.1c-2.6-11.1-0.7-22.5,5.2-32.9c5.9-10,14.8-17.4,26.2-21c3-0.7,5.2-3.3,5.6-6.3c1.1-8.1,1.9-15.2,1.9-21.8C246,120.7,245.6,114,244.1,105.9z M127.8,174.9c-25.4,0-46-20.6-46-46c0-25.4,20.6-46,46-46s46,20.6,46,46C173.8,154.2,153.2,174.9,127.8,174.9z"/></g></g>
    </svg>`;

    if (style.hasInnerButton) {
      if (style.text === "Release date") {
          const innerButton = document.createElement("button");
          innerButton.title = "Toggle Order (Newest/Oldest First)";
          const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
          svg.setAttribute("viewBox", "0 0 14 14");
          svg.setAttribute("width", "50%");
          svg.setAttribute("height", "50%");
          svg.style.fill = "#ffffffe6";  

          const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
          path.setAttribute("d", releaseDateReverse ? "M14 7L7 0L0 7h14z" : "M14 0L7 7L0 0h14z");

          svg.appendChild(path);
          innerButton.appendChild(svg);
          
          innerButton.style.cssText = `
            background-color: transparent;
            border: none;
            border-radius: 2px;
            padding: 0;
            cursor: pointer;
            position: absolute;
            right: 4px; 
            top: 50%;
            transform: translateY(-32%);
            display: flex;
            align-items: center;
            justify-content: center;
            width: 25px;
            height: 25px;
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

            path.setAttribute("d", releaseDateReverse ? "M14 7L7 0L0 7h14z" : "M14 0L7 7L0 0h14z");
          });
          
          button.appendChild(innerButton);
      }
      if (style.text === "My Scrobbles") {
        const innerButton = document.createElement("button");
        innerButton.title = "Set Last.fm Username";
        innerButton.style.cssText = `
          background-color: transparent;
          border: none;
          border-radius: 2px;
          padding: 0;
          cursor: pointer;
          position: absolute;
          right: 4px; 
          top: 50%;
          transform: translateY(-48%);
          display: flex;
          align-items: center;
          justify-content: center;
          width: 25px;
          height: 25px;
        `; 

        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(settingsSvg, "image/svg+xml");
        const svgElement = svgDoc.documentElement;
        svgElement.setAttribute("width", "55%");
        svgElement.setAttribute("height", "55%");
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
    return button;
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
      const buttonCenter = buttonRect.left + (buttonRect.width / 2);
      menuContainer.style.top = `${topPosition}px`;
      menuContainer.style.left = `${buttonCenter}px`;
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
    }
  }

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
      toggleMenu(event);
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
    if (buttonRect.top <= headerHeight || buttonRect.bottom <= headerBottom) {
      isButtonClicked = false;
      mainButton.style.backgroundColor = buttonStyles.main.backgroundColor;
      mainButton.style.color = buttonStyles.main.color;
      mainButton.style.filter = "brightness(1)";
      toggleMenu();
      return;
    }
    const spaceBelow = window.innerHeight - buttonRect.bottom;
    let topPosition = buttonRect.bottom + scrollTop + 8;
    if (spaceBelow < menuHeight) {
      topPosition = buttonRect.top + scrollTop - menuHeight - 8;
      if (topPosition < scrollTop + headerHeight) {
        isButtonClicked = false;
        mainButton.style.backgroundColor = buttonStyles.main.backgroundColor;
        mainButton.style.color = buttonStyles.main.color;
        mainButton.style.filter = "brightness(1)";
        toggleMenu();
        return;
      }
    }
    if (buttonRect.bottom < headerHeight || buttonRect.top > window.innerHeight || 
        buttonRect.right < 0 || buttonRect.left > window.innerWidth) {
      isButtonClicked = false;
      mainButton.style.backgroundColor = buttonStyles.main.backgroundColor;
      mainButton.style.color = buttonStyles.main.color;
      mainButton.style.filter = "brightness(1)";
      toggleMenu();
      return;
    }
    const buttonCenter = buttonRect.left + (buttonRect.width / 2);
    menuContainer.style.top = `${topPosition}px`;
    menuContainer.style.left = `${buttonCenter}px`;
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
          console.warn(
            `Retrying adding batch ${
              i / BATCH_SIZE + 1
            } in ${currentDelay / 1000} seconds...`
          );
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
            console.warn(`Retrying creating playlist in ${currentDelay / 1000} seconds...`);
            await new Promise((resolve) => setTimeout(resolve, currentDelay));
            currentDelay *= 2;
        }
    }
  }

  async function handleSortAndCreatePlaylist(sortType) {
    mainButton.disabled = true;
    mainButton.style.backgroundColor = buttonStyles.main.disabledBackgroundColor;
    mainButton.style.color = buttonStyles.main.disabledColor;
    mainButton.style.cursor = "default";
    svgElement.style.fill = buttonStyles.main.disabledColor;
    menuButtons.forEach((button) => (button.disabled = true));
    toggleMenu();
  
    try {
      const currentUri = getCurrentUri();
      if (!currentUri) {
        resetButtons();
        Spicetify.showNotification("Please select a playlist or artist first");
        return;
      }
  
      let tracks;
      if (URI.isPlaylistV1OrV2(currentUri)) {
        tracks = await getPlaylistTracks(currentUri.split(":")[2]);
      } else if (URI.isArtist(currentUri)) {
        tracks = await getArtistTracks(currentUri);
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
  
      if (sortType === "playCount" || sortType === "popularity" || sortType === "shuffle" || sortType === "releaseDate") {
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
          uniqueTracks = deduplicateTracks(tracksWithReleaseDates); 
        } else {
          uniqueTracks = deduplicateTracks(tracksWithPopularity);
        }
  
        if (sortType === "playCount") {
          sortedTracks = uniqueTracks
            .filter(track => track.playCount !== "N/A")
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
          sortedTracks = await handleScrobblesSorting(
            tracks,
            sortType,
            (progress) => {
              mainButton.innerText = `${60 + Math.floor(progress * 0.30)}%`;
            }
          );
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
      }

      const sourceUri = currentUri;
      let sourceName = URI.isArtist(sourceUri)
        ? await Spicetify.CosmosAsync.get(
            `https://api.spotify.com/v1/artists/${sourceUri.split(":")[2]}`
          ).then((r) => r.name)
        : await Spicetify.CosmosAsync.get(
            `https://api.spotify.com/v1/playlists/${sourceUri.split(":")[2]}`
          ).then((r) => r.name);
  
      const possibleSuffixes = [
        "(PlayCount)",
        "(Popularity)",
        "(ReleaseDate)",
        "(LFM Scrobbles)",
        "(LFM My Scrobbles)",
        "(Shuffle)"
      ];
  
      const sortSuffixRegex = new RegExp(` (${possibleSuffixes.map(suffix =>
        suffix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      ).join('|')})$`);
  
      if (sortSuffixRegex.test(sourceName)) {
        sourceName = sourceName.replace(sortSuffixRegex, '');
      }
  
      const sortTypeInfo = {
        playCount: { fullName: "play count", shortName: "PlayCount" },
        popularity: { fullName: "popularity", shortName: "Popularity" },
        releaseDate: { fullName: "release date", shortName: "ReleaseDate" },
        scrobbles: { fullName: "Last.fm scrobbles", shortName: "LFM Scrobbles" },
        personalScrobbles: { fullName: "Last.fm personal scrobbles", shortName: "LFM My Scrobbles" },
        shuffle: { fullName: "shuffle", shortName: "Shuffle" }
      }[sortType];

      try {
          const newPlaylist = await createPlaylist(
            `${sourceName} (${sortTypeInfo.shortName})`,
            `Sorted by ${sortTypeInfo.fullName} using sort-play`
          );
          mainButton.innerText = "Saving...";  
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

  function deduplicateTracks(tracks) {
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
  
    return uniqueTracks;
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
      
      const uniqueTracks = [];
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
              }

              if (
                  validPlayCountTracks.length === 0 &&
                  noOrZeroPlayCountTracks.length > 0
              ) {
                  noOrZeroPlayCountTracks.sort(
                      (a, b) => (b.popularity || 0) - (a.popularity || 0)
                  );
                  uniqueTracks.push(noOrZeroPlayCountTracks[0]);
              }
          } else {
              uniqueTracks.push(group[0]);
          }
      });

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
  
    return sortedTracks;
  }

  menuButtons.forEach((button) => {
    const sortType = buttonStyles.menuItems.find(
      (item) => item.text === button.querySelector("span").innerText 
    ).sortType;
    button.addEventListener("click", async (event) => {
      event.stopPropagation();
      menuButtons.forEach((btn) => {
        if (!btn.disabled) {
          btn.style.backgroundColor = "#282828"; 
        }
      });
      await handleSortAndCreatePlaylist(sortType);
    });
  });

  
  function resetButtons() {
    mainButton.disabled = false;
    mainButton.innerText = "Sort by"; 
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
    }
  }

  insertButton();

  const observer = new MutationObserver(() => {
    if (!document.contains(buttonContainer)) {
      insertButton();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  console.log(`sort-play loaded`);
}

if (typeof module !== 'undefined' && module.exports) {

    module.exports = main;
} else {
    await main();
}
})();
