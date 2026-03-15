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
  const targetUrl = `${SCRIPT_URL}?${params.toString()}`;

  try {
    let response;
    if (req.method === 'POST' && req.body) {
      // Enviar como POST con form data (Apps Script acepta postData)
      const formBody = new URLSearchParams();
      formBody.append('data', JSON.stringify(req.body));
      response = await fetch(targetUrl, {
        method: 'POST',
        redirect: 'follow',
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Mozilla/5.0'
        },
        body: formBody.toString()
      });
    } else {
      response = await fetch(targetUrl, {
        method: 'GET',
        redirect: 'follow',
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
    }

    const text = await response.text();
    const json = JSON.parse(text);
    res.status(200).json(json);
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
}
