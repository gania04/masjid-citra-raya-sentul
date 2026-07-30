fetch('https://www.youtube.com/@AshabulYaminTV/videos')
  .then(r => r.text())
  .then(t => {
    const matches = t.match(/"videoId":"([a-zA-Z0-9_-]{11})"/g);
    const ids = matches ? [...new Set(matches.map(m => m.split('"')[3]))] : [];
    console.log(ids.slice(0, 5));
  });
