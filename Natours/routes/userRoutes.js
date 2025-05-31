const express = require('express');
const userController = require('../controllers/userController.js');
const authController = require('./../controllers/authController.js');

const router = express.Router();
router.post('/signup', authController.signUp);
router.post('/login', authController.login);
router.post('/forgetpassword', authController.forgetPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.use(authController.protect);

router.patch('/updateMe', authController.protect, userController.updateMe);
router.patch('/changePassword', authController.changePassword);
router.delete('/deleteMe', userController.deleteMe);
router.route('/me').get(userController.getme, userController.getUser);

router.use(authController.restrictTo('admin'));
router
  .route('/')
  .get(userController.getAllUser)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

// router.get(
//   '/me',
//   authController.protect,
//   userController.getme,
//   userController.getUser,
// );

module.exports = router;
