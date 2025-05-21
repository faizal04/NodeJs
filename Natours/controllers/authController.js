const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const { sign } = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const User = require('./../models/userModel');
const AppError = require('../utils/appError');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JSON_SECRET, {
    expiresIn: process.env.JSON_EXP,
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    passwordChangeAt: req.body.passwordChangeAt,
  });
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
    data: user,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = await req.body;
  if (!email || !password) {
    return next(new AppError('Please Enter Email and Password', 400));
  }
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password, user.password))) {
    return next(new AppError('Invalid Email or Password', 401));
  }
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new AppError('You are not Logged in! Pleasse log in to get access ', 401),
    );
  }

  const decoded = await jwt.verify(token, process.env.JSON_SECRET);
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    next(
      new AppError('The user beloging to this token does no longer exist', 401),
    );
  }
  if (freshUser.passwordChangeCheck(decoded.iat)) {
    next(
      new AppError('User recently changed the password! Please login again'),
    );
  }
  req.user = freshUser;
  next();
});
