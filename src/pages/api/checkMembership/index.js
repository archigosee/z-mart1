export default async function handler(req, res) {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  const TELEGRAM_BOT_TOKEN = '7350305630:AAEsjUdDvgDlsXhToZel8NoI3SCxpv5lIrE';
  const TELEGRAM_CHANNEL_ID = '@dz_ech'; // Example: '@your_channel_id'

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getChatMember?chat_id=${TELEGRAM_CHANNEL_ID}&user_id=${userId}`
    );
    const data = await response.json();

    // Log the API response for debugging
    console.log('Telegram API Response:', data);

    if (!data.ok) {
      return res.status(500).json({ message: 'Failed to check membership', error: data.description });
    }

    const isMember =
      data.result.status === 'member' ||
      data.result.status === 'administrator' ||
      data.result.status === 'creator';

    res.json({ isMember });
  } catch (error) {
    console.error('Error checking Telegram membership:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
