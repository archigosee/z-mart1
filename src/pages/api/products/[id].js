// pages/api/products/[id].js

import dbConnect from '../../../backend/config/dbConnect';
import { getProduct } from '../../../backend/controllers/productControllers';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    await getProduct(req, res);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
