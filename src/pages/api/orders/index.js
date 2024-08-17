import { newOrder, getOrders } from '../../../backend/controllers/orderControllers';
import dbConnect from '../../../backend/config/dbConnect';

export default async function handler(req, res) {
  await dbConnect();

  switch (req.method) {
    case 'POST':
      try {
        await newOrder(req, res);
      } catch (error) {
        console.error('Error in newOrder handler:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
      }
      break;

    case 'GET':
      try {
        await getOrders(req, res);
      } catch (error) {
        console.error('Error in getOrders handler:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
      }
      break;

    default:
      res.setHeader('Allow', ['POST', 'GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
