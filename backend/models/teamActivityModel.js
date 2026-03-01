const mongoose = require('mongoose');

const teamActivitySchema = mongoose.Schema(
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
      // Optional
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('TeamActivity', teamActivitySchema);
