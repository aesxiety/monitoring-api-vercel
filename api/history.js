import { db } from '../utils/firebase';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });

  try {
    const snapshot = await db
      .collection('sensor_data')
      .orderBy('timestamp', 'desc')
      .limit(20)
      .get();

    const data = snapshot.docs.map(doc => {
      const d = doc.data();
      let waktu;

      // Auto-handle Firestore Timestamp & ISO String
      if (d.timestamp?._seconds) {
        waktu = new Date(d.timestamp._seconds * 1000).toLocaleTimeString('id-ID');
      } else if (typeof d.timestamp === 'string') {
        waktu = new Date(d.timestamp).toLocaleTimeString('id-ID');
      } else {
        waktu = '-';
      }

      return { ...d, waktu };
    });

    return res.status(200).json({ success: true, data: data.reverse() });
  } catch (err) {
    console.error('History API Error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
