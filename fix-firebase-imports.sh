#!/bin/bash

# Find all TypeScript/TSX files with Firebase imports and comment them out
find src -type f \( -name "*.ts" -o -name "*.tsx" \) | while read file; do
  if grep -q "from.*firebase\|import.*firebase" "$file"; then
    echo "Fixing: $file"
    # Comment out Firebase imports
    sed -i '' 's/^import.*firebase.*$/\/\/ REMOVED FIREBASE: &/' "$file"
    sed -i '' 's/^export.*from.*firebase.*$/\/\/ REMOVED FIREBASE: &/' "$file"
  fi
done

echo "✅ All Firebase imports commented out"
