#!/bin/bash
# ============================================
# Coolify Setup for dev.lucaszapico.space-v5
# Run once to create the app in Coolify with auto-deploy on push.
#
# Prerequisites:
#   1. Copy .coolify.env.example to .coolify.env and fill in your token
#   2. Ensure the GitHub App in Coolify has access to this repo
#      (GitHub Settings > Applications > coolifybluemonkey > Configure > add repo)
#   3. Code is pushed to GitHub (LucasZapico/dev.lucaszapico.space-v5)
#
# Usage:
#   ./scripts/coolify-setup.sh
# ============================================

set -e

# Load credentials
if [ ! -f .coolify.env ]; then
  echo "ERROR: .coolify.env not found. Copy .coolify.env.example and fill in your token."
  exit 1
fi
source .coolify.env

API="$COOLIFY_API"
TOKEN="$COOLIFY_TOKEN"
APP_UUID="$GITHUB_APP_UUID"

echo "==> Finding servers..."
SERVERS=$(curl -sf -H "Authorization: Bearer $TOKEN" "$API/servers")
echo "$SERVERS" | python3 -c "
import json, sys
for s in json.load(sys.stdin):
    print(f\"  {s['name']}: uuid={s['uuid']}\")"

echo ""
read -p "Enter server UUID for deployment: " SERVER_UUID

echo ""
echo "==> Finding projects..."
PROJECTS=$(curl -sf -H "Authorization: Bearer $TOKEN" "$API/projects")
echo "$PROJECTS" | python3 -c "
import json, sys
for p in json.load(sys.stdin):
    print(f\"  {p['name']}: uuid={p['uuid']}\")"

echo ""
echo "Enter project UUID (or 'new' to create one):"
read -p "> " PROJECT_UUID

if [ "$PROJECT_UUID" = "new" ]; then
  echo "==> Creating project..."
  PROJECT=$(curl -sf -X POST \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"name": "lucaszapico.space", "description": "Personal portfolio site"}' \
    "$API/projects")
  PROJECT_UUID=$(echo "$PROJECT" | python3 -c "import json,sys; print(json.load(sys.stdin)['uuid'])")
  echo "  Created project: $PROJECT_UUID"
fi

echo ""
echo "==> Finding destinations (Docker networks) on server..."
DESTINATIONS=$(curl -sf -H "Authorization: Bearer $TOKEN" "$API/servers/$SERVER_UUID/resources" 2>/dev/null || echo "[]")
# Just use the server UUID — Coolify will pick the default destination
echo "  Using default destination for server $SERVER_UUID"

echo ""
echo "==> Creating application..."
RESULT=$(curl -sf -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"project_uuid\": \"$PROJECT_UUID\",
    \"environment_name\": \"production\",
    \"server_uuid\": \"$SERVER_UUID\",
    \"name\": \"dev-lucaszapico-space-v5\",
    \"git_repository\": \"LucasZapico/dev.lucaszapico.space-v5\",
    \"git_branch\": \"master\",
    \"build_pack\": \"dockerfile\",
    \"ports_exposes\": \"3000\",
    \"github_app_uuid\": \"$APP_UUID\"
  }" \
  "$API/applications/private-github-app")

NEW_UUID=$(echo "$RESULT" | python3 -c "import json,sys; print(json.load(sys.stdin)['uuid'])")
echo "  App created: $NEW_UUID"

echo ""
echo "==> Enabling auto-deploy and setting Dockerfile..."
curl -sf -X PATCH \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "is_auto_deploy_enabled": true,
    "dockerfile_location": "/Dockerfile"
  }' \
  "$API/applications/$NEW_UUID" > /dev/null

echo "  Auto-deploy enabled"

echo ""
echo "==> Setting domain..."
curl -sf -X PATCH \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"fqdn": "https://dev.lucaszapico.space"}' \
  "$API/applications/$NEW_UUID" > /dev/null

echo "  Domain: https://dev.lucaszapico.space"

echo ""
echo "==> Triggering first deploy..."
curl -sf -X POST \
  -H "Authorization: Bearer $TOKEN" \
  "$API/deploy?uuid=$NEW_UUID&force=true" > /dev/null

echo "  Deploy triggered!"

echo ""
echo "==> Verifying webhook..."
sleep 3
HOOKS=$(gh api repos/LucasZapico/dev.lucaszapico.space-v5/hooks --jq '.[] | {id, active, url: .config.url}' 2>/dev/null || echo "none")
echo "  Webhooks: $HOOKS"

echo ""
echo "============================================"
echo "Setup complete!"
echo ""
echo "  App UUID:  $NEW_UUID"
echo "  Domain:    https://dev.lucaszapico.space"
echo "  Auto-deploy: ON (push to master)"
echo ""
echo "Save the app UUID to .coolify.env:"
echo "  APP_UUID=$NEW_UUID"
echo "============================================"
