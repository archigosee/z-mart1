import dbConnect from '../../../backend/config/dbConnect';
import EarnOption from '../../../backend/models/earnoptions';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const options = await EarnOption.find();
      res.status(200).json({ success: true, data: options });
    } catch (error) {
      console.error('Error fetching earn options:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch earn options' });
    }
  } else if (req.method === 'POST') {
    try {
      const { text, points, icon, link, requiresCheck } = req.body;

      if (!text || !points || !icon || (link === undefined && text !== "Invite Your Friend")) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: text, points, icon, link',
        });
      }

      const newOption = await EarnOption.create({
        text,
        points,
        icon,
        link: link || "", 
        requiresCheck: requiresCheck || false,
      });

      res.status(201).json({ success: true, data: newOption });
    } catch (error) {
      console.error('Error creating earn option:', error);
      res.status(500).json({ success: false, message: 'Failed to create earn option' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
