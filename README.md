# Sort Play
Sort Spotify playlists by play count using the Spotify Web API.

## Installation  
#### Using Marketplace  
1. Ensure that Spicetify is installed on your system.  
2. Open the Spicetify Marketplace.  
3. Search for **"Sort Play"**.  
4. Click **Install**.  

#### Manual Installation  
1. Copy the `sort-play.js` file to ``` %appdata%\spicetify\Extensions ```   
2. Open a terminal and run ```spicetify config extensions sort-play.js``` 
3. Apply the changes, run ```spicetify apply```

## Usage

1. Go to a public playlist (private playlists not supported).
2. You'll see a new "Sort" button in the playlist header.
3. In first use, you'll be prompted to enter your Spotify API Client ID and Client Secret. (to change API later right, click on the button)
4. Click "Sort" to sort the playlist, a new playlist with the sorted tracks will be added to your library.

## Setting Up Spotify API Credentials

1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/).
2. Log in with your Spotify account.
3. Click "Create an App".
4. Give your app a name and description (e.g., "Spicetify Sort Play").
5. Copy the **Client ID** and **Client Secret**.
6. Paste these into the extension's prompt in Spotify when asked.
   *   The extension saves these credentials locally, so you only need to enter them once.
   *   You can change or delete the saved credentials by right-clicking the "Sort" button.
