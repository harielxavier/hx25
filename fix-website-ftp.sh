#!/bin/bash

echo "🔧 Quick FTP Fix for Hariel Xavier Photography Website"
echo "====================================================="

# Configuration
FTP_HOST="ftp.harielxavier.com"
REMOTE_PATH="/public_html"

echo "🔐 Enter your Bluehost FTP credentials:"
read -p "FTP Username: " FTP_USER
read -s -p "FTP Password: " FTP_PASS
echo ""

echo "📤 Uploading fixed index.html via FTP..."

# Create FTP script to upload fixed index.html
cat > ftp_fix.txt << EOF
open $FTP_HOST
user $FTP_USER $FTP_PASS
binary
cd $REMOTE_PATH
put fixed-index.html index.html
quit
EOF

# Execute FTP
ftp -n < ftp_fix.txt

# Clean up
rm ftp_fix.txt

echo "✅ Fixed index.html uploaded!"
echo "🌐 Test your website at: https://harielxavier.com"

# Also create a backup script to fix the Vite build issue
echo ""
echo "🔧 Creating production build with correct paths..."

# Update vite config for production
cat > vite.config.fix.ts << 'VITE_EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
})
VITE_EOF

echo "📝 Vite config fix created. To rebuild with correct paths:"
echo "   1. cp vite.config.fix.ts vite.config.ts"
echo "   2. npm run build"
echo "   3. Re-deploy the dist folder"