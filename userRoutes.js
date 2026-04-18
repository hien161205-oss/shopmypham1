const express = require('express');
const router = express.Router();
const User = require('./public/User');
const jwt = require('jsonwebtoken');
const { protect, admin } = require('./public/auth');

const generateToken = (id, isAdmin) => {
    return jwt.sign({ id, isAdmin }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
};

// @desc    Đăng ký người dùng
// @route   POST /api/users
router.post('/', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'Người dùng đã tồn tại' });
        const user = await User.create({ name, email, password });
        res.status(201).json({ _id: user._id, name: user.name, email: user.email, token: generateToken(user._id, user.isAdmin) });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Đăng nhập
// @route   POST /api/users/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await user.comparePassword(password))) {
            res.json({ 
                _id: user._id, 
                name: user.name, 
                email: user.email, 
                isAdmin: user.isAdmin, 
                token: generateToken(user._id) 
            });
        } else {
            res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;