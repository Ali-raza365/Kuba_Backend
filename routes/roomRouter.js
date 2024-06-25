const router = require('express').Router()
const roomCtrl = require('../controllers/roomCtrl')

router.post('/rooms', roomCtrl.create);
router.get('/rooms', roomCtrl.getAll);
router.get('/roomsInfo/:hotel_id', roomCtrl.getByHotel);
router.get('/rooms/:room_id', roomCtrl.getDetail);

module.exports = router