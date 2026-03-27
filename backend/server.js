require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Import Routes
const authRoutes = require('./routes/auth');
const swipesRoutes = require('./routes/swipes');
const messagesRoutes = require('./routes/messages');
const subscriptionsRoutes = require('./routes/subscriptions');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/swipes', swipesRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/subscriptions', subscriptionsRoutes);

// Health Check Endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Gothic Date API!' });
});

// Socket.io Connection
io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);

  // Join conversation room
  socket.on('join-match', (matchId) => {
    socket.join(`match-${matchId}`);
    console.log(`User joined match: ${matchId}`);
  });

  // Send real-time message
  socket.on('send-message', (data) => {
    io.to(`match-${data.matchId}`).emit('receive-message', data);
    console.log('Message sent:', data);
  });

  // Typing indicator
  socket.on('typing', (data) => {
    io.to(`match-${data.matchId}`).emit('user-typing', data);
  });

  // Stop typing
  socket.on('stop-typing', (data) => {
    io.to(`match-${data.matchId}`).emit('user-stopped-typing', data);
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

// Start Server
server.listen(PORT, () => {
  console.log(`🚀 Gothic Date API running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = { app, server, io };
