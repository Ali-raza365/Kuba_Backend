
const HotelModel = require('../models/hotelModel')

const hotelCtrl = {
    create: async (req, res) => {
        try {
          const newHotel = new HotelModel(req?.body);
          const savedHotel = await newHotel.save();
          res.json(savedHotel);
          } catch (err) {
            res.status(500).json({ message: err.message });
          }
    },
    getAll: async (req, res) => {
      try {
          const hotels = await HotelModel.find().populate('rooms');
          res.json(hotels);
      } catch (err) {
          res.status(500).json({ message: err.message });
      }
  },
  getDetail: async (req, res) => {
      try {
          const { hotel_id } = req.body; // Use params instead of body
          if (!hotel_id) {
              return res.status(400).json({ message: 'Hotel ID is required' });
          }
          const hotel = await HotelModel.findById(hotel_id).populate('rooms');
          if (!hotel) {
              return res.status(404).json({ message: 'Hotel not found' });
          }
          res.json(hotel);
      } catch (err) {
          return res.status(500).json({ message: err.message });
      }
  },
  getFeaturedHotels: async (req, res) => {
    try {
        const featuredHotels = await HotelModel.find({ featured: true }).populate('rooms');;
        res.json(featuredHotels);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
},
}

module.exports = hotelCtrl