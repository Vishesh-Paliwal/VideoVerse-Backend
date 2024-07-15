const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('../../api/routes/authRoutes');
const { login } = require('../../api/controllers/authController');
const { JWT_SECRET } = require('../../config/config');
const jwt = require('jsonwebtoken');

const app = express();
app.use(bodyParser.json());
app.use('/auth', authRoutes);

describe('Auth Controller', () => {
  it('should return a valid JWT token on successful login', async () => {
    const mockUser = {
      username: 'admin',
      password: 'password',
    };

    const response = await request(app)
      .post('/auth/login')
      .send(mockUser)
      .expect(200);

    expect(response.body.token).toBeDefined();

    // Verify the token
    const decoded = jwt.verify(response.body.token, JWT_SECRET);
    expect(decoded.username).toBe(mockUser.username);
  });

  it('should return 401 on unsuccessful login with invalid credentials', async () => {
    const mockUser = {
      username: 'invalid_user',
      password: 'invalid_password',
    };

    const response = await request(app)
      .post('/auth/login')
      .send(mockUser)
      .expect(401);

    expect(response.body.message).toBe('Invalid credentials');
  });
});
