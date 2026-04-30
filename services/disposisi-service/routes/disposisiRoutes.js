const express = require('express');
const router = express.Router();
const disposisiController = require('../controllers/disposisiController');

router.get('/', disposisiController.index);
router.put('/:id/proses', disposisiController.proses);
router.put('/:id/selesai', disposisiController.selesai);

module.exports = router;