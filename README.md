<div align="center">

<img src="https://github.com/user-attachments/assets/52d8dea1-2fe3-46ba-a201-817cf7a31408" alt="Sort-Play Showcase" width="100%">

# [Sort-Play: The Ultimate Spotify Toolkit](https://github.com/hoeci/sort-play)

*A Spicetify extension that adds powerful sorting, filtering, UI features, and more to the Spotify desktop client.*

<p>
  <a href="https://spicetify.app/docs/getting-started"><img src="https://badges.niko2nio2.workers.dev/badge/Spicetify/Extension/1DB954?logo=spotify&v=1" alt="Spicetify Extension"></a>
  <a href="https://github.com/hoeci/sort-play"><img src="https://badges.niko2nio2.workers.dev/github/stars/hoeci/sort-play?logo=github&color=eac54f&v=1" alt="GitHub Stars"></a>
  <img src="https://badges.niko2nio2.workers.dev/badge/Made with/❤/F472B6?v=1" alt="Made with Love">
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
*   **True Release Date:** The track's actual historical debut. Automatically bypasses later re-issues, compilations, and remasters to find the original release date, while preserving accurate dates for live tracks and remixes (Note: accuracy is limited to the oldest available track on Spotify and may not be 100% accurate).
*   **Artist & Release Date:** Sorts tracks alphabetically by artist, then chronologically by release date.
*   **Last.fm Scrobbles:** The track's total global scrobbles on Last.fm.
*   **My Scrobbles:** Your personal scrobble count for each track (requires Last.fm username).
*   **Scrobble Range:** Your personal scrobbles within a specific custom date range (requires Last.fm username).
*   **Last Scrobbled:** The date you personally last scrobbled a track (requires Last.fm username).
*   **Taste Match:** Sorts tracks by how well they align with your unique listening history and personal taste profile.
*   **Energy Wave:** Creates a dynamic listening journey by arranging tracks to smoothly transition through different energy levels and moods.
*   **Liked Status:** Sorts tracks based on whether they are liked in your library.
*   **Album Color:** The dominant color of the album artwork, with modes for perceptual grouping or a pure hue gradient.
*   **Audio Features:**
    *   **Tempo (BPM):** The speed of the track measured in beats per minute.
    *   **Energy:** The intensity and activity level of the track.
    *   **Danceability:** How suitable a track is for dancing based on rhythm and beat strength.
    *   **Valence:** The musical positivity conveyed by a track (happy vs. sad).
    *   **Acousticness:** The likelihood that a track was recorded with acoustic instruments.
    *   **Instrumentalness:** The amount of vocals present (higher values indicate more instrumental tracks).
    *   **Key (Camelot):** The musical key of the track arranged harmonically using the Camelot wheel.
</details>

<details>
<summary><b>➕ Quick Filters</b> - Instantly filter by liked status, followed artists, release type, and more.</summary>
<br>

Apply instant filters to your current view without opening complex menus.
*   **Remove Duplicates:** Instantly identify and remove duplicate tracks from the current list.
*   **One Track per Artist:** Keep only a single track for each unique artist, automatically prioritizing the most played or most popular track.
*   **Liked Status:**
    *   **Remove Liked:** Remove tracks you have already saved to your library (uses intelligent ISRC matching).
    *   **Liked Only:** Filter the list to show *only* the tracks you have saved.
*   **Followed Artists:**
    *   **Followed (Main/Any):** Keep tracks where you follow the primary artist or any credited artist.
    *   **Not Followed:** Remove tracks by artists you already follow to find new music.
*   **Release Type:** Isolate specific release formats. Options include Albums, EPs, Singles, Compilations, and various combinations (e.g., "Albums & EPs"), with an optional toggle to group tracks by album.
*   **Remove Trashed:** Instantly remove songs you've banned using the Trashbin extension.
*   **Exclude via Playlist:** Filter out tracks that already exist in another playlist or folder of your choice.
</details>

<details>
<summary><b>➕ Extra Data Columns</b> - Add play count, BPM, scrobbles, and more as columns in your views.</summary>
<br>

Enhance your music views with more information.
*   **Playlist Columns:** Add up to **two** extra data columns to any playlist or search view.
*   **Album & Artist Columns:** Add one extra data column to album and artist pages.
*   **Data Types:** Display Play Count, Release Date, True Release Date, Scrobbles, My Scrobbles, Last Scrobbled, Key, BPM, Popularity, Energy, Danceability, Valence, and DJ Info (Key + BPM + Energy).
*   **Custom Formatting:** Configure formats for release dates, personal scrobbles (number vs. checkmark), keys (Camelot, Standard, Open Key), and Last Scrobbled (relative vs. date).
*   **Quick Column Switching:** Click the header of any extra column to instantly switch its data type.
*   **Interactive Cells:** Click on a True Release Date cell to instantly navigate to that exact album. Click on Scrobble data cells to instantly view detailed Last.fm stats.
</details>

<details>
<summary><b>➕ UI & Enhancements</b> - Genre tags, now playing data, old like button, and other tweaks.</summary>
<br>

*   **Old Like Button:** Brings back the heart (♥) icon for liking songs in track lists, the player bar, Now Playing sidebar, and  track previews feed, with intelligent ISRC matching.
*   **Interactive Genre Tags:** Displays clickable tags on the Now Playing bar and Artist pages linking to EveryNoise playlists or Spotify search.
*   **Now Playing Data:** Display extra track info (Release Date, Play Count, BPM, Key, Energy, Scrobbles, etc.) directly in the player bar next to the title or artist, with customizable formatting and separators.
*   **Configurable Sorting:** Easily toggle ascending/descending order for all applicable sort types.
*   **Last.fm Overrides Manager:** Manually fix mismatched Last.fm track links, edit overrides, and import/export override backups as JSON.
*   **Update History:** View changelogs and release commits directly inside the extension settings.
*   **Live Chat:** Access a live chat panel directly within the settings to talk with other Sort-Play users.
</details>

<details>
<summary><b>➕ Context Menus</b> - Powerful right-click actions for tracks, artists, and playlists.</summary>
<br>

Access tools directly from Spotify's native right-click menus.
*   **Create Discography (Artist Menu):** Generate a fully sorted and deduplicated discography playlist right from an artist's context menu.
*   **Show Genres (Track/Playlist/Album Menus):** View detailed, multi-source genre tags for individual tracks, or open an aggregated breakdown of ranked genres across entire playlists and albums with search filtering, source indicators, and percentage bars.
*   **Last.fm Details (Track Menu):** View Last.fm listeners, scrobbles, track tags, listening trends, and Shoutbox comments directly inside Spotify, with manual link override support.
*   **Last.fm Details (Artist Menu):** View global listeners, total scrobbles, and top community tags for any artist.
*   **Shuffle & Play (All Menus):** Instantly shuffle and play any playlist, album, or artist (with optional Vibe & Flow) directly from the right-click menu.
</details>

<details>
<summary><b>➕ Full Artist Discography</b> - Automatically load and sort an artist's entire catalog.</summary>
<br>

Apply any sort or filter option while on an Artist page to automatically fetch and process their complete discography.
*   **Complete Collection:** Instantly gathers tracks from all albums, singles, compilations, and "Appears On" releases during the sort process.
*   **Intelligent Deduplication:** Automatically cleans up duplicate tracks with customizable modes in Settings:
    *   **Default:** Smartly balances track popularity with album context to keep the best version (favoring studio albums over singles, unless the single is a viral hit). When sorting by Release Date, it strictly prioritizes the original Album version.
    *   **Keep Single & Album:** Retains both the single/EP version and the album version of a song.
    *   **One Per Release:** Retains one track per uniquely named release.
    *   **Don't Remove:** Keeps all duplicates for a 100% complete collection.

*(Note: Compilation versions are always removed if an original version exists, keeping your list clean).*
</details>

<details>
<summary><b>➕ Smart Shuffle & Flow</b> - Artist-aware shuffle with optional energy-based flow.</summary>
<br>

Randomize your listening with advanced options.
*   **Intelligent Shuffle:** Prevents multiple songs by the same artist from playing back-to-back for a more varied listening session.
*   **Vibe & Flow Shuffle:** An optional mode that creates a dynamic listening journey by arranging shuffled tracks based on energy wave patterns, tempo transitions, and harmonic key matching.
</details>

<details>
<summary><b>➕ Dedicated Playlist Creation</b> - Generate top tracks, new releases, discovery mixes, and more.</summary>
<br>

Generate a variety of curated playlists with a single click.
*   **Available Playlist Types:**
    *   **My Top Tracks:** Create playlists of your most-played tracks from the "Last Month," "Last 6 Months," or "All Time."
    *   **New Releases from Followed Artists:** A full playlist in order of release of all new singles and album tracks from every artist you follow.
    *   **Discovery Mixes:**
        *   **Recent Taste:** Recommendations based on your recent listening habits.
        *   **All-Time Taste:** Recommendations based on your long-term listening history.
        *   **Pure Discovery:** Recommendations exclusively from artists completely new to your listening history.
    *   **Genre Exploration:**
        *   **Random Genre Explorer:** Get a mix from a random selection of 20 genres from across Spotify.
    *   **Last.fm Generators:**
        *   **Infinite Vibe:** A continuous mood generated from your current track, recent obsessions, and library deep cuts.
        *   **Tastemaker Profile:** Enter a Last.fm username to clone their top tracks, loved tracks, and obsessions into a fresh discovery playlist.
        *   **Neighbors Mix:** A balanced mix of obsessions, trends, and favorites from your Last.fm neighbors, filtered for discovery.
*   **Automated Updates:** Schedule your dedicated playlists to update automatically (e.g., daily, weekly on Fridays) to always keep them fresh.
*   **Advanced Filtering for New Releases:** Filter new releases by keywords, track versions (Live, Remix, Acoustic, Instrumental), specific followed artists, and album limits.
*   **Customizable Limits:** Configure the size of your Top Tracks and Discovery playlists, the time window for New Releases, and the number of tracks to pull from each new album.
*   **Appearance Customization:** Set custom names and upload custom cover images for any dedicated playlist card.
</details>

<details>
<summary><b>➕ Dynamic Playlists</b> - Build self-updating playlists with custom sources, filters, and schedules.</summary>
<br>

Build powerful, self-updating playlists that manage themselves.
*   **Multi-Source:** Combine tracks from any number of playlists, artists, albums, folders, Liked Songs, or Local Files.
*   **Automated Scheduling:** Set an update schedule (e.g., every 3 hours, daily, weekly on Fridays) or custom intervals, with on-demand manual runs.
*   **Customizable Sorting:** Apply any sort method (Play Count, Release Date, Scrobbles, Taste Match, Audio Features, Shuffle, etc.) with standard or reversed direction, plus track deduplication.
*   **Advanced Filtering:** Automatically filter source tracks based on rules:
    *   **Track Status:** Filter by Liked Status, Followed Artists, and Scrobble History (Last.fm).
    *   **Range Rules:** Filter by Play Count, Scrobbles, Release Date, Date Added, Duration, Popularity, and Audio Features (Tempo, Energy, Danceability, Valence).
    *   **Keywords:** Keep or exclude matches across track title, album, and artist, with whole-word matching.
    *   **Genre Filtering:** Include or exclude genres with automatic source scanning, genre grouping, and "match all" mode.
    *   **Filter Presets:** Save and load filter configurations.
*   **Flexible Update Modes:**
    *   **Replace:** Overwrites all tracks in the playlist with fresh ones on each update.
    *   **Merge:** Adds new tracks to the existing ones and re-sorts the entire playlist.
    *   **Append:** Adds new tracks to the top of the playlist without removing old ones.
*   **Track Sampling:** Limit the number or percentage of random tracks pulled from each source on every update, with automatic rotation to prevent repeats.
</details>

<details>
<summary><b>➕ Playlist Analyzer</b> - Get visual insights and charts for your current view.</summary>
<br>

Generate a dashboard of the current tracklist (Playlist/Artist/Album) with visual insights and charts.
*   **Top Artists, Albums & Genres:** Explore interactive Treemaps showcasing the most prominent artists and albums, alongside genre distributions.
*   **Quick Stats:** View metrics like total duration, and total/median streams.
*   **Timeline & Eras:** See when the tracks were released using a Release Year Bar Chart, or use the Decades Analysis to see the defining eras (e.g., 80s, 90s, 00s) of the list.
*   **Vibe Map (Mood Analysis):** View the emotional tone of the tracks via a categorized Mood Ring, or explore the interactive Heatmap that maps track density based on Positivity (Valence) vs. Intensity (Energy).
*   **Audio Profile & Musicality:** View the Tempo (BPM) distribution, Top Musical Keys displayed on an interactive Camelot Wheel, and a Radar Chart breaking down acousticness, danceability, energy, and more.
*   **Setting Predictor:** Predicts the ideal time of day and weather (e.g., "Late Night", "Sunny & Clear") for the current tracklist based on its audio features.
</details>

<details>
<summary><b>➕ Vibe Filter</b> - Filter tracks by mood using an interactive grid or mixer.</summary>
<br>

Analyze and filter tracks based on their raw emotional tone and audio features.
*   **9 Distinct Vibes:** Filter across Workout (Hype), Party, Focus, Chill, Late Night Drive, Morning Coffee, Gaming, Rainy, and Festival (Pregame).
*   **Grid Mode:** Select multiple vibes to easily filter and include tracks that match any of the selected moods.
*   **Mixer Mode:** Act like a DJ by dialing in exact percentages for each vibe to craft the perfect blended playlist.
*   **Match Strictness:** Choose between Broad, Balanced, or Strict match levels to control how closely tracks must fit your chosen vibes.
</details>

<details>
<summary><b>➕ Advanced Custom Filter</b> - Filter by keywords, range sliders, and preview results in an interactive table.</summary>
<br>

A completely redesigned, powerful modal to meticulously filter any playlist or discography.
*   **Range Sliders:** Apply precise dual range sliders with empty-range indicators for attributes like Release Date, Date Added, Duration, Play Count, Popularity, Scrobbles, and Audio Features.
*   **Track Versions & Status:** Filter precisely by Live, Remix, Acoustic, and Instrumental versions, as well as Explicit, Liked, Followed, and Scrobble History status.
*   **Release Types & Quick Actions:** Instantly isolate Albums, EPs, Singles, or Compilations, apply quick deduplication, one track per artist, and remove trashed songs.
*   **Harmonic Key Filtering:** Filter tracks by musical key using an interactive Camelot wheel with optional harmonic mixing.
*   **Keyword Filtering:** Use keywords to filter by track title, album, and artist, with options to keep or exclude matches and match whole words.
*   **Interactive Tracklist:** View, sort, and manually remove tracks from your filtered selection in a detailed Tracklist before creating the playlist.
*   **Save & Load Keywords:** Save your favorite keyword sets into named groups and load them instantly for future use.
*   **Integrated Mini-Player:** Preview and listen to tracks directly within the Tracklist to help make your selections.
*   **Flexible Output:** Save as a new playlist, modify the current playlist, or send directly to the playback queue.
</details>

<details>
<summary><b>➕ Genre Filtering</b> - Filter by genre using multi-source data from Spotify, Last.fm, and Deezer.</summary>
<br>

Filter any playlist or discography by genre with a powerful, interactive modal.
*   **Multi-Source Data:** Uses lightning-fast Spotify Track genres by default, with optional toggles to use genre data from Last.fm, Deezer, and EveryNoise.
*   **Cloud Caching:** Uses a smart, community-driven database. Once a track is processed by any user, its genres load instantly for everyone else.
*   **Intelligent Mapping:** Automatically groups hundreds of specific sub-genres into broader, easy-to-understand main genres.
*   **Include & Exclude Modes:** Offers dual-action filtering to include genres (left-click) or exclude them (right-click).
*   **Intuitive Interface:** Easily browse, search, and select genres, complete with track counts for each genre and a "select all" option.
*   **Match All Option:** An advanced setting to only include tracks that match *all* of your selected genres instead of just any.
*   **Sort & Output Selection:** Choose how to sort and output the filtered tracks, with options to create a new playlist, modify the current playlist, or add to queue.
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
*   **Prompt Library & History:** Save your favorite AI prompts as presets and easily access your recent prompt history.
</details>

<details>
<summary><b>➕ Local File Integration</b> - Convert local files to Spotify tracks for sorting and streaming.</summary>
<br>

*   **Universal Support:** Fully supported across sorting, custom/genre filtering, dynamic playlists, and analysis tools. Automatically converts local tracks in playlists to their Spotify versions on-the-fly.
*   **Dedicated Conversion Tool:** Convert your entire 'Local Files' library into a new, streamable Spotify playlist directly from the menu.
*   **Detailed Report:** After converting your Local Files, view a report of which tracks were found and which couldn't be matched.
*   **Export Report:** Download the detailed conversion report as a JSON file for your records.
*   **Configurable Handling:** Choose how to handle local tracks during sorting (convert and keep, convert and remove, or preserve original local files).
</details>

<details>
<summary><b>➕ Flexible Output Options</b> - Save, overwrite, queue, or customize how results are handled.</summary>
<br>

Choose what happens after sorting and how your library is managed.
*   **Save as New Playlist:** Create a brand new playlist with the sorted tracks.
*   **Modify Current Playlist:** Directly update your own playlist with the sorted order while preserving original "Date Added" dates.
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
      <img src="https://github.com/user-attachments/assets/e269a370-8d54-436a-b459-3d652186626b" width="500px">
      <br><b>Playlist Analyzer</b>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/8eeab9e9-4eb3-4e2d-a545-60953d72be26" width="500px">
      <br><b>Vibe Filter</b>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/80065c83-13a6-4460-8050-93fd92232aaf" width="500px">
      <br><b>Dynamic Playlists</b>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/e732e945-0cd1-4fb2-b8a6-cc172b0ba48a" width="500px">
      <br><b>Dedicated Playlists</b>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/464630a5-d2f5-4fb1-aa1c-63c06b5b8f1e" width="500px">
      <br><b>Genre Filtering</b>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/f688d571-c3c1-402e-9f40-dfdbcdee5c72" width="500px">
      <br><b>Custom Filters</b>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/d656ecb3-4bbd-4d93-af19-985ae0c76116" width="500px">
      <br><b>Now Playing Genre & Data</b>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/fd39bb6c-aab0-480a-8225-64c3ea8ba0ed" width="500px">
      <br><b>AI Pick</b>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/54959812-3b7c-43c8-8be7-9d1ad88bd411" width="500px">
      <br><b>Last.fm Details</b>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/fd59711a-86dd-4baa-9df7-fecaf91a882f" width="500px">
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
