const express = require('express');
const viewController = require('./../controllers/viewsController');

const router = express.Router();
router.get('/', (req, res) => {
  res.status(200).render('index', {
    tour: 'the forest hiker',
    User: 'Faisal Harray',
  });
});

router.get('/overview', viewController.getOverview);
router.get('/tour', viewController.getTour);
module.exports = router;
