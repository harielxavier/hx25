#!/bin/bash

# Vercel Build Script with Validation
# This runs during Vercel deployment to ensure build quality

set -e  # Exit on any error

echo "🚀 Starting Vercel build with validation..."

# 1. Generate sitemap and RSS (prebuild)
echo "📄 Generating sitemap and RSS feed..."
npm run generate:sitemap
npm run generate:rss

# 2. Run production build
echo "🔨 Building production bundle..."
npm run build

# 3. Validate the build
echo "✅ Validating build..."
npm run build:validate

echo "🎉 Build validation passed! Deployment proceeding..."
