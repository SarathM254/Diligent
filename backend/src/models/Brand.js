import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    code: {
      type: String,
      required: true,
      unique: true // Ensures no two cigarette brands accidentally share the same identifier code
    },
    price: {
      wholesale: {
        type: Number,
        required: true
      },
      retail: {
        type: Number,
        required: true
      }
    }
  },
  {
    timestamps: true 
  }
);

const Brand = mongoose.model("Brand", brandSchema);

export default Brand;