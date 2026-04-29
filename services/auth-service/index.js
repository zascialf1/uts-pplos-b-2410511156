const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('./config/passport');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Session (dibutuhkan passport)
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

// Init passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
const authRoutes = require('./routes/authRoutes');
const oauthRoutes = require('./routes/oauthRoutes');

app.use('/auth', authRoutes);
app.use('/auth', oauthRoutes);

app.listen(PORT, () => {
    console.log(`Auth Service berjalan di port ${PORT}`);
});