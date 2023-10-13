const MUser = require('../models/mUserModel');
const AppError = require('../util/appError');
const catchAsync = require('../util/catchAsync');
const crypto = require('crypto');

exports.createMuser = catchAsync(async (req, res, next) => {
  const username = crypto.randomBytes(32).toString('hex');
  const member = await MUser.create({
    key: username,
    subDate: req.body.subDate,
    expDate: req.body.expDate,
    credit: req.body.credit,
  });

  res.status(201).json({
    status: 'success',
    data: {
      member,
    },
  });
});

exports.updateMuser = catchAsync(async (req, res, next) => {
  const member = await MUser.findOne({ key: req.body.key });
  if (!member) {
    return next(new AppError('Member does not exist', 404));
  }
  const updatedMember = await MUser.findByIdAndUpdate({ _id: member._id }, req.body, { new: true });

  res.status(200).json({
    status: 'success',
    data: {
      updatedMember,
    },
  });
});

exports.debitmUser = catchAsync(async (req, res, next) => {
  const member = await MUser.findOne({ key: req.body.key });

  //debit user
  member.credit = member.credit - 1;
  await member.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    data: {
      member,
    },
  });
});

exports.getMuser = catchAsync(async (req, res, next) => {
  console.log(req.params.token);
  const member = await MUser.findOne({ key: req.params.token });

  if (!member) {
    return next(new AppError('Wrong key', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      member,
    },
  });
});
