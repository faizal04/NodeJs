const Review = require('../models/reviewModal');
const catchAsync = require('../utils/catchAsync');
const factoryHandler = require('./factoryHandler');
exports.getAllReviews = factoryHandler.getAll(Review);

exports.setTourAndUser = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user;
  console.log(req.body.user, req.body.tour);
  next();
};

exports.getReview = factoryHandler.getOne(Review);
exports.createReview = factoryHandler.createOne(Review);
exports.updateReview = factoryHandler.updateOne(Review);
exports.deleteReview = factoryHandler.deleteOne(Review);
