import { db, Timestamp } from '../utils/firebase.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { start, end } = req.query;

      if (!start || !end) {
        return res.status(400).json({ success: false, message: 'Start & end date required' });
      }

      const startDate = Timestamp.fromDate(new Date(start));
      const endDate = Timestamp.fromDate(new Date(end));

      const snapshot = await db
        .collection('sensor_data')
        .where('timestamp', '>=', startDate)
        .where('timestamp', '<=', endDate)
        .orderBy('timestamp', 'asc')
        .get();

      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
