const express = require('express');
const router = express.Router();
const { Message, Match } = require('../database/schemas');

router.get('/match/:matchId', async (req, res) => {
  try {
    const { matchId } = req.params;
    const messages = await Message.find({ matchId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/send', async (req, res) => {
  try {
    const { matchId, senderId, receiverId, content } = req.body;

    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(400).json({ error: 'Match not found' });
    }

    const isValidMatch = (match.user1Id.toString() === senderId && match.user2Id.toString() === receiverId) ||
                         (match.user1Id.toString() === receiverId && match.user2Id.toString() === senderId);

    if (!isValidMatch) {
      return res.status(403).json({ error: 'Not authorized to send message' });
    }

    const message = new Message({
      matchId,
      senderId,
      receiverId,
      content
    });

    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/read/:matchId', async (req, res) => {
  try {
    const { matchId } = req.params;
    const { userId } = req.body;

    await Message.updateMany(
      { matchId, receiverId: userId, read: false },
      { read: true }
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
