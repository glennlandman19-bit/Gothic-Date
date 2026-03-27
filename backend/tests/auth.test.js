const request = require('supertest');
const { app } = require('../server');
const { User, Subscription } = require('../database/schemas');

describe('Authentication API', () => {
  beforeAll(async () => {
    // Clear test data
    await User.deleteMany({});
    await Subscription.deleteMany({});
  });

  describe('POST /api/auth/signup', () => {
    it('should create a new user and return token', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
          firstName: 'Test',
          lastName: 'User',
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('user');
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.username).toBe('testuser');
      expect(res.body.user.email).toBe('test@example.com');
    });

    it('should return 400 if user already exists', async () => {
      await request(app)
        .post('/api/auth/signup')
        .send({
          username: 'testuser2',
          email: 'test2@example.com',
          password: 'password123',
          firstName: 'Test',
          lastName: 'User',
        });

      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          username: 'testuser2',
          email: 'test2@example.com',
          password: 'password123',
          firstName: 'Test',
          lastName: 'User',
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('User already exists');
    });

    it('should return 400 if missing required fields', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          username: 'testuser3',
          // missing email and password
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Missing required fields');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeAll(async () => {
      await request(app)
        .post('/api/auth/signup')
        .send({
          username: 'logintest',
          email: 'login@example.com',
          password: 'password123',
          firstName: 'Login',
          lastName: 'Test',
        });
    });

    it('should login successfully and return token', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'password123',
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('user');
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.email).toBe('login@example.com');
    });

    it('should return 401 for invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'wrongpassword',
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe('Invalid credentials');
    });

    it('should return 401 if user not found', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe('Invalid credentials');
    });
  });
});
