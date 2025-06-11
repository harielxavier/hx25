#!/bin/bash
# Script to deploy the email fix to Firebase Functions

echo "Starting email fix deployment..."

# Navigate to the functions directory
cd "$(dirname "$0")/functions"

# Build the functions
echo "Building functions..."
npm run build

# Deploy only the functions that handle emails
echo "Deploying functions..."
firebase deploy --only functions:onLeadCreatedWithAdmin

echo "Deployment complete!"
