<div align="center">

<img src="https://github.com/user-attachments/assets/52d8dea1-2fe3-46ba-a201-817cf7a31408" alt="Sort-Play Showcase" width="100%">

# Sort-Play: The Ultimate Spotify Toolkit

<p>
  <a href="https://spicetify.app/docs/getting-started"><img src="https://img.shields.io/badge/Spicetify-Marketplace-1DB954?style=for-the-badge&logo=spotify" alt="Spicetify Marketplace"></a>
  <a href="https://github.com/hoeci/sort-play"><img src="https://img.shields.io/github/stars/hoeci/sort-play?style=for-the-badge&logo=github&color=eac54f" alt="GitHub Stars"></a>
  <img src="https://img.shields.io/badge/Made%20with-%E2%9D%A4-F472B6?style=for-the-badge" alt="Made with Love">
</p>

<p>
  <a href="#%EF%B8%8F-features"><b>⚡️ Features</b></a> •
  <a href="#-screenshots"><b>📷 Screenshots</b></a> •
  <a href="#%EF%B8%8F-installation"><b>🛠️ Installation</b></a>
</p>

</div>

## ⚡️ Features

### ➕ Comprehensive Sorting
Sort playlists, albums, and artist pages by a wide range of metrics.
*   **Global Play Count:** The track's total play count on Spotify.
*   **Popularity:** Spotify's internal 0-100 popularity index.
*   **Release Date:** The track's official album release date.
*   **Last.fm Scrobbles:** The track's total global scrobbles on Last.fm.
*   **My Scrobbles:** Your personal scrobble count for each track (requires Last.fm username).
*   **Last Scrobbled:** The date you personally last scrobbled a track (requires Last.fm username).
*   **Energy Wave:** Creates a dynamic listening journey by arranging tracks to smoothly transition through different energy levels and moods.
*   **Album Color:** The dominant color of the album artwork, with modes for perceptual grouping or a pure hue gradient.
*   **Audio Features:**
    *   **Tempo (BPM):** The speed of the track measured in beats per minute.
    *   **Energy:** The intensity and activity level of the track.
    *   **Danceability:** How suitable a track is for dancing based on rhythm and beat strength.
    *   **Valence:** The musical positivity conveyed by a track (happy vs. sad).
    *   **Acousticness:** The likelihood that a track was recorded with acoustic instruments.
    *   **Instrumentalness:** The amount of vocals present (higher values indicate more instrumental tracks).

### ➕ Flexible Output Options
Choose what happens after sorting.
*   **Save as New Playlist:** Create a brand new playlist with the sorted tracks.
*   **Modify Current Playlist:** Directly overwrite your own playlist with the sorted version (if you are the owner).
*   **Add to Queue:** Send the sorted tracks directly to your playback queue.
*   **Playlist Privacy:** Configure all newly created playlists to be private by default.
*   **Automatic Titling:** Choose whether to automatically append the sort type (e.g., `(PlayCount)`) to the playlist title when creating or modifying playlists.

### ➕ Extra Data Columns
Enhance your music views with more information.
*   **Playlist Columns:** Add up to **two** extra data columns to any playlist view.
*   **Album & Artist Columns:** Add one extra data column to album and artist pages.
*   **Data Types:** Display Play Count, Release Date, Scrobbles, My Scrobbles, Key, BPM, Popularity, Energy, Danceability, Valence and  DJ Info (Key + BPM + Energy).
*   **Custom Formatting:** Configure the format for release dates and how your personal scrobbles are displayed (number vs. checkmark).

### ➕ Smart Shuffle & Flow
Randomize your listening with advanced options.
*   **Intelligent Shuffle:** Prevents multiple songs by the same artist from playing back-to-back for a more varied listening session.
*   **Vibe & Flow Shuffle:** An optional mode that creates a dynamic listening journey by arranging shuffled tracks based on their energy and mood.

### ➕ Full Artist Discography
Load an artist's complete collection for sorting.
*   **Complete Collection:** Gathers tracks from all albums, singles, compilations, and "Appears On" releases.
*   **Intelligent Deduplication:** Automatically removes duplicate tracks, keeping the most popular version to create a clean, comprehensive discography.

### ➕ Advanced Custom Filter
A powerful modal to meticulously filter any playlist or discography.
*   **Keyword Filtering:** Use keywords to filter by track title, album, and artist, with options to keep or exclude matches and match whole words.
*   **Range Sliders:** Apply precise range sliders for attributes like Release Date, Duration, Play Count, Popularity, Tempo, Energy, Danceability, and Valence.
*   **Interactive Table:** View, sort, and manually remove tracks from your filtered selection in a detailed table before creating the playlist.
*   **Save & Load Keywords:** Save your favorite keyword sets into named groups and load them instantly for future use.
*   **Integrated Mini-Player:** Preview and listen to tracks directly within the filter modal to help make your selections.

### ➕ Genre Filtering
Filter any playlist or discography by genre with a powerful, interactive modal.
*   **Combined Genre Data:** Combines genre information from both Spotify and Last.fm for a more detailed and accurate profile for each track.
*   **Intelligent Mapping:** Automatically groups hundreds of specific sub-genres into broader, easy-to-understand main genres.
*   **Intuitive Interface:** Easily browse, search, and select genres, complete with track counts for each genre and a "select all" option.
*   **Match All Option:** An advanced setting to only include tracks that match *all* of your selected genres instead of just any.
*   **Sort Your Selection:** Choose how to sort the final filtered playlist, whether by play count, release date, or shuffle.

### ➕ Dynamic Playlists
Build powerful, self-updating playlists that manage themselves.
*   **Multi-Source:** Combine tracks from any number of playlists, artists, albums, or your Liked Songs.
*   **Automated Scheduling:** Set a custom schedule (e.g., every 3 hours, daily, weekly on Fridays) for automatic updates.
*   **Advanced Filtering:** Automatically exclude tracks based on rules:
    *   Exclude songs you have already liked.
    *   Exclude songs you have already listened to (via Last.fm scrobbles).
    *   Exclude songs based on keywords or a maximum play count.
*   **Flexible Update Modes:**
    *   **Replace:** Overwrites all tracks in the playlist with fresh ones on each update.
    *   **Merge:** Adds new tracks to the existing ones and re-sorts the entire playlist.
    *   **Append:** Adds new tracks to the top of the playlist without removing old ones.
*   **Track Sampling (optional):** Limit the number of random tracks pulled from each source on every update to keep the playlist fresh and varied.

### ➕ Dedicated Playlist Creation
Generate a variety of curated playlists with a single click.
*   **Available Playlist Types:**
    *   **My Top Tracks:** Create playlists of your most-played tracks from the "Last Month," "Last 6 Months," or "All Time."
    *   **New Releases from Followed Artists:** A full playlist in order of release of all new singles and album tracks from every artist you follow.
    *   **Genre Exploration:**
        *   **Genre Tree Explorer:** Generate a tailored playlist by selecting from a comprehensive list of main genres.
        *   **Random Genre Explorer:** Get a mix from a random selection of 20 genres from across Spotify.
    *   **Discovery Mixes:**
        *   **Recent Taste:** Recommendations based on your recent listening habits.
        *   **All-Time Taste:** Recommendations based on your long-term listening history.
        *   **Pure Discovery:** Recommendations exclusively from artists completely new to your listening history.
*   **Automated Updates:** Schedule your dedicated playlists to update automatically (e.g., daily, weekly on Fridays) to always keep them fresh.
*   **Customizable Limits:** Configure the size of your Top Tracks and Discovery playlists, the time window for New Releases, and the number of tracks to pull from each new album.

### ➕ AI-Powered Playlists
Generate playlists from natural language prompts.
*   **Context-Aware:** Uses the current playlist, album, or artist page as the music source for its selections.
*   **Powered by Gemini:** Utilizes Google's Gemini models for intelligent track selection based on your prompt.
*   **Customizable Instructions:** Edit the AI's system instructions to fine-tune its behavior and personality.
*   **Advanced AI Controls:**
    *   **Model Selection:** Choose between different Google Gemini models to balance speed and intelligence.
    *   **Data Toggles:** Decide whether to include song statistics and lyrics in the AI's analysis for more nuanced results.
*   **Use Your Own Key:** Provide your own free Google Gemini API key for extended, personal usage.
  
### ➕ Local File Integration
*   **Automatic Sorting Integration:** Converts local tracks in playlists to their Spotify versions on-the-fly when sorting or filtering.
*   **Dedicated Conversion Tool:** Convert your entire 'Local Files' library into a new, streamable Spotify playlist.
*   **Detailed Report:** After converting your Local Files, view a report of which tracks were found and which couldn't be matched.
*   **Export Report:** Download the detailed conversion report as a JSON file for your records.

### ➕ UI & Enhancements
*   **Old Like Button:** Brings back the heart (♥) icon for liking songs in track lists, the player bar, and the Now Playing View.
*   **Now Playing Data:** Display extra track info like Release Year, Play Count, BPM, and more directly in the player bar, with customizable position, data format, and separator character.
*   **Playlist Organization:** Automatically organizes all created playlists into a dedicated "Sort-Play Library" folder.
*   **Configurable Sorting:** Easily toggle ascending/descending order for all applicable sort types.
*   **Open After Sorting:** An option to automatically navigate to the newly created or modified playlist once the sorting is complete.
*   **Deduplication Report:** A choice to view a list of all tracks that were removed during a deduplication process.

## 📷 Screenshots 
<table>
  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/9b8bded3-8d2f-4949-ac23-59c2aa3f5467" width="500px">
      <br><b>Sorting Interface</b>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/97e63dc1-0b47-47e9-821a-8da5515ab508" width="500px">
      <br><b>Extra Columns</b>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/464630a5-d2f5-4fb1-aa1c-63c06b5b8f1e" width="500px">
      <br><b>Genre Filtering</b>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/fd39bb6c-aab0-480a-8225-64c3ea8ba0ed" width="500px">
      <br><b>AI Pick</b>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/fb0fc640-4b4d-411f-aab0-d07e7949b158" width="500px">
      <br><b>Dynamic Playlists</b>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/6ceabead-4def-4e97-b31d-322b0374f3da" width="500px">
      <br><b>Custom Filters</b>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/67ebab88-8a98-4a15-9533-a27e7449a479" width="500px">
      <br><b>Dedicated Playlists</b>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/868a2bd6-252e-41f3-a3ee-854c26a20c10" width="500px">
      <br><b>Settings</b>
    </td>
  </tr>
</table>

## 🛠️ Installation  

#### Using Marketplace 
1.  Ensure you have [Spicetify and Spicetify Marketplace](https://spicetify.app/docs/getting-started) installed.
2.  Open the [Spicetify Marketplace](https://github.com/hoeci/sort-play/blob/main/assets/SM.jpg?raw=true).  
3.  Search for `Sort-Play`.
4.  Click Install.


#### Manual Installation  
1. Ensure that [Spicetify](https://spicetify.app/) is installed on your system.  
2. Copy the `sort-play-loader.mjs` file to the Spicetify Extensions folder:

   - **Windows**: `%appdata%\spicetify\Extensions`  
   - **Linux & macOS**: `~/.config/spicetify/Extensions`

3.  Open a terminal and run the following commands:
    ```bash
    spicetify config extensions sort-play-loader.mjs
    spicetify apply
    ```
