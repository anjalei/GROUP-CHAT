const User = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SignupUser = async (req, res) => {
    try {
        const { username, phone, email, password } = req.body;
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
           return res.status(409).json({ message: "User already exists" });

        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username,
            phone,
            email,
            password: hashedPassword
        });

        res.status(201).json({ message: "User created successfully", userId: newUser.id });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

module.exports = {
    SignupUser,
};
