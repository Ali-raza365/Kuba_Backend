const router = require('express').Router()
const hotelCtrl = require('../controllers/hotelCtrl');
const uploadMiddleware = require('../middleware/upload');

router.post('/hotel/create', hotelCtrl.create);
router.get('/hotel/all', hotelCtrl.getAll);
router.post('/hotel/info', hotelCtrl.getDetail);
router.get('/hotel/featured', hotelCtrl.getFeaturedHotels);
router.post('/upload', uploadMiddleware,hotelCtrl.upload);
router.get('/hotel/user/:user_id', hotelCtrl.getHotelsByCreatedBy);
router.get('/hotel/search', hotelCtrl.getHotelsByAddress);


module.exports = router