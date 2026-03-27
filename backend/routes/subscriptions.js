const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_key');
const { Subscription, User } = require('../database/schemas');

router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const subscription = await Subscription.findOne({ userId });

    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    res.json(subscription);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/create-payment-intent', async (req, res) => {
  try {
    const { userId, plan } = req.body;

    const planPrices = {
      daily: 299,
      monthly: 999,
      yearly: 9999
    };

    if (!planPrices[plan]) {
      return res.status(400).json({ error: 'Invalid plan' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: planPrices[plan],
      currency: 'usd',
      metadata: { userId, plan }
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/update', async (req, res) => {
  try {
    const { userId, plan, stripeSubscriptionId } = req.body;

    const planLimits = {
      free: 10,
      daily: 50,
      monthly: 200,
      yearly: Infinity
    };

    const planPrices = {
      free: 0,
      daily: 2.99,
      monthly: 9.99,
      yearly: 99.99
    };

    const subscription = await Subscription.findOneAndUpdate(
      { userId },
      {
        plan,
        swipeLimit: planLimits[plan],
        messagesEnabled: plan !== 'free',
        premiumFeatures: plan !== 'free' && plan !== 'daily',
        price: planPrices[plan],
        stripeSubscriptionId,
        status: 'active'
      },
      { new: true }
    );

    res.json(subscription);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
