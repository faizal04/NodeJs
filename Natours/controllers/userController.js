const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const multer = require('multer');
const factoryHandler = require('./factoryHandler');
const sharp = require('sharp');
//reference

// const multerStorage = multer.diskStorage({
//   destination: (req, file, callback) => {
//     callback(null, 'public/img/users');
//   },
//   filename: (req, file, callback) => {
//     const ext = file.mimetype.split('/')[1];
//     callback(null, `user-${req.user._id}-${Date.now()}.${ext}`);
//   },
// });
const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, callback) => {
  if (file.mimetype.startsWith('image')) {
    callback(null, true);
  } else {
    callback(new AppError('Please Upload an image', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
exports.uploadPhoto = upload.single('photo');

exports.resizeUserPhoto = (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `user-${req.user._id}-${Date.now()}.jpeg`;
  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);
  next();
};
exports.updateMe = catchAsync(async (req, res, next) => {
  console.log('File:', req.file);
  console.log('Body:', req.body);

  // 1. Block password updates through this route
  if (req.body.password || req.body.confirmPassword) {
    return next(new AppError('This route is not for updating password.', 400));
  }

  // 2. Pick only allowed fields
  const allowedFields = ['name', 'email'];
  const filterBody = {};

  Object.keys(req.body).forEach((key) => {
    if (allowedFields.includes(key)) {
      filterBody[key] = req.body[key];
    }
  });

  // 3. If a photo is uploaded, manually add it
  if (req.file) {
    filterBody.photo = req.file.filename;
  }

  console.log('Filtered Body:', filterBody);

  // 4. Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user._id, filterBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    message: 'Your profile has been updated.',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  const user = req.user.id;
  await User.findByIdAndUpdate(user, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
    message: 'account successfully deactivated',
  });
});
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route not defined// visit to the singup route',
  });
};

exports.getme = (req, res, next) => {
  req.params.id = req.user._id;

  next();
};

exports.getUser = factoryHandler.getOne(User, { path: 'reviews' });
exports.getAllUser = factoryHandler.getAll(User);
exports.updateUser = factoryHandler.updateOne(User);
exports.deleteUser = factoryHandler.deleteOne(User);
