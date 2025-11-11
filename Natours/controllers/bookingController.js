const Razorpay = require('razorpay');
const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');

// initialize razorpay instance with your key_id and key_secret (load from env vars)
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_TEST_API_KEY,
  key_secret: process.env.RAZORPAY_TEST_API_SECRET,
});

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  console.log('entering chekout route');

  const tour = await Tour.findById(req.params.tourID);
  if (!tour) {
    return next(/* some error: tour not found */);
  }

  const amountInPaise = tour.price * 100; // Razorpay expects amount in paise if INR

  const options = {
    amount: amountInPaise,
    currency: 'INR',
    receipt: `tour_${Date.now()}`, // you can define your own receipt string
    // optionally notes: you can pass metadata
    notes: {
      tourName: tour.name,
      userEmail: req.user.email,
      tourId: tour.id,
    },
  };

  const order = await razorpay.orders.create(options);

  res.status(200).json({
    status: 'success',
    order, // send the order object to frontend
  });
});
