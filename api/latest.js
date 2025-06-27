import { db } from '../utils/firebase';

export default async function handler(req, res) {
  // ✅ CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // ✅ Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // ✅ GET Latest Sensor Data
  if (req.method === 'GET') {
    try {
      const snapshot = await db
        .collection('sensor_data') // pastikan nama koleksi sudah sesuai
        .orderBy('timestamp', 'desc')
        .limit(1)
        .get();

      if (snapshot.empty) {
        return res.status(404).json({ success: false, message: 'No data found' });
      }

      const data = snapshot.docs[0].data();

      return res.status(200).json({ success: true, data });
    } catch (error) {
      console.error('🔥 Firestore Error:', error.message);
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  // ✅ Reject other methods
  return res.status(405).json({ message: 'Method not allowed' });
}
