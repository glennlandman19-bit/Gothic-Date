const express = require('express');
const router = express.Router();
const { Swipe, Match, User, Subscription } = require('../database/schemas');

router.post('/swipe', async (req, res) => {
  try {
    const { userId, targetUserId, liked } = req.body;

    const subscription = await Subscription.findOne({ userId });
    if (!subscription) {
      return res.status(400).json({ error: 'No subscription found' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const swipesToday = await Swipe.countDocuments({
      userId,
      swipedAt: { $gte: today }
    });

    if (swipesToday >= subscription.swipeLimit) {
      return res.status(400).json({ error: 'Daily swipe limit reached' });
    }

    const swipe = new Swipe({
      userId,
      targetUserId,
      liked
    });

    await swipe.save();

    if (liked) {
      const reverseSwipe = await Swipe.findOne({
        userId: targetUserId,
        targetUserId: userId,
        liked: true
      });

      if (reverseSwipe) {
        const match = new Match({
          user1Id: userId,
          user2Id: targetUserId,
          status: 'accepted'
        });
        await match.save();
        return res.json({ match: match._id, newMatch: true });
      }
    }

    res.json({ newMatch: false });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/suggestions/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const swipedUsers = await Swipe.find({ userId }).select('targetUserId');
    const swipedIds = swipedUsers.map(s => s.targetUserId);

    const suggestions = await User.find({
      _id: { $nin: [userId, ...swipedIds] }
    }).limit(10);

    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
