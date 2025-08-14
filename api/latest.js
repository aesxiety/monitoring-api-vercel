import { db } from '../utils/firebase';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });

  try {
    const snap = await db.collection('sensor_data')
      .orderBy('timestamp', 'desc')
      .limit(1)
      .get();

    if (snap.empty) return res.status(404).json({ success: false, message: 'No data' });

    return res.status(200).json({ success: true, data: snap.docs[0].data() });
  } catch (e) {
    console.error('[latest] error:', e);
    return res.status(500).json({ success: false, error: e.message });
  }
}
