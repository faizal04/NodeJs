// app.route('/api/v1/tours').get(GetAllTours).post(CreateTour);

// app
//   .route('/api/v1/tours/:id')
//   .get(GetTour)
//   .patch(UpdateTour)
//   .delete(DeleteTour);

const express = require('express');
const tourController = require('../controllers/tourControllers');
const authController = require('./../controllers/authController.js');
const reviewRouter = require('../routes/reviewRoutes.js');
const router = express.Router();
router.route('/tour-stats').get(tourController.getTourStats);

router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.tourPlan,
  );

router.use('/:tourId/reviews', reviewRouter);
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTour, tourController.GetAllTours);
router
  .route('/')
  .get(tourController.GetAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.CreateTour,
  );
router
  .route('/:id')
  .get(tourController.GetTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.UpdateTour,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour,
  );

module.exports = router;
