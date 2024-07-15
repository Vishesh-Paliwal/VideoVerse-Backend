const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const sequelize = require('../../database/db');
const uploadRoutes = require('../../api/routes/uploadRoutes');
const Video = require('../../api/models/Video');
const { checkVideoDuration } = require('../../api/utils/videoUtils');
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNzIxMDI3NDE1LCJleHAiOjE3MjE3NDc0MTV9.OWHPmaxcFFOR4yZu25NU6FW9hOzP0I7WZpRL2aqgyT4'


jest.mock('../../api/models/Video');
jest.mock('../../api/utils/videoUtils');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use('/upload', uploadRoutes);

describe('Upload Controller', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: false });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should upload a video successfully', async () => {
    checkVideoDuration.mockResolvedValue(10);

    Video.create.mockResolvedValue({
      id: 1,
      originalName: 'test.mp4',
      mimeType: 'video/mp4',
      size: 1024,
      duration: 10,
      buffer: Buffer.from('test buffer')
    });

    const response = await request(app)
      .post('/upload')
      .attach('video', Buffer.from('test buffer'), 'test.mp4')
      .set('Content-Type', 'multipart/form-data')
      .set('Authorization', token);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Video uploaded successfully');
    expect(response.body.videoId).toBe(1);
  });

  it('should return 400 if no video file uploaded', async () => {
    const response = await request(app)
      .post('/upload')
      .set('Authorization',token)
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('No video file uploaded');
  });

  it('should return 400 if video duration check fails', async () => {
    checkVideoDuration.mockRejectedValue(new Error('Invalid video duration'));

    const response = await request(app)
      .post('/upload')
      .attach('video', Buffer.from('test buffer'), 'test.mp4')
      .set('Content-Type', 'multipart/form-data')
      .set('Authorization', token);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid video duration');
  });

  it('should return 400 if video creation fails', async () => {
    checkVideoDuration.mockResolvedValue(10);

    Video.create.mockRejectedValue(new Error('Video creation failed'));

    const response = await request(app)
      .post('/upload')
      .attach('video', Buffer.from('test buffer'), 'test.mp4')
      .set('Content-Type', 'multipart/form-data')
      .set('Authorization', token);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Video creation failed');
  });

  it('should return 400 if invalid video format', async () => {
    const response = await request(app)
      .post('/upload')
      .attach('video', Buffer.from('test buffer'), 'test.avi')
      .set('Content-Type', 'multipart/form-data')
      .set('Authorization', token);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Only .mp4 files are allowed');
  });
});
