const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const sequelize = require('../../database/db');
const trimRoutes = require('../../api/routes/trimRoutes');
const Video = require('../../api/models/Video');
const { trimVideoFile } = require('../../api/utils/videoUtils');
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNzIxMDI3NDE1LCJleHAiOjE3MjE3NDc0MTV9.OWHPmaxcFFOR4yZu25NU6FW9hOzP0I7WZpRL2aqgyT4'

jest.mock('../../api/models/Video');
jest.mock('../../api/utils/videoUtils');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use('/trim', trimRoutes);

describe('Trim Controller', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: false });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should trim a video successfully', async () => {
    const videoBuffer = Buffer.from('test buffer');
    const trimmedBuffer = Buffer.from('trimmed buffer');
    const video = {
      id: 1,
      originalName: 'test.mp4',
      mimeType: 'video/mp4',
      size: 1024,
      duration: 20,
      buffer: videoBuffer
    };

    Video.findByPk.mockResolvedValue(video);
    trimVideoFile.mockResolvedValue(trimmedBuffer);
    Video.create.mockResolvedValue({
      id: 2,
      originalName: 'test.mp4-trimmed',
      mimeType: 'video/mp4',
      size: trimmedBuffer.length,
      duration: 10,
      buffer: trimmedBuffer
    });

    const response = await request(app)
      .post('/trim')
      .send({ videoId: 1, startTime: 5, endTime: 15 })
      .set('Authorization', token );

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Video trimmed successfully');
    expect(response.body.trimmedVideoId).toBe(2);
  });

  it('should return 400 if videoId, startTime, or endTime is missing', async () => {
    const response = await request(app)
      .post('/trim')
      .send({ startTime: 5, endTime: 15 })
      .set('Authorization', token );

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Video ID, start time, and end time are required');
  });

  it('should return 404 if video is not found', async () => {
    Video.findByPk.mockResolvedValue(null);

    const response = await request(app)
      .post('/trim')
      .send({ videoId: 1, startTime: 5, endTime: 15 })
      .set('Authorization', token );

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Video not found');
  });

  it('should return 500 if trimming fails', async () => {
    const videoBuffer = Buffer.from('test buffer');
    const video = {
      id: 1,
      originalName: 'test.mp4',
      mimeType: 'video/mp4',
      size: 1024,
      duration: 20,
      buffer: videoBuffer
    };

    Video.findByPk.mockResolvedValue(video);
    trimVideoFile.mockRejectedValue(new Error('Trimming failed'));

    const response = await request(app)
      .post('/trim')
      .send({ videoId: 1, startTime: 5, endTime: 15 })
      .set('Authorization', token );

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Trimming failed');
  });
});
