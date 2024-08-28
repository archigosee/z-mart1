import Order from '../models/order';
import axios from 'axios';
import { updateCommission } from './commissionController';

export const newOrder = async (req, res) => {
  const { userId, orderItems, totalAmount, commissionamount } = req.body;

  console.log('Request body:', req.body);

  try {
    const order = await Order.create({
      userId,
      orderItems,
      totalAmount,
      commissionamount,
      paymentStatus: 'Pending',
    });

    console.log('Created order:', order);

    await updateCommission(userId, commissionamount);
    await sendOrderNotificationToTelegram(userId, order);

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(400).json({ success: false, message: 'Order creation failed' });
  }
};

const sendOrderNotificationToTelegram = async (userId, order) => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = userId;
  const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

  const message = `
    🛒 *Order Confirmation*\n
    Order ID: ${order._id}\n
    Total Amount: $${order.totalAmount}\n
    Payment Status: ${order.paymentStatus}\n
    Commission: ${order.commissionamount}\n\n
    *Order Items:*\n${order.orderItems.map(item => `- ${item.name} (${item.quantity}x): $${item.price}`).join('\n')}
  `;

  console.log('Message to send:', message);

  try {
    await axios.post(apiUrl, {
      chat_id: chatId,
      text: message,
      parse_mode: "Markdown",
    });
  } catch (error) {
    console.error("Error sending order notification to Telegram:", error);
  }
};

export const getOrders = async (req, res) => {
  const { userId } = req.query;

  try {
    // Fetch orders based on the userId
    const orders = await Order.find({ userId }).sort({ createdAt: -1 }); // Sort by creation date, newest first
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
};
