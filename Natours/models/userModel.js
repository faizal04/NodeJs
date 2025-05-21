const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please tell us your name'],
  },
  email: {
    type: String,
    required: [true, 'please provide email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'please provide a valid email'],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    minLength: 8,
    required: [true, 'please provide a password'],
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, 'please confirm your password'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Password doesnt match',
    },
  },
  passwordChangeAt: Date,
});

userSchema.pre('save', async function (req, res, next) {
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});
userSchema.methods.comparePassword = async function (
  inputPassword,
  userPassword,
) {
  return await bcrypt.compare(inputPassword, userPassword);
};

userSchema.methods.passwordChangeCheck = function (JWTTimeStamp) {
  if (this.passwordChangeAt) {
    const changeTimeStamp = parseInt(this.passwordChangeAt.getTime() / 1000);
    console.log(JWTTimeStamp, changeTimeStamp);
    return JWTTimeStamp < changeTimeStamp;
  }
  return false;
};
const User = mongoose.model('User', userSchema);
module.exports = User;
