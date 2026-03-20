#!/bin/bash

# Switch between web app versions (v1 vs v2)
# Usage: ./switch-web-version.sh v1
#        ./switch-web-version.sh v2

VERSION=${1:-v1}

if [ "$VERSION" != "v1" ] && [ "$VERSION" != "v2" ]; then
  echo "❌ Usage: ./switch-web-version.sh [v1|v2]"
  exit 1
fi

WEB_DIR="apps/web"
VERSIONS_DIR="apps/web-versions"

echo "🔄 Switching to web app $VERSION..."

# Backup current version
CURRENT_VERSION=$(cat "$WEB_DIR/.version" 2>/dev/null || echo "v1")
if [ "$CURRENT_VERSION" != "$VERSION" ]; then
  cp -r "$WEB_DIR/src" "$VERSIONS_DIR/$CURRENT_VERSION/src" 2>/dev/null
  echo "  Backed up $CURRENT_VERSION"
fi

# Copy target version
rm -rf "$WEB_DIR/src"
cp -r "$VERSIONS_DIR/$VERSION/src" "$WEB_DIR/src"
echo "$VERSION" > "$WEB_DIR/.version"

echo "✅ Now using web app $VERSION"
echo ""
echo "Run: pnpm dev:web"