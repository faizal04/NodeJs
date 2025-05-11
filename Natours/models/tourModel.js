// const express = require("express ")
const mongoose = require('mongoose');
const TourSchema = mongoose.Schema({
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
});
const Tour = mongoose.model('Tour', TourSchema);

module.exports = Tour;
