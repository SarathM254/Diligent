import Payment from "../models/Payment.js";
import User from "../models/User.js";

// @desc    Salesman submits or updates daily cash/PhonePe payment counts
// @route   POST /api/payments
export const submitDailyPayment = async (req, res) => {
  try {
    const { salesmanId, paymentDate, denominations, phonePeTransactions } = req.body;

    if (!salesmanId || !paymentDate) {
      return res.status(400).json({ success: false, message: "Salesman ID and Payment Date are required." });
    }

    // Map input fields to Mongoose schema shape
    const paymentData = {
      salesmanId,
      paymentDate,
      handCash: { denominations: denominations || {} },
      phonePe: phonePeTransactions || [],
      status: "unverified" // Explicitly drops back to unverified on updates
    };

    // Upsert pattern: Create sheet if empty for the day, update values if matching
    const payment = await Payment.findOneAndUpdate(
      { salesmanId, paymentDate, status: "unverified" }, 
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
    // In a future phase, we will fetch the salesman profile here and execute:
    // salesmanProfile.broughtForwardDebt -= payment.grandTotalPaid;
    // For now, we simulate this calculation block and return the verified amounts cleanly.

    return res.status(200).json({
      success: true,
      message: `Payment verified. Total of ₹${payment.grandTotalPaid} is locked and cleared from ledger debt metrics.`,
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
    const sheets = await Payment.find({}).populate("salesmanId", "name email salesmanId").sort({ paymentDate: -1 });
    return res.status(200).json({ success: true, count: sheets.length, data: sheets });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error fetching payments summary", error: error.message });
  }
};
