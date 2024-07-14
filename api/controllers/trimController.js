const { trimVideoFile } = require('../utils/videoUtils');
const Video = require('../models/Video');

const trimVideo = async (req, res) => {
  const { videoId, startTime, endTime } = req.body;

  if (!videoId || startTime == null || endTime == null) {
    return res.status(400).json({ message: 'Video ID, start time, and end time are required' });
  }

  try {
    const video = await Video.findByPk(videoId);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const trimmedBuffer = await trimVideoFile(video.buffer, startTime, endTime);

    const trimmedVideo = await Video.create({
      originalName: `${video.originalName}-trimmed`,
      mimeType: video.mimeType,
      size: trimmedBuffer.length,
      duration: endTime - startTime,
      buffer: trimmedBuffer
    });

    res.status(200).json({ message: 'Video trimmed successfully', trimmedVideoId: trimmedVideo.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { trimVideo };
