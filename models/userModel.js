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
    username: {
        type: String,
        trim: true,
        // unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: 'https://res.cloudinary.com/devatchannel/image/upload/v1602752402/avatar/avatar_cugq40.png'
    },
    resetPasswordToken: String,
    resetPasswordExpires: String,
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


module.exports = mongoose.model('user', userSchema)

//    payment_methods: [
//         {
//             customer_id: String,
//             payment_method_id: String,
//             last4: Number,//"4242",
//             brand: String,//"Visa",
//             expiration_month: Number, //2,
//             expiration_year: Number, //2030,
//             is_default: Boolean,
//         }
//     ]