// api/sensor.js
import { db, Timestamp } from '../utils/firebase.js';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  try {
    const { suhu, kelembaban, gas, suara, gerakan, waktuGerakan } = req.body || {};

    if (![suhu, kelembaban, gas, suara, gerakan].every(v => typeof v === 'number' && !isNaN(v))) {
      return res.status(400).json({ success: false, message: 'Invalid types' });
    }

    if (![0,1].includes(gerakan)) {
      return res.status(400).json({ success: false, message: 'gerakan must be 0 or 1' });
    }

    const data = {
      suhu,
      kelembaban,
      gas,
      suara,
      gerakan,
      ...(typeof waktuGerakan === 'number' ? { waktuGerakan } : {}),
      timestamp: Timestamp.now()
    };

    await db.collection('sensor_data').add(data);

    return res.status(200).json({ success: true, message: 'Data saved' });
  } catch (err) {
    console.error('[sensor] Error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
