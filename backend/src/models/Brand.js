import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    code: {
      type: String,
      required: false,
    },
    wholesalePrice: {
      type: Number,
      required: true
    },
    retailPrice: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true 
  }
);

const Brand = mongoose.model("Brand", brandSchema);

export default Brand;