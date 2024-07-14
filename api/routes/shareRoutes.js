const express = require('express');
const { generateShareLink, accessSharedLink } = require('../controllers/shareControleer');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/generate', authMiddleware, generateShareLink);
router.get('/:token', accessSharedLink);

module.exports = router;
