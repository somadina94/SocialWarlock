const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    cart: {
      type: Array,
      required: [true, "An order must have a cart"],
    },
    products: {
      type: Array,
      required: [true, "An order must have a product"],
    },
    totalQuantity: {
      type: Number,
      required: [true, "An order must have a total quantity."],
    },
    totalPrice: {
      type: Number,
      required: [true, "An order must have a total price."],
    },
    status: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Order must belong to a user"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// orderSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: "platform",
//     select: "name price",
//   });

//   next();
// });

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
