require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
var bodyParser = require('body-parser')
var morgan = require('morgan')
// const SocketServer = require('./socketServer')
const { errorHandler } = require('./middleware/errorHandler')
// const sendAndSaveNotification = require('./utils/sendAndSaveNotification')


require('./db/conn.js')

const app = express()
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'))

app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
});
app.use('/uploads', express.static('uploads'));


// Socket
const http = require('http').createServer(app)
// const io = require('socket.io')(http)

// io.on('connection', socket => {
//     console.log('Socket connected!');
//     // SocketServer(socket, io)
// })

// Routes
app.use('/api', require('./routes/authRouter'))
app.use('/api', require('./routes/userRouter'))
app.use('/api', require('./routes/hotelRouter'))
app.use('/api', require('./routes/roomRouter.js'))
// app.use('/api', require('./routes/eventRouter'))
// app.use('/api', require('./routes/activitiesRouter'))
// app.use('/api', require('./routes/chatRouter'))
// app.use('/api', require('./routes/paymentRouter'))
// app.use('/api', require('./routes/notifyRouter'))

app.get('/',async (req, res) => {

    res.send('server is running')
})

app.use(errorHandler);



const port = process.env.PORT || 8080
http.listen(port, () => {
    console.log('Server is running on port', port)
})