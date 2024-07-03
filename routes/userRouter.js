const router = require('express').Router()
const auth = require("../middleware/auth")
const userCtrl = require("../controllers/userCtrl")
const uploadMiddleware = require('../middleware/upload')


router.get('/user/all', auth, userCtrl.getUsers)
router.post('/user', auth,uploadMiddleware, userCtrl.updateUser)
router.get('/user/info', auth, userCtrl.getUserInfo)
router.post('/user/delete', auth, userCtrl.deleteUser)

router.post('/user/favorites', userCtrl.addFavorite);
router.post('/user/rm-favorites', userCtrl.removeFavorite);
router.get('/user/:user_id/favorites', userCtrl.getFavorites);

module.exports = router