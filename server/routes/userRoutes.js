const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .post(userController.createUser)
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    userController.getAllUsers
  );

router.post("/signUp", authController.signUp);
router.post("/loginUser", authController.loginUser);
router.post("/loginAdmin", authController.loginAdmin);
router.post("/logout", authController.logout);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassowrd);
router.patch(
  "/updatePassword",
  authController.protect,
  authController.updatePassword
);

router.use(authController.protect);

router
  .route("/:id")
  .patch(userController.updateUser)
  .get(userController.getOneUser)
  .delete(authController.restrictTo("admin"), userController.deleteUser);

module.exports = router;
