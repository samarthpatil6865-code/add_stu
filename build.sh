#!/usr/bin/env node

# Netlify build script for Class Folio Desk

echo "🚀 Starting Netlify build process..."

# Set environment variables
export NODE_ENV=production
export VITE_API_URL=https://your-backend-url.onrender.com

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Run linting (optional)
echo "🔍 Running linting..."
npm run lint || echo "⚠️ Linting warnings found, continuing build..."

# Run tests (optional)
echo "🧪 Running tests..."
npm run test || echo "⚠️ Tests failed, continuing build..."

# Build the application
echo "🏗️ Building application..."
npm run build

# Check if build was successful
if [ -d "dist" ]; then
    echo "✅ Build successful!"
    echo "📁 Build output in 'dist' directory"
    
    # List build contents
    echo "📋 Build contents:"
    ls -la dist/
    
    # Check for index.html
    if [ -f "dist/index.html" ]; then
        echo "✅ index.html found"
    else
        echo "❌ index.html not found"
        exit 1
    fi
else
    echo "❌ Build failed - no dist directory found"
    exit 1
fi

echo "🎉 Netlify build completed successfully!"
