const router = require('express').Router()
const authCtrl = require('../controllers/authCtrl')

router.post('/register', authCtrl.register);
router.post('/signin-google', authCtrl.googleLogin);
router.post('/login', authCtrl.login);
router.post('/forgot-password', authCtrl.forgotPasswordRoute);
router.post('/verify-otp', authCtrl.verifyOTPRoute);
router.post('/resend-otp', authCtrl.reSendOTP);
router.post('/reset-password', authCtrl.resetPasswordRoute);
router.post("/change-password", authCtrl.changePasswordRoute);

module.exports = router