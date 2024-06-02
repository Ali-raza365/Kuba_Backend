const router = require('express').Router()
const authCtrl = require('../controllers/authCtrl')

router.post('/register', authCtrl.register);
router.post('/login', authCtrl.login);
router.post('/forgot-password', authCtrl.forgotPasswordRoute);
router.post('/verify-otp', authCtrl.verifyOTPRoute);
router.post('/change-password', authCtrl.changePasswordRoute);
module.exports = router