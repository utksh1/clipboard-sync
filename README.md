# Clipboard Sync

Cross-device clipboard synchronization using Vercel backend.

## Features

- Automatic clipboard sync across Mac, Windows, and Linux
- Supports text, images, and files
- ~1-2 second sync latency
- No authentication (personal use)

## Setup

### Backend Deployment

1. Deploy to Vercel:
```bash
cd backend
vercel deploy --prod
```

2. Setup Vercel KV:
   - Go to Vercel dashboard → Storage tab
   - Create new KV database (or connect Upstash Redis)
   - Connect to your project

3. Note your deployment URL (e.g., `https://clipboard-sync-xyz.vercel.app`)

### Client Setup

1. Install dependencies:
```bash
cd client
npm install
```

2. Update `config.json` with your backend URL:
```json
{
  "apiUrl": "https://your-deployment.vercel.app",
  "deviceId": ""
}
```

3. Run the client:
```bash
node client.js
```

The `deviceId` will be auto-generated on first run.

### Platform Requirements

- **Mac**: No additional requirements
- **Windows**: PowerShell 5.0+
- **Linux**: Install `xclip` (`sudo apt install xclip`)

## Usage

1. Start the client on each device you want to sync
2. Copy text/images/files on any device
3. Content automatically appears on all other devices within 1-2 seconds

## Architecture

- **Backend**: Vercel serverless functions with KV storage and Blob storage
- **Client**: Node.js script monitoring clipboard changes
- **Sync**: Polling-based (500ms monitor, 1s sync interval)

## Limitations

- 1-2 second sync latency (polling-based)
- 500MB file size limit (Vercel Blob free tier)
- No clipboard history (only latest)
- Requires internet connection
- No end-to-end encryption

## License

MIT
