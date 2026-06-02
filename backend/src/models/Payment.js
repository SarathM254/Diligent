import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    salesmanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    paymentDate: {
      type: String, // Stored as 'YYYY-MM-DD' to lock it to the operational day
      required: true
    },
    handCash: {
      denominations: {
        500: { type: Number, default: 0, min: 0 },
        200: { type: Number, default: 0, min: 0 },
        100: { type: Number, default: 0, min: 0 },
        50: { type: Number, default: 0, min: 0 },
        20: { type: Number, default: 0, min: 0 },
        10: { type: Number, default: 0, min: 0 }
      },
      totalHandCash: {
        type: Number,
        default: 0
      }
    },
    phonePe: [
      {
        transactionId: { type: String, trim: true }, // Optional reference tracking string
        amount: { type: Number, required: true, min: 0 }
      }
    ],
    totalPhonePeCash: {
      type: Number,
      default: 0
    },
    grandTotalPaid: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      required: true,
      enum: ["unverified", "verified"],
      default: "unverified"
    }
  },
  { 
    timestamps: true 
  }
);

// Enforce unique cash settlement sheet per salesman per day
paymentSchema.index({ salesmanId: 1, paymentDate: 1 }, { unique: true });

// Pre-save middleware to automatically handle denomination multiplication and totals
paymentSchema.pre("save", function () {
  // 1. Calculate Hand Cash from counts
  const denoms = this.handCash.denominations;
  this.handCash.totalHandCash = 
    (denoms[500] * 500) +
    (denoms[200] * 200) +
    (denoms[100] * 100) +
    (denoms[50] * 50) +
    (denoms[20] * 20) +
    (denoms[10] * 10);

  // 2. Calculate PhonePe Total from transaction array
  if (this.phonePe && this.phonePe.length > 0) {
    this.totalPhonePeCash = this.phonePe.reduce((sum, tx) => sum + tx.amount, 0);
  } else {
    this.totalPhonePeCash = 0;
  }

  // 3. Compute Grand Total Combined Cash
  this.grandTotalPaid = this.handCash.totalHandCash + this.totalPhonePeCash;
});

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
