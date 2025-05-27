// const express = require("express ")
const mongoose = require('mongoose');
const User = require('./userModel');
const TourSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      lowercase: true,
      minLength: [5, 'A tour must have greater then 5 characters'],
      maxLength: [40, 'A tour must have less or equal then 40 characters'],
    },
    ratingAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'A tour Rating must be above 1'],
      max: [5, 'A tour Rating must be below 5'],
    },
    duration: {
      type: Number,
      required: [true, 'this field is required'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A  tour must have Group Size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have Difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy medium or difficult',
      },
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: 'Price discount must be below price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: true,
    },

    price: { type: Number, required: true },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have image '],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        description: String,
        address: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
TourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});
TourSchema.virtual('weeks').get(function () {
  return this.duration / 7;
});
//doument middleware in mongoose run before save and create() to trigger it create a new tour
TourSchema.pre('save', function (next) {
  console.log('document', this.name);
  next();
});

//Query middleware
TourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});
// TourSchema.pre('save', async function (next) {
//   const guidePromise = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidePromise);

//   next();
// });
//aggregation middleware

TourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this.pipeline());
  next();
});
TourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
  next();
});
const Tour = mongoose.model('Tour', TourSchema);

module.exports = Tour;
