import { db } from '../utils/firebase';

export default async function handler(req, res) {
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
        timestamp: new Date()
      };

      // 🔧 Hapus semua field yang undefined agar tidak error di Firestore
      const filteredData = Object.fromEntries(
        Object.entries(data).filter(([_, v]) => v !== undefined)
      );

      await db.collection('sensor_data').add(filteredData);

      res.status(200).json({ success: true, message: 'Data berhasil disimpan ke Firestore' });
    } catch (error) {
      console.error('🔥 Firestore Error:', error.message);
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
