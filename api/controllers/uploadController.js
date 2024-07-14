const { checkVideoDuration } = require('../utils/videoUtils');
const Video = require('../models/Video');

const uploadVideo = async (req, res) => {
  console.log("Upload controller hit");

  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No video file uploaded' });
    }

    const duration = await checkVideoDuration(req.file.buffer);

    const newVideo = await Video.create({
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      duration: duration,
      buffer: req.file.buffer
    });

    res.status(200).json({ message: 'Video uploaded successfully', videoId: newVideo.id });
  } catch (error) {
    console.log("here is error", error.message);
    res.status(400).json({ message: error.message });
  }
};

module.exports = { uploadVideo };
