#!/bin/bash

# Hariel Xavier Photography - Bluehost Deployment Script
# Deploy to harielxavier.com

echo "🚀 Starting deployment to harielxavier.com..."

# Configuration
DOMAIN="harielxavier.com"
USERNAME="missiongeek"
REMOTE_PATH="/home/missiongeek/public_html"
BUILD_DIR="./dist"

# Check if build directory exists
if [ ! -d "$BUILD_DIR" ]; then
    echo "❌ Build directory not found. Please run 'npm run build' first."
    exit 1
fi

echo "📦 Build directory found: $BUILD_DIR"

# Create backup of current website
echo "💾 Creating backup of current website..."
BACKUP_DIR="backup-$(date +%Y%m%d-%H%M%S)"

echo "📤 Uploading files via SFTP..."

# Create SFTP batch file
cat > sftp_commands.txt << EOF
cd $REMOTE_PATH
mkdir $BACKUP_DIR
mput $BUILD_DIR/*
put -r $BUILD_DIR/assets
put -r $BUILD_DIR/images
put -r $BUILD_DIR/MoStuff
quit
EOF

# Execute SFTP with credentials
echo "🔐 Connecting to $DOMAIN..."
sftp -b sftp_commands.txt $USERNAME@$DOMAIN

# Clean up
rm sftp_commands.txt

if [ $? -eq 0 ]; then
    echo "✅ Deployment completed successfully!"
    echo "🌐 Your website should now be live at: https://$DOMAIN"
    echo "💾 Backup created in: $REMOTE_PATH/$BACKUP_DIR"
else
    echo "❌ Deployment failed. Please check your credentials and try again."
    exit 1
fi

echo "🎉 Deployment process finished!"