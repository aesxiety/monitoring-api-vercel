// api/sensor-latest.js
import { db } from '../utils/firebase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });

  try {
    const snapshot = await db.collection('sensor_data')
      .orderBy('timestamp', 'desc')
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ message: 'No data' });
    }

    const doc = snapshot.docs[0].data();

    let waktuStr = null;
    if (typeof doc.waktuGerakan === 'number') {
      const hh = Math.floor(doc.waktuGerakan / 10000);
      const mm = Math.floor((doc.waktuGerakan % 10000) / 100);
      const ss = doc.waktuGerakan % 100;
      waktuStr = `${hh.toString().padStart(2,'0')}:${mm.toString().padStart(2,'0')}:${ss.toString().padStart(2,'0')}`;
    }

    return res.status(200).json({
      suhu: doc.suhu,
      kelembaban: doc.kelembaban,
      gas: doc.gas,
      suara: doc.suara,
      gerakan: doc.gerakan,
      waktuGerakan: waktuStr,
      timestamp: doc.timestamp.toDate().toISOString()
    });
  } catch (err) {
    console.error('[sensor-latest] Error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
