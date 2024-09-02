import mongoose from 'mongoose';
import { nanoid } from 'nanoid';

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String, required: true },
});

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
    default: () => nanoid(7), // Generate a unique 7-character orderId
  },
  userId: { type: String, required: true },
  orderItems: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  commissionamount: { type: Number, required: true },
  address: { type: String },  // Added address field
  phoneNumber: { type: String },  // Added phone number field
  paymentStatus: {
    type: String,
    default: 'Pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Order || mongoose.model('Order', orderSchema);
