# Gothic Date API Documentation

## Base URL
\`\`\`
http://localhost:3000/api
\`\`\`

---

## Authentication Endpoints

### Sign Up
**POST** \`/auth/signup\`

Create a new user account.

**Request Body:**
\`\`\`json
{
  "username": "gothicuser",
  "email": "user@example.com",
  "password": "securepassword123",
  "firstName": "Raven",
  "lastName": "Dark"
}
\`\`\`

**Response (201):**
\`\`\`json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "gothicuser",
    "email": "user@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
\`\`\`

---

### Login
**POST** \`/auth/login\`

Authenticate user and return JWT token.

**Request Body:**
\`\`\`json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "gothicuser",
    "email": "user@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
\`\`\`

---

## Swipe Endpoints

### Record Swipe
**POST** \`/swipes/swipe\`

Record a user's swipe action.

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Request Body:**
\`\`\`json
{
  "userId": "507f1f77bcf86cd799439011",
  "targetUserId": "507f1f77bcf86cd799439013",
  "liked": true
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "newMatch": true,
  "match": {
    "_id": "507f1f77bcf86cd799439014",
    "user1Id": "507f1f77bcf86cd799439011",
    "user2Id": "507f1f77bcf86cd799439013",
    "status": "accepted"
  }
}
\`\`\`

---

### Get Suggestions
**GET** \`/swipes/suggestions/:userId\`

Get list of suggested profiles for swiping.

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Response (200):**
\`\`\`json
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "username": "lunamoon",
    "firstName": "Luna",
    "age": 24,
    "bio": "Nocturnal dreamer"
  }
]
\`\`\`

---

## Message Endpoints

### Send Message
**POST** \`/messages/send\`

Send a message to a matched user.

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Request Body:**
\`\`\`json
{
  "matchId": "507f1f77bcf86cd799439014",
  "senderId": "507f1f77bcf86cd799439011",
  "receiverId": "507f1f77bcf86cd799439013",
  "content": "Hey there!"
}
\`\`\`

**Response (201):**
\`\`\`json
{
  "_id": "507f1f77bcf86cd799439022",
  "matchId": "507f1f77bcf86cd799439014",
  "senderId": "507f1f77bcf86cd799439011",
  "receiverId": "507f1f77bcf86cd799439013",
  "content": "Hey there!",
  "read": false,
  "createdAt": "2026-03-26T12:15:00Z"
}
\`\`\`

---

### Get Conversation
**GET** \`/messages/match/:matchId\`

Get all messages in a conversation.

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Response (200):**
\`\`\`json
[
  {
    "_id": "507f1f77bcf86cd799439020",
    "matchId": "507f1f77bcf86cd799439014",
    "senderId": "507f1f77bcf86cd799439011",
    "receiverId": "507f1f77bcf86cd799439013",
    "content": "Hey! How are you?",
    "read": true,
    "createdAt": "2026-03-26T12:10:00Z"
  }
]
\`\`\`

---

## Subscription Endpoints

### Get Subscription
**GET** \`/subscriptions/:userId\`

Get user's current subscription details.

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Response (200):**
\`\`\`json
{
  "_id": "507f1f77bcf86cd799439030",
  "userId": "507f1f77bcf86cd799439011",
  "plan": "monthly",
  "swipeLimit": 200,
  "messagesEnabled": true,
  "premiumFeatures": true,
  "price": 9.99,
  "status": "active"
}
\`\`\`

---

### Create Payment Intent
**POST** \`/subscriptions/create-payment-intent\`

Create a Stripe payment intent for subscription purchase.

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Request Body:**
\`\`\`json
{
  "userId": "507f1f77bcf86cd799439011",
  "plan": "monthly"
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "clientSecret": "pi_3L7X5K2eZvKYlo2C1V7a8Z9x_secret_xxxx"
}
\`\`\`

---

## Error Responses

### 400 Bad Request
\`\`\`json
{
  "error": "Missing required fields"
}
\`\`\`

### 401 Unauthorized
\`\`\`json
{
  "error": "Invalid or missing token"
}
\`\`\`

### 404 Not Found
\`\`\`json
{
  "error": "Resource not found"
}
\`\`\`

### 500 Server Error
\`\`\`json
{
  "error": "Internal server error"
}
\`\`\`

---

**Last Updated:** 2026-03-26
