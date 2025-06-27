import { db } from '../utils/firebase.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const snapshot = await db.collection('sensor_data')
      .orderBy('waktu', 'desc')
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ message: 'No data found' });
    }

    const latest = snapshot.docs[0].data();
    res.status(200).json(latest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
