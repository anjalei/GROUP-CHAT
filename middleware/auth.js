const jwt = require("jsonwebtoken");
const User = require("../model/user"); 

const authenticateUser = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');

        if (!authHeader) {
            return res.status(401).json({ error: 'No token provided.' });
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ where: { id: decoded.userId } });

        if (!user) {
            return res.status(401).json({ error: 'User not found.' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token.' });
    }
};

module.exports = authenticateUser;
