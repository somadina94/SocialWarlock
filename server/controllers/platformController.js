const Platform = require("../models/platformModel");
const AppError = require("../util/appError");
const catchAsync = require("../util/catchAsync");

exports.createPlatform = catchAsync(async (req, res, next) => {
  const platform = await Platform.create(req.body);

  res.status(201).json({
    status: "success",
    message: "Platform created successfully.",
    data: {
      platform,
    },
  });
});

exports.getAllPlatforms = catchAsync(async (req, res, next) => {
  const platforms = await Platform.find();

  res.status(200).json({
    status: "success",
    data: {
      platforms,
    },
  });
});

exports.getOnePlatform = catchAsync(async (req, res, next) => {
  const platform = await Platform.findById(req.params.id);

  if (!platform) {
    return next(new AppError("No platform found with that ID.", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      platform,
    },
  });
});

exports.updatePlatform = catchAsync(async (req, res, next) => {
  const platform = await Platform.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json({
    status: "success",
    message: `${platform.name} platform updated successfully.`,
    data: {
      platform,
    },
  });
});

exports.deletePlatform = catchAsync(async (req, res, next) => {
  const platform = await Platform.findByIdAndDelete(req.params.id);

  if (!platform) {
    return next(new AppError("No platform found with that ID,", 404));
  }

  res.status(204).json({
    status: "success",
  });
});
