// backend/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true, // Ensure the userId is always stored
    unique: true, // Ensure uniqueness
  },
  firstName: String,
  lastName: String,
  username: String,
  languageCode: String,
  points: {
    type: Number,
    default: 0,
  },
  commission: {
    type: Number,
    default: 0, // Store the commission earned by the user
  },
  isPremium: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.models.User || mongoose.model("User", userSchema);
