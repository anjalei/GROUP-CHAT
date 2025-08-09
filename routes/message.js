
const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/auth');  
const { postMesage } = require('../controller/messagecontroller');

router.post('/message', authenticateUser, postMesage);


module.exports = router;
