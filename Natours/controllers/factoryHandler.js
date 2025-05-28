const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
// exports.DeleteTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndDelete(req.params.id);
//   if (!tour) {
//     return next(new AppError('No Data found with this ID', 404));
//   }
//   res.status(204).json({
//     status: 'success',
//     data: null,
//   });
// });

exports.deleteOne = (Modal) =>
  catchAsync(async (req, res, next) => {
    const doc = await Modal.findByIdAndDelete(req.params.id);
    if (!Modal) {
      return next(new AppError('No Docunent found with this ID', 404));
    }
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
