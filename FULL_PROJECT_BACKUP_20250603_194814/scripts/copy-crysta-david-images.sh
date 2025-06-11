#!/bin/bash

# Script to copy Crysta & David wedding images to the project directory
# This assumes the images are in a directory that's visible in Finder

SOURCE_DIR="/Users/bigmo/Crysta & David"
TARGET_DIR="/Users/bigmo/Documents/Current Projects/HarielXavierPhotography Website Current/public/Crysta & David"

# Create target directory if it doesn't exist
mkdir -p "$TARGET_DIR"

# Copy all jpg files
echo "Copying Crysta & David wedding images..."
cp "$SOURCE_DIR"/*.jpg "$TARGET_DIR"/ 2>/dev/null || echo "No jpg files found"
cp "$SOURCE_DIR"/*.jpeg "$TARGET_DIR"/ 2>/dev/null || echo "No jpeg files found"
cp "$SOURCE_DIR"/*.png "$TARGET_DIR"/ 2>/dev/null || echo "No png files found"

# Count copied files
NUM_FILES=$(ls -1 "$TARGET_DIR" | wc -l)
echo "Copied $NUM_FILES files to $TARGET_DIR"

# Make the script executable
chmod +x "$0"

echo "Done!"
