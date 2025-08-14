// api/sensor-realtime.js
import { db, Timestamp } from '../utils/firebase.js';

export default async function handler(req, res) {
  // CORS dan SSE headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });

  // Fungsi untuk kirim data ke client
  const sendData = async () => {
    try {
      const snapshot = await db.collection('sensor_data')
        .orderBy('timestamp', 'desc')
        .limit(1)
        .get();

      if (!snapshot.empty) {
        const doc = snapshot.docs[0].data();

        let waktuStr = null;
        if (typeof doc.waktuGerakan === 'number') {
          const hh = Math.floor(doc.waktuGerakan / 10000);
          const mm = Math.floor((doc.waktuGerakan % 10000) / 100);
          const ss = doc.waktuGerakan % 100;
          waktuStr = `${hh.toString().padStart(2,'0')}:${mm.toString().padStart(2,'0')}:${ss.toString().padStart(2,'0')}`;
        }

        const data = {
          suhu: doc.suhu,
          kelembaban: doc.kelembaban,
          gas: doc.gas,
          suara: doc.suara,
          gerakan: doc.gerakan,
          waktuGerakan: waktuStr,
          timestamp: doc.timestamp.toDate().toISOString()
        };

        res.write(`data: ${JSON.stringify(data)}\n\n`);
      }
    } catch (err) {
      console.error('[sensor-realtime] Error:', err);
    }
  };

  // Kirim data pertama
  await sendData();

  // Interval update tiap 2 detik
  const intervalId = setInterval(sendData, 2000);

  // Cleanup saat client disconnect
  req.on('close', () => {
    clearInterval(intervalId);
    res.end();
  });
}
