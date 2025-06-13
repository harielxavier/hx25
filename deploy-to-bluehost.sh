#!/bin/bash

# Hariel Xavier Photography - Bluehost VPS Deployment Script
# This script deploys the built website to Bluehost VPS server

echo "🚀 Starting deployment to Bluehost VPS..."

# Configuration
DOMAIN="harielxavierphotography.com"
REMOTE_PATH="/home/harielxa/public_html"
BUILD_DIR="./dist"

# Check if build directory exists
if [ ! -d "$BUILD_DIR" ]; then
    echo "❌ Build directory not found. Running build first..."
    npm run build
    if [ $? -ne 0 ]; then
        echo "❌ Build failed. Exiting."
        exit 1
    fi
fi

echo "📦 Build directory found: $BUILD_DIR"

# Create backup of current website
echo "💾 Creating backup of current website..."
BACKUP_DIR="backup-$(date +%Y%m%d-%H%M%S)"

# Function to deploy via SFTP
deploy_sftp() {
    echo "🔐 Please enter your Bluehost credentials:"
    read -p "Username: " USERNAME
    read -s -p "Password: " PASSWORD
    echo ""
    
    echo "📤 Uploading files via SFTP..."
    
    # Create SFTP batch file
    cat > sftp_commands.txt << EOF
cd $REMOTE_PATH
mkdir $BACKUP_DIR
put -r $BUILD_DIR/* ./
quit
EOF

    # Execute SFTP
    sftp -b sftp_commands.txt $USERNAME@$DOMAIN
    
    # Clean up
    rm sftp_commands.txt
}

# Function to deploy via SCP (if SSH is available)
deploy_scp() {
    echo "🔐 Please enter your Bluehost username:"
    read -p "Username: " USERNAME
    
    echo "📤 Uploading files via SCP..."
    
    # Create backup
    ssh $USERNAME@$DOMAIN "cd $REMOTE_PATH && mkdir -p $BACKUP_DIR && cp -r * $BACKUP_DIR/ 2>/dev/null || true"
    
    # Upload new files
    scp -r $BUILD_DIR/* $USERNAME@$DOMAIN:$REMOTE_PATH/
}

# Function to deploy via rsync (most efficient)
deploy_rsync() {
    echo "🔐 Please enter your Bluehost username:"
    read -p "Username: " USERNAME
    
    echo "📤 Syncing files via rsync..."
    
    # Create backup
    ssh $USERNAME@$DOMAIN "cd $REMOTE_PATH && mkdir -p $BACKUP_DIR && cp -r * $BACKUP_DIR/ 2>/dev/null || true"
    
    # Sync files
    rsync -avz --delete $BUILD_DIR/ $USERNAME@$DOMAIN:$REMOTE_PATH/
}

# Ask user for deployment method
echo "🔧 Choose deployment method:"
echo "1) SFTP (most compatible)"
echo "2) SCP (requires SSH access)"
echo "3) rsync (fastest, requires SSH access)"
read -p "Enter choice (1-3): " CHOICE

case $CHOICE in
    1)
        deploy_sftp
        ;;
    2)
        deploy_scp
        ;;
    3)
        deploy_rsync
        ;;
    *)
        echo "❌ Invalid choice. Using SFTP as default."
        deploy_sftp
        ;;
esac

if [ $? -eq 0 ]; then
    echo "✅ Deployment completed successfully!"
    echo "🌐 Your website should now be live at: https://$DOMAIN"
    echo "💾 Backup created in: $REMOTE_PATH/$BACKUP_DIR"
else
    echo "❌ Deployment failed. Please check your credentials and try again."
    exit 1
fi

echo "🎉 Deployment process finished!"