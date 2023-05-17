const express = require("express");
const platformController = require("../controllers/platformController");

const router = express.Router();

router
  .route("/")
  .post(platformController.createPlatform)
  .get(platformController.getAllPlatforms);

router
  .route("/:id")
  .get(platformController.getOnePlatform)
  .patch(platformController.updatePlatform)
  .delete(platformController.deletePlatform);

module.exports = router;
