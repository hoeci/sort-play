<div align="center">

<img src="https://github.com/user-attachments/assets/52d8dea1-2fe3-46ba-a201-817cf7a31408" alt="Sort-Play Showcase" width="100%">

# Sort-Play: The Ultimate Spotify Toolkit

*A Spicetify extension that adds powerful sorting, filtering, and more to the Spotify desktop client.*

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

<details>
<summary><b>➕ Comprehensive Sorting</b> - Sort by play count, scrobbles, release date, audio features, and more.</summary>
<br>

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
</details>

<details>
<summary><b>➕ Quick Filters</b> - Instantly filter by liked status, followed artists, release type, and more.</summary>
<br>

Apply instant filters to your current view without opening complex menus.
*   **Remove Duplicates:** Instantly identify and remove duplicate tracks from the current list.
*   **Liked Status:**
    *   **Remove Liked:** Remove tracks you have already saved to your library (uses intelligent ISRC matching).
    *   **Liked Only:** Filter the list to show *only* the tracks you have saved.
*   **Followed Artists:**
    *   **Followed (Main/Any):** Keep tracks where you follow the primary artist or any credited artist.
    *   **Not Followed:** Remove tracks by artists you already follow to find new music.
*   **Release Type:** Isolate specific release formats. Options include **Albums**, **EPs**, **Singles**, **Compilations**, and various combinations (e.g., "Albums & EPs").
*   **Remove Trashed:** Instantly remove songs you've banned using the Trashbin extension.
*   **Exclude via Playlist:** Filter out tracks that already exist in another playlist of your choice.
</details>

<details>
<summary><b>➕ Extra Data Columns</b> - Add play count, BPM, scrobbles, and more as columns in your views.</summary>
<br>

Enhance your music views with more information.
*   **Playlist Columns:** Add up to **two** extra data columns to any playlist view.
*   **Album & Artist Columns:** Add one extra data column to album and artist pages.
*   **Data Types:** Display Play Count, Release Date, Scrobbles, My Scrobbles, Key, BPM, Popularity and DJ Info (Key + BPM).
*   **Custom Formatting:** Configure the format for release dates and how your personal scrobbles are displayed (number vs. checkmark).
*   **Quick Column Switching:** Click the header of any extra column to instantly switch its data type.
</details>

<details>
<summary><b>➕ UI & Enhancements</b> - Genre tags, now playing data, old like button, and other tweaks.</summary>
<br>

*   **Old Like Button:** Brings back the heart (♥) icon for liking songs in track lists, the player bar, and Now Playing.
*   **Interactive Genre Tags:** Displays clickable tags on the Now Playing bar and Artist pages linking to EveryNoise.
*   **Now Playing Data:** Display extra track info like Release Date, Play Count, and BPM directly in the player bar.
*   **Configurable Sorting:** Easily toggle ascending/descending order for all applicable sort types.
</details>

<details>
<summary><b>➕ Full Artist Discography</b> - Automatically load and sort an artist's entire catalog.</summary>
<br>

Apply any sort or filter option while on an Artist page to automatically fetch and process their complete discography.
*   **Complete Collection:** Instantly gathers tracks from all albums, singles, compilations, and "Appears On" releases during the sort process.
*   **Intelligent Deduplication:** Automatically removes duplicate tracks, keeping the most popular version to create a clean, comprehensive discography playlist.
</details>


<details>
<summary><b>➕ Smart Shuffle & Flow</b> - Artist-aware shuffle with optional energy-based flow.</summary>
<br>

Randomize your listening with advanced options.
*   **Intelligent Shuffle:** Prevents multiple songs by the same artist from playing back-to-back for a more varied listening session.
*   **Vibe & Flow Shuffle:** An optional mode that creates a dynamic listening journey by arranging shuffled tracks harmonically based on their Tempo and Key.
</details>

<details>
<summary><b>➕ Dedicated Playlist Creation</b> - Generate top tracks, new releases, discovery mixes, and more.</summary>
<br>

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
    *   **Last.fm Generators:**
        *   **Infinite Vibe:** A continuous mood generated from your current track, recent obsessions, and library deep cuts.
        *   **Neighbors Mix:** A balanced mix of obsessions, trends, and favorites from your Last.fm neighbors, filtered for discovery.
*   **Automated Updates:** Schedule your dedicated playlists to update automatically (e.g., daily, weekly on Fridays) to always keep them fresh.
*   **Customizable Limits:** Configure the size of your Top Tracks and Discovery playlists, the time window for New Releases, and the number of tracks to pull from each new album.
</details>

<details>
<summary><b>➕ Dynamic Playlists</b> - Build self-updating playlists with custom sources, filters, and schedules.</summary>
<br>

Build powerful, self-updating playlists that manage themselves.
*   **Multi-Source:** Combine tracks from any number of playlists, artists, albums, or your Liked Songs.
*   **Automated Scheduling:** Set a custom schedule (e.g., every 3 hours, daily, weekly on Fridays) for automatic updates.
*   **Advanced Filtering:** Automatically filter tracks based on rules:
    *   Exclude songs you have already liked.
    *   Exclude songs you have already listened to (via Last.fm scrobbles).
    *   Filter by Genre: Include or exclude specific genres.
    *   Exclude songs based on keywords or a maximum play count.
*   **Flexible Update Modes:**
    *   **Replace:** Overwrites all tracks in the playlist with fresh ones on each update.
    *   **Merge:** Adds new tracks to the existing ones and re-sorts the entire playlist.
    *   **Append:** Adds new tracks to the top of the playlist without removing old ones.
*   **Track Sampling (optional):** Limit the number of random tracks pulled from each source on every update to keep the playlist fresh and varied.
</details>

<details>
<summary><b>➕ Advanced Custom Filter</b> - Filter by keywords, range sliders, and preview results in an interactive table.</summary>
<br>

A powerful modal to meticulously filter any playlist or discography.
*   **Keyword Filtering:** Use keywords to filter by track title, album, and artist, with options to keep or exclude matches and match whole words.
*   **Range Sliders:** Apply precise range sliders for attributes like Release Date, Duration, Play Count, Popularity, and Tempo.
*   **Interactive Table:** View, sort, and manually remove tracks from your filtered selection in a detailed table before creating the playlist.
*   **Save & Load Keywords:** Save your favorite keyword sets into named groups and load them instantly for future use.
*   **Integrated Mini-Player:** Preview and listen to tracks directly within the filter modal to help make your selections.
</details>

<details>
<summary><b>➕ Genre Filtering</b> - Filter by genre using multi-source data from Spotify, Last.fm, and Deezer.</summary>
<br>

Filter any playlist or discography by genre with a powerful, interactive modal.
*   **Multi-Source Data:** Combines genre information from Spotify, Last.fm, and Deezer for the most detailed and accurate profile possible for each track.
*   **Cloud Caching:** Uses a smart, community-driven database. Once a track is processed by any user, its genres load instantly for everyone else.
*   **Intelligent Mapping:** Automatically groups hundreds of specific sub-genres into broader, easy-to-understand main genres.
*   **Include & Exclude Modes:** Offers dual-action filtering to include genres (left-click) or exclude them (right-click).
*   **Intuitive Interface:** Easily browse, search, and select genres, complete with track counts for each genre and a "select all" option.
*   **Match All Option:** An advanced setting to only include tracks that match *all* of your selected genres instead of just any.
*   **Sort Your Selection:** Choose how to sort the final filtered playlist, whether by play count, release date, or shuffle.
</details>

<details>
<summary><b>➕ AI Pick</b> - Filter tracks using natural language prompts with Google Gemini.</summary>
<br>

Use AI to select specific songs from your current list based on your prompt.
*   **Context-Aware:** Picks tracks directly from the current playlist, album, or artist page.
*   **Powered by Gemini:** Utilizes Google's Gemini models for intelligent track selection.
*   **Customizable Instructions:** Edit the AI's system instructions to fine-tune its behavior.
*   **Advanced Controls:** Choose models and toggle data sources like song statistics and lyrics.
*   **Use Your Own Key:** Provide your own free Google Gemini API key for extended usage.
</details>

<details>
<summary><b>➕ Local File Integration</b> - Convert local files to Spotify tracks for sorting and streaming.</summary>
<br>

*   **Automatic Sorting Integration:** Converts local tracks in playlists to their Spotify versions on-the-fly when sorting or filtering.
*   **Dedicated Conversion Tool:** Convert your entire 'Local Files' library into a new, streamable Spotify playlist.
*   **Detailed Report:** After converting your Local Files, view a report of which tracks were found and which couldn't be matched.
*   **Export Report:** Download the detailed conversion report as a JSON file for your records.
</details>

<details>
<summary><b>➕ Flexible Output Options</b> - Save, overwrite, queue, or customize how results are handled.</summary>
<br>

Choose what happens after sorting and how your library is managed.
*   **Save as New Playlist:** Create a brand new playlist with the sorted tracks.
*   **Modify Current Playlist:** Directly overwrite your own playlist with the sorted version.
*   **Add to Queue:** Send the sorted tracks directly to your playback queue.
*   **Playlist Organization:** Automatically organizes all created playlists into a dedicated "Sort-Play Library" folder.
*   **Open After Sorting:** Automatically navigate to the new or modified playlist once the process is complete.
*   **Deduplication Report:** View a detailed list of all tracks removed during the deduplication process.
*   **Playlist Privacy:** Configure all newly created playlists to be private by default.
*   **Automatic Titling:** Choose whether to automatically append the sort type (e.g., `(PlayCount)`) to the playlist title.
</details>

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
2.  Open the [Spicetify Marketplace](https://github.com/hoeci/sort-play/blob/main/assets/marketplace.jpg?raw=true).  
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
