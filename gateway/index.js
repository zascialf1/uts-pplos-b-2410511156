const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 60,
    message: { status: 'error', message: 'Terlalu banyak request, coba lagi nanti' }
});
app.use(limiter);

// Test route dulu
app.get('/health', (req, res) => {
    res.json({ status: 'Gateway aktif' });
});

// Routes
const authProxy = require('./routes/authProxy');
const pengaduanProxy = require('./routes/pengaduanProxy');
const disposisiProxy = require('./routes/disposisiProxy');

app.use('/auth', require('./routes/authProxy'));
app.use('/pengaduan', pengaduanProxy);
app.use('/disposisi', disposisiProxy);

app.listen(PORT, () => {
    console.log(`API Gateway berjalan di port ${PORT}`);
}).on('error', (err) => {
    console.error('Gateway error:', err);
});