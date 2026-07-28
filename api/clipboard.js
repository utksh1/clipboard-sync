let messages = [];

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
    
    messages.push(entry);
    if (messages.length > 100) messages.shift();
    
    return res.json({ success: true, id: entry.id });
  }
  
  if (req.method === 'GET') {
    return res.json({ messages });
  }
  
  res.status(405).json({ error: 'Method not allowed' });
}
