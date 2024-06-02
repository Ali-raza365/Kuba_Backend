const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model('chat', chatMessageSchema)