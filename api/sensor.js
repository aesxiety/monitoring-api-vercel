// api/sensor.js
import { db, Timestamp } from '../utils/firebase.js';

export default async function handler(req, res) {
  // CORS setup
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const data = {
        suhu: req.body.suhu,
        kelembaban: req.body.kelembaban,
        tekanan: req.body.tekanan,
        gas: req.body.gas,
        berat: req.body.berat,
        suara: req.body.suara,
        anomaly: req.body.anomaly,
        timestamp: Timestamp.now()
      };

      const cleanData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== undefined)
      );

      await db.collection('sensor_data').add(cleanData);
      return res.status(200).json({ success: true, message: 'Data berhasil disimpan' });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
