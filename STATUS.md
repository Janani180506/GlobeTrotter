# Application Status

## Services Running

### ✅ MongoDB
- **Status**: Running
- **Port**: 27017
- **Database**: triptales

### 🔄 Backend Server
- **Status**: Starting...
- **Port**: 5000
- **URL**: http://localhost:5000

### 🔄 Frontend Server
- **Status**: Starting...
- **Port**: 3000
- **URL**: http://localhost:3000

## Access the Application

Once both servers are running (may take 30-60 seconds):

1. **Open your browser**: http://localhost:3000
2. **Sign up** for a new account
3. **Start creating trips!**

## Check Status

### Backend Status:
```bash
curl http://localhost:5000/api/cities
```
Should return JSON data if backend is running.

### Frontend Status:
Open http://localhost:3000 in your browser.

### MongoDB Status:
```bash
./start-mongodb.sh
```

## If Services Don't Start

### Backend Issues:
1. Check if port 5000 is available
2. Check MongoDB connection
3. Look at terminal output for errors

### Frontend Issues:
1. Check if port 3000 is available
2. Make sure backend is running first
3. Check browser console for errors

## Stop Services

Press `Ctrl+C` in the terminals where servers are running, or:

```bash
# Find and kill processes
pkill -f "node.*server.js"
pkill -f "react-scripts"
```

