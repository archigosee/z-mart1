// pages/api/products/index.js

import { newProduct, getProducts } from '../../../backend/controllers/productControllers';
import dbConnect from '../../../backend/config/dbConnect';

export default async function handler(req, res) {
  await dbConnect();

  switch (req.method) {
    case 'POST':
      await newProduct(req, res);
      break;

    case 'GET':
      await getProducts(req, res);
      break;

    default:
      res.setHeader('Allow', ['POST', 'GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
