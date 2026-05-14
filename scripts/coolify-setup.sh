#!/bin/bash
# ============================================
# Coolify bootstrap for dev.lucaszapico.space-v5
# Creates the app on hetzner-blue-1 with auto-deploy on push to master.
#
# Prerequisites:
#   1. `pass coolify/api-key` holds the Coolify API token
#   2. The GitHub App in Coolify has access to this repo
#      (GitHub Settings > Applications > coolifybluemonkey > Configure)
#   3. Code is pushed to LucasZapico/dev.lucaszapico.space-v5
#
# Usage:
#   ./scripts/coolify-setup.sh
# ============================================

set -euo pipefail

API="https://coolify.bluemonkeymakes.com/api/v1"
SERVER_UUID="vo8cgoo0wkc4404occscco88"   # hetzner-blue-1
PROJECT_UUID="ioc0skoc48808ggkcok0gooc"  # LucasZapico
GITHUB_APP_UUID="g048oc4gs8g4484gogo00k8c"
APP_NAME="dev-lucaszapico-space-v5"
REPO="LucasZapico/dev.lucaszapico.space-v5"
BRANCH="master"
PORT="3000"
DOMAIN="https://dev.lucaszapico.space"

TOKEN=$(pass coolify/api-key)

echo "==> Creating application on hetzner-blue-1..."
RESULT=$(curl -sf -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"project_uuid\": \"$PROJECT_UUID\",
    \"environment_name\": \"production\",
    \"server_uuid\": \"$SERVER_UUID\",
    \"name\": \"$APP_NAME\",
    \"git_repository\": \"$REPO\",
    \"git_branch\": \"$BRANCH\",
    \"build_pack\": \"dockerfile\",
    \"ports_exposes\": \"$PORT\",
    \"github_app_uuid\": \"$GITHUB_APP_UUID\"
  }" \
  "$API/applications/private-github-app")
APP_UUID=$(echo "$RESULT" | python3 -c "import json,sys; print(json.load(sys.stdin)['uuid'])")
echo "  App UUID: $APP_UUID"

echo ""
echo "==> Configuring Dockerfile, healthcheck, auto-deploy..."
curl -sf -X PATCH \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "dockerfile_location": "/Dockerfile",
    "is_auto_deploy_enabled": true,
    "health_check_enabled": true,
    "health_check_path": "/",
    "health_check_start_period": 30,
    "health_check_retries": 15
  }' \
  "$API/applications/$APP_UUID" > /dev/null

echo ""
echo "==> Setting domain: $DOMAIN"
curl -sf -X PATCH \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"domains\": \"$DOMAIN\"}" \
  "$API/applications/$APP_UUID?force_domain_override=true" > /dev/null

echo ""
echo "==> Triggering first deploy..."
curl -sf -X POST \
  -H "Authorization: Bearer $TOKEN" \
  "$API/deploy?uuid=$APP_UUID&force=true" > /dev/null

echo ""
echo "============================================"
echo "Setup complete!"
echo ""
echo "  App UUID:  $APP_UUID"
echo "  Server:    hetzner-blue-1"
echo "  Domain:    $DOMAIN"
echo "  Auto-deploy: ON (push to $BRANCH)"
echo "============================================"
