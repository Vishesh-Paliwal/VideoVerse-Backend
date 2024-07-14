const { checkVideoDuration } = require('../utils/videoUtils');
const uploadVideo = async (req, res) => {
    console.log("Upload controller hit");
    console.log("req.file: ", req.file);
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No video file uploaded' });
      }
  
      await checkVideoDuration(req.file.buffer);
      console.log(checkVideoDuration(req.file.buffer))
  
      res.status(200).json({ message: 'Video uploaded successfully' });
    } catch (error) {
      console.log("here is error")
      res.status(400).json({ message: error.message });
    }
  };
  
module.exports = { uploadVideo };
