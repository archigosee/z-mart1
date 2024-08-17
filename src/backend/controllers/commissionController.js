import User from '../models/user';

export const updateCommission = async (userId, commissionamount) => {
  try {
    console.log(`Updating commission for user: ${userId} with amount: ${commissionamount}`);

    if (isNaN(commissionamount)) {
      throw new Error('Invalid commission amount: ' + commissionamount);
    }

    // Find the user by their userId
    let user = await User.findOne({ userId });

    if (user) {
      // If the user exists, update their commission
      user.commission = (user.commission || 0) + commissionamount;
      await user.save();
    } else {
      // If the user doesn't exist, create a new user with the initial commission
      await User.create({ userId, commission: commissionamount });
    }
  } catch (error) {
    console.error('Error updating commission:', error);
  }
};



// Function to get the commission for a specific user
export const getCommission = async (req, res) => {
  const { userId } = req.query;

  try {
    const user = await User.findOne({ userId });

    if (user) {
      res.status(200).json({ success: true, commission: user.commission || 0 });
    } else {
      res.status(404).json({ success: false, message: 'User not found', commission: 0 });
    }
  } catch (error) {
    console.error('Error fetching commission:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
