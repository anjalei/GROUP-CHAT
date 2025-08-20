
const express = require('express');
const router = express.Router();
const multer=require('multer');
const authenticateUser = require('../middleware/auth');  
const { postMessage,getMessages,uploadFile } = require('../controller/messagecontroller');
const upload=multer();

router.post('/message', authenticateUser, postMessage);
router.get('/getmessages/:groupId', authenticateUser, getMessages);
router.post('/upload/:groupId',authenticateUser,upload.single('file'),uploadFile)

module.exports = router;
