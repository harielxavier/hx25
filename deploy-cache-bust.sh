#!/bin/bash

echo "🚀 Deploying with cache-busting to fix BlogManagerActions.js 404 error..."

# Build fresh version
echo "📦 Building fresh version..."
npm run build

# Add cache-busting headers to .htaccess
echo "🔄 Creating cache-busting .htaccess..."
cat > dist/.htaccess << 'EOF'
# Cache busting for HTML files
<FilesMatch "\.(html|htm)$">
    Header set Cache-Control "no-cache, no-store, must-revalidate"
    Header set Pragma "no-cache"
    Header set Expires 0
</FilesMatch>

# Cache busting for JS and CSS files
<FilesMatch "\.(js|css)$">
    Header set Cache-Control "no-cache, no-store, must-revalidate"
    Header set Pragma "no-cache"
    Header set Expires 0
</FilesMatch>

# Enable mod_rewrite
RewriteEngine On

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Handle React Router
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Set proper MIME types
AddType application/javascript .js
AddType text/css .css
AddType image/svg+xml .svg

# Security headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
EOF

# Deploy to server
echo "🌐 Deploying to server..."
scp -i bluehost_key -o StrictHostKeyChecking=no -r dist/* missiongeek@harielxavier.com:/home/missiongeek/public_html/

# Clear server cache by touching a cache-bust file
echo "💥 Clearing server cache..."
ssh -i bluehost_key -o StrictHostKeyChecking=no missiongeek@harielxavier.com "touch /home/missiongeek/public_html/cache-bust-$(date +%s).txt"

echo "✅ Deployment complete with cache-busting!"
echo "🔍 The BlogManagerActions.js 404 error should now be resolved."
echo "📱 Users may need to hard refresh (Ctrl+F5 or Cmd+Shift+R) to see changes."