## Twitch Easy Follower – Chrome Extension

Twitch Easy Follower is a simple Chrome extension that shows all Twitch channels you follow that are currently live.

Each live channel is listed with a button that opens the stream in a new tab.

---

### 1. Prerequisites

- Google Chrome (or any Chromium-based browser that supports Manifest V3)

- A Twitch account

- A Twitch Developer Application (for clientId and OAuth scopes)

---

### 2. Create a Twitch Developer Application

1. Go to https://dev.twitch.tv/console/apps and sign in.

2. Click “Register Your Application”.

3. Choose a name (e.g. Easy Follower).

4. Set OAuth Redirect URL to something like http://localhost (for token generation).

5. Category: anything reasonable (e.g. “Application Integration”).

6. After creating, copy your Client ID.

7. Click “New Secret” to generate a Client Secret (only for token generation, not used directly by the extension).

---

### 3. Get an OAuth Access Token

For quick testing, you can generate a user token via the implicit flow in your browser:

1. Open a new browser tab with this URL (replace YOUR_CLIENT_ID and YOUR_REDIRECT_URI):

   https://id.twitch.tv/oauth2/authorize

     ?client_id=YOUR_CLIENT_ID

     &redirect_uri=YOUR_REDIRECT_URI

     &response_type=token

     &scope=user:read:follows

Example:

   https://id.twitch.tv/oauth2/authorize

     ?client_id=xxxxxxxxxxxxxxxxxxxx

     &redirect_uri=http://localhost

     &response_type=token

     &scope=user:read:follows

1. Log in to Twitch and authorize the app.

2. After redirect you’ll see an URL like:

   http://localhost/#access_token=YOUR_ACCESS_TOKEN&scope=...

3. Copy the access_token value (everything after access_token= up to the next &).

> Note: This is a user access token. For production use, you should not ship static tokens inside a public extension.

---

### 4. Configure the Extension (config.json)

Inside the src folder there is a file called config.json.

Fill it with your own values:

{

  "clientId": "YOUR_CLIENT_ID",

  "accessToken": "YOUR_ACCESS_TOKEN",

  "username": "your_twitch_username"

}

- clientId: from the Twitch developer console

- accessToken: from the OAuth flow above

- username: your Twitch login name (lowercase)


---

### 7. Load the Extension in Chrome

1. Open Chrome and navigate to chrome://extensions/.

2. Enable Developer mode (toggle in the top right corner).

3. Click “Load unpacked”.

4. Select the twitch_extension folder (the one that contains manifest.json).

5. The extension should now appear in your toolbar.

6. Click the extension icon to open the popup.

You should see the list of currently live followed channels with a “Go to Stream” button for each.

---

### 8. How It Works (Short Overview)

- On startup, the extension:

- Loads config.json to get clientId, accessToken, and username.

- Calls https://api.twitch.tv/helix/users?login=... to get your Twitch user ID.

- Fetches all channels you follow via https://api.twitch.tv/helix/channels/followed.

- Uses https://api.twitch.tv/helix/streams to filter only channels that are currently live.

- Renders each live channel in the popup as a list item with:

- Channel name

- “Go to Stream” button (opens the Twitch channel in a new tab)

- Optional stream title and viewer count

---

### 9. Troubleshooting

-   No channels shown:

- Check the browser console (right-click in popup → Inspect) for errors.

- Verify config.json path and values.

- Ensure your token has user:read:follows scope and is still valid.

- “Failed to fetch” or CORS errors:

- Confirm host_permissions in manifest.json include https://api.twitch.tv/*.

- Icons or popup not loading:

- Verify that the paths in manifest.json are correct and relative to the extension root.

If you run into a specific error message, you can copy it from the console and diagnose based on that.
