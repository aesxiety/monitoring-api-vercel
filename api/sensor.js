import { db, Timestamp } from '../utils/firebase';

import { db } from '../utils/firebase';
import { Timestamp } from 'firebase-admin/firestore';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  try {
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ success: false, message: 'Invalid body' });
    }

    const { suhu, kelembaban, gas, suara, gerakan, waktuGerakan } = req.body;

    // Validasi sederhana (aman & quick)
    const isNum = v => typeof v === 'number' && !isNaN(v);
    if (![suhu, kelembaban, gas, suara, gerakan].every(isNum)) {
      return res.status(400).json({ success: false, message: 'Invalid types' });
    }
    if (gerakan !== 0 && gerakan !== 1) {
      return res.status(400).json({ success: false, message: 'gerakan must be 0 or 1' });
    }

    const data = {
      suhu,
      kelembaban,
      gas,
      suara,
      gerakan,
      ...(isNum(waktuGerakan) ? { waktuGerakan } : {}),
      timestamp: Timestamp.now(),
    };

    await db.collection('sensor_data').add(data);
    return res.status(200).json({ success: true, message: 'OK' });
  } catch (e) {
    console.error('[sensor] error:', e);
    return res.status(500).json({ success: false, error: e.message });
  }
}
