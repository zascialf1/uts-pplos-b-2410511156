const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Step 1: Redirect ke Google
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// Step 2: Google callback setelah login
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/auth/google/failed' }),
    (req, res) => {
        const user = req.user;

        // Generate JWT setelah OAuth berhasil
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
            message: 'Login Google berhasil',
            user: {
                nama: user.nama,
                email: user.email,
                foto_profil: user.foto_profil,
                role: user.role,
                oauth_provider: user.oauth_provider
            },
            access_token: accessToken,
            refresh_token: refreshToken
        });
    }
);

// Route kalau gagal
router.get('/google/failed', (req, res) => {
    res.status(401).json({ status: 'error', message: 'Login Google gagal' });
});

module.exports = router;