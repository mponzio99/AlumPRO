export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxWjVQUvMXF0PZkK5f6h3CUOM8OitVQPac6GM8zcqh2XUSbzZ4EetftN-_2Kzop4cQIrg/exec';
  const params = new URLSearchParams(req.query);

  try {
    let targetUrl;
    
    if (req.method === 'POST' && req.body) {
      const data = encodeURIComponent(JSON.stringify(req.body));
      targetUrl = `${SCRIPT_URL}?${params.toString()}&data=${data}`;
    } else {
      targetUrl = `${SCRIPT_URL}?${params.toString()}`;
    }

    console.log('Fetching:', targetUrl.slice(0, 100));

    const response = await fetch(targetUrl, {
      method: 'GET',
      redirect: 'follow',
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    console.log('Response status:', response.status);
    const text = await response.text();
    console.log('Response text:', text.slice(0, 200));

    const json = JSON.parse(text);
    res.status(200).json(json);
  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(500).json({ ok: false, error: error.message });
  }
}
