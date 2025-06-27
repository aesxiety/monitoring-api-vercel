import { db } from '../utils/firebase';

export default async function handler(req, res) {
  try {
    const snapshot = await db
      .collection('sensors')
      .orderBy('timestamp', 'desc')
      .limit(20) // Ambil 20 data terakhir
      .get();

    const data = snapshot.docs.map(doc => {
      const d = doc.data();
      return {
        ...d,
        waktu: new Date(d.timestamp._seconds * 1000).toLocaleTimeString('id-ID')
      };
    });

    res.status(200).json({ success: true, data: data.reverse() }); // Urutkan dari lama ke baru
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
