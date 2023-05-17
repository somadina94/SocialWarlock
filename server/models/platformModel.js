const mongoose = require("mongoose");

const platformShema = new mongoose.Schema(
  {
    name: {
      type: String,
      enum: ["Facebook", "Instagram", "LinkedIn"],
    },
    price: {
      type: Number,
      required: [true, "Product must have a price"],
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const Platform = mongoose.model("Platform", platformShema);

module.exports = Platform;
