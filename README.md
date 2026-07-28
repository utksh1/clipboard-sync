# Clipboard Sync

Cross-device clipboard synchronization using Vercel backend - **completely free!**

## Features

- Automatic clipboard sync across Mac, Windows, and Linux
- Supports text, images, and files
- ~1-2 second sync latency
- No authentication (personal use)
- **100% free** - uses in-memory storage on Vercel

## Quick Start

### 1. Client Setup

```bash
cd client
npm install
node client.js
```

The client will auto-generate a device ID on first run and connect to the deployed backend at `https://clipboard-sync-mocha.vercel.app`.

### 2. Platform Requirements

- **Mac**: No additional requirements
- **Windows**: PowerShell 5.0+
- **Linux**: Install `xclip` (`sudo apt install xclip`)

## Usage

1. Start the client on each device you want to sync
2. Copy text/images/files on any device
3. Content automatically appears on all other devices within 1-2 seconds

## How It Works

- **Backend**: Vercel serverless functions with in-memory storage (free tier)
- **Client**: Node.js script monitoring clipboard changes
- **Sync**: Polling-based (500ms monitor, 1s sync interval)

## Deploy Your Own Backend

If you want to deploy your own backend:

```bash
vercel deploy --prod
```

Then update `client/config.json` with your deployment URL.

## Limitations

- In-memory storage resets on backend redeployment (data not persistent)
- 1-2 second sync latency (polling-based)
- 500MB file size limit (Vercel Blob free tier)
- No clipboard history (only latest)
- Requires internet connection

## Architecture

```
┌─────────────┐         ┌──────────────────┐         ┌─────────────┐
│   Device 1  │────────▶│  Vercel Backend  │◀────────│   Device 2  │
│   (Client)  │         │  (In-memory DB)  │         │   (Client)  │
└─────────────┘         └──────────────────┘         └─────────────┘
```

## License

MIT
