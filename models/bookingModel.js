const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true,
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['booked', 'free', 'pending'],
    default: 'pending',
  },
  adults: {
    type: Number,
    required: true,
    default: 1,
  },
  children: {
    type: Number,
    required: true,
    default: 0,
  },
  contactDetails: {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'paypal', 'credit_card'],
    required: true,
  },
  paypalOrderId: {
    type: String,
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);
