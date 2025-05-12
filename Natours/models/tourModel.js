// const express = require("express ")
const mongoose = require('mongoose');
const TourSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
    },
    ratingAverage: {
      type: Number,
      default: 4.5,
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
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    priceDiscount: Number,
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
  },

  {
    toJSON: { virtauls: true },
    toObject: { virtual: true },
  },
);
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

//aggregation middleware

TourSchema.pre('aggregate', function (next) {
  console.log('this is the aggregation part ');
  next();
});

const Tour = mongoose.model('Tour', TourSchema);

module.exports = Tour;
