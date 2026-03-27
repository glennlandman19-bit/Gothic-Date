const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    minlength: 3,
    maxlength: 20
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true
  },
  passwordHash: { 
    type: String, 
    required: true 
  },
  firstName: { 
    type: String 
  },
  lastName: { 
    type: String 
  },
  bio: { 
    type: String,
    maxlength: 500
  },
  profileImage: { 
    type: String 
  },
  age: { 
    type: Number,
    min: 18,
    max: 120
  },
  interests: [{ 
    type: String 
  }],
  location: { 
    type: String 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Profile Schema
const profileSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    unique: true
  },
  photos: [{ 
    type: String 
  }],
  bio: { 
    type: String 
  },
  interests: [{ 
    type: String 
  }],
  age: { 
    type: Number 
  },
  gender: { 
    type: String, 
    enum: ['Male', 'Female', 'Other'] 
  },
  lookingFor: { 
    type: String 
  },
  height: { 
    type: String 
  },
  bodyType: { 
    type: String 
  },
  religion: { 
    type: String 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Match Schema
const matchSchema = new mongoose.Schema({
  user1Id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  user2Id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  matchedAt: { 
    type: Date, 
    default: Date.now 
  },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'rejected'], 
    default: 'pending' 
  },
  lastMessageAt: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

// Message Schema
const messageSchema = new mongoose.Schema({
  matchId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Match', 
    required: true 
  },
  senderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  receiverId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  read: { 
    type: Boolean, 
    default: false 
  },
  readAt: {
    type: Date
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
});

// Subscription Schema
const subscriptionSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    unique: true
  },
  plan: { 
    type: String, 
    enum: ['free', 'daily', 'monthly', 'yearly'], 
    default: 'free' 
  },
  swipeLimit: { 
    type: Number, 
    required: true 
  },
  messagesEnabled: { 
    type: Boolean, 
    default: false 
  },
  premiumFeatures: { 
    type: Boolean, 
    default: false 
  },
  startDate: { 
    type: Date, 
    default: Date.now 
  },
  endDate: { 
    type: Date 
  },
  price: { 
    type: Number 
  },
  currency: {
    type: String,
    default: 'USD'
  },
  stripeCustomerId: {
    type: String
  },
  stripeSubscriptionId: { 
    type: String 
  },
  stripePaymentMethodId: {
    type: String
  },
  status: { 
    type: String, 
    enum: ['active', 'cancelled', 'expired', 'pending'], 
    default: 'active' 
  },
  billingCycle: {
    type: String,
    enum: ['monthly', 'yearly']
  },
  autoRenew: {
    type: Boolean,
    default: true
  },
  cancelledAt: {
    type: Date
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Swipe Schema
const swipeSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  targetUserId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  liked: { 
    type: Boolean, 
    required: true 
  },
  swipedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Report Schema
const reportSchema = new mongoose.Schema({
  reporterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reportedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reason: {
    type: String,
    enum: ['inappropriate', 'spam', 'scam', 'offensive', 'other'],
    required: true
  },
  description: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'resolved'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  reviewedAt: {
    type: Date
  },
  resolvedAt: {
    type: Date
  }
});

// Block Schema
const blockSchema = new mongoose.Schema({
  blockerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  blockedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Export models
module.exports = {
  User: mongoose.model('User', userSchema),
  Profile: mongoose.model('Profile', profileSchema),
  Match: mongoose.model('Match', matchSchema),
  Message: mongoose.model('Message', messageSchema),
  Subscription: mongoose.model('Subscription', subscriptionSchema),
  Swipe: mongoose.model('Swipe', swipeSchema),
  Report: mongoose.model('Report', reportSchema),
  Block: mongoose.model('Block', blockSchema)
};
