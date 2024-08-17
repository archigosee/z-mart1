// backend/controllers/pointsController.js
import User from "../models/user";

// Get total points for the user
export const getPoints = async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ success: false, message: "User ID is required" });
  }

  try {
    // Find the user by userId (string)
    let user = await User.findOne({ userId });

    // If the user is not found, create a new user with 0 points
    if (!user) {
      user = new User({
        userId,
        points: 0,
      });
      await user.save();
    }

    res.status(200).json({ success: true, points: user.points });
  } catch (error) {
    console.error("Error fetching points:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Update points for the user
export const updatePoints = async (req, res) => {
  const { userId, points } = req.body;

  if (!userId) {
    return res.status(400).json({ success: false, message: "User ID is required" });
  }

  try {
    // Find the user by userId (string)
    let user = await User.findOne({ userId });

    // If the user is not found, create a new user with the initial points
    if (!user) {
      user = new User({
        userId,
        points: points || 0,
      });
    } else {
      // Add points to the user's existing points
      user.points = (user.points || 0) + points;
    }

    // Save the updated or newly created user
    await user.save();

    res.status(200).json({ success: true, points: user.points });
  } catch (error) {
    console.error("Error updating points:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
