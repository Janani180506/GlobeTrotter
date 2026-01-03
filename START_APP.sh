#!/bin/bash

echo "🚀 Starting GlobalTrotters Application..."
echo ""

# Check MongoDB
echo "📊 Checking MongoDB..."
if lsof -i :27017 > /dev/null 2>&1; then
    echo "✅ MongoDB is running"
else
    echo "⚠️  Starting MongoDB..."
    ./start-mongodb.sh
    sleep 2
fi

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  Creating .env file..."
    cat > .env << 'ENVEOF'
PORT=5001
MONGODB_URI=mongodb://localhost:27017/triptales
JWT_SECRET=54f48ef739483ef7149a4c2ca6120e462923a5e872d6f5b792fd860d1bbc6557
JWT_EXPIRE=7d
NODE_ENV=development
ENVEOF
    echo "✅ .env file created"
fi

# Check dependencies
if [ ! -d "node_modules" ]; then
    echo "⚠️  Installing backend dependencies..."
    npm install
fi

if [ ! -d "client/node_modules" ]; then
    echo "⚠️  Installing frontend dependencies..."
    cd client && npm install && cd ..
fi

# Kill existing processes
echo ""
echo "🧹 Cleaning up existing processes..."
pkill -f "nodemon.*Triptales" 2>/dev/null
pkill -f "react-scripts.*Triptales" 2>/dev/null
sleep 2

# Start backend
echo ""
echo "🔧 Starting backend server on port 5001..."
cd /Users/priya/Triptales
npm run dev > backend.log 2>&1 &
BACKEND_PID=$!
sleep 3

# Verify backend
if curl -s http://localhost:5001/api/cities > /dev/null 2>&1; then
    echo "✅ Backend server started successfully"
else
    echo "❌ Backend server failed to start. Check backend.log"
    exit 1
fi

# Start frontend
echo ""
echo "🎨 Starting frontend server on port 3000..."
cd client
npm start > ../frontend.log 2>&1 &
FRONTEND_PID=$!
sleep 5

# Verify frontend
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend server started successfully"
else
    echo "⚠️  Frontend may still be starting..."
fi

echo ""
echo "=========================================="
echo "✅ All services are running!"
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend:  http://localhost:5001"
echo "📊 MongoDB:  localhost:27017"
echo ""
echo "Press Ctrl+C to stop all services"
echo "=========================================="
echo ""

# Wait for user interrupt
trap "echo ''; echo '🛑 Stopping services...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
wait

