#!/bin/bash
# Auto-sync'i arka planda başlat
cd "$(dirname "${BASH_SOURCE[0]}")/.." || exit 1

if [ -f .sync/sync.pid ] && kill -0 "$(cat .sync/sync.pid)" 2>/dev/null; then
  echo "⚠️  Auto-sync zaten çalışıyor (PID: $(cat .sync/sync.pid))"
  echo "   Önce durdurmak için:  bash .sync/stop.sh"
  exit 1
fi

nohup bash .sync/auto-sync.sh > /dev/null 2>&1 &
sleep 1
if [ -f .sync/sync.pid ] && kill -0 "$(cat .sync/sync.pid)" 2>/dev/null; then
  echo "✅ Auto-sync başladı (PID: $(cat .sync/sync.pid))"
  echo "   📄 Log:     tail -f .sync/sync.log"
  echo "   ⏹  Durdur:  bash .sync/stop.sh"
else
  echo "❌ Başlatılamadı, .sync/sync.log dosyasını kontrol et"
fi
