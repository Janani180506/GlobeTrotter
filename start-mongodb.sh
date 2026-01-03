#!/bin/bash

# MongoDB Startup Script for GlobalTrotters

echo "🚀 Starting MongoDB for GlobalTrotters..."

# Create data directory if it doesn't exist
mkdir -p data/db

# Check if MongoDB is already running
if lsof -Pi :27017 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "✅ MongoDB is already running on port 27017"
    echo "Testing connection..."
    mongosh --eval "db.adminCommand('ping')" --quiet
    if [ $? -eq 0 ]; then
        echo "✅ MongoDB connection successful!"
        exit 0
    else
        echo "⚠️  MongoDB port is in use but connection failed"
    fi
else
    echo "Starting MongoDB server..."
    
    # Try to start MongoDB using brew services (macOS)
    if command -v brew &> /dev/null; then
        echo "Using Homebrew to start MongoDB..."
        brew services start mongodb-community 2>/dev/null || brew services start mongodb-community@6.0 2>/dev/null
        
        # Wait a moment for MongoDB to start
        sleep 3
        
        # Check if it's running
        if lsof -Pi :27017 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
            echo "✅ MongoDB started successfully via Homebrew!"
        else
            echo "⚠️  Homebrew service start may have failed, trying direct start..."
            # Fallback to direct start
            mongod --dbpath "$(pwd)/data/db" --port 27017 --fork --logpath "$(pwd)/data/mongod.log"
            sleep 2
            if lsof -Pi :27017 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
                echo "✅ MongoDB started successfully!"
            else
                echo "❌ Failed to start MongoDB"
                exit 1
            fi
        fi
    else
        # Direct start without brew
        echo "Starting MongoDB directly..."
        mongod --dbpath "$(pwd)/data/db" --port 27017 --fork --logpath "$(pwd)/data/mongod.log"
        sleep 2
        if lsof -Pi :27017 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
            echo "✅ MongoDB started successfully!"
        else
            echo "❌ Failed to start MongoDB"
            echo "Check the log file: data/mongod.log"
            exit 1
        fi
    fi
fi

echo ""
echo "📊 MongoDB Status:"
echo "   Port: 27017"
echo "   Database: triptales"
echo "   Data directory: $(pwd)/data/db"
echo ""
echo "✅ MongoDB is ready to use!"
echo ""
echo "Next steps:"
echo "1. Run: npm run seed (to populate sample data)"
echo "2. Run: npm run dev:all (to start the application)"

