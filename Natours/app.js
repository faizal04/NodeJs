const express = require('express');
const userRouter = require('./routes/userRoutes');
const tourRouter = require('./routes/tourRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const dotenv = require('dotenv');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
dotenv.config({ path: './config.env' });
const app = express();
const morgan = require('morgan');
const AppError = require('./utils/appError');
const errorController = require('./controllers/errorController');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const hpp = require('hpp');
//////////////////////MiddleWare
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
app.use(express.json());
// app.use((req, res, next) => {
//   console.log('hellow from the middleware');
//   next();
// });
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
app.use(helmet());
const limter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'too many requests from this IP, Please try again later',
});
app.use('/api', limter);
app.use(mongoSanitize());
app.use(xss());

app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);
//mount routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(errorController);
module.exports = app;
//  will do tomorrow
