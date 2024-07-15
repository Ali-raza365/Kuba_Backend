const router = require('express').Router();
const bookingCtrl = require('../controllers/bookingCtrl');

router.post('/booking/create', bookingCtrl.createBooking);
router.get('/booking/all', bookingCtrl.getAllBookings);
router.get('/booking/:id', bookingCtrl.getBookingById);
router.get('/dashboard/:hotelId', bookingCtrl.getDashboardData);
router.get('/booking/user/:userId', bookingCtrl.getBookingsByUserId);
router.get('/booking/hotel/:hotelId', bookingCtrl.getBookingsByHotelId);
router.get('/booking/status/:status', bookingCtrl.getBookingsByStatus);
router.post('/booking/paypal/payment', bookingCtrl.processPayPalPayment);
router.post('/booking/paypal/execute', bookingCtrl.executePayPalPayment);

module.exports = router;
