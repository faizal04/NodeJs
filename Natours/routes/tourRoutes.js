// app.route('/api/v1/tours').get(GetAllTours).post(CreateTour);

// app
//   .route('/api/v1/tours/:id')
//   .get(GetTour)
//   .patch(UpdateTour)
//   .delete(DeleteTour);

const express = require('express');
const tourController = require('../controllers/tourControllers');
const authController = require('./../controllers/authController.js');

const router = express.Router();
router.route('/tour-stats').get(tourController.getTourStats);

router.route('/monthly-plan/:year').get(tourController.tourPlan);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTour, tourController.GetAllTours);
router
  .route('/')
  .get(authController.protect, tourController.GetAllTours)
  .post(tourController.CreateTour);
router
  .route('/:id')
  .get(tourController.GetTour)
  .patch(tourController.UpdateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.DeleteTour,
  );

module.exports = router;
