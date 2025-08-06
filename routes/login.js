const express = require('express');
const router = express.Router();
const User = require('../model/user'); 
const {loginUser} = require('../controller/loginController');

router.post('/login',loginUser);

module.exports = router;









