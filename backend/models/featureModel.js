const mongoose = require('mongoose');

const featureSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    imageUrl: {
      type: String,
      required: [true, 'Please add an image URL'],
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Feature', featureSchema);
