const shareController = require('../../api/controllers/shareController');
const SharedLink = require('../../api/models/SharedLink');
const Video = require('../../api/models/Video');
const { v4: uuidv4 } = require('uuid');

jest.mock('../../api/models/SharedLink');
jest.mock('../../api/models/Video');
jest.mock('uuid');

describe('Share Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateShareLink', () => {
    it('should generate a shareable link', async () => {
      const req = {
        body: {
          videoId: 1,
          expiryHours: 24
        }
      };

      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      Video.findByPk.mockResolvedValue({ id: 1 });
      uuidv4.mockReturnValue('test-token');
      SharedLink.create.mockResolvedValue({ token: 'test-token' });

      await shareController.generateShareLink(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ link: 'http://localhost:3000/share/test-token' }));
    });

    it('should return 400 if videoId or expiryHours are missing', async () => {
      const req = { body: {} };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await shareController.generateShareLink(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Video ID and expiry hours are required' }));
    });

    it('should return 404 if video not found', async () => {
      const req = {
        body: {
          videoId: 1,
          expiryHours: 24
        }
      };

      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      Video.findByPk.mockResolvedValue(null);

      await shareController.generateShareLink(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Video not found' }));
    });
  });

  describe('accessSharedLink', () => {
    it('should return the video if the link is valid and not expired', async () => {
      const req = { params: { token: 'test-token' } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      const sharedLink = {
        token: 'test-token',
        videoId: 1,
        expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
      };

      SharedLink.findOne.mockResolvedValue(sharedLink);
      Video.findByPk.mockResolvedValue({ id: 1 });

      await shareController.accessSharedLink(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Video accessed successfully' }));
    });

    it('should return 404 if shared link not found', async () => {
      const req = { params: { token: 'test-token' } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      SharedLink.findOne.mockResolvedValue(null);

      await shareController.accessSharedLink(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Shared link not found' }));
    });

    it('should return 410 if shared link has expired', async () => {
      const req = { params: { token: 'test-token' } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      const sharedLink = {
        token: 'test-token',
        videoId: 1,
        expiryDate: new Date(Date.now() - 24 * 60 * 60 * 1000)
      };

      SharedLink.findOne.mockResolvedValue(sharedLink);

      await shareController.accessSharedLink(req, res);

      expect(res.status).toHaveBeenCalledWith(410);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Shared link has expired' }));
    });

    it('should return 404 if video not found', async () => {
      const req = { params: { token: 'test-token' } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      const sharedLink = {
        token: 'test-token',
        videoId: 1,
        expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
      };

      SharedLink.findOne.mockResolvedValue(sharedLink);
      Video.findByPk.mockResolvedValue(null);

      await shareController.accessSharedLink(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Video not found' }));
    });
  });
});
