const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const SECRET_KEY = process.env.JWT_SECRET;

const authenticationMiddleware = async (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authentication failed' });
    }
    const token = authHeader.replace('Bearer ', '').trim();
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.email = decoded.email;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Authentication failed' });
    }
};

module.exports = authenticationMiddleware;
