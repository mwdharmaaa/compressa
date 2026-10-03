#!/usr/bin/env bash
set -euo pipefail

echo "══════════════════════════════════════════════════════════════"
echo "  Launching Compressa Dev Server (@mwdhrmaaa)                 "
echo "══════════════════════════════════════════════════════════════"

if [ ! -d "node_modules" ]; then
    echo "[*] Installing dependencies..."
    npm install
fi

echo "[*] Starting Vite dev server and opening browser..."
npm run dev -- --open --host
