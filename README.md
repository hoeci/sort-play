# Sort Play
Sort Spotify playlists by play count using the Spotify Web API.

## Installation

1. Make sure you have Spicetify installed.
2. Open the Spicetify Marketplace.
3. Search for "Sort Play" or "Play Count Sorter".
4. Click "Install".

## Usage

1. Go to a playlist you own (sorting is not supported for private playlists).
2. You'll see a new "Sort" button in the playlist header.
3. The first time you use the extension, you'll be prompted to enter your Spotify API Client ID and Client Secret.
4. Click "Sort" to sort the playlist. The extension will:
    *   Fetch play counts for all tracks in the playlist.
    *   Create a new playlist named "(Sorted) \[Original Playlist Name]" with the tracks sorted by play count in descending order.

## Setting Up Spotify API Credentials

1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/).
2. Log in with your Spotify account.
3. Click "Create an App".
4. Give your app a name and description (e.g., "Spicetify Sort Play").
5. Copy the **Client ID** and **Client Secret**.
6. Paste these into the extension's prompt in Spotify when asked.
   *   The extension saves these credentials locally, so you only need to enter them once.
   *   You can change or delete the saved credentials by right-clicking the "Sort" button.
