#!/bin/zsh

cd "$(dirname "$0")"

PORT=4173
URL="http://localhost:${PORT}"

echo "Starting Exametrics at ${URL}"
echo "Keep this Terminal window open while you study."
echo ""

if command -v python3 >/dev/null 2>&1; then
  open "${URL}" >/dev/null 2>&1
  python3 -m http.server "${PORT}" --bind 127.0.0.1
else
  echo "Python 3 was not found on this Mac."
  echo "Install Python 3 or use another static file server."
  echo ""
  read -k 1 "?Press any key to close..."
fi
