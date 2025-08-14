import { db } from '../utils/firebase';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });

  try {
    const snapshot = await db
      .collection('sensor_data')
      .orderBy('timestamp', 'desc')
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ success: false, message: 'No data found' });
    }

    const data = snapshot.docs[0].data();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Latest API Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
