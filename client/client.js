import { readClipboard, writeClipboard, hashContent } from './clipboard.js';
import { readFileSync, writeFileSync } from 'fs';
import FormData from 'form-data';
import fetch from 'node-fetch';

const config = JSON.parse(readFileSync('./config.json', 'utf-8'));

if (!config.deviceId) {
  config.deviceId = `device-${Date.now()}`;
  writeFileSync('./config.json', JSON.stringify(config, null, 2));
}

const API_URL = config.apiUrl;
const DEVICE_ID = config.deviceId;

let lastHash = '';
let lastTimestamp = 0;

async function uploadContent(content) {
  const formData = new FormData();
  formData.append('file', Buffer.from(content), {
    filename: `clipboard-${Date.now()}`,
    contentType: 'application/octet-stream'
  });

  const response = await fetch(`${API_URL}/api/upload`, {
    method: 'POST',
    body: formData,
    headers: formData.getHeaders()
  });

  const data = await response.json();
  return data.url;
}

async function monitorClipboard() {
  const clipboard = await readClipboard();
  
  if (!clipboard) return;
  
  const hash = hashContent(clipboard.content);
  
  if (hash !== lastHash) {
    lastHash = hash;
    const timestamp = Date.now();
    
    let content = clipboard.content;
    
    if (clipboard.type === 'image' || clipboard.type === 'file') {
      content = await uploadContent(clipboard.content);
    }
    
    await fetch(`${API_URL}/api/clipboard`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: clipboard.type,
        content,
        deviceId: DEVICE_ID,
        timestamp
      })
    });
    
    lastTimestamp = timestamp;
    console.log(`Uploaded ${clipboard.type} to cloud`);
  }
}

async function syncClipboard() {
  const response = await fetch(`${API_URL}/api/clipboard`);
  const data = await response.json();
  
  if (!data || !data.timestamp) return;
  
  if (data.timestamp > lastTimestamp && data.deviceId !== DEVICE_ID) {
    await writeClipboard(data.type, data.content);
    lastTimestamp = data.timestamp;
    lastHash = hashContent(data.content);
    console.log(`Synced ${data.type} from ${data.deviceId}`);
  }
}

console.log(`Clipboard sync started for ${DEVICE_ID}`);
console.log(`API: ${API_URL}`);

setInterval(monitorClipboard, 500);
setInterval(syncClipboard, 1000);
