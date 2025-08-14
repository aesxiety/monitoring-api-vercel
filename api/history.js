import { db } from '../utils/firebase';

function parseDateOnly(d) {
  if (!d) return null;
  const dt = new Date(d);
  if (isNaN(+dt)) return null;
  // normalisasi ke awal hari untuk start, dan akhir hari untuk end (di bawah ini)
  return dt;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });

  try {
    const { start, end, limit } = req.query;

    let q = db.collection('sensor_data').orderBy('timestamp', 'asc');

    const startD = parseDateOnly(start);
    const endD = parseDateOnly(end);

    if (startD) {
      const startDay = new Date(startD.getFullYear(), startD.getMonth(), startD.getDate(), 0, 0, 0, 0);
      q = q.where('timestamp', '>=', startDay);
    }
    if (endD) {
      const endDay = new Date(endD.getFullYear(), endD.getMonth(), endD.getDate(), 23, 59, 59, 999);
      q = q.where('timestamp', '<=', endDay);
    }

    const lim = Math.min(Math.max(parseInt(limit || '200', 10), 1), 2000);
    q = q.limit(lim);

    const snap = await q.get();
    const data = snap.docs.map(d => d.data());

    return res.status(200).json({ success: true, data });
  } catch (e) {
    console.error('[history] error:', e);
    // Jika Firestore minta composite index, kita tetap reply rapi
    if (String(e?.message || '').includes('index')) {
      return res.status(400).json({
        success: false,
        error: 'Firestore index required. Buka error link di logs Vercel untuk membuat index otomatis.',
      });
    }
    return res.status(500).json({ success: false, error: e.message });
  }
}
