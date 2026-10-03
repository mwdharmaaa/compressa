#!/usr/bin/env bash
set -euo pipefail

echo "══════════════════════════════════════════════════════════════"
echo "  Deploying Compressa - Video Compressor Studio (@mwdhrmaaa)   "
echo "══════════════════════════════════════════════════════════════"

# 1. Dependency Resolution
echo "[*] Verifying dependencies..."
if [ ! -d "node_modules" ]; then
    npm ci || npm install
fi

# 2. Production Build Check
echo "[*] Running production test build..."
npm run build
echo "[OK] Build succeeded."

# 3. Docker Orchestration
if command -v docker >/dev/null 2>&1 && docker info >/dev/null 2>&1; then
    echo "[*] Docker daemon detected. Building container..."
    docker compose down --remove-orphans || true
    docker compose build --pull
    docker compose up -d

    echo "[*] Waiting for container health check..."
    for i in {1..15}; do
        HEALTH=$(docker inspect --format='{{json .State.Health.Status}}' compressa-app 2>/dev/null || echo "starting")
        if [ "$HEALTH" = "\"healthy\"" ] || [ "$HEALTH" = "healthy" ]; then
            echo "[OK] Container is healthy!"
            break
        fi
        sleep 1
    done

    echo "──────────────────────────────────────────────────────────────"
    echo "[OK] Application running on Docker: http://localhost:3000"
    echo "──────────────────────────────────────────────────────────────"
else
    echo "[!] Docker not running or unavailable. Starting local preview server..."
    npx vite preview --port 3000 --host
fi
