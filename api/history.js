import { db } from '../../utils/firebase'; // atau '../utils/firebase' sesuai struktur kamu

export default async function handler(req, res) {
  // ✅ CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // ✅ Handle preflight (OPTIONS)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const snapshot = await db
      .collection('sensors')
      .orderBy('timestamp', 'desc')
      .limit(20)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ success: false, message: 'Data kosong' });
    }

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
