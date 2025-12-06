const express = require('express');
const viewController = require('./../controllers/viewsController');
const authController = require('./../controllers/authController');
const bookingController = require('./../controllers/bookingController');

const router = express.Router();

router.get(
  '/',
  bookingController.createBookingCheckout,
  authController.isLoggedIn,
  viewController.getOverview,
);
router.get('/tour/:slug', authController.isLoggedIn, viewController.getTour);
router.get('/login', authController.isLoggedIn, viewController.getLoginForm);
router.get('/signup', authController.isLoggedIn, viewController.getSignupForm);

router.get('/me', authController.protect, viewController.getMyAccount);
router.get('/my-tours', authController.protect, viewController.getmyTour);
router.get(
  '/checkout/:tourId',
  authController.protect,
  viewController.getCheckoutPage,
);
module.exports = router;
