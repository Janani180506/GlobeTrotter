# Quick Start Guide - MongoDB is Running! ✅

## Current Status

✅ **MongoDB is running on port 27017**
✅ **Connection test successful**

## Next Steps

### 1. Create Environment File

Create a `.env` file in the root directory with:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/triptales
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
JWT_EXPIRE=7d
NODE_ENV=development
```

**Quick JWT Secret Generator:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Install Dependencies (if not done)

```bash
# Backend dependencies
npm install

# Frontend dependencies
cd client
npm install
cd ..
```

### 3. Seed the Database (Optional but Recommended)

This will populate your database with sample cities and activities:

```bash
npm run seed
```

Expected output:
```
MongoDB connected
6 cities seeded
9 activities seeded
Database seeded successfully
```

### 4. Start the Application

```bash
npm run dev:all
```

This starts:
- **Backend** on http://localhost:5000
- **Frontend** on http://localhost:3000

### 5. Open in Browser

Navigate to: **http://localhost:3000**

### 6. Create Your Account

1. Click "Sign up"
2. Fill in your details
3. Start creating trips!

## MongoDB Management

### Check MongoDB Status
```bash
./start-mongodb.sh
```

### Stop MongoDB
```bash
brew services stop mongodb-community
```

### Restart MongoDB
```bash
brew services restart mongodb-community
```

### View MongoDB Logs
```bash
tail -f data/mongod.log
```

## Troubleshooting

### If MongoDB stops running:
```bash
./start-mongodb.sh
```

### If you need to reset the database:
```bash
# Stop MongoDB first
brew services stop mongodb-community

# Delete data
rm -rf data/db

# Restart MongoDB
./start-mongodb.sh

# Reseed
npm run seed
```

## All Set! 🎉

Your MongoDB is running and ready. Just follow steps 1-6 above to start using the application!

