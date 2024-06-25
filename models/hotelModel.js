const mongoose = require('mongoose')

const addressSchema = new mongoose.Schema({
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
  });

const hotelSchema  = new mongoose.Schema({
      name: {
        type: String,
        required: true,
        trim: true,
      },
      address: {
        type: addressSchema,
        required: true,
      },
      rating: {
        type: Number,
        min: 0,
        max: 5,
      },
      images: [String],
      rooms: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Room',
        },
      ],
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      favorites: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
      featured : {
        type: Boolean,
        default: Date.now
    },
      amenities: [String], // e.g., ["pool", "gym", "spa"]
      description: String,
    },
       {
    timestamps: true
})


module.exports = mongoose.model('Hotel', hotelSchema)
