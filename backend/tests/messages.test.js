const request = require('supertest');
const { app } = require('../server');
const { User, Match, Message } = require('../database/schemas');

describe('Messages API', () => {
  let user1Id, user2Id, matchId, token1, token2;

  beforeAll(async () => {
    // Clear test data
    await User.deleteMany({});
    await Match.deleteMany({});
    await Message.deleteMany({});

    // Create test users
    const res1 = await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'msguser1',
        email: 'msg1@example.com',
        password: 'password123',
        firstName: 'Message',
        lastName: 'User1',
      });

    const res2 = await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'msguser2',
        email: 'msg2@example.com',
        password: 'password123',
        firstName: 'Message',
        lastName: 'User2',
      });

    user1Id = res1.body.user.id;
    user2Id = res2.body.user.id;
    token1 = res1.body.token;
    token2 = res2.body.token;

    // Create a match
    const match = new Match({
      user1Id,
      user2Id,
      status: 'accepted',
    });
    await match.save();
    matchId = match._id;
  });

  describe('POST /api/messages/send', () => {
    it('should send a message successfully', async () => {
      const res = await request(app)
        .post('/api/messages/send')
        .set('Authorization', `Bearer ${token1}`)
        .send({
          matchId,
          senderId: user1Id,
          receiverId: user2Id,
          content: 'Hello!',
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.content).toBe('Hello!');
      expect(res.body.read).toBe(false);
    });

    it('should return 400 if match not found', async () => {
      const fakeMatchId = '000000000000000000000000';
      const res = await request(app)
        .post('/api/messages/send')
        .set('Authorization', `Bearer ${token1}`)
        .send({
          matchId: fakeMatchId,
          senderId: user1Id,
          receiverId: user2Id,
          content: 'Hello!',
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Match not found');
    });

    it('should return 403 if user not authorized', async () => {
      const res = await request(app)
        .post('/api/messages/send')
        .set('Authorization', `Bearer ${token1}`)
        .send({
          matchId,
          senderId: '000000000000000000000000',
          receiverId: user2Id,
          content: 'Hello!',
        });

      expect(res.statusCode).toBe(403);
    });
  });

  describe('GET /api/messages/match/:matchId', () => {
    it('should retrieve conversation messages', async () => {
      // Send a message first
      await request(app)
        .post('/api/messages/send')
        .set('Authorization', `Bearer ${token1}`)
        .send({
          matchId,
          senderId: user1Id,
          receiverId: user2Id,
          content: 'Test message',
        });

      const res = await request(app)
        .get(`/api/messages/match/${matchId}`)
        .set('Authorization', `Bearer ${token1}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0].content).toBe('Test message');
    });
  });

  describe('PUT /api/messages/read/:matchId', () => {
    it('should mark messages as read', async () => {
      const res = await request(app)
        .put(`/api/messages/read/${matchId}`)
        .set('Authorization', `Bearer ${token2}`)
        .send({
          userId: user2Id,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
