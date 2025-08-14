import db from '../utils/firebase';

export default async function handler(req, res) {
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
    const { start, end } = req.query;
    if (!start || !end) {
      return res.status(400).json({ success: false, message: 'Start and end timestamps required' });
    }

    const startDate = new Date(parseInt(start));
    const endDate = new Date(parseInt(end));

    const snapshot = await db
      .collection('sensor_data')
      .where('timestamp', '>=', startDate)
      .where('timestamp', '<=', endDate)
      .orderBy('timestamp', 'asc')
      .get();

    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      waktu: doc.data().timestamp.toDate().toLocaleString('id-ID')
    }));

    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error('Error:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
}
