import { db } from '../utils/firebase';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const snapshot = await db
      .collection('sensor_data')
      .orderBy('timestamp', 'desc')
      .limit(20)
      .get();

    const data = snapshot.docs.map(doc => {
      const d = doc.data();
      return {
        ...d,
        waktu: new Date(d.timestamp._seconds * 1000).toLocaleTimeString('id-ID')
      };
    });

    return res.status(200).json({ success: true, data: data.reverse() });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
