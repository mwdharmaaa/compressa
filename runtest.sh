#!/usr/bin/env bash
set -euo pipefail

echo "══════════════════════════════════════════════════════════════"
echo "  Running Automated Tests: Compressa                          "
echo "══════════════════════════════════════════════════════════════"

npm run test
echo "[OK] All test suites passed."
