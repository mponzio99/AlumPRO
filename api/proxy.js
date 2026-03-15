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
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
}
