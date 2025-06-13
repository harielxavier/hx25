#!/bin/bash

# Alternative FTP deployment script for Bluehost
echo "📁 FTP Deployment to Bluehost"
echo "================================"

# Configuration
DOMAIN="harielxavierphotography.com"
FTP_HOST="ftp.harielxavierphotography.com"
REMOTE_PATH="/public_html"
BUILD_DIR="./dist"

# Check if build exists
if [ ! -d "$BUILD_DIR" ]; then
    echo "❌ Build directory not found. Please run 'npm run build' first."
    exit 1
fi

echo "🔐 Enter your Bluehost FTP credentials:"
read -p "FTP Username: " FTP_USER
read -s -p "FTP Password: " FTP_PASS
echo ""

echo "📤 Uploading files via FTP..."

# Create FTP script
cat > ftp_upload.txt << EOF
open $FTP_HOST
user $FTP_USER $FTP_PASS
binary
cd $REMOTE_PATH
lcd $BUILD_DIR
prompt off
mput *
mput -r *
quit
EOF

# Execute FTP
ftp -n < ftp_upload.txt

# Clean up
rm ftp_upload.txt

echo "✅ FTP upload completed!"
echo "🌐 Check your website at: https://$DOMAIN"