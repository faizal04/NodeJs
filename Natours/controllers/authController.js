const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const catchAsync = require('../utils/catchAsync');
const User = require('./../models/userModel');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JSON_SECRET, {
    expiresIn: process.env.JSON_EXP,
  });
};

const createSendToken = (statuscode, user, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.jwt_Cookie_Expires_In * 24 * 60 * 60 * 1000,
    ),
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
  };

  res.cookie('jwt', token, cookieOptions);
  user.password = undefined;
  res.status(statuscode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};
exports.signUp = catchAsync(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    passwordChangeAt: req.body.passwordChangeAt,
    role: req.body.role,
  });
  createSendToken(201, user, res);
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
  createSendToken(200, user, res);
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
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      next(new AppError('You are not Allowed to perform this task'), 403);
    }
    next();
  };
};
exports.forgetPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    next(new AppError('No User found with this email', 404));
  }
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  const resetURL = `${req.protocol}://$req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

  const message = `forget you password? reset it here :${resetURL}\n If you didn't request this, ignore it.`;
  console.log(user.email);
  try {
    await sendEmail({
      email: user.email,
      subject: 'Your Password reset Token (valid for 10 mins)',
      message,
    });
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email',
    });
  } catch (err) {
    console.log('ERROR', err);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        'There was an error sending the email Try again later ',
        500,
      ),
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  console.log('token', hashedToken);
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    // passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Invalid token or the time is expired', 400));
  }
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;

  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  token = this.signToken(user._id);
  createSendToken(200, user, res);

  //  logging the user in
});
exports.changePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  const correct = await user.comparePassword(
    req.body.currentPassword,
    user.password,
  );
  if (!correct) {
    return next(new AppError('Invalid Current Password'));
  }

  user.password = req.body.newpassword;
  user.confirmPassword = req.body.newconfirmPassword;

  await user.save();
  createSendToken(200, user, res);
});
