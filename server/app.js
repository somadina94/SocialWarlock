const express = require("express");
const cors = require("cors");
const AppError = require("./util/appError");
const globalErrorHandler = require("./controllers/errorController");
const productRouter = require("./routes/productRoutes");
const userRouter = require("./routes/userRoutes");
const orderRouter = require("./routes/orderRoutes");
const platformRouter = require("./routes/platformRoutes");
const paymentRouter = require("./routes/paymentRoutes");
const helmet = require("helmet");
const compression = require("compression");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");
const paymentController = require("./controllers/paymentController");

const app = express();

app.use(helmet());

const limiter = rateLimit({
  max: 50,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this ip address, try again in 1hour.",
});
app.use("/api", limiter);

app.use(express.json());

app.use(
  "/webhook",
  express.raw({ type: "application/json" }),
  paymentController.webhookResponse
);

// {
//   verify: (req, res, buf) => {
//     const url = req.originalUrl;
//     if (url.startsWith("api/v1/payment/webhook")) {
//       req.rawBody = buf.toString();
//     }
//   },
// }

app.use(cors());

// Data sanitization against NOSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

app.use(compression());

app.use("/api/v1/products", productRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/platform", platformRouter);
app.use("/api/v1/payment", paymentRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
