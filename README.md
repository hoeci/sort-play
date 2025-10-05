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
+ **Comprehensive Sorting:** Sort playlists, albums and artist pages by play count, popularity, release date, album color, Last.fm scrobbles, Last Scrobbled, tempo, energy, danceability, valence, acousticness, and instrumentalness.
+ **Full Artist Discography:** Load an artist's complete collection, including singles, albums, and compilations, for sorting, with all duplicate tracks removed.
+ **Dynamic Playlists:** Create self-updating playlists from any combination of sources (playlists, artists, albums) that automatically stay updated and sorted on a custom schedule.
+ **Playlist Creation:** Generate specialized playlists like 'New Releases from Followed Artists', 'Discovery Mixes', and your 'Top Tracks' for different time periods.
+ **Extra Data Columns:** Add an extra column to playlists, albums, and artist pages (Play Count, Release Date, Scrobbles, DJ Info, Key, BPM, and more).
+ **Advanced Custom Filter:** Fine-tune playlists with keywords and range sliders for play count, release date, duration, and various audio features (BPM, energy, danceability).
+ **Genre Filtering:** Filter any playlist or discography by genre, using combined data from Spotify and Last.fm.
+ **AI-Powered Playlists:** Generate playlists from prompts, using the current context as a music source with Gemini models.
+ **Last.fm Integration:** Connect your Last.fm account to sort by your personal scrobble history.
+ **Smart Deduplication:** Remove duplicate tracks from playlists, automatically keeping the most popular version.
+ **Smart Shuffle:** Randomize your playlist with an intelligent shuffle that helps prevent multiple songs by the same artist from playing back-to-back.
+ **Configurable Sorting:** Easily toggle ascending/descending order for sort types.
+ **Flexible Output:** Save as a new playlist, modify your current playlist (if owned), or just add the sorted tracks to your queue.

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
