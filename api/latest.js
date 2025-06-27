import { db } from '../utils/firebase';

export default async function handler(req, res) {
  // Atur header CORS
  res.setHeader('Access-Control-Allow-Origin', '*'); // <- Bolehkan semua domain
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end(); // ← tanggapi preflight request
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const snapshot = await db
      .collection('sensors')
      .orderBy('timestamp', 'desc')
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ success: false, message: 'Data not found' });
    }

    const latest = snapshot.docs[0].data();
    return res.status(200).json({ success: true, data: latest });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
