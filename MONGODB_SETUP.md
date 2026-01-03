# MongoDB Setup Instructions

## Quick Start

MongoDB appears to be installed on your system. Here's how to ensure it's running:

### Option 1: Use the Startup Script (Easiest)

```bash
./start-mongodb.sh
```

This script will:
- Check if MongoDB is already running
- Start MongoDB if needed
- Verify the connection

### Option 2: Manual Start with Homebrew (macOS)

```bash
# Start MongoDB as a service
brew services start mongodb-community

# Or if you have a specific version
brew services start mongodb-community@6.0
```

### Option 3: Start MongoDB Directly

```bash
# Create data directory
mkdir -p data/db

# Start MongoDB
mongod --dbpath data/db --port 27017
```

This will run MongoDB in the foreground. Press `Ctrl+C` to stop it.

### Option 4: Start MongoDB in Background

```bash
# Create data directory
mkdir -p data/db

# Start MongoDB in background
mongod --dbpath data/db --port 27017 --fork --logpath data/mongod.log
```

## Verify MongoDB is Running

### Check if MongoDB is listening on port 27017:

```bash
lsof -i :27017
```

### Test Connection with mongosh:

```bash
mongosh
```

If it connects, you'll see:
```
Current Mongosh Log ID: ...
Connecting to: mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000
Using MongoDB: 6.0.26
```

Type `exit` to leave.

### Test Connection with Node.js:

```bash
node test-mongodb.js
```

## Environment Configuration

Make sure your `.env` file contains:

```env
MONGODB_URI=mongodb://localhost:27017/triptales
```

## Common Issues

### Port 27017 Already in Use

If you see "Address already in use", MongoDB is already running! That's good.

To check what's using the port:
```bash
lsof -i :27017
```

### Permission Denied

If you get permission errors:
```bash
# Fix permissions for data directory
chmod -R 755 data/
```

### MongoDB Won't Start

1. Check if another MongoDB instance is running:
   ```bash
   ps aux | grep mongod
   ```

2. Check the log file:
   ```bash
   cat data/mongod.log
   ```

3. Try using the default MongoDB data directory:
   ```bash
   mongod --dbpath /usr/local/var/mongodb
   ```

## Stop MongoDB

### If started with Homebrew:
```bash
brew services stop mongodb-community
```

### If started directly:
```bash
# Find the process
ps aux | grep mongod

# Kill it (replace PID with actual process ID)
kill <PID>
```

## Next Steps

Once MongoDB is running:

1. **Seed the database** (optional but recommended):
   ```bash
   npm run seed
   ```

2. **Start the application**:
   ```bash
   npm run dev:all
   ```

3. **Access the app**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## MongoDB Data Location

- **Data directory**: `./data/db` (in project root)
- **Log file**: `./data/mongod.log` (if started with --logpath)

To reset the database, simply delete the data directory:
```bash
rm -rf data/db
```

Then start MongoDB again and run `npm run seed`.

