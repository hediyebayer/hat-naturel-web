#!/bin/bash
# Hat Naturel — Otomatik Git Sync
# - Her 30 sn: GitHub'dan pull (arkadaşının değişiklikleri inecek)
# - Local değişiklik varsa: otomatik commit + push (arkadaşın görür)
#
# Çalıştırma:  bash .sync/auto-sync.sh
# Durdurma:    bash .sync/stop.sh

set -u
REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_DIR" || exit 1

LOG="$REPO_DIR/.sync/sync.log"
PIDFILE="$REPO_DIR/.sync/sync.pid"
INTERVAL=30                # saniye — pull/push periyodu
DEBOUNCE=8                 # saniye — değişiklikten kaç sn sonra commit atalım

mkdir -p "$REPO_DIR/.sync"
echo $$ > "$PIDFILE"

log() { echo "[$(date '+%H:%M:%S')] $*" | tee -a "$LOG"; }

log "🟢 Auto-sync başladı (PID: $$)"
log "   Repo:     $REPO_DIR"
log "   Periyot:  ${INTERVAL}s pull/push  |  ${DEBOUNCE}s debounce commit"
log "   Log:      $LOG"
log "   Durdur:   bash .sync/stop.sh"

last_change_at=0

while :; do
  # ─── 1. PULL: arkadaşının değişikliklerini al ────────────────
  fetch_out=$(git fetch origin main 2>&1)
  behind=$(git rev-list --count HEAD..origin/main 2>/dev/null || echo 0)
  if [ "$behind" -gt 0 ]; then
    log "⬇️  Arkadaşından $behind yeni commit geliyor — pull yapılıyor..."
    if git pull --no-edit origin main >> "$LOG" 2>&1; then
      log "✅ Pull tamam ($(git log -1 --format='%h %s' origin/main))"
    else
      log "⚠️  Pull çakıştı! Manuel müdahale gerekebilir. Devam ediyorum..."
    fi
  fi

  # ─── 2. LOCAL DEĞİŞİKLİK var mı? ────────────────────────────
  dirty=$(git status --porcelain | wc -l | tr -d ' ')
  if [ "$dirty" -gt 0 ]; then
    now=$(date +%s)
    if [ "$last_change_at" -eq 0 ]; then
      last_change_at=$now
      log "📝 Değişiklik algılandı ($dirty dosya) — ${DEBOUNCE}s bekleniyor..."
    fi
    age=$(( now - last_change_at ))
    if [ "$age" -ge "$DEBOUNCE" ]; then
      changed_files=$(git status --porcelain | awk '{print $2}' | head -5 | xargs)
      git add -A
      msg="chore(auto-sync): $(date '+%Y-%m-%d %H:%M') — ${changed_files}"
      if git commit -m "$msg" >> "$LOG" 2>&1; then
        log "📦 Commit: $msg"
        if git push origin main >> "$LOG" 2>&1; then
          log "⬆️  Push tamam — arkadaşın birazdan görecek 🚀"
        else
          log "❌ Push başarısız (auth?). Detay → $LOG"
        fi
      fi
      last_change_at=0
    fi
  else
    last_change_at=0
  fi

  sleep "$INTERVAL"
done
