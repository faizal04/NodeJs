const AppError = require('../utils/appError');

const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    console.error('error');
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }

  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
    });
  }
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later',
  });
};
const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      errStack: err.stack,
      error: err,
    });
  }
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: err.message,
  });
};

const handleCastErrorDB = (error) => {
  const message = `Invalid ${error.path} :${error.value}`;
  return new AppError(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
  const value = err.message.match(/dup key: { name: "(.*?)" }/)[1];
  return new AppError(
    `Duplicate field value ${value}. please use different name`,
    404,
  );
};
const jsonTokenExp = () =>
  new AppError('Your Token is Expired ! Please Login Again', 401);
const jsonWebtokenError = () => {
  new AppError('Invalid Token Please Login Again', 401);
};
const hadleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors)
    .map((el) => el.message)
    .join(', ');

  return new AppError(`${errors}`, 400);
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = Object.create(err);
    if (error.name === 'CastError') {
      error = handleCastErrorDB(error);
    }

    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = hadleValidationErrorDB(error);

    if (error.name === 'JsonWebTokenError') error = jsonWebtokenError();

    if (error.name === 'TokenExpiredError') error = jsonTokenExp();
    sendErrorProd(error, req, res);
  }
};
