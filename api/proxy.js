export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwe3Kh0oBMDEBQk-C7gnqRh3DKYBBjLke2s5V76_vyUJNolH0fTmg4VY2F3SsdZbRVM7Q/exec';
  const params = new URLSearchParams(req.query);
  const url = `${SCRIPT_URL}?${params.toString()}`;

  try {
    const fetchOptions = {
      method: 'GET',
      redirect: 'follow',
      headers: { 'User-Agent': 'Mozilla/5.0' }
    };

    // Si viene con body (POST), reenviarlo como query param data
    if (req.method === 'POST' && req.body) {
      const data = encodeURIComponent(JSON.stringify(req.body));
      const postUrl = `${url}&data=${data}`;
      fetchOptions.method = 'GET';
      const response = await fetch(postUrl, fetchOptions);
      const text = await response.text();
      const json = JSON.parse(text);
      return res.status(200).json(json);
    }

    const response = await fetch(url, fetchOptions);
    const text = await response.text();
    const json = JSON.parse(text);
    res.status(200).json(json);
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
}
