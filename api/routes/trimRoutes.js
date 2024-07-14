const express = require('express');
const router = express.Router();
const { trimVideo } = require('../controllers/trimController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('', authMiddleware, trimVideo);

module.exports = router;
