const express = require('express');
const path = require('path');
const app = express();

// Serve static front-end files
app.use(express.static(path.join(__dirname, '/')));

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Your existing API routes here
// Example:
// app.post('/shorten', (req, res) => { ... });

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


const express = require('express');
const bodyParser = require('body-parser');
const shortid = require('shortid');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static frontend files
app.use(express.static('public'));
app.use(bodyParser.json());

// Load or initialize URL mappings
let urls = {};
if (fs.existsSync('urls.json')) {
    urls = JSON.parse(fs.readFileSync('urls.json'));
}

// API to shorten a URL
app.post('/shorten', (req, res) => {
    const { longUrl } = req.body;
    if (!longUrl) return res.status(400).json({ error: 'URL is required' });

    const shortId = shortid.generate();
    urls[shortId] = longUrl;

    fs.writeFileSync('urls.json', JSON.stringify(urls, null, 2));

    res.json({ shortUrl: `${req.protocol}://${req.get('host')}/${shortId}` });
});

// Redirect short URL
app.get('/:id', (req, res) => {
    const longUrl = urls[req.params.id];
    if (longUrl) res.redirect(longUrl);
    else res.status(404).send('URL not found');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
