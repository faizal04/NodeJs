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

exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if ((!lat, !lng)) {
    next(
      new AppError(
        'Please provide latitude and longitude int the formate lat,lng',
        400,
      ),
    );
  }

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours,
    },
  });
});

exports.getDistances = catchAsync(async (req, res, next) => {
  console.log('hellow from getdistances');
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;
  if ((!lat, !lng)) {
    next(
      new AppError(
        'Please provide latitude and longitude int the formate lat,lng',
        400,
      ),
    );
  }
  const distance = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier,
      },
    },
    { $project: { distance: 1, name: 1 } },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      data: distance,
    },
  });
});
