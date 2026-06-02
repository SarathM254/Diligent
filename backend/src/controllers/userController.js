import User from "../models/User.js";

// @desc    Get all salesmen profiles including their current BF balances
// @route   GET /api/users/salesmen
export const getAllSalesmen = async (req, res) => {
  try {
    const salesmen = await User.find({ role: "salesman" }).sort({ name: 1 });
    return res.status(200).json({ success: true, count: salesmen.length, data: salesmen });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error fetching salesmen profiles", error: error.message });
  }
};

// @desc    Owner master control to unconditionally adjust a salesman's BF debt balance
// @route   PATCH /api/users/adjust-balance
export const adjustLedgerBalance = async (req, res) => {
  try {
    const { salesmanId, action, amount } = req.body;

    if (!salesmanId || !action || amount === undefined) {
      return res.status(400).json({ success: false, message: "Salesman ID, action (add/subtract), and amount are required." });
    }

    const user = await User.findById(salesmanId);
    if (!user || user.role !== "salesman") {
      return res.status(404).json({ success: false, message: "Salesman profile not found." });
    }

    const adjustmentAmount = Number(amount);
    if (action === "add") {
      user.broughtForwardDebt += adjustmentAmount;
    } else if (action === "subtract") {
      user.broughtForwardDebt -= adjustmentAmount;
    } else {
      return res.status(400).json({ success: false, message: "Invalid action. Must be 'add' or 'subtract'." });
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: `Master override successful. Adjusted balance by ${action === "add" ? "+" : "-"}₹${adjustmentAmount}.`,
      data: user
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Balance adjustment failed", error: error.message });
  }
};
