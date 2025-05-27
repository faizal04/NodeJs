const AppError = require('../utils/appError');
const Tour = require('./../models/tourModel');
const APIfeatures = require('./../utils/apiFeatures');

const catchAsync = require('./../utils/catchAsync');

exports.aliasTopTour = (req, res, next) => {
  req.query.limit = '100';
  req.query.sort = '-ratingAverage,price';
  req.query.fields = 'name,price,ratingAverage,summary,difficulty';
  next();
};

exports.GetAllTours = catchAsync(async (req, res, next) => {
  const features = new APIfeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limit()
    .paginate();

  const tours = await features.query;

  res.status(200).json({
    status: 'success',
    result: tours.length,
    data: {
      tours,
    },
  });
});

exports.GetTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id).populate('reviews');
  if (!tour) {
    return next(new AppError('No Data found with this ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

exports.DeleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  if (!tour) {
    return next(new AppError('No Data found with this ID', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
exports.UpdateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!tour) {
    return next(new AppError('No Data found with this ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

exports.CreateTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
});

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
