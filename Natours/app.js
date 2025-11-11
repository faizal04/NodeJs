const express = require('express');
const path = require('path');
const userRouter = require('./routes/userRoutes');
const tourRouter = require('./routes/tourRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
dotenv.config({ path: './config.env' });
const app = express();
const morgan = require('morgan');
const AppError = require('./utils/appError');
const errorController = require('./controllers/errorController');
const rateLimit = require('express-rate-limit');
// const helmet = require('helmet');
const hpp = require('hpp');
//////////////////////MiddleWare
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
    limit: '10kb',
  }),
);
app.use(cookieParser());

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// serving static files
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
// app.use(
//   helmet({
//     contentSecurityPolicy: false,
//   }),
// );

// app.use(
//   helmet({
//     contentSecurityPolicy: {
//       useDefaults: true,
//       directives: {
//         'default-src': ["'self'"],
//         'script-src': ["'self'", 'https://unpkg.com'],
//         'style-src': ["'self'", 'https://unpkg.com', "'unsafe-inline'"],
//         'img-src': [
//           "'self'",
//           'data:',
//           'blob:',
//           'https://unpkg.com',
//           'https://*.tile.openstreetmap.org',
//           'https://*.openstreetmap.org',
//         ],
//         'connect-src': ["'self'"],
//         'font-src': ["'self'"],
//         'object-src': ["'none'"],
//       },
//     },
//   }),
// );

const limter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'too many requests from this IP, Please try again later',
});

app.use('/api', limter);
// app.use(mongoSanitize());
// app.use(xss());

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
app.use('/', viewRouter);

app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/booking', bookingRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(errorController);
module.exports = app;
