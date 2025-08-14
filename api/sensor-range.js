import { db, Timestamp } from '../utils/firebase.js';
import { runCors } from '../utils/cors.js';

export default async function handler(req, res) {
  await runCors(req, res, async () => {
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });

    try {
      const { start, end } = req.query;
      if (!start || !end) return res.status(400).json({ success: false, message: 'Start & end required' });

      const startDate = Timestamp.fromDate(new Date(start));
      const endDate = Timestamp.fromDate(new Date(end));

      const snapshot = await db.collection('sensor_data')
        .where('timestamp', '>=', startDate)
        .where('timestamp', '<=', endDate)
        .orderBy('timestamp', 'asc')
        .get();

      const data = snapshot.docs.map(doc => {
        const d = doc.data();
        let waktuStr = null;
        if (typeof d.waktuGerakan === 'number') {
          const hh = Math.floor(d.waktuGerakan / 10000);
          const mm = Math.floor((d.waktuGerakan % 10000) / 100);
          const ss = d.waktuGerakan % 100;
          waktuStr = `${hh.toString().padStart(2,'0')}:${mm.toString().padStart(2,'0')}:${ss.toString().padStart(2,'0')}`;
        }
        return {
          id: doc.id,
          suhu: d.suhu,
          kelembaban: d.kelembaban,
          gas: d.gas,
          suara: d.suara,
          gerakan: d.gerakan,
          waktuGerakan: waktuStr,
          timestamp: d.timestamp.toDate().toISOString()
        };
      });

      return res.status(200).json({ success: true, data });
    } catch (err) {
      console.error('[sensor-range] Error:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });
}
