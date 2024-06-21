const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        trim: true,
        maxlength: 25
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: 'https://res.cloudinary.com/devatchannel/image/upload/v1602752402/avatar/avatar_cugq40.png'
    },
    type:{ type: String, default: 'email' },
    user_verified :{ type: Boolean, default: false },
    otpCode: String,
    otpExpires: String,
    phone:String,
    role: { type: String, default: 'user' },
    mobile: { type: String, default: '' },
    favorites: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'event',
        },
    ],
    notifications: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'notification',
        },
    ],
    fcm: [
        {
            osType: {
                type: String, 
            },
            fcmToken: {
                type: String,
            },
            deviceId: {
                type: String,
            },
            refresh_date: {
                type: Date,
                default: Date.now
            },
        },
    ],
    address: {
        name: String,
        coordinates: {
            latitude: Number,
            longitude: Number
        }
    }
}, {
    timestamps: true
})


module.exports = mongoose.model('User', userSchema)
