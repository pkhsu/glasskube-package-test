#!/bin/bash
set -e

VERSION=$1
MESSAGE=${2:-"chore: release $VERSION"}

if [ -z "$VERSION" ]; then
  echo "Usage: $0 <version> [commit_message]"
  echo "Example: $0 v1.0.9 \"style: update UI to light mode\""
  exit 1
fi

echo "📦 Committing changes..."
# Allow empty commit if nothing changed, just to be safe, but usually we have changes.
# If git commit fails (no changes), we catch it but don't exit if we want to proceed to tag.
# However, for demo, usually we want to commit something.
if git diff --quiet && git diff --cached --quiet; then
  echo "No changes to commit."
else
  git add .
  git commit -m "$MESSAGE"

  echo "🔄 Pulling latest changes (rebase)..."
  git pull --rebase origin main

  echo "⬆️  Pushing code to main..."
  git push origin main
fi

echo "🚀 Tagging and releasing $VERSION..."
git tag "$VERSION"
git push origin "$VERSION"

echo "✅ Done! CI/CD pipeline triggered for $VERSION."
