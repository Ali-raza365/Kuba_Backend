const Users = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const sendEmail = require('../utils/SendEmail')
const getRandomProfilePicture = require('../utils/validation')
const { OAuth2Client } = require('google-auth-library')

const authCtrl = {
    register: async (req, res) => {
        try {
            const { fullname, email, password , phone} = req.body

            const user_email = await Users.findOne({ email })
            if (user_email) return res.status(400).json({ msg: "This email already exists." })

            if (password.length < 6)
                return res.status(400).json({ msg: "Password must be at least 6 characters." })

            const passwordHash = await bcrypt.hash(password, 12)

                const otp = crypto.randomInt(100000, 999999).toString();
                let mail_result = await sendEmail(email, otp)

            const newUser = new Users({
                fullname,
                email,
                phone,
                password: passwordHash,
                avatar: getRandomProfilePicture(),
                otpCode: otp,
                otpExpires: Date.now() + 3600000,
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
        console.log(user)
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            // Generate a random OTP
            const otp = crypto.randomInt(100000, 999999).toString();

            console.log({ otp })

            // let mail_result = await sendEmail(email, otp)
            // console.log({ mail_result })

            user.otpCode = otp;
            user.otpExpires = Date.now() + 3600000; // Token expires in 1 hour
            await user.save();


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

            if (user.otpCode !== otp) {
                return res.status(401).json({ error: 'Invalid OTP' });
            }

            if (user.otpExpires < Date.now()) {
                return res.status(401).json({ error: 'OTP expired' });
            }

            user.user_verified = true;
            await user.save()

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
            user.otpCode = undefined;
            user.otpExpires = undefined;
            await user.save();

            res.json({ message: 'Password changed successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    googleLogin: async (req, res) => {
        try {
            const { id_token } = req.body
            const verify = await client.verifyIdToken({
                idToken: id_token, audience: `${process.env.MAIL_CLIENT_ID}`
            })

            const {
                email, email_verified, name, picture
            } = verify.getPayload()

            if (!email_verified)
                return res.status(500).json({ msg: "Email verification failed." })

            const password = email + 'your google secrect password'
            const passwordHash = await bcrypt.hash(password, 12)

            const user = await Users.findOne({ email: email })

            if (user) {
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
            } else {
                const user = {
                    fullname: name,
                    email,
                    password: passwordHash,
                    avatar: picture,
                    type: 'google'
                }
                const newUser = new Users(user)
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
            }

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
}

const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30d' })
}



module.exports = authCtrl