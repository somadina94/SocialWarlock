const User = require("../models/userModel");
const AppError = require("../util/appError");
const catchAsync = require("../util/catchAsync");
const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const Email = require("../util/email");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, req, res, message) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expiresIn: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    message: message,
    token,
    data: {
      user,
    },
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const adminEmail = {
    email: process.env.ADMIN_EMAIL,
    name: "Admin Social Warlock",
  };

  await new Email(newUser).sendWelcome();

  await new Email(adminEmail).sendNewMember();

  const message = "Signed up successfully.";

  createSendToken(newUser, 201, req, res, message);
});

exports.loginUser = catchAsync(async (req, res, next) => {
  // 1) Get user entered login details
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide your email and password", 401));
  }

  // 2) Check if user exists
  const user = await User.findOne({ email: email }).select("+password");

  // 3) Check if role is admin
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password"));
  }

  // 4) Check if password is correct.
  if (user.role === "admin") {
    return next(new AppError("Wrong url, try admin url", 401));
  }

  // 5) Login user and send Token
  const message = "Logged in successfully.";
  createSendToken(user, 200, req, res, message);
});

exports.loginAdmin = catchAsync(async (req, res, next) => {
  // 1) Get user entered login details
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide your email and password", 401));
  }

  // 2) Check if user exists
  const user = await User.findOne({ email: email }).select("+password");

  // 3) Check if role is user
  if (user.role === "user") {
    return next(new AppError("Wrong url, try user url", 401));
  }

  // 4) Check if password is correct.
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password"));
  }

  // 5) Login user and send Token
  const message = "Welcome Administrator.";
  createSendToken(user, 200, req, res, message);
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Check if token exists and get token
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("Access denied, please login to get access.", 401)
    );
  }

  // 2) Check if token is valid
  const decodedJWT = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findOne({ _id: decodedJWT.id });

  // 3) Check if user still exists
  if (!currentUser) {
    return next(new AppError("User no longer exists", 401));
  }

  // 4) Check if user recently changed password.
  if (currentUser.changedPasswordAfterJWT(decodedJWT.iat)) {
    return next(
      new AppError(
        "You recently changed password, please login again to be granted access."
      )
    );
  }

  // All being set, grant access to protected route.
  req.user = currentUser;
  next();
});

exports.logout = (req, res) => {
  const token = "loggedout";
  res.cookie("jwt", token, {
    expiresIn: 1000,
  });
  res.status(200).json({
    status: "success",
    message: "Goodbye, see you next time, goodluck",
    token,
  });
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("Access denied", 403));
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user with posted email
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError("Email not registered with us.", 404));
  }

  // 2) Create random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send resetToken to user's email
  try {
    const url = `https://www.provbm.com/resetPassword/${resetToken}`;

    await new Email(user, url).sendPasswordReset();

    res.status(200).json({
      status: "success",
      message: "Password reset url sent to your email!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        "There was an error sending the email, try again later!",
        500
      )
    );
  }
});

exports.resetPassowrd = catchAsync(async (req, res, next) => {
  // 1) Get random reset token from user and get user with it
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpires: { $gt: Date.now() },
  });

  // 2) If token has not expired and there is user, set the new pin
  if (!user) {
    return next(new AppError("Token is invalid or has expired.", 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;

  // 3) update changedPasswordAt property for the user with pre-save middleware
  await user.save();

  // 4) Log the user in, send jwt
  const message = "Password changed successfully.";
  createSendToken(user, 200, req, res, message);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user._id).select("+password");
  // 2) Check if posted current pin is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Your current password is wrong.", 401));
  }
  if (req.body.password !== req.body.passwordConfirm) {
    return next(
      new AppError(
        "Your new password and confirm new password are not the same",
        401
      )
    );
  }
  // 3) If correct, update pin
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  // 4) log user in, send jwt
  const message = "Password changed successfully.";
  createSendToken(user, 200, req, res, message);
});
