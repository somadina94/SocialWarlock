const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const AppError = require("../util/appError");
const catchAsync = require("../util/catchAsync");
const Email = require("../util/email");
const coinbase = require("coinbase-commerce-node");

const Client = coinbase.Client;
const clientObj = Client.init(process.env.COINBASE_API_KEY);
clientObj.setRequestTimeout(10000);
const resources = coinbase.resources;
const webhook = coinbase.Webhook;

exports.checkout = catchAsync(async (req, res, next) => {
  const { totalPrice, totalQuantity } = req.body;

  const charge = await resources.Charge.create({
    name: "Test Charge",
    description: "Test Charge Description",
    local_price: {
      amount: totalPrice,
      currency: "USD",
    },
    pricing_type: "fixed_price",
    metadata: {
      totalPrice,
      totalQuantity,
    },
  });

  res.status(200).json({
    status: "success",
    charge,
  });
});

exports.webhookResponse = catchAsync(async (req, res, next) => {
  console.log("calling");
  const event = webhook.verifyEventBody(
    req.rawBody,
    req.headers["x-cc-webhook-signature"],
    process.env.COINBASE_WEBHOOK_SECRET
  );
  console.log(event.data);

  if (event.type === "charge:confirmed") {
    let amount = event.data.pricing.local.amount;
    let currency = event.data.pricing.local.currency;
    let metaData = event.data.metadata;

    console.log(amount, currency, metaData);
  }

  //   res.status(200);
});
