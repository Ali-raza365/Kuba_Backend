const router = require('express').Router()
const hotelCtrl = require('../controllers/hotelCtrl')

router.post('/create', hotelCtrl.create);
router.get('/', hotelCtrl.getAll);
router.post('/info', hotelCtrl.getDetail);
router.get('/featured', hotelCtrl.getFeaturedHotels);

module.exports = router