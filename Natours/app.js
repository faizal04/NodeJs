//responses using express
// const fs = require('fs');

// app.get("/", (req, res) => {
//   res
//     .status(200)
//     .json({ message: "hellow world from server side", app: "natours" });
// });

// app.post("/", (req, res) => {
//   res.send("hellow post request from server EXPRESS ");
// });

///////////////////// APi Creation of Tours
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`),
// );
// /////////////////Route Operations
// const GetAllTours = (req, res) => {
//   res.status(200).json({
//     status: 'success',
//     requestedAt: req.requestTime,
//     result: tours.length,
//     data: {
//       tours: tours,
//     },
//   });
// };

// const GetTour = (req, res) => {
//   // console.log(req.params);

//   const id = +req.params.id;
//   const tour = tours.find((el) => el.id === id);
//   if (!tour) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID',
//     });
//   }

//   res.status(200).json({
//     status: 'success',
//     data: { tour },
//   });
// };

// const DeleteTour = (req, res) => {
//   if (req.params.id * 1 > tours.length - 1) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID',
//     });
//   }

//   res.status(204).json({
//     status: 'success',
//     data: null,
//   });
// };
// const UpdateTour = (req, res) => {
//   console.log(req.params);
//   if (req.params.id * 1 > tours.length - 1) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID',
//     });
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour: '<Updated Tour here..>',
//     },
//   });
// };
// const CreateTour = (req, res) => {
//   const newTour = req.body;
//   tours.push(Object.assign({ id: tours.length }, newTour));
//   fs.writeFile(
//     `${__dirname}/dev-data/data/tours-simple.json`,
//     JSON.stringify(tours),
//     (err) => {
//       if (err) throw new Error('Data could not be submitted');
//     },
//   );
//   res.send('Data Added Successfully');
// };

// const getAllUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'Route not defined',
//   });
// };
// const getUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'Route not defined',
//   });
// };
// const createUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'Route not defined',
//   });
// };
// const updateUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'Route not defined',
//   });
// };
// const deleteUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'Route not defined',
//   });
// };
// app.get('/api/v1/tours', GetAllTours);
// app.get('/api/v1/tours/:id', GetTour);
// app.post('/api/v1/tours', CreateTour);
// app.patch('/api/v1/tours/:id', UpdateTour);
// app.delete('/api/v1/tours/:id', DeleteTour);

//////////////////////////Routes
// app.route('/api/v1/tours').get(GetAllTours).post(CreateTour);

// app
//   .route('/api/v1/tours/:id')
//   .get(GetTour)
//   .patch(UpdateTour)
//   .delete(DeleteTour);

// app.route('/api/v1/users').get(getAllUser).post(createUser);

// app
//   .route('/api/v1/users/:id')
//   .get(getUser)
//   .patch(updateUser)
//   .delete(deleteUser);

///////////////Server Starting
// const port = 3000;
// app.listen(port, () => {
//   console.log('server is Starting' + port);
// });

//////app.js
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
app.use((req, res, next) => {
  console.log('hellow from the middleware');
  next();
});
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
app.use(helmet());
const limter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
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
