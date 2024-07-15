const Booking = require('../models/bookingModel');
const Room = require('../models/roomModel');
const Hotel = require('../models/hotelModel');
const User = require('../models/userModel');
const paypal = require('paypal-rest-sdk');
const mongoose = require('mongoose');
const moment = require('moment');

// PayPal configuration
paypal.configure({
    mode: 'sandbox', // 'sandbox' or 'live'
    client_id: process.env.PAYPAL_CLIENT_ID,
    client_secret: process.env.PAYPAL_CLIENT_SECRET
});

const bookingCtrl = {
    createBooking: async (req, res) => {
        try {
            const { hotelId, roomId, userId, startDate, endDate, totalPrice, adults, children, contactDetails, paymentMethod, paypalOrderId } = req.body;

            // Check if required fields are provided
            if (!hotelId || !roomId || !userId || !startDate || !endDate || !totalPrice || !contactDetails || !paymentMethod) {
                return res.status(400).json({ msg: "All required fields must be provided." });
            }

            // Check if hotel exists
            const hotel = await Hotel.findById(hotelId);
            if (!hotel) {
                return res.status(404).json({ msg: "Hotel not found." });
            }

            // Check if room exists
            const room = await Room.findById(roomId);
            if (!room) {
                return res.status(404).json({ msg: "Room not found." });
            }

            // Check if user exists
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ msg: "User not found." });
            }

            // Create new booking
            const newBooking = new Booking({
                hotel: hotelId,
                room: roomId,
                user: userId,
                startDate,
                endDate,
                totalPrice,
                adults,
                children,
                contactDetails,
                paymentMethod,
                paypalOrderId,
            });

            await newBooking.save();

            // Optionally, send a confirmation email
            // await sendEmail(contactDetails.email, 'Booking Confirmation', 'Your booking has been confirmed.');

            res.json({ msg: 'Booking created successfully!', booking: newBooking });

        } catch (err) {
            console.error(err);
            res.status(500).json({ msg: err.message });
        }
    },
    getAllBookings: async (req, res) => {
        try {
            const bookings = await Booking.find().populate('user').populate('hotel').populate('room');
            res.json(bookings);
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    getBookingById: async (req, res) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return res.status(400).json({ msg: "Invalid booking ID." });
            }

            const booking = await Booking.findById(req.params.id).populate('user').populate('hotel').populate('room');
            if (!booking) return res.status(404).json({ msg: 'Booking not found' });
            res.json(booking);
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    getBookingsByUserId: async (req, res) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
                return res.status(400).json({ msg: "Invalid user ID." });
            }

            const bookings = await Booking.find({ user: req.params.userId }).populate('hotel').populate('room');
            res.json(bookings);
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    getBookingsByHotelId: async (req, res) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(req.params.hotelId)) {
                return res.status(400).json({ msg: "Invalid hotel ID." });
            }

            const bookings = await Booking.find({ hotel: req.params.hotelId }).populate('user').populate('room');
            res.json(bookings);
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    getBookingsByStatus: async (req, res) => {
        try {
            const validStatuses = ['pending', 'booked', 'cancelled', 'completed'];
            if (!validStatuses.includes(req.params.status)) {
                return res.status(400).json({ msg: "Invalid booking status." });
            }

            const bookings = await Booking.find({ status: req.params.status }).populate('user').populate('hotel').populate('room');
            res.json(bookings);
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    processPayPalPayment: async (req, res) => {
        const { bookingId, paymentDetails } = req.body;

        if (!bookingId || !paymentDetails) {
            return res.status(400).json({ msg: "Booking ID and payment details are required." });
        }

        if (!mongoose.Types.ObjectId.isValid(bookingId)) {
            return res.status(400).json({ msg: "Invalid booking ID." });
        }

        const payment = {
            intent: 'sale',
            payer: {
                payment_method: 'paypal'
            },
            redirect_urls: {
                return_url: process.env.PAYPAL_RETURN_URL,
                cancel_url: process.env.PAYPAL_CANCEL_URL
            },
            transactions: [{
                amount: {
                    total: paymentDetails.amount,
                    currency: paymentDetails.currency
                },
                description: `Booking payment for booking ID: ${bookingId}`
            }]
        };

        paypal.payment.create(payment, function (error, payment) {
            if (error) {
                return res.status(500).json({ msg: error.response });
            } else {
                res.json(payment);
            }
        });
    },
    executePayPalPayment: async (req, res) => {
        const { paymentId, payerId, bookingId } = req.body;

        if (!paymentId || !payerId || !bookingId) {
            return res.status(400).json({ msg: "Payment ID, Payer ID, and Booking ID are required." });
        }

        if (!mongoose.Types.ObjectId.isValid(bookingId)) {
            return res.status(400).json({ msg: "Invalid booking ID." });
        }

        const execute_payment_json = {
            payer_id: payerId,
            transactions: [{
                amount: {
                    currency: 'USD',
                    total: req.body.amount
                }
            }]
        };

        paypal.payment.execute(paymentId, execute_payment_json, async function (error, payment) {
            if (error) {
                return res.status(500).json({ msg: error.response });
            } else {
                const booking = await Booking.findById(bookingId);
                if (!booking) return res.status(404).json({ msg: 'Booking not found' });
                booking.status = 'booked';
                await booking.save();
                res.json({ msg: 'Payment successful!', booking });
            }
        });
    },
    getDashboardData: async (req, res) => {
        try {
            const { hotelId } = req.params;

            if (!hotelId) {
                return res.status(400).json({ msg: "Hotel ID must be provided." });
            }

            // Check if hotel exists
            const hotelExists = await Hotel.exists({ _id: hotelId });
            if (!hotelExists) {
                return res.status(404).json({ msg: "Hotel not found." });
            }

            const today = moment().startOf('day');
            const endOfDay = moment().endOf('day');

            // Fetching the count of pending check-ins for the specific hotel
            const pendingCheckIns = await Booking.countDocuments({ hotel: hotelId, status: 'pending' });

            // Fetching the count of today's check-ins for the specific hotel
            const todayCheckIns = await Booking.countDocuments({
                hotel: hotelId,
                status: 'booked',
                startDate: { $gte: today.toDate(), $lt: endOfDay.toDate() }
            });

            const totalRooms = await Room.countDocuments({ hotelId: hotelId });
            // console.log(totalRooms)
            // Fetching the count of available rooms for the specific hotel
            const availableRooms = totalRooms - pendingCheckIns

            // Fetching the count of active bookings for the specific hotel
            const activeBookings = await Booking.countDocuments({ hotel: hotelId, status: 'booked' });

            res.json({
                pendingCheckIns,
                todayCheckIns,
                availableRooms,
                activeBookings
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ msg: err.message });
        }
    }
};

module.exports = bookingCtrl;
