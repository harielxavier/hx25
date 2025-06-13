#!/bin/bash

# Hariel Xavier Photography - SFTP Deployment Script
# Deploy to harielxavier.com via SFTP

echo "🚀 Starting SFTP deployment to harielxavier.com..."

# Configuration
SFTP_HOST="harielxavier.com"
SFTP_USER="missiongeek"
SFTP_PASS="Vamos!!86"
REMOTE_PATH="/public_html"
BUILD_DIR="./dist"

# Check if build directory exists
if [ ! -d "$BUILD_DIR" ]; then
    echo "❌ Build directory not found. Please run 'npm run build' first."
    exit 1
fi

echo "📦 Build directory found: $BUILD_DIR"
echo "🔐 Connecting to $SFTP_HOST via SFTP..."

# Create SFTP batch commands
cat > sftp_commands.txt << 'EOF'
cd /public_html
lcd ./dist
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
mkdir assets
cd assets
lcd assets
mput *
cd ..
lcd ..
mkdir images
cd images
lcd images
put -r *
cd ..
lcd ..
mkdir MoStuff
cd MoStuff
lcd MoStuff
put -r *
cd ..
lcd ..
mkdir uploads
cd uploads
lcd uploads
put -r *
cd ..
lcd ..
mkdir view
cd view
lcd view
put -r *
quit
EOF

# Execute SFTP with password authentication
echo "📤 Uploading files via SFTP..."
sshpass -p "$SFTP_PASS" sftp -o StrictHostKeyChecking=no -b sftp_commands.txt "$SFTP_USER@$SFTP_HOST"

# Clean up
rm sftp_commands.txt

if [ $? -eq 0 ]; then
    echo "✅ Deployment completed successfully!"
    echo "🌐 Your website should now be live at: https://$SFTP_HOST"
else
    echo "❌ SFTP deployment failed. Trying alternative method..."
    
    # Try rsync as backup
    echo "🔄 Attempting rsync deployment..."
    sshpass -p "$SFTP_PASS" rsync -avz --delete -e "ssh -o StrictHostKeyChecking=no" "$BUILD_DIR/" "$SFTP_USER@$SFTP_HOST:$REMOTE_PATH/"
    
    if [ $? -eq 0 ]; then
        echo "✅ Rsync deployment completed successfully!"
        echo "🌐 Your website should now be live at: https://$SFTP_HOST"
    else
        echo "❌ All deployment methods failed. Please check credentials and server configuration."
        exit 1
    fi
fi

echo "🎉 Deployment process finished!"