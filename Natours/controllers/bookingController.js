const Razorpay = require('razorpay');
const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const Booking = require('../models/bookingModel');

// initialize razorpay instance with your key_id and key_secret (load from env vars)
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_TEST_API_KEY,
  key_secret: process.env.RAZORPAY_TEST_API_SECRET,
});

// controllers/bookingController.js
exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.tourID);

  if (!tour) {
    return next(new AppError('Tour not found', 404));
  }

  // Create Razorpay Payment Link (hosted checkout page)
  const paymentLink = await razorpay.paymentLink.create({
    amount: tour.price * 100, // Amount in paise
    currency: 'INR',
    description: `Booking for ${tour.name}`,
    customer: {
      name: req.user.name,
      email: req.user.email,
    },
    notify: {
      sms: false,
      email: true,
    },
    reminder_enable: true,
    notes: {
      tourId: tour.id,
      userId: req.user.id,
      tourName: tour.name,
    },
    callback_url: `${req.protocol}://${req.get('host')}/?tour=${req.params.tourID}&user=${req.user._id}&price=${tour.price}`,
    callback_method: 'get',
  });

  res.status(200).json({
    status: 'success',
    paymentUrl: paymentLink.short_url, // Send URL to frontend
  });
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  const { tour, user, price } = req.query;
  console.log(tour, user, price);
  if (!tour && !user && !price) return next();
  await Booking.create({ tour, user, price });
  res.redirect(req.originalUrl.split('?')[0]);
});
