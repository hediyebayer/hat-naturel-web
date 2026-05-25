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

## 🚀 Deploy komutları (sunucuda)
```bash
cd /var/www/hat-naturel-web
git pull origin main
npm ci --no-audit --no-fund
npm run build
pm2 reload hat-naturel-web
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
- [ ] DNS yayılınca `certbot --nginx -d hatnature.com.tr -d www.hatnature.com.tr` ile SSL
- [ ] Auto-deploy webhook veya GitHub Actions (`main` push → droplet `git pull && build && pm2 reload`)
- [ ] Nginx config'e HTTPS redirect (SSL sonrası)
- [ ] Backup stratejisi (snapshot / rsync)
