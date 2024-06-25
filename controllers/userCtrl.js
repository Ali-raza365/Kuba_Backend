const HotelModel = require('../models/hotelModel');
const Users = require('../models/userModel')

const userCtrl = {
    getUserInfo: async (req, res) => {
        try {
            const user = await Users.findById(req.user._id).select('-password -role').populate('notifications')
            if (!user) return res.status(400).json({ msg: "User does not exist." })
            const unreadNotifications = user.notifications.filter(notification => notification.status == 'unread');
            const unreadCount = unreadNotifications.length || 0;
            res.json({ user: { ...user?._doc, unreadCount } })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getUsers: async (req, res) => {
        try {
            const users = await Users.find({}).select('-password')
            if (!users) return res.status(400).json({ msg: "User does not exist." })

            res.json({ users })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    updateUser: async (req, res) => {
        try {
            const { fullname, username, email, avatar, mobile, address, role, } = req.body
            if (!fullname) return res.status(400).json({ msg: "Please add your full name." })
            if (!email) return res.status(400).json({ msg: "Please add your email address." })
            const email_user = await Users.findOne({ email })
            if (email_user) {
                if (email_user?._id?.toString() !== req.user._id?.toString()) return res.status(400).json({ msg: "This email already exists." })
            }
            const username_user = !!username ? await Users.findOne({ username }) : null
            if (username_user) {
                if (username_user?._id?.toString() !== req.user._id?.toString()) return res.status(400).json({ msg: "This username already exists." })
            }

            let updatedUser = await Users.findOneAndUpdate({ _id: req.user._id }, {
                username, fullname, email, avatar: req?.imageUrl || avatar, address, mobile, role,
            }, { new: true }).select('-password')
            res.json({ msg: "Profile Updated Successfully", user: updatedUser })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    deleteUser: async (req, res) => {
        try {
            let user_id = req.user._id

            if (!user_id) return res.status(400).json({ msg: "User not Found" })
            await Users.findByIdAndDelete({ _id: user_id })

            res.json({ msg: 'User Deleted Successfully!' })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    addFavorite: async (req, res) => {
        try {
            const { user_id, hotel_id } = req.body;
            if (!user_id || !hotel_id) {
                return res.status(400).json({ message: 'User ID and Hotel ID are required' });
            }

            const user = await Users.findById(user_id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            if (!user.favorites.includes(hotel_id)) {
                user.favorites.push(hotel_id);
                await user.save();
            }

            const hotel = await HotelModel.findById(hotel_id);
            if (!hotel) {
                return res.status(404).json({ message: 'Hotel not found' });
            }

            if (!hotel.favorites.includes(user_id)) {
                hotel.favorites.push(user_id);
                await hotel.save();
            }

            res.status(200).json({ message: 'Hotel added to favorites' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },
    removeFavorite: async (req, res) => {
        try {
            const { user_id, hotel_id } = req.body;
            if (!user_id || !hotel_id) {
                return res.status(400).json({ message: 'User ID and Hotel ID are required' });
            }

            const user = await Users.findById(user_id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            user.favorites = user.favorites.filter(fav => fav.toString() !== hotel_id);
            await user.save();

            const hotel = await HotelModel.findById(hotel_id);
            if (!hotel) {
                return res.status(404).json({ message: 'Hotel not found' });
            }

            hotel.favorites = hotel.favorites.filter(fav => fav.toString() !== user_id);
            await hotel.save();

            res.status(200).json({ message: 'Hotel removed from favorites' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },
    getFavorites: async (req, res) => {
        try {
            const { user_id } = req.params;
            if (!user_id) {
                return res.status(400).json({ message: 'User ID is required' });
            }

            const user = await Users.findById(user_id).populate({
                path: 'favorites',
                model: 'Hotel', // Assuming 'favorites' is an array of Hotel references
                populate: {
                    path: 'rooms',
                    model: 'Room' // Assuming 'rooms' is an array of Room references in Hotel model
                }
            })
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json(user.favorites);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}


module.exports = userCtrl