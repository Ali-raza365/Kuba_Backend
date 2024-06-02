const router = require('express').Router()
const notifyctrl = require('../controllers/notifyctrl')
const auth = require("../middleware/auth")


router.post('/notify/updateFcm',auth, notifyctrl.updateFCM);
router.post('/notify/send',auth, notifyctrl.sendNotify);
router.get('/notify/all',auth, notifyctrl.allNotify);
router.get('/notify/status',auth, notifyctrl.updateNotifyStatus);

module.exports = router