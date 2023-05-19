const express = require("express");
const productController = require("../controllers/productController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect, authController.restrictTo("admin"));

router
  .route("/")
  .post(productController.createProduct)
  .get(productController.getAllProducts);

router
  .route("/:id")
  .get(productController.getOneProduct)
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct);

router.patch("/approve/:id", productController.approveProduct);

module.exports = router;
