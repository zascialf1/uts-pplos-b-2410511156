const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('./db');
const jwt = require('jsonwebtoken');
require('dotenv').config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
},
(accessToken, refreshToken, profile, done) => {
    const email = profile.emails[0].value;
    const nama = profile.displayName;
    const foto = profile.photos[0].value;
    const oauth_id = profile.id;

    // Cek apakah user sudah ada di database
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) return done(err);

        if (results.length > 0) {
            // User sudah ada, return user
            return done(null, results[0]);
        } else {
            // User belum ada, buat baru otomatis
            db.query(
                'INSERT INTO users (nama, email, password, role, oauth_provider, oauth_id, foto_profil) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [nama, email, '', 'mahasiswa', 'google', oauth_id, foto],
                (err, result) => {
                    if (err) return done(err);
                    db.query('SELECT * FROM users WHERE id = ?', [result.insertId], (err, rows) => {
                        if (err) return done(err);
                        return done(null, rows[0]);
                    });
                }
            );
        }
    });
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
    db.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
        done(err, results[0]);
    });
});

module.exports = passport;