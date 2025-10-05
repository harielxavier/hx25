#!/bin/bash

echo "🔄 Switching to Supabase..."
echo ""

# Create backup of current service imports
echo "📦 Creating backup of current services..."
mkdir -p .backup/services
cp -r src/services/*.ts .backup/services/ 2>/dev/null || true

# Function to update imports in a file
update_imports() {
    local file=$1
    echo "  Updating: $file"
    
    # Update blog service imports
    sed -i.bak "s|from ['\"].*services/blogService['\"]|from '../services/supabase/blogService'|g" "$file"
    sed -i.bak "s|from ['\"].*services/blog['\"]|from '../services/supabase/blogService'|g" "$file"
    
    # Update gallery service imports
    sed -i.bak "s|from ['\"].*services/galleryService['\"]|from '../services/supabase/galleryService'|g" "$file"
    
    # Update client service imports
    sed -i.bak "s|from ['\"].*services/clientService['\"]|from '../services/supabase/clientService'|g" "$file"
    
    # Update lead service imports
    sed -i.bak "s|from ['\"].*services/leadService['\"]|from '../services/supabase/leadService'|g" "$file"
    
    # Update storage service imports
    sed -i.bak "s|from ['\"].*services/storageService['\"]|from '../services/supabase/storageService'|g" "$file"
    
    # Update analytics service imports
    sed -i.bak "s|from ['\"].*services/analyticsService['\"]|from '../services/supabase/analyticsService'|g" "$file"
    
    # Remove backup files
    rm -f "${file}.bak"
}

# Update all TypeScript/TSX files in src
echo ""
echo "🔧 Updating service imports in all files..."
find src -name "*.tsx" -o -name "*.ts" | while read file; do
    if grep -q "from.*services/" "$file" 2>/dev/null; then
        update_imports "$file"
    fi
done

# Update App.tsx to use Supabase Auth
echo ""
echo "🔐 Updating authentication context in App.tsx..."
sed -i.bak "s|from './contexts/AuthContext'|from './contexts/SupabaseAuthContext'|g" src/App.tsx
sed -i.bak "s|useAuth()|useSupabaseAuth as useAuth()|g" src/App.tsx
rm -f src/App.tsx.bak

echo ""
echo "✅ Migration to Supabase services complete!"
echo ""
echo "📋 Next steps:"
echo "  1. Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are in your .env"
echo "  2. Run: node migrate-to-supabase.mjs (to migrate data)"
echo "  3. Test your app: npm run dev"
echo ""
echo "🔙 To rollback: cp -r .backup/services/* src/services/"
echo ""
