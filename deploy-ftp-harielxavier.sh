#!/bin/bash

# Hariel Xavier Photography - FTP Deployment Script
# Deploy to harielxavier.com via FTP

echo "🚀 Starting FTP deployment to harielxavier.com..."

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

# Create FTP script
cat > ftp_script.txt << EOF
open $FTP_HOST
user $FTP_USER $FTP_PASS
binary
cd $REMOTE_PATH
lcd $BUILD_DIR

# Upload main files
put index.html
put robots.txt
put sitemap.xml
put fallback.html
put imagetest.html
put test-view.html
put test.html
put logo.svg
put placeholder-image.jpg
put sample-galleries.json

# Create and upload assets directory
mkdir assets
cd assets
lcd assets
mput *
cd ..
lcd ..

# Create and upload images directory
mkdir images
cd images
lcd images
mput *
cd ..
lcd ..

# Create and upload MoStuff directory
mkdir MoStuff
cd MoStuff
lcd MoStuff
mput *
cd ..
lcd ..

# Create and upload uploads directory
mkdir uploads
cd uploads
lcd uploads
mput *
cd ..
lcd ..

# Create and upload view directory
mkdir view
cd view
lcd view
mput *
cd ..
lcd ..

quit
EOF

# Execute FTP commands
ftp -n < ftp_script.txt

# Clean up
rm ftp_script.txt

if [ $? -eq 0 ]; then
    echo "✅ Deployment completed successfully!"
    echo "🌐 Your website should now be live at: https://$FTP_HOST"
else
    echo "❌ Deployment failed. Please check the connection and try again."
    exit 1
fi

echo "🎉 Deployment process finished!"