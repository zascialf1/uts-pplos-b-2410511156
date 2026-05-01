const { createProxyMiddleware } = require('http-proxy-middleware');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ status: 'error', message: 'Token tidak ditemukan' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ status: 'error', message: 'Token tidak valid' });
    }
};

const proxy = createProxyMiddleware({
    target: process.env.DISPOSISI_SERVICE_URL,
    changeOrigin: true,
    on: {
        error: (err, req, res) => {
            res.status(500).json({ status: 'error', message: 'Disposisi service tidak tersedia' });
        }
    }
});

const express = require('express');
const router = express.Router();

router.use(verifyToken);
router.use(proxy);

module.exports = router;