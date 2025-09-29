#!/bin/bash

# StudySync AI Backend Start Script

echo "🚀 Starting StudySync AI Backend..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install/update dependencies
echo "📚 Installing dependencies..."
pip install -r requirements.txt

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚙️  Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your configuration before running the server!"
    echo "   You can edit it with: nano .env"
    echo ""
fi

# Start the server
echo "🌟 Starting FastAPI server..."
echo "📖 API Documentation will be available at: http://localhost:8000/docs"
echo "🏠 Frontend should be running at: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

python main.py