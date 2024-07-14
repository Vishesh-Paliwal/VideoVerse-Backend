const ffmpeg = require('fluent-ffmpeg');
const tmp = require('tmp');
const fs = require('fs');
const { MIN_VIDEO_DURATION, MAX_VIDEO_DURATION } = require('../../config/config');

const checkVideoDuration = (buffer) => {
  return new Promise((resolve, reject) => {
    tmp.file({ postfix: '.mp4' }, (err, path, fd, cleanupCallback) => {
      if (err) {
        return reject(err);
      }

      fs.writeFile(path, buffer, (err) => {
        if (err) {
          cleanupCallback();
          return reject(err);
        }

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
          resolve(duration);
        });
      });
    });
  });
};

// const ffmpeg = require('fluent-ffmpeg');
// const tmp = require('tmp');
// const fs = require('fs');

const trimVideoFile = (buffer, startTime, endTime) => {
  return new Promise((resolve, reject) => {
    tmp.file({ postfix: '.mp4' }, (err, path, fd, cleanupCallback) => {
      if (err) {
        return reject(err);
      }

      fs.writeFile(path, buffer, (err) => {
        if (err) {
          cleanupCallback();
          return reject(err);
        }

        tmp.file({ postfix: '.mp4' }, (err, outputPath, outputFd, outputCleanupCallback) => {
          if (err) {
            cleanupCallback();
            return reject(err);
          }

          ffmpeg(path)
            .setStartTime(startTime)
            .setDuration(endTime - startTime)
            .output(outputPath)
            .on('end', () => {
              fs.readFile(outputPath, (err, trimmedBuffer) => {
                if (err) {
                  cleanupCallback();
                  outputCleanupCallback();
                  return reject(err);
                }

                cleanupCallback();
                outputCleanupCallback();
                resolve(trimmedBuffer);
              });
            })
            .on('error', (err) => {
              cleanupCallback();
              outputCleanupCallback();
              reject(err);
            })
            .run();
        });
      });
    });
  });
};

module.exports = { checkVideoDuration, trimVideoFile };

//module.exports = { checkVideoDuration};
