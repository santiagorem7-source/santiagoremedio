const SB_URL = 'https://kvlwpgqihnfsxxjhsvuj.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2bHdwZ3FpaG5mc3h4amhzdnVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5OTQ2MTMsImV4cCI6MjA5NTU3MDYxM30.Fm4pl_JAeTxfvsu1QUBbaTlL6Jd1YnRLpLEeWQd98Ng';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const headers = {
    'apikey': SB_KEY,
    'Authorization': 'Bearer ' + SB_KEY,
    'Content-Type': 'application/json',
  };

  if (req.method === 'GET') {
    const r = await fetch(SB_URL + '/rest/v1/datos?select=*', { headers });
    const data = await r.json();
    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    const r = await fetch(SB_URL + '/rest/v1/datos?on_conflict=tipo,key,closer_id', {
      method: 'POST',
      headers: { ...headers, 'Prefer': 'resolution=merge-duplicates' },
      body: JSON.stringify(req.body),
    });
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
