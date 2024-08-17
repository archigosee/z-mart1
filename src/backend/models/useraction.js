// models/UserAction.js
import mongoose from 'mongoose';

const UserActionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  points: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.UserAction || mongoose.model('UserAction', UserActionSchema);
