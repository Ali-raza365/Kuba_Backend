const Event = require("./models/eventModel");

const SocketServer = (socket,io) => {

    const userId = socket.handshake.query.userId ;
    socket.userId = userId;
    socket.on('joinChatRoom', async (eventId) => {
        try {
            const event = await Event.findById(eventId);
            if (!event) {
                // Event not found
                socket.emit('chatError', 'Event not found');
                return;
            }
            socket.join(`event:${eventId}`);
            // console.log(`User joined chat room for event: ${eventId}`);
            socket.emit(`joinChatRoom", "User joined chat room for event: ${eventId}` )
        } catch (error) {
            console.error('Error joining chat room:', error);
            socket.emit('chatError', 'Error joining chat room');
        }
    });

    // Handle incoming chat messages
    socket.on('chatMessage', async ({ eventId, messageData }) => {
        try {
            console.log("userId",socket?.userId)
            console.log("messageData",messageData)
            
            const {_id,...other} =messageData
            const event = await Event.findById(eventId);
            if (!event) {
                // Event not found
                socket.emit('chatError', 'Event not found');
                return;
            }
            event.chat.push({ ...other, user: socket.userId });
            await event.save();

            // Emit the chat message to all users in the event's chat room
            io.to(`event:${eventId}`).emit('chatMessage', { ...messageData });
        } catch (error) {
            console.error('Error sending chat message:', error);
            socket.emit('chatError', 'Error sending chat message');
        }
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });

    // socket.on('disconnect', () => {
    //     const data = users.find(user => user.socketId === socket.id)
    //     if(data){
    //         const clients = users.filter(user => 
    //             data.followers.find(item => item._id === user.id)
    //         )

    //         if(clients.length > 0){
    //             clients.forEach(client => {
    //                 socket.to(`${client.socketId}`).emit('CheckUserOffline', data.id)
    //             })
    //         }

    //         if(data.call){
    //             const callUser = users.find(user => user.id === data.call)
    //             if(callUser){
    //                 users = EditData(users, callUser.id, null)
    //                 socket.to(`${callUser.socketId}`).emit('callerDisconnect')
    //             }
    //         }
    //     }
    //     users = users.filter(user => user.socketId !== socket.id)










    // })





    // Notification

}

module.exports = SocketServer