const HotelModel = require("../models/hotelModel");
const RoomModel = require("../models/roomModel");

const roomCtrl = {
    create: async (req, res) => {
        try {
            const newRoom = new RoomModel(req.body);
            const savedRoom = await newRoom.save();
            
            // Add the room to the hotel's rooms array
            await HotelModel.findByIdAndUpdate(req.body.hotelId, { $push: { rooms: savedRoom._id } });

            res.status(201).json(savedRoom); // Use 201 for created resources
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },
    getAll: async (req, res) => {
        try {
            const rooms = await RoomModel.find();
            res.json(rooms);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },
    getDetail: async (req, res) => {
        try {
            const { room_id } = req.params; // Use params instead of body
            if (!room_id) {
                return res.status(400).json({ message: 'Room ID is required' });
            }
            const room = await RoomModel.findById(room_id);
            if (!room) {
                return res.status(404).json({ message: 'Room not found' });
            }
            res.json(room);
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    },
    getByHotel: async (req, res) => {
        try {
            const { hotel_id } = req.params;
            if (!hotel_id) {
                return res.status(400).json({ message: 'Hotel ID is required' });
            }
            const rooms = await RoomModel.find({ hotelId: hotel_id });
            res.json(rooms);
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }
};

module.exports = roomCtrl;