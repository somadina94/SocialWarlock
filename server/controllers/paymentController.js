const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const AppError = require('../util/appError');
const Platfrom = require('../models/platformModel');
const catchAsync = require('../util/catchAsync');
const Email = require('../util/email');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

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
        } else {
        }
        counter++;
      });
    });
  };
  await checkPrice();

  let charge;

  try {
    charge = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      success_url: `https://social.jahbyte.com`,
      cancel_url: `https://social.jahbyte.com`,
      customer_email: req.user.email,
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Order checkout',
            },
            unit_amount: totalPrice * 100,
          },
          quantity: totalQuantity,
        },
      ],
      metadata: {
        userId: String(req.user._id),
        totalPrice: String(totalPrice),
        totalQuantity: String(totalQuantity),
        cart: JSON.stringify(cart), // MUST stringify objects
      },
    });

    // console.log('CHARGE:', charge);
  } catch (err) {
    console.error('COINBASE ERROR');
    console.error(err?.response?.data || err);
  }

  if (!charge) {
    return next(
      new AppError('There was an error creating the charge. Please try again later.', 500)
    );
  }

  res.status(200).json({
    status: 'success',
    data: {
      charge,
    },
  });
});

exports.webhookResponse = async (req, res, next) => {
  const signature = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.metadata;
    const metaData = event.data.object.metadata;
    const cart = JSON.parse(metaData.cart);
    const totalQuantity = metaData.totalQuantity;
    const user = metaData.userId;
    const totalPrice = metaData.totalPrice;

    const platforms = cart.map((el) => {
      const data = {
        id: el.id,
        quantity: el.quantity,
        name: el.name,
      };

      return data;
    });

    // if (event.type === 'charge:confirmed') {
    //   const metaData = event.data.metadata;
    //   const cart = JSON.parse(metaData.cart);
    //   const totalQuantity = metaData.totalQuantity;
    //   const user = metaData.user;
    //   const totalPrice = metaData.totalPrice;

    //   const platforms = cart.map((el) => {
    //     const data = {
    //       id: el.id,
    //       quantity: el.quantity,
    //       name: el.name,
    //     };

    //     return data;
    //   });

    // let totalPrice = 0;
    // const checkPrice = () => {
    //   return new Promise((resolve, reject) => {
    //     let counter = 0;
    //     platforms.forEach(async (el) => {
    //       const response = await Platfrom.findById(el.id);
    //       const price = response.price * el.quantity;
    //       totalPrice += price;
    //       if (counter === platforms.length - 1) {
    //         resolve();
    //       }
    //       counter++;
    //     });
    //   });
    // };

    // await checkPrice();

    const makeOrder = () => {
      return new Promise((resolve, reject) => {
        let counter = 0;
        let purchased = [];
        platforms.forEach(async (el) => {
          const productsArray = await Product.find({
            status: true,
            active: true,
          });

          const filteredByName = productsArray.filter((doc) => doc.platform.name === el.name);

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

            // await deleteProduct();

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
      name: 'Admin Social Warlock',
    };

    await new Email(adminEmail).sendNewOrder();
  }

  res.sendStatus(200);
};
