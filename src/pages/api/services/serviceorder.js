import dbConnect from '../../../backend/config/dbConnect';
import { createServiceOrder, getServiceOrders } from '../../../backend/controllers/serviceOrderController';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    await createServiceOrder(req, res);
  } else if (req.method === 'GET') {
    await getServiceOrders(req, res);
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
