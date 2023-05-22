const express = require("express");
const paymentController = require("../controllers/paymentController");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/checkout", paymentController.checkout);

router.post("/webhook", paymentController.webhookResponse);

module.exports = router;
