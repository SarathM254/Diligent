import mongoose from "mongoose";

const ledgerTransactionSchema = new mongoose.Schema(
  {
    salesmanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    type: {
      type: String,
      required: true,
      enum: ["manual_add", "manual_subtract", "bill_delivery", "cash_payment_clearance"]
    },
    amount: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    previousBF: {
      type: Number,
      required: true
    },
    newBF: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

ledgerTransactionSchema.index({ salesmanId: 1, createdAt: -1 });

// Auto-delete records 20 days after they are created
ledgerTransactionSchema.index({ createdAt: 1 }, { expireAfterSeconds: 20 * 24 * 60 * 60 });

const LedgerTransaction = mongoose.model("LedgerTransaction", ledgerTransactionSchema);
export default LedgerTransaction;
