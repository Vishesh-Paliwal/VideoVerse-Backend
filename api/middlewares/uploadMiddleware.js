const multer = require('multer');
const { MAX_VIDEO_SIZE } = require('../../config/config');

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: MAX_VIDEO_SIZE },
  fileFilter: (req, file, cb) => {
    console.log("valid video here");
    if (file.mimetype !== 'video/mp4') {
      console.log("invalid video format");
      return cb(new Error('Only .mp4 files are allowed'), false);
    }
    cb(null, true);
  },
}).single('video');

const uploadMiddleware = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    console.log("valid video format");
    next();
  });
};

module.exports = uploadMiddleware;
