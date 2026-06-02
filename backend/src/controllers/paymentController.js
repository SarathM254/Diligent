import Payment from "../models/Payment.js";
import User from "../models/User.js";

// @desc    Salesman submits or updates daily cash/PhonePe payment counts
// @route   POST /api/payments
export const submitDailyPayment = async (req, res) => {
  try {
    let { cashBreakdown, totalHandCash, phonePeAmount, totalPayment } = req.body;

    // Fallback salesmanId if not provided by frontend (since no login)
    let salesmanId = req.body.salesmanId;
    if (!salesmanId) {
      const defaultUser = await User.findOne({ role: 'salesman' });
      salesmanId = defaultUser ? defaultUser._id : null;
    }
    
    const paymentDate = new Date().toISOString().split('T')[0];

    // Map input fields to Mongoose schema shape
    const paymentData = {
      salesmanId,
      paymentDate,
      cashBreakdown: cashBreakdown || {},
      totalHandCash: totalHandCash || 0,
      phonePeAmount: phonePeAmount || 0,
      totalPayment: totalPayment || 0,
      status: "unverified"
    };

    const existingPayment = await Payment.findOne({ salesmanId, paymentDate });
    if (existingPayment && existingPayment.status === "verified") {
      return res.status(400).json({ 
        success: false, 
        message: "Payment for today has already been verified and locked by the owner." 
      });
    }

    // Upsert pattern: Create sheet if empty for the day, update values if matching
    const payment = await Payment.findOneAndUpdate(
      { salesmanId, paymentDate }, 
      paymentData,
      { new: true, upsert: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Daily payment metrics logged successfully.",
      data: payment
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: "Error processing payment entry. Sheet may be locked/verified.", 
      error: error.message 
    });
  }
};

// @desc    Owner verifies payment and adjusts the Salesman's outstanding ledger balance
// @route   PATCH /api/payments/:id/verify
export const verifyPaymentByOwner = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the targeted unverified payment document
    const payment = await Payment.findById(id);
    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment entry sheet not found." });
    }

    if (payment.status === "verified") {
      return res.status(400).json({ success: false, message: "This payment collection has already been verified and adjusted." });
    }

    // Change status to locked/verified
    payment.status = "verified";
    await payment.save();

    // INTERVIEW RELEVANT BUSINESS LOGIC: 
    // Deduct the verified payment amount from the salesman's BF debt
    const salesman = await User.findById(payment.salesmanId);
    if (salesman) {
      salesman.broughtForwardDebt -= payment.totalPayment;
      await salesman.save();
    }

    return res.status(200).json({
      success: true,
      message: `Payment verified. Total of ₹${payment.totalPayment} is locked and cleared from ledger debt metrics.`,
      data: payment
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Verification execution failed", error: error.message });
  }
};

// @desc    Get individual payment data dashboard for Owner views
// @route   GET /api/payments/admin/pending
export const getPendingPaymentsForAdmin = async (req, res) => {
  try {
    const sheets = await Payment.find({ status: 'unverified' }).populate("salesmanId", "name");
    const mapped = sheets.map(p => ({
      _id: p._id,
      salesmanName: p.salesmanId ? p.salesmanId.name : 'Unknown',
      totalPayment: p.totalPayment,
      status: p.status,
      totalHandCash: p.totalHandCash,
      phonePeAmount: p.phonePeAmount
    }));
    return res.status(200).json(mapped);
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error fetching payments summary", error: error.message });
  }
};
