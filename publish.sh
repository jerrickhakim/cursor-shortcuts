#!/bin/bash

# Cursor File Shortcuts Publishing Script

echo "🚀 Publishing Cursor File Shortcuts to npm..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Make sure you're in the cli_tool directory."
    exit 1
fi

# Check if npm is logged in
if ! npm whoami &> /dev/null; then
    echo "❌ Not logged in to npm. Please run 'npm login' first."
    exit 1
fi

# Run tests
echo "🧪 Running tests..."
npm test

if [ $? -ne 0 ]; then
    echo "❌ Tests failed. Please fix the issues before publishing."
    exit 1
fi

# Check if there are uncommitted changes
if [ -d ".git" ]; then
    if ! git diff-index --quiet HEAD --; then
        echo "⚠️  Warning: You have uncommitted changes."
        read -p "Continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo "❌ Publishing cancelled."
            exit 1
        fi
    fi
fi

# Publish to npm
echo "📦 Publishing to npm..."
npm publish

if [ $? -eq 0 ]; then
    echo "✅ Successfully published to npm!"
    echo ""
    echo "Users can now install with:"
echo "  npm install -g cursor-shortcuts"
else
    echo "❌ Failed to publish to npm."
    exit 1
fi
