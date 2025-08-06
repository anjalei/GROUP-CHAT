const express = require('express');
const router = express.Router(); 
const User = require('../model/user'); 
const {SignupUser} = require('../controller/signupController');

router.post('/signup',SignupUser);



module.exports = router;