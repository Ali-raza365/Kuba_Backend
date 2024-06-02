const axios = require("axios");
const User = require("../models/userModel"); // Replace with the actual path to your User model
const Notification = require("../models/notification"); // Replace with the actual path to your Notification model

async function sendAndSaveNotification(notifyData, user_id, sender_id) {
    try {
        const { type, event_title } = notifyData

        let data = {};
        let message = "";
        let title = "Team Mates";

        const user = await User.findOne({ _id: user_id });
        console.log(user?.fcm, user_id);

        if (!user || user.fcm.length === 0) {
            console.log("User not found or FCM token not available");
            return;
        }
        const fcmTokens = user.fcm.map((data) => data.fcmToken);


        // condition 
        if (type == 'send-request') {

            const sender = await User.findOne({ _id: sender_id });

            message = `${sender?.fullname} wants to particate this ${event_title} `
            data = {
                user_name: sender?.fullname,
                user_email: sender?.email,
                user_avatar: sender?.avatar,
                image: user?.avatar,
                ...notifyData
            }
        }
        else if (type == "accept-request") {
            message = `your request to particate ${event_title} has been accepted `
            data = {
                user_name: user?.fullname,
                user_email: user?.email,
                user_avatar: user?.avatar,
                image: notifyData?.event_image,
                ...notifyData
            }
        }

        // Prepare the notification payload
        const notificationPayload = {
            registration_ids: fcmTokens,
            collapse_key: "type_a",
            notification: {
                body: message,
                title: title || 'Team Mates',
                sound: "default", // Add this property to play the default notification sound
                vibrate: 1,
            },
        };

        // Send the FCM notification
        const response = await axios.post(process.env.FCM_API, notificationPayload, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `key=${process.env.FCM_AUth_KEY}`,
            },
        });

        console.log("FCM SENT !!!");
        console.log(data, user);
        console.log("FCM SENT !!!");

        // Save the notification in MongoDB
        const notification = new Notification({
            recipient: user._id,
            message: message,
            title: title,
            timestamp: new Date(),
            notifiydata: {
                ...data
            }
        });

        await notification.save();

        user.notifications.push(notification._id);
        await user.save();
        return
    } catch (error) {
        console.error("Error sending FCM notification:", error);
        return error
    }
}

module.exports = sendAndSaveNotification;