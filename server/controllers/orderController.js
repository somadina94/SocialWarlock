const Order = require("../models/orderModel");
const Platfrom = require("../models/platformModel");
const Product = require("../models/productModel");
const AppError = require("../util/appError");
const catchAsync = require("../util/catchAsync");
const Email = require("../util/email");

exports.createOrder = catchAsync(async (req, res, next) => {
  const cart = req.body.cart;

  const platforms = cart.map((el) => {
    const data = {
      id: el.id,
      quantity: el.quantity,
      name: el.name,
    };

    return data;
  });

  let totalPrice = 0;
  const checkPrice = () => {
    return new Promise((resolve, reject) => {
      let counter = 0;
      platforms.forEach(async (el) => {
        const response = await Platfrom.findById(el.id);
        const price = response.price * el.quantity;
        totalPrice += price;
        if (counter === platforms.length - 1) {
          resolve();
        }
        counter++;
      });
    });
  };

  await checkPrice();

  const makeOrder = () => {
    return new Promise((resolve, reject) => {
      let counter = 0;
      let purchased = [];
      platforms.forEach(async (el) => {
        const productsArray = await Product.find();

        const filteredByName = productsArray.filter(
          (doc) => doc.platform.name === el.name
        );

        const [quantityPurchased] = filteredByName.slice(0, el.quantity);
        purchased.push(quantityPurchased);
        const data = {
          user: req.user._id,
          totalPrice,
          cart,
          totalQuantity: req.body.totalQuantity,
          products: purchased,
        };
        if (counter === platforms.length - 1) {
          await Order.create(data);
          resolve();
        }
        counter++;
      });
    });
  };

  await makeOrder();

  const adminEmail = {
    email: process.env.ADMIN_EMAIL,
    name: "Admin Social Warlock",
  };

  await new Email(adminEmail).sendNewOrder();

  res.status(201).json({
    status: "success",
    message:
      "Order successfully created, we will approve your order as soon as we receive your payment. Thanks for your order🤝",
  });
});

exports.getAllOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find();

  res.status(200).json({
    status: "success",
    count: orders.length,
    data: {
      orders,
    },
  });
});

exports.updateOder = catchAsync(async (req, res, next) => {
  const updatedOder = await Order.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!updatedOder) {
    return next(new AppError("Order does not exist!", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Order successfully updated!",
    data: {
      order: updatedOder,
    },
  });
});

exports.getOneOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError("Order was not found", 401));
  }

  res.status(200).json({
    status: "success",
    data: {
      order,
    },
  });
});

exports.deleteOder = catchAsync(async (req, res, next) => {
  const order = await Order.findByIdAndDelete(req.params.id);

  if (!order) {
    return next(new AppError("Order was not found", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
