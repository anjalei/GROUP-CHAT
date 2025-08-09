
const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/auth');  
const { postMesage,getMessages } = require('../controller/messagecontroller');

router.post('/message', authenticateUser, postMesage);
router.get('/getmessages', authenticateUser, getMessages);

module.exports = router;
