const Users = require('../models/userModel')
const Notify = require('../models/notification')


const notifyCtrl = {
    updateFCM: async (req, res) => {
        try {

            const userId = req.user._id
            const { osType, fcmToken, deviceId, deviceName } = req.body
            if (!fcmToken) return res.status(400).json({ msg: "FCM Token required!" });

            const isUser = await Users.findOne({ _id: userId });
            if (!isUser) return res.status(400).json({ msg: "User Does Not Exist!" });

            const isDeviceExist = await Users.findOne({
                _id: userId,
                fcm: { $elemMatch: { deviceId: deviceId } },
            });

            if (isDeviceExist) {
                Users.updateOne(
                    {
                        _id: userId,
                        fcm: { $elemMatch: { deviceId: deviceId } },
                    },
                    {
                        $set: {
                            "fcm.$.fcmToken": fcmToken,
                            "fcm.$.refresh_date": new Date(new Date().toUTCString()),
                        },
                    }
                )
                    .exec()
                    .then(async (result) => {
                        res.status(200).json({ message: 'Fcm Token Update Sucessfully!' });
                    })
                    .catch((err) => {
                        res.status(500).json({ error: err.Message });
                    });
            } else {
                var fcmObj = {};
                (fcmObj.osType = osType),
                    (fcmObj.fcmToken = fcmToken),
                    (fcmObj.deviceId = deviceId),
                    (fcmObj.deviceName = deviceName),
                    (fcmObj.refresh_date = new Date(new Date().toUTCString()));
                isUser.fcm.push(fcmObj);

                Users.updateOne(
                    {
                        _id: userId,
                    },
                    {
                        $set: {
                            fcm: isUser.fcm,
                        },
                    }
                )
                    .exec()
                    .then(async (result) => {
                        res.status(200).json({ message: 'Fcm Token Update Sucessfully!' });
                    })
                    .catch((err) => {
                        res.status(500).json({ error: err.Message });
                    });
            }
        } catch (error) {
            res.status(500).json({ message: error?.message });
        }
    },
    sendNotify: async (req, res) => {
        try {
            const { recipient, type, message, timestamp, notifiydata } = req.body;

            if (!recipient) return res.status(400).json({ msg: "user Id required!" })

            const newNotify = new Notify({
                recipient, type, message, timestamp, notifiydata
            })

            await newNotify.save()

            let updateuser = await Users.findByIdAndUpdate(
                recipient,
                { $addToSet: { notifications: newNotify?._id } },
                { new: true }
            );

            console.log(updateuser);
            res.send({
                Notify: newNotify,
            })
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Failed to send Notification ' });
        }
    },
    updateNotifyStatus: async (req, res) => {
        try {
            const { notify_id, status } = req.query
            let updatenotify = await Notify.findByIdAndUpdate(
                notify_id,
                { status },
                { new: true }
            );
            res.send({
                message: "status change successfully",
            })

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Failed to change notification status  ' });
        }
    },
    allNotify: async (req, res) => {
        try {

            if (!req.user._id) return res.status(400).json({ msg: "invalid Token!" })

            const user = await Users.findById(req.user._id).populate('notifications')
            const unreadNotifications = user.notifications.filter(notification => notification.status == 'unread');

            const unreadCount = unreadNotifications.length;

            res.send({
                notifications: user.notifications || [],
                unreadCount,
            })
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Failed to get Notification ' });
        }
    },
}
module.exports = notifyCtrl
