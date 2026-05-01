const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config();

const tokenBlacklist = [];

exports.register = (req, res) => {
    const { nama, email, password, role } = req.body;
    if (!nama || !email || !password) {
        return res.status(400).json({ status: 'error', message: 'Nama, email, dan password wajib diisi' });
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    db.query(
        'INSERT INTO users (nama, email, password, role) VALUES (?, ?, ?, ?)',
        [nama, email, hashedPassword, role || 'mahasiswa'],
        (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({ status: 'error', message: 'Email sudah terdaftar'});
                }
                return res.status(500).json({ status: 'error', message: err.message });
            }
            res.status(201).json({ status: 'sukses', message: 'Registrasi berhasil', userId: result.insertId });
        }
    );
};

exports.login = (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ status: 'error', message: 'Email dan password wajib diisi'});
    }
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message });
        if (results.legth === 0) {
            return res.status(401).json({ status: 'error', message: 'Email atau password salah' });
        }
        const user = results[0];
        if (!bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ status: 'error', message: 'Email atau password salah' });
        }
        const accessToken = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );
        const refreshToken = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.REFRESH_EXPIRES_IN }
        );
        res.json({
            status: 'sukses', 
            message: 'Login berhasil',
            access_token: accessToken,
            refresh_token: refreshToken
        });
    });
};

exports.refresh = (req, res) => {
    const { refresh_token } = req.body;
    if (!refresh_token) {
        return res.status(400).json({ status: 'error', message: 'Refresh token wajib diisi' });
    }
    try {
        const decoded = jwt.verify(refresh_token, process.env.JWT_SECRET);
        const accessToken = jwt.sign(
            { id: decoded.id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );
        res.json({ status: 'sukses', access_token: accessToken });
    } catch (err) {
        res.status(401).json({ status: 'error', message: 'Refresh token tidak valid' });
    }
};

exports.logout = (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(400).json({ status: 'error', message: 'Token tidak ditemukan' });
    tokenBlacklist.push(token);
    res.json({ status: 'sukses', message: 'Logout berhasil' });
};

exports.getBlacklist = () => tokenBlacklist;