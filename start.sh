#!/bin/bash

echo "Starting Freespeek Admin Panel..."
echo "Make sure you're in the freespeek-admin directory"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "Error: package.json not found. Please run this script from the freespeek-admin directory."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Start the development server
echo "Starting development server..."
echo "The application will be available at: http://localhost:3000"
echo "Press Ctrl+C to stop the server"
echo ""

npm start 