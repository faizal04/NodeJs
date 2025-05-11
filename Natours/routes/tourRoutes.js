// app.route('/api/v1/tours').get(GetAllTours).post(CreateTour);

// app
//   .route('/api/v1/tours/:id')
//   .get(GetTour)
//   .patch(UpdateTour)
//   .delete(DeleteTour);

const express = require('express');
const tourController = require('../controllers/tourControllers');

const router = express.Router();

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTour, tourController.GetAllTours);
router
  .route('/')
  .get(tourController.GetAllTours)
  .post(tourController.CreateTour);
router
  .route('/:id')
  .get(tourController.GetTour)
  .patch(tourController.UpdateTour)
  .delete(tourController.DeleteTour);

module.exports = router;
