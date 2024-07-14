const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const Video = require('../models/Video'); 

const mergeVideos = async (req, res) => {
  const { videoIds } = req.body;

  if (!Array.isArray(videoIds) || videoIds.length === 0) {
    return res.status(400).json({ error: 'No video IDs provided' });
  }

  try {
    const videos = await Video.findAll({
      where: { id: videoIds },
    });

    if (videos.length !== videoIds.length) {
      return res.status(404).json({ error: 'One or more videos not found' });
    }

    const fileListPath = path.join(__dirname, 'filelist.txt');
    const tempFiles = videos.map((video, index) => {
      const tempFilePath = path.join(__dirname, `temp_${index}.mp4`);
      fs.writeFileSync(tempFilePath, video.buffer);
      return tempFilePath;
    });

    const fileListContent = tempFiles.map(file => `file '${file}'`).join('\n');
    fs.writeFileSync(fileListPath, fileListContent);

    const outputFilePath = path.join(__dirname, 'output.mp4');

    exec(`ffmpeg -f concat -safe 0 -i ${fileListPath} -c copy ${outputFilePath}`, async (err) => {
      tempFiles.forEach(file => fs.unlinkSync(file));
      fs.unlinkSync(fileListPath);

      if (err) {
        return res.status(500).json({ error: 'Error merging videos', details: err.message });
      }

      const mergedVideoBuffer = fs.readFileSync(outputFilePath);
      fs.unlinkSync(outputFilePath);

      const mergedVideo = await Video.create({
        originalName: 'merged_video.mp4',
        mimeType: 'video/mp4',
        size: mergedVideoBuffer.length,
        duration: videos.reduce((acc, video) => acc + video.duration, 0),
        buffer: mergedVideoBuffer
      });

      res.json({ message: 'Videos merged successfully', video: mergedVideo });
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

module.exports = {
  mergeVideos
};
