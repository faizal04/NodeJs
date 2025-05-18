const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllUser = catchAsync(async (req, res) => {
  const user = await User.find();
  res.status(200).json({
    status: 'success',
    users: user,
  });
});
exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route not defined',
  });
};
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route not defined',
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route not defined',
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route not defined',
  });
};
