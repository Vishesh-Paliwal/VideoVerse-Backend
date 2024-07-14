const ffmpeg = require('fluent-ffmpeg');
const tmp = require('tmp');
const fs = require('fs');
const { MIN_VIDEO_DURATION, MAX_VIDEO_DURATION } = require('../../config/config');

const checkVideoDuration = (buffer) => {
  return new Promise((resolve, reject) => {
    // Create a temporary file
    tmp.file({ postfix: '.mp4' }, (err, path, fd, cleanupCallback) => {
      if (err) {
        return reject(err);
      }

      // Write the buffer to the temporary file
      fs.writeFile(path, buffer, (err) => {
        if (err) {
          cleanupCallback();
          return reject(err);
        }

        // Use ffmpeg to check the video duration
        ffmpeg.ffprobe(path, (err, metadata) => {
          if (err) {
            cleanupCallback();
            console.log("util error");
            return reject(err);
          }

          const duration = metadata.format.duration;
          if (duration < MIN_VIDEO_DURATION || duration > MAX_VIDEO_DURATION) {
            cleanupCallback();
            console.log("duration error");
            return reject(new Error(`Video duration must be between ${MIN_VIDEO_DURATION} and ${MAX_VIDEO_DURATION} seconds`));
          }

          console.log("util resolved");
          cleanupCallback();
          resolve();
        });
      });
    });
  });
};

module.exports = { checkVideoDuration };
