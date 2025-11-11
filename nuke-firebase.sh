#!/bin/bash

# Replace ALL Firebase imports with comments
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec perl -i -pe 's/} from ['"'"']firebase\/.*['"'"'];?$/\/\/ REMOVED FIREBASE/g; s/^import .* from ['"'"']firebase.*$/\/\/ REMOVED FIREBASE/g; s/^import\(['"'"'].*firebase.*['"'"']\).*$/\/\/ REMOVED FIREBASE/g; s/await import\(['"'"'].*firebase.*['"'"']\)/\/\/ REMOVED FIREBASE/g' {} \;

echo "✅ Nuked all Firebase"
