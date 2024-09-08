import dbConnect from '../../../backend/config/dbConnect';
import { getServices, createService } from '../../../backend/controllers/serviceController';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    await getServices(req, res);
  } else if (req.method === 'POST') {
    await createService(req, res);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
