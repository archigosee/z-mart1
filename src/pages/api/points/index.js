// pages/api/points.js

import { updatePoints, getPoints } from '../../../backend/controllers/pointController';
import dbConnect from '../../../backend/config/dbConnect';

export default async function handler(req, res) {
  await dbConnect();

  switch (req.method) {
    case 'POST':
      return updatePoints(req, res);
    case 'GET':
      return getPoints(req, res);
    default:
      res.setHeader('Allow', ['POST', 'GET']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
