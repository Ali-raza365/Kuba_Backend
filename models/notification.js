const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
      },
      type: {
        type: String,
        default: 'normal',
      },
      message: {
        type: String,
        required: true
      },
      timestamp: {
        type: Date,
        default: Date.now
      },
      notifiydata:{},
      status: {
        type: String,
        enum: ['unread', 'read'],
        default: 'unread'
      }
  }
);


module.exports = mongoose.model('notification', notificationSchema)