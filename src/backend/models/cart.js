import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  quantity: { type: Number, required: true },
  stock: { type: Number, required: true },
  seller: { type: String, required: true },
  commission: { type: Number, required: true, default: 0 }, // Added commission field
});

const cartSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [cartItemSchema],
});

export default mongoose.models.Cart || mongoose.model('Cart', cartSchema);
