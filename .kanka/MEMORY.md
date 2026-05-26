# hat-naturel-web — Kanka Memory

## 🖥️ DigitalOcean Droplet
- **IP**: `206.81.29.231`
- **Region**: fra1 (Frankfurt)
- **Hostname**: `ubuntu-s-2vcpu-2gb-90gb-intel-fra1`
- **Plan**: Basic Premium Intel, 2 vCPU / 2 GB RAM / 90 GB Disk
- **OS**: Ubuntu 24.04 LTS
- **User**: `root`

## 🔑 SSH Bağlantı
```bash
ssh hatnaturel   # ~/.ssh/config'de tanımlı
# veya
ssh -i ~/.ssh/digitalocean_hatnaturel root@206.81.29.231
```
- Private key: `~/.ssh/digitalocean_hatnaturel`
- Public key: `~/.ssh/digitalocean_hatnaturel.pub`

## 🌐 Domain
- **Primary**: `hatnature.com.tr` (DNS yönlendiriliyor → A kaydı `206.81.29.231`)
- **www**: `www.hatnature.com.tr` (A → `206.81.29.231`)
- SSL: Let's Encrypt (DNS yayılınca kurulacak — `certbot --nginx`)

## 📂 Sunucudaki proje yolu
- **App dir**: `/var/www/hat-naturel-web`
- **Logs**: `/var/log/hat-naturel-web/{out,error}.log`
- **PM2 config**: `/var/www/hat-naturel-web/ecosystem.config.js`

## 🛠️ Stack (droplet'te kurulu)
- Node.js v20.20.2 (NodeSource)
- npm 10.8.2
- PM2 7.0.1 (systemd ile boot'ta otomatik başlar — `pm2-root.service`)
- Nginx 1.24.0 (reverse proxy: 80 → 127.0.0.1:3001)
- UFW firewall: OpenSSH + Nginx Full açık

## 🚀 Deploy — OTOMATİK (GitHub Actions)

⚠️ **MANUEL DEPLOY YAPMA!** `.github/workflows/deploy.yml` her `main` push'unda otomatik deploy ediyor.

Manuel `ssh hatnaturel "cd /var/www/... && npm run build"` ile Actions çakışıp `.next/export/500.html` rename hatası verir.

### Doğru akış:
```bash
# Local’de:
git add -A && git commit -m "..." && git push origin main
# Sonra:
gh run watch  # ya da gh run list ile takip et
```

### Actions failed olursa sebep araştır:
```bash
gh run list --limit 5
gh run view <RUN_ID> --log-failed
```

### Acil durum (Actions yokken) — manuel deploy:
```bash
ssh hatnaturel "cd /var/www/hat-naturel-web && git pull origin main && rm -rf .next && npm ci --no-audit --no-fund && npm run build && pm2 reload hat-naturel-web"
```

## 🔁 PM2 komutları
- `pm2 status` — durum
- `pm2 logs hat-naturel-web` — canlı log
- `pm2 reload hat-naturel-web` — zero-downtime restart
- `pm2 monit` — interaktif monitor

## 🐙 GitHub Deploy Key (droplet'te)
- Repo: `git@github.com:hediyebayer/hat-naturel-web.git`
- Key path (droplet): `~/.ssh/github_hatnaturel`
- GitHub'da kayıtlı: Settings → Deploy Keys → "DigitalOcean Droplet (fra1)"

## ❌ Vercel — KULLANILMIYOR
- Eski Vercel deployment'ı tarihe karıştı. Kanka kendi sunucusunda host ediyor artık.
- Vercel'deki proje silinmeli veya pasifleştirilmeli (manuel).

## ⏭️ TODO (sırada)
- [ ] DNS — `hatnaturel.com.tr` `206.81.29.231`'e yönlendirilmeli (şu an yanlış IP'de)
- [ ] DNS yayılınca `certbot --nginx -d hatnaturel.com.tr -d www.hatnaturel.com.tr` ile SSL
- [x] Auto-deploy GitHub Actions (`main` push → droplet `git pull && build && pm2 reload`) — partner tarafından eklendi
- [ ] Nginx config'e HTTPS redirect (SSL sonrası)
- [ ] Backup stratejisi (snapshot / rsync)
- [ ] Partner için droplet'e SSH key ekleme (kendi key'i ile)
