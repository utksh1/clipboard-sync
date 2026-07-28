import { put } from '@vercel/blob';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const contentType = req.headers['content-type'] || 'application/octet-stream';
  const filename = req.headers['x-filename'] || `file-${Date.now()}`;
  
  const blob = await put(filename, req, {
    access: 'public',
    contentType,
  });

  return res.json({ url: blob.url });
}
