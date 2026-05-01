const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

const disposisiRoutes = require('./routes/disposisiRoutes');
app.use('/disposisi', disposisiRoutes);

app.listen(PORT, () => {
    console.log(`Disposisi Service berjalan di port ${PORT}`);
});