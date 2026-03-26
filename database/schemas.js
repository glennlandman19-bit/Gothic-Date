const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    bio: { type: String },
    profileImage: { type: String },
    age: { type: Number },
    interests: [{ type: String }],
    location: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const profileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    photos: [{ type: String }],
    bio: { type: String },
    interests: [{ type: String }],
    age: { type: Number },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    lookingFor: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const matchSchema = new mongoose.Schema({
    user1Id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    user2Id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    matchedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
});

const messageSchema = new mongoose.Schema({
    matchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Match', required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    read: { type: Boolean, default: false }
});

const subscriptionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    plan: { type: String, enum: ['free', 'daily', 'monthly', 'yearly'], default: 'free' },
    swipeLimit: { type: Number, required: true },
    messagesEnabled: { type: Boolean, default: false },
    premiumFeatures: { type: Boolean, default: false },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    price: { type: Number },
    stripeSubscriptionId: { type: String },
    status: { type: String, enum: ['active', 'cancelled', 'expired'], default: 'active' }
});

const swipeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    targetUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    liked: { type: Boolean, required: true },
    swipedAt: { type: Date, default: Date.now }
});

module.exports = { User: mongoose.model('User', userSchema), Profile: mongoose.model('Profile', profileSchema), Match: mongoose.model('Match', matchSchema), Message: mongoose.model('Message', messageSchema), Subscription: mongoose.model('Subscription', subscriptionSchema), Swipe: mongoose.model('Swipe', swipeSchema) };