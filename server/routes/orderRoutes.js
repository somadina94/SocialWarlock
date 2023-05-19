const express = require("express");
const orderController = require("../controllers/orderController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router
  .route("/")
  .get(orderController.getAllOrdersUser)
  .post(orderController.createOrder);

router.get("/admin", orderController.getAllOrdersAdmin);

router
  .route("/:id")
  .get(orderController.getOneOrder)
  .patch(authController.restrictTo("admin"), orderController.updateOder)
  .delete(authController.restrictTo("admin"), orderController.deleteOder);

router.use(authController.restrictTo("admin"));

router.patch("/approveOrder/:id", orderController.approveOrder);

module.exports = router;
