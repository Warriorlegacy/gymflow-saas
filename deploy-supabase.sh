#!/bin/bash

# GymFlow Supabase Migration Auto-Deploy Script
# Usage: ./deploy-migrations.sh

set -e

echo "🏋️ Deploying GymFlow Supabase Migrations..."

# Check for required environment variables
if [ -z "$SUPABASE_DB_URL" ] && [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
    echo "❌ Error: SUPABASE_DB_URL or NEXT_PUBLIC_SUPABASE_URL must be set"
    exit 1
fi

# Get Supabase project ref from URL
SUPABASE_URL=${SUPABASE_DB_URL:-$NEXT_PUBLIC_SUPABASE_URL}
PROJECT_REF=$(echo $SUPABASE_URL | sed 's/.*\/\/\([^.]*\).*/\1/')

echo "📦 Project: $PROJECT_REF"

# Check if supabase CLI is available
if ! command -v supabase &> /dev/null; then
    echo "📦 Installing Supabase CLI..."
    npm install -g supabase
fi

# Link to project (if not already linked)
echo "🔗 Linking to Supabase project..."
supabase link --project-ref $PROJECT_REF 2>/dev/null || true

# Run migrations
echo "🚀 Running migrations..."
supabase db push

echo "✅ Deployment complete!"
