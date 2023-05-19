const User = require("../models/userModel");
const AppError = require("../util/appError");
const catchAsync = require("../util/catchAsync");

exports.createUser = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(201).json({
    status: "success",
    message: "New user created successfully.",
    data: { user },
  });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find({ role: "user" });

  if (!users) {
    return next(new AppError("No users were found.", 404));
  }

  res.status(200).json({
    status: "success",
    count: users.length,
    data: {
      users,
    },
  });
});

exports.getOneUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id).populate("orders");

  if (!user) {
    return next(new AppError("No user found with that ID."));
  }

  res.status(200).json({
    status: "success",
    data: { user },
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new AppError("No user found with that ID.", 404));
  }

  res.status(200).json({
    status: "success",
    message: "User account updated successfully.",
    data: {
      user,
    },
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: "success",
  });
});

exports.blockUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { active: false },
    { new: true }
  );

  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    message: "User blocked successfully.",
  });
});

exports.unblockUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { active: true },
    { new: true }
  );

  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    message: "User unblocked successfully.",
  });
});
