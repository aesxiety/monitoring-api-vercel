import { db } from '../utils/firebase';
import { Timestamp } from 'firebase-admin/firestore';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  try {
    // Pastikan body ada
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ success: false, message: 'Invalid request body' });
    }

    const { suhu, kelembaban, tekanan, gas, berat, suara, anomaly, gerakan } = req.body;

    const cleanData = {
      suhu,
      kelembaban,
      tekanan,
      gas,
      berat,
      suara,
      anomaly,
      gerakan,
      timestamp: Timestamp.now(), // gunakan Firestore Timestamp
    };

    // Hapus field undefined
    Object.keys(cleanData).forEach(
      key => cleanData[key] === undefined && delete cleanData[key]
    );

    await db.collection('sensor_data').add(cleanData);

    res.status(200).json({ success: true, message: 'Data berhasil disimpan' });
  } catch (error) {
    console.error('Sensor API Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}
