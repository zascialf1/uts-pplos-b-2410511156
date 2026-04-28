const jwt = require('jsonwebtoken');
const { getBlacklist } = require('../controllers/authController');
require('dotenv').config();

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ status: 'error', message: 'Token tidak ditemukan' });
    }
    if (getBlacklist().includes(token)) {
        return res.status(401).json({ status: 'error', message: 'Token sudah tidak valid' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(403).json({ status: 'error', message: 'Token tidak valid atau kadaluarsa' });
    }
};