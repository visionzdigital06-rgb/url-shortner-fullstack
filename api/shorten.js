// api/shorten.js
let urls = []; // in-memory storage

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    try {
      // Parse JSON body
      let body = '';
      for await (const chunk of req) {
        body += chunk;
      }
      const { originalUrl } = JSON.parse(body);

      if (!originalUrl) return res.status(400).json({ error: 'URL is required' });

      // Create a short URL code
      const shortCode = Math.random().toString(36).substring(2, 8);
      const shortUrl = `${req.headers.origin}/${shortCode}`;

      // Save in memory
      urls.push({ originalUrl, shortUrl });

      return res.status(200).json({ shortUrl });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }
};
