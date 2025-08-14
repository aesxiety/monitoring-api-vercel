import { db } from '../utils/firebase';
import { setCors } from '../utils/cors';

export default async function handler(req, res) {
  setCors(res);
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
      return {
        ...d,
        waktu: d.timestamp.toDate().toLocaleTimeString('id-ID')
      };
    });

    return res.status(200).json({ success: true, data: data.reverse() });
  } catch (err) {
    console.error('[API] Error ambil history:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
}
