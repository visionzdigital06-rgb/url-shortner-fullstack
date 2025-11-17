const urls = require('../urls.json');

module.exports = (req, res) => {
  if (req.method === 'POST') {
    const originalUrl = req.body.originalUrl;
    const shortUrl = Math.random().toString(36).substring(2, 8);
    urls.push({ originalUrl, shortUrl });
    res.status(200).json({ shortUrl });
  } else {
    res.status(405).send('Method Not Allowed');
  }
};
