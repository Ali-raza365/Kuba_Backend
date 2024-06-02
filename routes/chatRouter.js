const router = require('express').Router()
const auth = require("../middleware/auth")
const chatCtrl = require("../controllers/chatCtrl")

router.get('/chat/chatlist', auth, chatCtrl.getChatList)
router.post('/chat/messages', auth, chatCtrl.getmessages)



module.exports = router