const express = require("express");
const platformController = require("../controllers/platformController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    platformController.createPlatform
  )
  .get(platformController.getAllPlatforms);

router.use(authController.protect, authController.restrictTo("admin"));

router
  .route("/:id")
  .get(platformController.getOnePlatform)
  .patch(platformController.updatePlatform)
  .delete(platformController.deletePlatform);

module.exports = router;
