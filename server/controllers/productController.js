const Product = require("../models/productModel");
const AppError = require("../util/appError");
const catchAsync = require("../util/catchAsync");

exports.createProduct = catchAsync(async (req, res, next) => {
  const product = await Product.create(req.body);

  if (!product) {
    return next(new AppError("Couldn't create product", 400));
  }

  res.status(201).json({
    status: "success",
    message: "Product created successfully.",
    data: {
      product,
    },
  });
});

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find();

  if (!products) {
    return next(new AppError("Couldn't find products.", 404));
  }

  res.status(200).json({
    status: "success",
    count: products.length,
    data: {
      products,
    },
  });
});

exports.getOneProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError("No product found with that ID.", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json({
    status: "success",
    message: "Product update successfully.",
    data: {
      product,
    },
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return next(new AppError("Couldn't find any product with that ID.", 404));
  }

  res.status(204).json({
    status: "success",
  });
});

exports.approveProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { status: true },
    { new: true }
  );

  if (!product) {
    return next(new AppError("Couldn't find any product with that ID.", 404));
  }

  res.status(200).json({
    status: "success",
    message: `${product.name} product activated successfully.`,
    data: {
      product,
    },
  });
});
