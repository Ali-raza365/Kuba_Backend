
const HotelModel = require('../models/hotelModel')
const mongoose = require('mongoose');

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
    upload: async (req, res) => {
        try {
            if (!req.imageUrls || req.imageUrls.length === 0) {
                return res.status(400).send('No files uploaded.');
            }
              const imageUrls = req.imageUrls
            //   const imageUrls = req.imageUrls.map(imageUrl => `${req.protocol}://${req.get('host')}/${imageUrl}`);
            res.status(200).json({ imageUrls });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },
    getHotelsByCreatedBy: async (req, res) => {
        try {
            const { user_id } = req.params;
            if (!user_id) {
                return res.status(400).json({ message: 'User ID is required' });
            }

            if (!mongoose.Types.ObjectId.isValid(user_id)) {
                return res.status(400).json({ message: 'Invalid user id value' });
            }

            const hotels = await HotelModel.find({ createdBy: user_id });
            res.json(hotels);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },
    getHotelsByAddress: async (req, res) => {
        try {
            const { city, country ,name ,search} = req.query;

            const query = {};
            // if (city) {
            //     query['address.city'] = { $regex: new RegExp(city, 'i') };
            // }
            // if (country) {
            //     query['address.country'] = { $regex: new RegExp(country, 'i') };
            // }
            // if (name) {
            //     query['name'] = { $regex: new RegExp(name, 'i') };
            // }

                query['address.city'] = { $regex: new RegExp(search, 'i') };
                query['address.country'] = { $regex: new RegExp(search, 'i') };
                query['name'] = { $regex: new RegExp(search, 'i') };

            const hotels = await HotelModel.find({
                $or: [
                    { 'address.city': query['address.city'] },
                    { 'address.country': query['address.country'] },
                    { 'name': query['name'] }
                ]
            });
            res.json(hotels);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },
}

module.exports = hotelCtrl