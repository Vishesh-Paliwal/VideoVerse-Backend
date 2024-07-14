const express = require('express');
const { mergeVideos } = require('../controllers/mergeController');
const router = express.Router();

router.post('/', mergeVideos);

module.exports = router;
