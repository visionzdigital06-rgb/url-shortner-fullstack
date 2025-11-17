document.getElementById('shortenBtn').addEventListener('click', async () => {
  const longUrl = document.getElementById('longUrl').value;
  if (!longUrl) return alert('Please enter a URL');

  try {
    const res = await fetch('/api/shorten', {  // <-- updated path
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ originalUrl: longUrl }) // <-- match key with serverless function
    });

    const data = await res.json();
    if (data.shortUrl) {
      document.getElementById('result').innerHTML = `Short URL: <a href="${data.shortUrl}" target="_blank">${data.shortUrl}</a>`;
    } else {
      document.getElementById('result').innerText = 'Error creating short URL';
    }
  } catch (err) {
    console.error(err);
    document.getElementById('result').innerText = 'Error creating short URL';
  }
});
