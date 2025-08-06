const User = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



const SignupUser = async (req, res) => {
    try {
        const { username , phone , email , password } = req.body;
       
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username,
            phone,
            email,
            password: hashedPassword
        });

        res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong" });
    }
};

module.exports = {
    SignupUser,
};