#!/bin/bash

# Switch between landing page versions (v1 vs v2)
# Usage: ./switch-landing-version.sh v1
#        ./switch-landing-version.sh v2

VERSION=${1:-v1}

if [ "$VERSION" != "v1" ] && [ "$VERSION" != "v2" ]; then
  echo "❌ Usage: ./switch-landing-version.sh [v1|v2]"
  exit 1
fi

LANDING_DIR="apps/landing-page"
BACKUP_DIR="apps/landing-page-versions"

echo "🔄 Switching to landing page $VERSION..."

# Backup current version
CURRENT_VERSION=$(cat "$LANDING_DIR/.version" 2>/dev/null || echo "v1")
if [ "$CURRENT_VERSION" != "$VERSION" ]; then
  cp -r "$LANDING_DIR/src" "$BACKUP_DIR/$CURRENT_VERSION/" 2>/dev/null
fi

# Copy target version
cp -r "$BACKUP_DIR/$VERSION/src" "$LANDING_DIR/src"
echo "$VERSION" > "$LANDING_DIR/.version"

echo "✅ Now using landing page $VERSION"
echo ""
echo "Run: pnpm dev:landing"
