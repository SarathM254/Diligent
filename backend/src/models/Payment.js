import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    salesmanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    paymentDate: {
      type: String, 
      required: true
    },
    cashBreakdown: {
      type: Object,
      default: {}
    },
    totalHandCash: {
      type: Number,
      default: 0
    },
    phonePeAmount: {
      type: Number,
      default: 0
    },
    totalPayment: {
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

paymentSchema.index({ salesmanId: 1, paymentDate: 1 }, { unique: true });

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
