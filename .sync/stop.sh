#!/bin/bash
cd "$(dirname "${BASH_SOURCE[0]}")/.." || exit 1
if [ -f .sync/sync.pid ]; then
  PID=$(cat .sync/sync.pid)
  if kill "$PID" 2>/dev/null; then
    echo "🛑 Auto-sync durduruldu (PID: $PID)"
  else
    echo "ℹ️  Process zaten çalışmıyordu"
  fi
  rm -f .sync/sync.pid
else
  echo "ℹ️  Çalışan auto-sync yok"
fi
