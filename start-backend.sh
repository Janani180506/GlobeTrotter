#!/bin/bash

echo "🚀 Starting GlobalTrotters Backend Server..."
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found!"
    echo "Creating .env file..."
    cat > .env << 'ENVEOF'
PORT=5000
MONGODB_URI=mongodb://localhost:27017/triptales
JWT_SECRET=54f48ef739483ef7149a4c2ca6120e462923a5e872d6f5b792fd860d1bbc6557
JWT_EXPIRE=7d
NODE_ENV=development
ENVEOF
    echo "✅ .env file created"
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "⚠️  Dependencies not installed!"
    echo "Installing dependencies..."
    npm install
fi

# Check MongoDB
echo "Checking MongoDB connection..."
node test-mongodb.js > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "⚠️  MongoDB connection failed!"
    echo "Starting MongoDB..."
    ./start-mongodb.sh
    sleep 2
fi

# Start the server
echo ""
echo "Starting backend server on port 5000..."
echo "Press Ctrl+C to stop"
echo ""
npm run dev

