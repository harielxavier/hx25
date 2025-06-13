#!/bin/bash

# Hariel Xavier Photography - cURL FTP Deployment Script
# Deploy to harielxavier.com via FTP using curl

echo "🚀 Starting cURL FTP deployment to harielxavier.com..."

# Configuration
FTP_HOST="harielxavier.com"
FTP_USER="missiongeek"
FTP_PASS="Vamos!!86"
REMOTE_PATH="/public_html"
BUILD_DIR="./dist"

# Check if build directory exists
if [ ! -d "$BUILD_DIR" ]; then
    echo "❌ Build directory not found. Please run 'npm run build' first."
    exit 1
fi

echo "📦 Build directory found: $BUILD_DIR"
echo "🔐 Connecting to $FTP_HOST..."

# Function to upload file via curl
upload_file() {
    local file="$1"
    local remote_path="$2"
    echo "📤 Uploading $file..."
    curl -T "$file" "ftp://$FTP_USER:$FTP_PASS@$FTP_HOST$remote_path" --ftp-create-dirs
}

# Function to upload directory recursively
upload_directory() {
    local local_dir="$1"
    local remote_dir="$2"
    
    echo "📁 Uploading directory: $local_dir -> $remote_dir"
    
    # Create remote directory
    curl -Q "MKD $remote_dir" "ftp://$FTP_USER:$FTP_PASS@$FTP_HOST/"
    
    # Upload all files in directory
    for file in "$local_dir"/*; do
        if [ -f "$file" ]; then
            filename=$(basename "$file")
            upload_file "$file" "$remote_dir/$filename"
        elif [ -d "$file" ]; then
            dirname=$(basename "$file")
            upload_directory "$file" "$remote_dir/$dirname"
        fi
    done
}

# Upload main files
echo "📤 Uploading main files..."
upload_file "$BUILD_DIR/index.html" "$REMOTE_PATH/index.html"
upload_file "$BUILD_DIR/robots.txt" "$REMOTE_PATH/robots.txt"
upload_file "$BUILD_DIR/sitemap.xml" "$REMOTE_PATH/sitemap.xml"
upload_file "$BUILD_DIR/fallback.html" "$REMOTE_PATH/fallback.html"
upload_file "$BUILD_DIR/imagetest.html" "$REMOTE_PATH/imagetest.html"
upload_file "$BUILD_DIR/test-view.html" "$REMOTE_PATH/test-view.html"
upload_file "$BUILD_DIR/test.html" "$REMOTE_PATH/test.html"
upload_file "$BUILD_DIR/logo.svg" "$REMOTE_PATH/logo.svg"
upload_file "$BUILD_DIR/placeholder-image.jpg" "$REMOTE_PATH/placeholder-image.jpg"
upload_file "$BUILD_DIR/sample-galleries.json" "$REMOTE_PATH/sample-galleries.json"

# Upload directories
echo "📁 Uploading directories..."
upload_directory "$BUILD_DIR/assets" "$REMOTE_PATH/assets"
upload_directory "$BUILD_DIR/images" "$REMOTE_PATH/images"
upload_directory "$BUILD_DIR/MoStuff" "$REMOTE_PATH/MoStuff"
upload_directory "$BUILD_DIR/uploads" "$REMOTE_PATH/uploads"
upload_directory "$BUILD_DIR/view" "$REMOTE_PATH/view"

echo "✅ Deployment completed successfully!"
echo "🌐 Your website should now be live at: https://$FTP_HOST"
echo "🎉 Deployment process finished!"