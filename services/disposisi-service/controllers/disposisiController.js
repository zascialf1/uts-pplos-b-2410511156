const axios = require('axios');
require('dotenv').config();

const PENGADUAN_URL = process.env.PENGADUAN_SERVICE_URL;

// get untuk ambil data semua disposisi
exports.index = async (req, res) => {
    console.log('PENGADUAN_URL:', PENGADUAN_URL);
    try {
        const response = await axios.get(`${PENGADUAN_URL}/pengaduan`);
        const pengaduanList = response.data.data;

        const filtered = pengaduanList.filter(p => p.status !== 'selesai');

        res.json({
            status: 'sukses',
            message: 'Data pengaduan untuk disposisi',
            data: filtered
        });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

// put update disposisi ke diproses
exports.proses = async (req, res) => {
    const { id } = req.params;
    try {
        const check = await axios.get(`${PENGADUAN_URL}/pengaduan/${id}`);
        if (check.data.status !== 'sukses') {
            return res.status(404).json({ status: 'error', message: 'Pengaduan tidak ditemukan' });
        }

        const update = await axios.put(`${PENGADUAN_URL}/pengaduan/${id}`, {
            status: 'diproses'
        });

        res.json({
            status: 'sukses',
            message: 'Pengaduan berhasil didisposisi',
            data: update.data.data
        });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

// put update selesaikan pengaduan
exports.selesai = async (req, res) => {
    const { id } = req.params;
    try {
        const update = await axios.put(`${PENGADUAN_URL}/pengaduan/${id}`, {
            status: 'selesai'
        });

        res.json({
            status: 'sukses',
            message: 'Pengaduan berhasil diselesaikan',
            data: update.data.data
        });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};