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
    const response = await fetch(url, {
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });
    const text = await response.text();
    try {
      const data = JSON.parse(text);
      res.status(200).json(data);
    } catch(e) {
      console.error('Response was not JSON:', text.slice(0, 500));
      res.status(500).json({ ok: false, error: 'Invalid JSON from script', raw: text.slice(0, 200) });
    }
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
}
