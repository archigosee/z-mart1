import dbConnect from '../../../backend/config/dbConnect';
import User from '../../../backend/models/user';
import axios from 'axios';

const botToken = "7350305630:AAEsjUdDvgDlsXhToZel8NoI3SCxpv5lIrE";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { message } = req.body;

    if (!message || !message.chat || !message.from || !message.text) {
      return res.status(400).json({ success: false, message: 'Invalid request' });
    }

    const chatId = message.chat.id;
    const userId = message.from.id;
    const text = message.text;

    await dbConnect();

    if (text === '/start') {
      // Create a unique invite link
      const inviteLink = `https://t.me/waganextbot?start=${userId}`;

      // Send request to get the phone number and show invite link
      const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

      const requestPhoneNumberMessage = {
        chat_id: chatId,
        text: `Please share your phone number to continue:\nHere is your unique invitation link: ${inviteLink}`,
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
    } else if (text.startsWith('/start')) {
      // Handle join via invite link
      const inviterUserId = text.split(' ')[1];

      if (inviterUserId) {
        try {
          // Check if the user has already joined via an invite link or is already a member
          const user = await User.findOne({ userId });
          if (user && (user.hasJoinedViaInvite || user.phoneNumber)) {
            return res.status(200).json({ success: true, message: 'You have already joined or are already a member' });
          }

          // Award points to the inviter
          const inviter = await User.findOneAndUpdate(
            { userId: inviterUserId },
            { $inc: { points: 1000 } },
            { new: true }
          );

          if (inviter) {
            const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
            const thankYouMessage = {
              chat_id: inviterUserId,
              text: `Congratulations! You've earned 1000 points for inviting a friend.`,
            };

            await axios.post(apiUrl, thankYouMessage);
          }

          // Mark the user as having joined via an invite link
          await User.findOneAndUpdate(
            { userId },
            { hasJoinedViaInvite: true },
            { new: true }
          );

          return res.status(200).json({ success: true, message: 'User joined via invite link' });
        } catch (error) {
          console.error('Error handling join via invite link:', error);
          return res.status(500).json({ success: false, message: 'Failed to handle invite link' });
        }
      }

      return res.status(200).json({ success: true, message: 'Command received' });
    } else {
      return res.status(200).json({ success: true, message: 'Command received' });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}
