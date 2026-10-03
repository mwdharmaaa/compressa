#!/usr/bin/env bash
set -euo pipefail

echo "══════════════════════════════════════════════════════════════"
echo "  Redeploying Compressa (@mwdhrmaaa)                          "
echo "══════════════════════════════════════════════════════════════"

ACTIVE_BRANCH=$(git rev-parse --abbrev-ref HEAD || echo "devv")

echo "[*] Active branch: $ACTIVE_BRANCH"
echo "[*] Tearing down running containers..."
if command -v docker >/dev/null 2>&1 && docker info >/dev/null 2>&1; then
    docker compose down --remove-orphans || true
fi

echo "[*] Triggering deploy sequence..."
bash deploy.sh
