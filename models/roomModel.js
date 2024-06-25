const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel',
      required: true,
    },
    roomNumber: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    features: [String],
    description: String,
    images: [String],
  },
  {
    timestamps: true,
  });
  
  module.exports = mongoose.model('Room', roomSchema);
  
