import dbConnect from '../../../backend/config/dbConnect';
import User from '../../../backend/models/User';
import axios from 'axios';

const botToken ="7350305630:AAEsjUdDvgDlsXhToZel8NoI3SCxpv5lIrE";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: 'Invalid request' });
    }

    const chatId = message.chat.id;
    const userId = message.from.id;
    const text = message.text;

    await dbConnect();

    if (text === '/start') {
      // Send request to get the phone number
      const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

      const requestPhoneNumberMessage = {
        chat_id: chatId,
        text: 'Please share your phone number to continue:',
        reply_markup: {
          one_time_keyboard: true,
          keyboard: [
            [
              {
                text: 'Share Phone Number',
                request_contact: true, // Request contact details (phone number)
                one_time_keyboard: true,
              },
            ],
          ],
        },
      };

      try {
        await axios.post(apiUrl, requestPhoneNumberMessage);
        return res.status(200).json({ success: true, message: 'Phone number requested' });
      } catch (error) {
        console.error('Error sending message:', error);
        return res.status(500).json({ success: false, message: 'Failed to send message' });
      }
    } else if (message.contact) {
      // Handle the shared phone number
      const phoneNumber = message.contact.phone_number;

      try {
        // Update or create the user with the phone number
        await User.findOneAndUpdate(
          { userId },
          { phoneNumber },
          { upsert: true, new: true }
        );

        return res.status(200).json({ success: true, message: 'Phone number saved successfully' });
      } catch (error) {
        console.error('Error saving phone number:', error);
        return res.status(500).json({ success: false, message: 'Failed to save phone number' });
      }
    } else {
      return res.status(200).json({ success: true, message: 'Command received' });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}
