# Setup Guide - GlobalTrotters Travel Planning App

This guide will walk you through setting up and running the application step by step.

## Prerequisites

Before you begin, make sure you have installed:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **MongoDB** (choose one option below)

## Step 1: Install Dependencies

### 1.1 Install Backend Dependencies

Open your terminal in the project root directory (`/Users/priya/Triptales`) and run:

```bash
npm install
```

This will install all backend dependencies (Express, Mongoose, JWT, etc.)

### 1.2 Install Frontend Dependencies

```bash
cd client
npm install
cd ..
```

This will install all React frontend dependencies.

## Step 2: Set Up MongoDB

You have two options for MongoDB:

### Option A: Local MongoDB Installation

1. **Install MongoDB locally:**
   - **macOS**: `brew install mongodb-community`
   - **Windows**: Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - **Linux**: Follow [MongoDB Installation Guide](https://docs.mongodb.com/manual/installation/)

2. **Start MongoDB service:**
   - **macOS/Linux**: `brew services start mongodb-community` or `mongod`
   - **Windows**: MongoDB should start as a service automatically

3. **Verify MongoDB is running:**
   ```bash
   mongosh
   ```
   If it connects, you're good to go! Type `exit` to leave.

### Option B: MongoDB Atlas (Cloud - Recommended for Beginners)

1. **Create a free account:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for a free account

2. **Create a cluster:**
   - Click "Build a Database"
   - Choose the FREE tier (M0)
   - Select a cloud provider and region (choose closest to you)
   - Click "Create"

3. **Set up database access:**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create a username and password (save these!)
   - Set user privileges to "Atlas admin" or "Read and write to any database"
   - Click "Add User"

4. **Configure network access:**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development) or add your IP
   - Click "Confirm"

5. **Get your connection string:**
   - Go to "Database" in the left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/`)
   - Replace `<password>` with your actual password
   - Replace `<dbname>` with `triptales` (or any name you prefer)

## Step 3: Configure Environment Variables

1. **Create a `.env` file** in the root directory (`/Users/priya/Triptales/.env`):

   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/triptales
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```

2. **Update the `MONGODB_URI` based on your MongoDB setup:**

   **For Local MongoDB:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/triptales
   ```

   **For MongoDB Atlas:**
   ```env
   MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster0.xxxxx.mongodb.net/triptales?retryWrites=true&w=majority
   ```
   (Replace `yourusername`, `yourpassword`, and `cluster0.xxxxx` with your actual values)

3. **Generate a secure JWT secret:**
   - You can use any random string (at least 32 characters recommended)
   - Or generate one: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
   - Copy the output and use it as your `JWT_SECRET`

## Step 4: Seed the Database (Optional but Recommended)

This will populate your database with sample cities and activities:

```bash
npm run seed
```

You should see output like:
```
MongoDB connected
6 cities seeded
9 activities seeded
Database seeded successfully
```

## Step 5: Run the Application

You have two options to run the app:

### Option 1: Run Both Servers Together (Recommended)

In the root directory, run:

```bash
npm run dev:all
```

This will start both the backend (port 5000) and frontend (port 3000) simultaneously.

### Option 2: Run Servers Separately

**Terminal 1 - Backend:**
```bash
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```

## Step 6: Access the Application

Once both servers are running:

- **Frontend**: Open [http://localhost:3000](http://localhost:3000) in your browser
- **Backend API**: Available at [http://localhost:5000](http://localhost:5000)

## Step 7: Create Your First Account

1. Navigate to `http://localhost:3000`
2. Click "Sign up" or go to `/signup`
3. Fill in:
   - Name
   - Email
   - Password (minimum 6 characters)
   - Confirm Password
4. Click "Sign Up"
5. You'll be automatically logged in and redirected to the dashboard

## Troubleshooting

### MongoDB Connection Issues

**Error: "MongoDB connection error"**

1. **For Local MongoDB:**
   - Verify MongoDB is running: `mongosh` or `mongo`
   - Check if the port is correct (default: 27017)
   - Try: `brew services restart mongodb-community` (macOS)

2. **For MongoDB Atlas:**
   - Verify your IP is whitelisted in Network Access
   - Check your username and password are correct
   - Ensure the connection string format is correct
   - Make sure you replaced `<password>` and `<dbname>` in the connection string

**Error: "Authentication failed"**

- Double-check your MongoDB username and password
- For Atlas, ensure the user has proper permissions

### Port Already in Use

**Error: "Port 5000 already in use"**

- Change the PORT in `.env` to another number (e.g., 5001)
- Or kill the process using port 5000:
  ```bash
  # macOS/Linux
  lsof -ti:5000 | xargs kill
  
  # Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  ```

**Error: "Port 3000 already in use"**

- React will automatically ask if you want to use port 3001
- Or manually change it in `client/package.json` scripts

### Frontend Not Connecting to Backend

- Ensure the backend is running on port 5000
- Check that `proxy` is set in `client/package.json` (should be `"proxy": "http://localhost:5000"`)
- Clear browser cache and restart both servers

### Module Not Found Errors

- Delete `node_modules` and `package-lock.json`
- Run `npm install` again in both root and client directories

## Quick Start Checklist

- [ ] Node.js installed
- [ ] MongoDB installed/running OR Atlas account created
- [ ] Backend dependencies installed (`npm install`)
- [ ] Frontend dependencies installed (`cd client && npm install`)
- [ ] `.env` file created with correct MongoDB URI
- [ ] Database seeded (`npm run seed`)
- [ ] Both servers running (`npm run dev:all`)
- [ ] Application accessible at http://localhost:3000

## Next Steps

After setup:
1. Create your user account
2. Create your first trip
3. Add cities and activities
4. View your budget breakdown
5. Share your itinerary!

## Need Help?

- Check the main [README.md](README.md) for more details
- Review the API endpoints documentation
- Check MongoDB logs for connection issues
- Verify all environment variables are set correctly

