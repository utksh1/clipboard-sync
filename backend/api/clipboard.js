import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { type, content, deviceId, timestamp, filename } = req.body;
    
    const entry = {
      id: Date.now().toString(),
      type,
      content,
      deviceId,
      timestamp,
      filename
    };
    
    await kv.set('clipboard:latest', JSON.stringify(entry));
    
    return res.json({ success: true, id: entry.id });
  }
  
  if (req.method === 'GET') {
    const data = await kv.get('clipboard:latest');
    
    if (!data) {
      return res.json({ content: null });
    }
    
    return res.json(JSON.parse(data));
  }
  
  res.status(405).json({ error: 'Method not allowed' });
}
