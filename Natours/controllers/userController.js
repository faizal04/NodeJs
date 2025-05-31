const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factoryHandler = require('./factoryHandler');

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.confirmPassword)
    return next(new AppError('this Route is not for updating password', 400));

  const allowedFieds = ['email', 'name'];
  const filterBody = {};
  Object.keys(req.body).forEach((key) => {
    if (allowedFieds.includes(key)) {
      filterBody[key] = req.body[key];
    }
  });

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    message: 'your profile has been updated',
    data: {
      updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  const user = req.user.id;
  await User.findByIdAndUpdate(user, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
    message: 'account successfully deactivated',
  });
});
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route not defined// visit to the singup route',
  });
};

exports.getme = (req, res, next) => {
  req.params.id = req.user._id;

  next();
};

exports.getUser = factoryHandler.getOne(User, { path: 'reviews' });
exports.getAllUser = factoryHandler.getAll(User);
exports.updateUser = factoryHandler.updateOne(User);
exports.deleteUser = factoryHandler.deleteOne(User);
