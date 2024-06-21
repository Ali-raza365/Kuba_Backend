
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
        const hotels = await HotelModel.find();
        res.json(hotels);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    },
    getDetail: async (req, res) => {
      try {
        const {hotel_id} =req.body
        const hotel = await HotelModel.findById(hotel_id);
        if (!hotel) {
          return res.status(404).json({ message: 'Hotel not found' });
        }
        res.json(hotel);
      } catch (err) {
        return res.status(500).json({ message: err.message });
      }
    }
}

module.exports = hotelCtrl