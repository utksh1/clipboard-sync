let clipboardData = null;

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { type, content, deviceId, timestamp, filename } = req.body;
    
    clipboardData = {
      id: Date.now().toString(),
      type,
      content,
      deviceId,
      timestamp,
      filename
    };
    
    return res.json({ success: true, id: clipboardData.id });
  }
  
  if (req.method === 'GET') {
    return res.json(clipboardData || { content: null });
  }
  
  res.status(405).json({ error: 'Method not allowed' });
}
