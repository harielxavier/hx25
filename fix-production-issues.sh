#!/bin/bash

# Fix Production Issues Script
# Addresses: 404 errors, 403 forbidden, JWT secrets, file permissions

echo "🔧 Fixing production issues..."

# 1. Create .env.production with proper JWT secrets
echo "🔑 Setting up production environment variables..."
cat > .env.production << 'EOF'
# Production Environment Variables
VITE_FIREBASE_API_KEY=AIzaSyAXW2TqnlSymyfdZULM4NN3gfSG_imcv0U
VITE_FIREBASE_AUTH_DOMAIN=harielxavierphotography-18d17.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=harielxavierphotography-18d17
VITE_FIREBASE_STORAGE_BUCKET=harielxavierphotography-18d17.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=195040006099
VITE_FIREBASE_APP_ID=1:195040006099:web:4d670ea2b5d859ab606926
VITE_FIREBASE_MEASUREMENT_ID=G-SB0Q9ER7KW

# JWT Secrets (32+ characters, production-safe)
JWT_SECRET=harielxavier_production_jwt_secret_2024_secure_key_32chars_minimum
JWT_REFRESH_SECRET=harielxavier_refresh_token_secret_2024_production_secure_64chars_minimum

# Google Calendar API
VITE_GOOGLE_CALENDAR_API_KEY=AIzaSyAXW2TqnlSymyfdZULM4NN3gfSG_imcv0U
VITE_GOOGLE_CALENDAR_CLIENT_ID=195040006099-3vi02q1l80gltjcetvbepmfb7m9gst4l.apps.googleusercontent.com

# Production URLs
VITE_APP_URL=https://harielxavier.com
VITE_API_URL=https://harielxavier.com/api
EOF

# 2. Create .htaccess for proper file permissions and redirects
echo "📁 Creating .htaccess for file permissions..."
cat > dist/.htaccess << 'EOF'
# Hariel Xavier Photography - Production .htaccess

# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Set proper MIME types
<IfModule mod_mime.c>
    AddType application/javascript .js
    AddType text/css .css
    AddType image/png .png
    AddType image/jpeg .jpg
    AddType image/jpeg .jpeg
    AddType image/gif .gif
    AddType image/svg+xml .svg
    AddType video/mp4 .mp4
    AddType application/pdf .pdf
</IfModule>

# Fix file permissions - allow access to all files
<FilesMatch "\.(css|js|png|jpg|jpeg|gif|svg|mp4|pdf|txt|json|html)$">
    Require all granted
    Header set Access-Control-Allow-Origin "*"
</FilesMatch>

# Prevent access to sensitive files
<FilesMatch "\.(env|log|sql|bak)$">
    Require all denied
</FilesMatch>

# React Router - redirect all requests to index.html
<IfModule mod_rewrite.c>
    RewriteEngine On
    
    # Handle Angular and React Router
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</IfModule>

# Cache control
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>

# Security headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
</IfModule>
EOF

# 3. Rebuild with production environment
echo "🏗️ Rebuilding with production configuration..."
npm run build

# 4. Fix file permissions in dist directory
echo "🔒 Setting proper file permissions..."
find dist -type f -name "*.html" -exec chmod 644 {} \;
find dist -type f -name "*.css" -exec chmod 644 {} \;
find dist -type f -name "*.js" -exec chmod 644 {} \;
find dist -type f -name "*.png" -exec chmod 644 {} \;
find dist -type f -name "*.jpg" -exec chmod 644 {} \;
find dist -type f -name "*.jpeg" -exec chmod 644 {} \;
find dist -type f -name "*.gif" -exec chmod 644 {} \;
find dist -type f -name "*.svg" -exec chmod 644 {} \;
find dist -type f -name "*.mp4" -exec chmod 644 {} \;
find dist -type f -name "*.pdf" -exec chmod 644 {} \;
find dist -type d -exec chmod 755 {} \;

echo "✅ Production fixes applied!"
echo "📋 Next steps:"
echo "   1. Upload the updated dist/ folder to your server"
echo "   2. Ensure .htaccess is in the root of public_html"
echo "   3. Check file permissions on server (644 for files, 755 for directories)"
echo "   4. Clear browser cache to remove BlogManagerActions.js 404 error"