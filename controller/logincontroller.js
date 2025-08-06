const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/user');

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ message: "User not found." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Incorrect password." });
        }

        const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET);

        return res.status(200).json({ message: "Login successful", token });
    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ message: "Something went wrong." });
    }
};
