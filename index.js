const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const shortid = require('shortid');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from /public folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

// Load or initialize URL mappings
let urls = {};
if (fs.existsSync('urls.json')) {
    urls = JSON.parse(fs.readFileSync('urls.json'));
}

// API: Shorten a URL
app.post('/shorten', (req, res) => {
    const { longUrl } = req.body;
    if (!longUrl) return res.status(400).json({ error: 'URL is required' });

    const shortId = shortid.generate();
    urls[shortId] = longUrl;

    fs.writeFileSync('urls.json', JSON.stringify(urls, null, 2));

    res.json({ shortUrl: `${req.protocol}://${req.get('host')}/${shortId}` });
});

// Redirect to original URL
app.get('/:id', (req, res) => {
    const longUrl = urls[req.params.id];
    if (longUrl) res.redirect(longUrl);
    else res.status(404).send('URL not found');
});

// Serve homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
