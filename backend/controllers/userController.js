const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Helper to create JWT with both id and email
const createToken = (user) => {
    return jwt.sign(
        { id: user._id.toString(), email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: 3 * 24 * 60 * 60 }
    );
};

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const newUser = await userModel.register(name, email, password);
        // Create token for new user
        const token = createToken(newUser);
        res.status(201).json({
            message: 'Registration successful',
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                createdAt: newUser.createdAt,
                updatedAt: newUser.updatedAt,
            }
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await userModel.login(email, password);

        // Create token with both id and email
        const token = createToken(user);

        return res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            }
        });
    } catch (error) {
        return res.status(401).json({ message: error.message });
    }
};

const getUserProfile = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer')) {
            return res.status(401).json({ message: 'Authorization token is required' });
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || !decoded.email) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        const user = await userModel.getUser(decoded.email);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({
            message: 'User profile retrieved successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        });
    } catch (error) {
        return res.status(401).json({ message: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
};