
const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/auth');  
const { postMessage,getMessages } = require('../controller/messagecontroller');

router.post('/message', authenticateUser, postMessage);
router.get('/getmessages', authenticateUser, getMessages);

module.exports = router;
