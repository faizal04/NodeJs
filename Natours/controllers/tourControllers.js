const AppError = require('../utils/appError');
const Tour = require('./../models/tourModel');
const APIfeatures = require('./../utils/apiFeatures');
const factoryHandler = require('./factoryHandler');

const catchAsync = require('./../utils/catchAsync');

exports.aliasTopTour = (req, res, next) => {
  req.query.limit = '100';
  req.query.sort = '-ratingAverage,price';
  req.query.fields = 'name,price,ratingAverage,summary,difficulty';
  next();
};

exports.GetTour = factoryHandler.getOne(Tour, {
  path: 'reviews',
});

exports.GetAllTours = factoryHandler.getAll(Tour);
exports.deleteTour = factoryHandler.deleteOne(Tour);
exports.UpdateTour = factoryHandler.updateOne(Tour);
exports.CreateTour = factoryHandler.createOne(Tour);

exports.getTourStats = catchAsync(async (req, res, next) => {
  const tourStats = await Tour.aggregate([
    { $match: { ratingAverage: { $gte: 4.5 } } },
    {
      $group: {
        _id: '$difficulty',
        total: { $sum: 1 },
        numRating: { $sum: '$ratingsQuantity' },
        minPrice: { $min: '$price' },
        avgPrice: { $avg: '$price' },
      },
    },
    {
      $sort: { total: 1 },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      tourStats,
    },
  });
});

exports.tourPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  console.log(year);

  const plan = await Tour.aggregate([
    { $unwind: '$startDates' },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { month: { $month: '$startDates' }, name: '$name' },
        price: { $sum: '$price' },
        total: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: { month: '$_id.month' },

        documents: {
          $push: { name: '$_id.name', price: '$price', total: { $sum: 1 } },
        },
        totalTours: { $sum: 1 },
        subTotalPrice: { $sum: '$price' },
      },
    },
    { $sort: { '_id.month': 1 } },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});
