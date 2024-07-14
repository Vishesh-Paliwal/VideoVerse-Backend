const { v4: uuidv4 } = require('uuid');
const SharedLink = require('../models/SharedLink');
const Video = require('../models/Video');

const generateShareLink = async (req, res) => {
  const { videoId, expiryHours } = req.body;

  if (!videoId || !expiryHours) {
    return res.status(400).json({ error: 'Video ID and expiry hours are required' });
  }

  try {
    const video = await Video.findByPk(videoId);

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    const token = uuidv4();
    const expiryDate = new Date(Date.now() + expiryHours * 60 * 60 * 1000);

    const sharedLink = await SharedLink.create({
      token,
      videoId,
      expiryDate
    });

    res.json({ message: 'Shareable link generated', link: `http://localhost:3000/share/${token}` });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

const accessSharedLink = async (req, res) => {
    const { token } = req.params;
  
    try {
      const sharedLink = await SharedLink.findOne({ where: { token } });
  
      if (!sharedLink) {
        return res.status(404).json({ error: 'Shared link not found' });
      }
  
      if (new Date() > sharedLink.expiryDate) {
        return res.status(410).json({ error: 'Shared link has expired' });
      }
  
      const video = await Video.findByPk(sharedLink.videoId);
  
      if (!video) {
        return res.status(404).json({ error: 'Video not found' });
      }
  
      res.json({ message: 'Video accessed successfully', video });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  };
  
  module.exports = {
    generateShareLink,
    accessSharedLink
  };