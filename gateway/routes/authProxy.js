const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

router.use(async (req, res) => {
    try {
        const url = `http://localhost:3001${req.originalUrl}`;
        const response = await axios({
            method: req.method,
            url: url,
            params: req.query,
            data: req.body,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': req.headers['authorization'] || ''
            }
        });
        res.status(response.status).json(response.data);
    } catch (err) {
        if (err.response) {
            res.status(err.response.status).json(err.response.data);
        } else {
            res.status(500).json({ status: 'error', message: err.message });
        }
    }
});

module.exports = router;