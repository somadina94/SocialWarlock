const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const AppError = require("../util/appError");
const Platfrom = require("../models/platformModel");
const catchAsync = require("../util/catchAsync");
const Email = require("../util/email");
const coinbase = require("coinbase-commerce-node");

const Client = coinbase.Client;
const clientObj = Client.init(process.env.COINBASE_API_KEY);
clientObj.setRequestTimeout(10000);
const resources = coinbase.resources;
const webhook = coinbase.Webhook;

exports.checkout = catchAsync(async (req, res, next) => {
  const { cart, totalQuantity } = req.body;

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

  const charge = await resources.Charge.create({
    name: "Order checkout",
    description: "Social account purchase Charge",
    local_price: {
      amount: totalPrice,
      currency: "USD",
    },
    pricing_type: "fixed_price",
    metadata: {
      totalPrice,
      totalQuantity,
      cart,
      user: req.user._id,
    },
  });

  res.status(200).json({
    status: "success",
    data: {
      charge,
    },
  });
});

exports.webhookResponse = async (req, res, next) => {
  const event = webhook.verifyEventBody(
    req.rawBody,
    req.headers["x-cc-webhook-signature"],
    process.env.COINBASE_WEBHOOK_SECRET
  );

  if (event.type === "charge:confirmed") {
    const metaData = event.data.metadata;
    const cart = JSON.parse(metaData.cart);
    const totalQuantity = metaData.totalQuantity;
    const user = metaData.user;

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
          const productsArray = await Product.find({
            status: true,
            active: true,
          });

          const filteredByName = productsArray.filter(
            (doc) => doc.platform.name === el.name
          );

          const [...quantityPurchased] = filteredByName.slice(0, el.quantity);
          quantityPurchased.forEach((el) => purchased.push(el));
          const data = {
            user,
            totalPrice,
            cart,
            totalQuantity,
            products: purchased,
          };
          if (counter === platforms.length - 1) {
            const order = await Order.create(data);

            const { products } = order;

            const deleteProduct = () => {
              return new Promise((resolve, reject) => {
                let counter = 0;
                products.forEach(async (el) => {
                  await Product.findByIdAndUpdate(el._id, { active: false });
                  if (counter === products.length - 1) {
                    resolve();
                  }
                  counter++;
                });
              });
            };

            await deleteProduct();

            order.status = true;
            await order.save({ validateBeforeSave: false });

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
  }

  res.sendStatus(200);
};
