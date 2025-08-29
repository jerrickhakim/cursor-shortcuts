#!/bin/bash

# Simple wrapper script for the Rocko CLI tool
# Usage: ./s <command>

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Run the CLI tool
node "$SCRIPT_DIR/index.js" "$@"
