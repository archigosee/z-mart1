// pages/api/commission.js
import dbConnect from '../../../backend/config/dbConnect';
import { getCommission } from '../../../backend/controllers/commissionController';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    return getCommission(req, res);
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
