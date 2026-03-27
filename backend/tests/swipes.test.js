const request = require('supertest');
const { app } = require('../server');
const { User, Swipe, Subscription } = require('../database/schemas');

describe('Swipes API', () => {
  let userId, targetUserId, token;

  beforeAll(async () => {
    // Clear test data
    await User.deleteMany({});
    await Swipe.deleteMany({});
    await Subscription.deleteMany({});

    // Create test users
    const user1 = await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'swipeuser1',
        email: 'swipe1@example.com',
        password: 'password123',
        firstName: 'Swipe',
        lastName: 'User1',
      });

    const user2 = await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'swipeuser2',
        email: 'swipe2@example.com',
        password: 'password123',
        firstName: 'Swipe',
        lastName: 'User2',
      });

    userId = user1.body.user.id;
    targetUserId = user2.body.user.id;
    token = user1.body.token;
  });

  describe('POST /api/swipes/swipe', () => {
    it('should record a swipe successfully', async () => {
      const res = await request(app)
        .post('/api/swipes/swipe')
        .set('Authorization', `Bearer ${token}`)
        .send({
          userId,
          targetUserId,
          liked: true,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('newMatch');
      expect(res.body.newMatch).toBe(false); // Only one user swiped
    });

    it('should enforce swipe limit', async () => {
      // Create multiple users to swipe on
      for (let i = 0; i < 12; i++) {
        await request(app)
          .post('/api/auth/signup')
          .send({
            username: `limituser${i}`,
            email: `limit${i}@example.com`,
            password: 'password123',
            firstName: 'Limit',
            lastName: `User${i}`,
          });
      }

      // Get subscription to check limit
      const sub = await Subscription.findOne({ userId });
      expect(sub.swipeLimit).toBe(10);

      // Try to exceed limit (should fail on 11th swipe)
      let res;
      for (let i = 0; i < 11; i++) {
        const targetUser = await User.findOne({ username: `limituser${i}` });
        res = await request(app)
          .post('/api/swipes/swipe')
          .set('Authorization', `Bearer ${token}`)
          .send({
            userId,
            targetUserId: targetUser._id,
            liked: true,
          });
      }

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Daily swipe limit reached');
    });
  });

  describe('GET /api/swipes/suggestions/:userId', () => {
    it('should return profile suggestions', async () => {
      const res = await request(app)
        .get(`/api/swipes/suggestions/${userId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should not return already swiped users', async () => {
      const res = await request(app)
        .get(`/api/swipes/suggestions/${userId}`)
        .set('Authorization', `Bearer ${token}`);

      const suggestedIds = res.body.map(u => u._id);
      expect(suggestedIds).not.toContain(targetUserId.toString());
    });
  });
});
