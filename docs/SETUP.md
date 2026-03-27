# Gothic Date - Complete Setup Guide

## Prerequisites

- Node.js v16+
- npm or yarn
- MongoDB Atlas account
- Stripe account
- Git

---

## Backend Setup

### 1. Clone Repository

\`\`\`bash
git clone https://github.com/glennlandman19-bit/Gothic-Date.git
cd Gothic-Date/backend
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Create Environment File

\`\`\`bash
cp .env.example .env
\`\`\`

### 4. Configure .env

Edit \`.env\` and add:

\`\`\`env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gothic-date
JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRATION=24h
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_key
CORS_ORIGIN=http://localhost:8081
\`\`\`

### 5. Start Server

\`\`\`bash
npm start
\`\`\`

Expected output:
\`\`\`
🚀 Gothic Date API running on port 3000
🌍 Environment: development
\`\`\`

---

## Frontend Setup

### 1. Navigate to Frontend

\`\`\`bash
cd ../frontend
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
# or
expo install
\`\`\`

### 3. Create .env

\`\`\`bash
echo "EXPO_PUBLIC_API_URL=http://localhost:3000" > .env
\`\`\`

### 4. Start Expo

\`\`\`bash
expo start
\`\`\`

### 5. Run on Device

- **iOS:** Press \`i\`
- **Android:** Press \`a\`
- **Physical:** Scan QR with Expo Go app

---

## Running Tests

### Backend Tests

\`\`\`bash
cd backend
npm test
\`\`\`

### With Coverage

\`\`\`bash
npm test -- --coverage
\`\`\`

---

## Deployment

### Deploy Backend to Heroku

\`\`\`bash
cd backend
heroku create gothic-date-api
heroku config:set JWT_SECRET=your_secret
heroku config:set MONGODB_URI=your_uri
heroku config:set STRIPE_SECRET_KEY=your_key
git push heroku main
\`\`\`

### Deploy Frontend with EAS

\`\`\`bash
cd frontend
eas build --platform ios
eas build --platform android
eas submit
\`\`\`

---

## Troubleshooting

### MongoDB Connection Failed
- Check IP whitelist in MongoDB Atlas
- Verify credentials in .env
- Test connection string

### Stripe Key Issues
- Use TEST keys (starts with pk_test_ or sk_test_)
- Never commit live keys to repo

### Port Already in Use
\`\`\`bash
lsof -i :3000
kill -9 <PID>
\`\`\`

---

**Need help? Check API.md or open a GitHub issue**
