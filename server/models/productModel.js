const mongoose = require("mongoose");
const validator = require("validator");

const productSchema = new mongoose.Schema(
  {
    createdAt: {
      type: Date,
      default: Date.now,
    },
    username: {
      type: String,
      unique: true,
      required: [true, "Please provide the email or username of product."],
    },
    password: {
      type: String,
      required: [true, "Please provide the password of product."],
    },
    platform: {
      type: mongoose.Schema.ObjectId,
      ref: "Platform",
      required: [true, "Please provide the platform the product belongs to."],
    },
    status: {
      type: Boolean,
      default: true,
    },
    recoveryEmail: {
      type: String,
      lowercase: true,
      validate: [
        validator.isEmail,
        "Please provide a valid recovery email for product.",
      ],
    },
    recoveryPassword: {
      type: String,
      required: [
        true,
        "Please provide a recovery password for the for product recovery email.",
      ],
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "platform",
    select: "name price",
  });

  next();
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
