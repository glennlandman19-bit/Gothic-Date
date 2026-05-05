## 💬 Gothic-Date Messaging Feature

### 📋 Overview

The in-app messaging feature enables paid subscribers to communicate with matched users. Messages are protected behind a subscription paywall and include read receipts, message history, and soft deletes.

### 🔐 Requirements

- ✅ **Active Paid Subscription** - Required for all messaging operations
- ✅ **JWT Authentication** - Users must be logged in
- ✅ **Valid Conversation** - Messages exist within conversations between two users

---

## 🏗️ Architecture

### Database Models

#### **Conversation Model**
```javascript
{
  participants: [userId, userId],      // Two users in conversation
  lastMessage: messageId,                // Reference to most recent message
  isActive: Boolean,                     // Soft delete flag
  createdAt: Date,
  updatedAt: Date
}
```

#### **Message Model**
```javascript
{
  conversation: conversationId,
  sender: userId,
  recipient: userId,
  content: String (max 500 chars),
  isRead: Boolean,
  readAt: Date,
  deletedBy: [userId],                   // Soft delete tracking
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔌 API Endpoints

All endpoints require `Authorization: Bearer <JWT_TOKEN>` header and active subscription.

### **Conversations**

#### Get All Conversations
```
GET /api/conversations
```
**Response:**
```json
{
  "success": true,
  "conversations": [
    {
      "_id": "convId",
      "participants": [
        { "_id": "userId", "username": "darkRaven", "avatar": "url" },
        { "_id": "userId", "username": "moonWhisper", "avatar": "url" }
      ],
      "lastMessage": { "content": "...", "createdAt": "2026-05-05T..." },
      "createdAt": "2026-05-01T...",
      "updatedAt": "2026-05-05T..."
    }
  ]
}
```

#### Create New Conversation
```
POST /api/conversations
Content-Type: application/json

{
  "participantId": "userId"
}
```

---

### **Messages**

#### Send Message
```
POST /api/messages/send
Content-Type: application/json

{
  "conversationId": "convId",
  "content": "Your message here"
}
```

**Validation:**
- Message length: 1-500 characters
- Both users must be participants in conversation
- Sender must have active subscription

**Response:**
```json
{
  "success": true,
  "message": {
    "_id": "msgId",
    "conversation": "convId",
    "sender": { "username": "darkRaven" },
    "recipient": "userId",
    "content": "Your message here",
    "isRead": false,
    "createdAt": "2026-05-05T10:30:00Z"
  }
}
```

#### Get Messages
```
GET /api/messages/:conversationId?limit=50&offset=0
```

**Response:**
```json
{
  "success": true,
  "messages": [
    {
      "_id": "msgId",
      "sender": { "username": "darkRaven" },
      "content": "Message content",
      "isRead": true,
      "createdAt": "2026-05-05T10:30:00Z"
    }
  ],
  "total": 120
}
```

**Note:** Automatically marks fetched messages as read

#### Mark as Read
```
PUT /api/messages/:conversationId/read
```

#### Delete Message (Soft Delete)
```
DELETE /api/messages/:messageId
```

#### Get Unread Count
```
GET /api/messages/unread/count
```

**Response:**
```json
{
  "success": true,
  "unreadCount": 5
}
```

---

## 🎨 Frontend Components

### **ChatWindow Component**
Main messaging interface with "Kinship Seeker" header.

```jsx
import ChatWindow from './components/ChatWindow';

<ChatWindow 
  conversation={conversationData}
  currentUserId={userId}
  onClose={handleClose}
  onSendMessage={handleSend}
/>
```

**Features:**
- ✨ Gothic aesthetic with dark red borders, gold accents
- 💬 Real-time message display with auto-scroll
- ⏰ Message timestamps
- 🎯 Sent/received message differentiation
- 📝 Input validation (500 char limit)

### **ConversationsList Component**
Sidebar showing active conversations with search.

```jsx
import ConversationsList from './components/ConversationsList';

<ConversationsList 
  conversations={conversationData}
  currentUserId={userId}
  onSelectConversation={handleSelect}
  onCreateNew={handleNewChat}
/>
```

**Features:**
- 🔍 Search conversations by username
- 👤 User avatars with fallback initials
- ✋ Last message preview
- 🎨 Hover animations
- 📱 Responsive design

### **MessageService**
API client for all messaging operations.

```javascript
import messageService from './services/MessageService';

// Get conversations
const conversations = await messageService.getConversations();

// Send message
await messageService.sendMessage(conversationId, 'Hello!');

// Mark as read
await messageService.markAsRead(conversationId);

// Create conversation
const newConv = await messageService.createConversation(userId);
```

---

## 🔒 Security Features

### **Subscription Verification**
```javascript
// Middleware checks:
✓ User has valid JWT token
✓ Subscription is active
✓ Subscription expiration date is in future
```

### **Authorization Checks**
```javascript
✓ Users can only access their own conversations
✓ Users can only send/receive messages in conversations they're part of
✓ Only sender/recipient can delete messages
```

### **Input Validation**
```javascript
✓ Message length: 1-500 characters
✓ No empty messages
✓ SQL injection prevention (MongoDB)
✓ XSS protection (sanitization)
```

---

## 🚀 Setup & Integration

### **Backend Setup**

1. **Install Dependencies**
   ```bash
   npm install mongoose express
   ```

2. **Import Models**
   ```javascript
   const Message = require('./models/Message');
   const Conversation = require('./models/Conversation');
   ```

3. **Add Routes**
   ```javascript
   const messageRoutes = require('./routes/messageRoutes');
   app.use('/api', messageRoutes);
   ```

4. **Add Middleware**
   ```javascript
   const checkSubscription = require('./middleware/checkSubscription');
   ```

### **Frontend Setup**

1. **Install MessageService**
   ```javascript
   import messageService from './services/MessageService';
   ```

2. **Set API Base URL** (in `.env`)
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

3. **Add Components to App**
   ```jsx
   import ChatWindow from './components/ChatWindow';
   import ConversationsList from './components/ConversationsList';
   
   <div className="messaging-area">
     <ConversationsList {...props} />
     <ChatWindow {...props} />
   </div>
   ```

---

## 🎨 Gothic Styling

### **Color Scheme**
- **Primary Dark**: `#1a0000` (Deep blood red)
- **Border**: `#8b0000` (Dark crimson)
- **Accent Gold**: `#d4af37` (Mystical gold)
- **Secondary Pink**: `#ff69b4` (Hot pink text)
- **Background Gradient**: `linear-gradient(135deg, #1a0000 0%, #2d1b1b 50%)`

### **Effects**
- 🌟 Text glow animations
- 👁️ Shadow depths (multiple layers)
- ⬆️ Hover lift animations
- 🔄 Smooth transitions
- 📱 Responsive breakpoints (768px, 480px)

---

## 📊 Usage Examples

### **Send Message**
```javascript
try {
  const result = await messageService.sendMessage(
    '507f1f77bcf86cd799439011',
    'Your dark desires are heard, kindred soul...'
  );
  console.log('Message sent:', result.message._id);
} catch (error) {
  if (error.message.includes('subscription')) {
    // Show upgrade modal
  } else {
    console.error('Failed to send:', error);
  }
}
```

### **Load Conversations**
```javascript
useEffect(() => {
  const loadConversations = async () => {
    try {
      const data = await messageService.getConversations();
      setConversations(data.conversations);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  };
  
  loadConversations();
}, []);
```

### **Monitor Unread**
```javascript
const checkUnread = async () => {
  const { unreadCount } = await messageService.getUnreadCount();
  setBadgeCount(unreadCount);
};

setInterval(checkUnread, 5000); // Poll every 5 seconds
```

---

## 🐛 Error Handling

### **Common Errors**

| Status | Error | Solution |
|--------|-------|----------|
| 403 | Paid subscription required | Show upgrade prompt |
| 401 | User not authenticated | Redirect to login |
| 404 | Conversation not found | Handle gracefully |
| 400 | Invalid message | Validate before sending |
| 500 | Server error | Retry or contact support |

---

## 🔮 Future Enhancements

- 🔴 Real-time messaging with WebSockets
- 📸 Image/attachment sharing
- 💌 Message reactions/emojis
- 🔔 Push notifications
- 📞 Voice/video calls
- 🌙 End-to-end encryption
- 📋 Message search/filters
- 👥 Group conversations

---

## ✅ Testing

### **Manual Testing Checklist**

- [ ] Create conversation between two users
- [ ] Send message (verify content length validation)
- [ ] Receive message (verify read status)
- [ ] Mark as read (verify read timestamp)
- [ ] Delete message (verify soft delete)
- [ ] Test without subscription (verify 403 error)
- [ ] Search conversations
- [ ] Load conversation history
- [ ] Test on mobile (responsive design)
- [ ] Test error states (network failures, server errors)

---

## 📚 Related Documentation

- [User Authentication](./AUTH.md)
- [Subscription System](./SUBSCRIPTION.md)
- [Database Schema](./DATABASE.md)
- [API Reference](./API.md)

---

**Last Updated:** 2026-05-05  
**Status:** ✅ Production Ready  
**Maintainer:** Gothic-Date Team
