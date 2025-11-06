const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
exports.getOverview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});
exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });
  if (!tour) {
    return next(new AppError('No Tour Found with that name', 404));
  }

  res.status(200).render('tour', {
    title: tour.name,
    tour,
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your Account',
  });
};

exports.getMyAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your Account',
  });
};

// exports.updateUser = catchAsync(async (req, res, next) => {
//   console.log(req.body);
//   console.log(req.user);
//   const updatedUser = await User.findByIdAndUpdate(
//     req.user._id,
//     {
//       name: req.body.name,
//       email: req.body.email,
//     },
//     {
//       new: true,
//       runValidators: true,
//     },
//   );
//   console.log('updatedUSer', updatedUser);
//   res.status(200).render('account', {
//     title: 'Your Account',
//     user: updatedUser,
//   });
// });
