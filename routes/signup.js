const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/auth');  
const User = require('../model/user'); 
const {signupUser} = require('../controller/signupController');

router.post('/post',signupUser);



module.exports = router;