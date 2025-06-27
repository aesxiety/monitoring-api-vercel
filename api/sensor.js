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
        timestamp: new Date().toISOString()
      };

      // Hilangkan nilai undefined agar tidak error di Firestore
      const cleanData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== undefined)
      );

      await db.collection('sensor_data').add(cleanData);

      res.status(200).json({ success: true, message: 'Data berhasil disimpan' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
