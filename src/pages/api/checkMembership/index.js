import dbConnect from '../../../backend/config/dbConnect';

const BOT_TOKEN = '7350305630:AAEsjUdDvgDlsXhToZel8NoI3SCxpv5lIrE'; // Replace with your bot's token
const CHANNEL_ID = '1339725466'; 

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      await dbConnect();
      const { userId } = req.body;

      // Check if user is a member of the Telegram channel
      const checkMembership = await fetch(
        `https://api.telegram.org/bot${BOT_TOKEN}/getChatMember?chat_id=${CHANNEL_ID}&user_id=${userId}`
      );
      const membershipData = await checkMembership.json();

      if (!membershipData.ok) {
        console.error('Failed to check membership status:', membershipData.description);
        return res.status(500).json({
          message: 'Failed to check membership status. Please try again later.',
        });
      }

      const isMember =
        membershipData.result.status === 'member' ||
        membershipData.result.status === 'administrator' ||
        membershipData.result.status === 'creator';

      // Log membership status to the terminal
      console.log(`User ID ${userId} is ${isMember ? 'a member' : 'not a member'}`);

      res.status(200).json({ isMember });
    } catch (error) {
      console.error('Error checking membership status:', error.message);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
