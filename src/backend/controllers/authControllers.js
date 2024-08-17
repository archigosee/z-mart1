// src/backend/controllers/authController.js
import User from "../models/user";

export const registerUser = async (req, res) => {
  try {
    const { name, userId } = req.body; // Ensure the correct destructuring of req.body

    // Validate presence of required fields
    if (!name || !userId) {
      return res.status(400).json({ success: false, message: "Name and userId are required." });
    }

    // Check if the user already exists
    let user = await User.findOne({ userId });
    if (user) {
      return res.status(400).json({ message: "User already registered." });
    }

    // Create a new user
    user = await User.create({ name, userId });
    res.status(201).json({ success: true, user });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
