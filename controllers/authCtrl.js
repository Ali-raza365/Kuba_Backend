const Users = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const sendEmail = require('../utils/SendEmail')
const  getRandomProfilePicture  = require('../utils/validation')

const authCtrl = {
    register: async (req, res) => {
        try {
            const { fullname, email, password, } = req.body

            const user_email = await Users.findOne({ email })
            if (user_email) return res.status(400).json({ msg: "This email already exists." })

            if (password.length < 6)
                return res.status(400).json({ msg: "Password must be at least 6 characters." })

            const passwordHash = await bcrypt.hash(password, 12)

            const newUser = new Users({
                fullname,
                 email,
                password: passwordHash,
                avatar:getRandomProfilePicture()
            })

            const access_token = createAccessToken({ id: newUser._id })
            await newUser.save()

            res.json({
                msg: 'Register Success!',
                access_token,
                user: {
                    ...newUser._doc,
                    password: ''
                }
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body

            const user = await Users.findOne({ email })

            if (!user) return res.status(400).json({ msg: "This email does not exist." })

            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) return res.status(400).json({ msg: "Password is incorrect." })

            const access_token = createAccessToken({ id: user._id })

            res.json({
                msg: 'Login Success!',
                access_token,
                user: {
                    ...user._doc,
                    password: ''
                }
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    forgotPasswordRoute: async (req, res) => {
        const { email } = req.body;
        try {
            const user = await Users.findOne({ email })

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            // Generate a random OTP
            const otp = crypto.randomInt(100000, 999999).toString();

            console.log({ otp })

            let mail_result = await sendEmail(email, otp)

            user.resetPasswordToken = otp;
            user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
            await user.save();

            console.log({ mail_result })

            res.json({ message: 'Password reset email sent' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server Not Responded: Try Again Later' });

        }
    },
    verifyOTPRoute: async (req, res) => {
        const { email, otp } = req.body;
        console.log({ email, otp });

        try {
            const user = await Users.findOne({ email });

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            if (user.resetPasswordToken !== otp) {
                return res.status(401).json({ error: 'Invalid OTP' });
            }

            if (user.resetPasswordExpires < Date.now()) {
                return res.status(401).json({ error: 'OTP expired' });
            }

            // OTP is valid
            res.json({ message: 'OTP verified successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    changePasswordRoute: async (req, res) => {
        const { email, newPassword } = req.body;

        try {
            const user = await Users.findOne({ email });

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            if (!newPassword) {
                return res.status(404).json({ error: 'Please Enter New Password' });
            }

            if (newPassword?.length < 6)
                return res.status(400).json({ msg: "Password must be at least 6 characters." })

            const passwordHash = await bcrypt.hash(newPassword, 12)

            user.password = passwordHash;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();

            res.json({ message: 'Password changed successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

}

const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30d' })
}



module.exports = authCtrl