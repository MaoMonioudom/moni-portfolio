const mongoose = require('mongoose');

const bannerSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
    },
    subtitle: {
      type: String,
      required: false,
      default: '',
    },
    imageUrl: {
      type: String,
      required: [true, 'Please add an image'],
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Banner', bannerSchema);
