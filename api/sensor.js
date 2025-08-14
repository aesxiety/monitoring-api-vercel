import { db } from '../utils/firebase';
import { setCors } from '../utils/cors';
import admin from 'firebase-admin';

export default async function handler(req, res) {
  setCors(res);

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  try {
    const {
      suhu,
      kelembaban,
      gas,
      suara,
      gerakan,
      waktuGerakan
    } = req.body;

    // ===== VALIDASI DATA =====
    if (
      typeof suhu !== 'number' ||
      typeof kelembaban !== 'number' ||
      typeof gas !== 'number' ||
      typeof suara !== 'number' ||
      typeof gerakan !== 'number' ||
      typeof waktuGerakan !== 'number'
    ) {
      return res.status(400).json({
        success: false,
        message: 'Format data tidak valid. Pastikan semua nilai adalah number.'
      });
    }

    // Nilai harus masuk akal (opsional)
    if (
      suhu < -40 || suhu > 85 ||
      kelembaban < 0 || kelembaban > 100 ||
      gas < 0 || suara < 0 ||
      gerakan < 0 || gerakan > 1
    ) {
      return res.status(400).json({
        success: false,
        message: 'Nilai data di luar batas wajar.'
      });
    }

    // ===== SIMPAN KE FIRESTORE =====
    const data = {
      suhu,
      kelembaban,
      gas,
      suara,
      gerakan,
      waktuGerakan,
      timestamp: admin.firestore.Timestamp.now()
    };

    await db.collection('sensor_data').add(data);

    return res.status(200).json({ success: true, message: 'Data berhasil disimpan' });
  } catch (error) {
    console.error('[API] Error simpan data:', error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
}
