# Fix: Registration Failed Error

## Problem
The registration is failing because the **backend server is not running**.

## Solution: Start the Backend Server

### Quick Fix (Recommended)

**Option 1: Start both frontend and backend together**
```bash
npm run dev:all
```

**Option 2: Start backend separately**

Open a **new terminal window** and run:
```bash
cd /Users/priya/Triptales
npm run dev
```

You should see:
```
MongoDB connected
Server running on port 5000
```

### Alternative: Use the startup script
```bash
./start-backend.sh
```

## Port 5000 Conflict

If you see "Port 5000 already in use", you have two options:

### Option A: Use a different port (Recommended)

1. Update `.env` file:
```env
PORT=5001
```

2. Update `client/package.json`:
```json
"proxy": "http://localhost:5001"
```

3. Restart both servers

### Option B: Kill the process using port 5000

```bash
# Find what's using port 5000
lsof -ti:5000

# Kill it (replace PID with actual number)
kill -9 <PID>
```

## Step-by-Step Fix

1. **Open a new terminal** (keep the frontend running)

2. **Navigate to project directory**:
   ```bash
   cd /Users/priya/Triptales
   ```

3. **Start the backend**:
   ```bash
   npm run dev
   ```

4. **Verify it's running**:
   - You should see: "MongoDB connected" and "Server running on port 5000"
   - Open http://localhost:5000/api/cities in browser (should show JSON)

5. **Try registration again** in the frontend

## Verify Everything is Working

### Check Backend:
```bash
curl http://localhost:5000/api/cities
```
Should return JSON data.

### Check MongoDB:
```bash
./start-mongodb.sh
```

### Check Browser Console:
1. Open browser developer tools (F12)
2. Go to Network tab
3. Try registering again
4. Look for `/api/auth/register` request
5. Check the response status and error message

## Common Error Messages

### "Cannot connect to server"
→ Backend is not running. Start it with `npm run dev`

### "Network Error"
→ Backend is not running or wrong port. Check `client/package.json` proxy setting.

### "User already exists"
→ Email is already registered. Try a different email or login instead.

### "MongoDB connection error"
→ MongoDB is not running. Run `./start-mongodb.sh`

## After Starting Backend

Once the backend is running, you should see in the terminal:
```
MongoDB connected
Server running on port 5000
```

Then try registering again. The registration should work!

## Still Not Working?

1. **Check browser console** (F12) for specific error
2. **Check backend terminal** for error messages
3. **Verify MongoDB is running**: `./start-mongodb.sh`
4. **Verify .env file exists** with correct MongoDB URI

