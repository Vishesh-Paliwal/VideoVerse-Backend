const express = require('express');
const router = express.Router();
const { uploadVideo } = require('../controllers/uploadController');
const authMiddleware = require('../middlewares/authMiddleware');
const uploadMiddleware = require('../middlewares/uploadMiddleware');

router.post('' ,authMiddleware, uploadMiddleware, (req, res, next) => {
    console.log("Upload route hit");
    next();
  }, uploadVideo);

module.exports = router;