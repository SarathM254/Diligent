import User from "../models/User.js";

// @desc    Get all salesmen profiles including their current BF balances
// @route   GET /api/users/salesmen
export const getAllSalesmen = async (req, res) => {
  try {
    const salesmen = await User.find({ role: "salesman" }).sort({ name: 1 });
    return res.status(200).json(salesmen);
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error fetching salesmen profiles", error: error.message });
  }
};

// @desc    Owner master control to unconditionally adjust a salesman's BF debt balance
// @route   PATCH /api/users/adjust-balance
export const adjustLedgerBalance = async (req, res) => {
  try {
    const { userId, amount } = req.body;

    if (!userId || amount === undefined) {
      return res.status(400).json({ success: false, message: "User ID and amount are required." });
    }

    const user = await User.findById(userId);
    if (!user || user.role !== "salesman") {
      return res.status(404).json({ success: false, message: "Salesman profile not found." });
    }

    const adjustmentAmount = Number(amount);
    user.broughtForwardDebt += adjustmentAmount;

    await user.save();

    return res.status(200).json({
      success: true,
      message: `Master override successful. Adjusted balance by ₹${adjustmentAmount}.`,
      data: user
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Balance adjustment failed", error: error.message });
  }
};

export const getAllOperators = async (req, res) => {
  try {
    const operators = await User.find({ role: "operator" }).sort({ name: 1 });
    return res.status(200).json(operators);
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error fetching operators", error: error.message });
  }
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, role, salesmanId } = req.body;
    
    if (!name || !email || !role) {
      return res.status(400).json({ success: false, message: "Name, email, and role are required." });
    }

    if (role === 'salesman' && !salesmanId) {
      return res.status(400).json({ success: false, message: "Salesman ID is required for salesmen." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already in use." });
    }

    const newUser = new User({
      name,
      email,
      role,
      salesmanId: role === 'salesman' ? salesmanId : undefined
    });

    await newUser.save();
    return res.status(201).json(newUser);
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to register user", error: error.message });
  }
};
