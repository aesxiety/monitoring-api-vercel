import { db } from '../utils/firebase.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { suhu, kelembaban, tekanan, gas, berat, suara, waktu } = req.body;

  try {
    const data = {
      suhu, kelembaban, tekanan, gas, berat, suara,
      waktu: waktu || new Date().toISOString()
    };

    await db.collection('sensor_data').add(data);
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
