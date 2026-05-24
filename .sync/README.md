# 🔄 Auto-Sync — Otomatik GitHub Senkronizasyon

Sen ve arkadaşın aynı projede çalışırken **her ikiniz de** birbirinizin
değişikliklerini **anlık** olarak görmek için bu sistemi kullanırsınız.

## Nasıl Çalışır?

- **Her 30 saniyede bir** GitHub'dan `git pull` yapar → arkadaşının yeni
  commit'leri otomatik iner
- **Dosya değiştirdiğinde** 8 saniye bekler (debounce) → sonra otomatik
  `commit + push` yapar → arkadaşın 30 saniye içinde görür

## Kullanım

```bash
# Başlat (arka planda çalışır)
bash .sync/start.sh

# Logları canlı izle
tail -f .sync/sync.log

# Durdur
bash .sync/stop.sh
```

## Önemli Notlar

⚠️ **İlk kullanımdan önce GitHub auth (PAT) ayarlı olmalı.**
Kontrol için:
```bash
git push origin main      # şifre sormamalı
```

⚠️ **Aynı dosyayı aynı anda ikiniz değiştirirseniz** çakışma (conflict) çıkar.
O zaman log'da `⚠️ Pull çakıştı` mesajını görürsün → terminale gel,
`git status` ile dosyayı düzelt → `git add . && git commit && git push`.

💡 **İpucu**: Aynı sayfa/component üzerinde çalışacaksanız önce bir Slack/WhatsApp
mesajı atın — "ben şu an X.tsx'i düzenliyorum" gibi. Çakışma riskini sıfıra
indirir.
