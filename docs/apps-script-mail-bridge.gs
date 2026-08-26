/**
 * Hat Naturel — Gmail Apps Script HTTPS köprüsü
 *
 * Amaç: DigitalOcean outbound SMTP (25/465/587) bloğunu bypass etmek.
 * Bu script hatnaturel@gmail.com hesabında Apps Script Web App olarak
 * deploy edilir; Next.js sunucusu HTTPS 443 üzerinden buraya POST atar,
 * script GmailApp.sendEmail ile gerçek Gmail'den gönderir.
 *
 * ── KURULUM (5 dk) ────────────────────────────────────────────────
 * 1. https://script.google.com → hatnaturel@gmail.com ile giriş yap
 * 2. "New project" → adını "Hat Naturel Mail Bridge" yap
 * 3. Bu dosyanın tamamını Code.gs'ye yapıştır
 * 4. TOKEN değerini değiştir (aşağıda) — rastgele 32+ karakter üret:
 *      örn: openssl rand -hex 24
 * 5. Deploy → "New deployment" → tür: **Web app**
 *      - Description: hat-naturel-web mail bridge
 *      - Execute as: **Me** (hatnaturel@gmail.com)
 *      - Who has access: **Anyone**
 * 6. Deploy → izin ver (Gmail gönderim izni) → Web App URL'sini kopyala
 *      (https://script.google.com/macros/s/AKfy.../exec şeklinde)
 * 7. Sunucudaki /var/www/hat-naturel-web/.env.local'a ekle:
 *      GMAIL_SCRIPT_URL=<kopyalanan URL>
 *      GMAIL_SCRIPT_TOKEN=<4. adımdaki token>
 * 8. pm2 restart hat-naturel-web
 * 9. Test (aşağıda "TEST" bölümü)
 *
 * ⚠️ Güvenlik: Token bilinmeden script email gönderemez. URL'in gizli
 * tutulması şart değil ama token kesinlikle gizli kalmalı.
 */

// 6 haneli değil — uzun rastgele string gir. Sunucudaki .env ile AYNI olmalı.
var TOKEN = 'BURAYA-RASTGELE-TOKEN-YAZ';

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return json({ ok: false, error: 'no body' });
    }
    var body = JSON.parse(e.postData.contents);

    if (body.token !== TOKEN) {
      return json({ ok: false, error: 'invalid token' });
    }
    if (!body.to || !body.subject) {
      return json({ ok: false, error: 'to and subject required' });
    }

    var options = { htmlBody: body.html || '' };
    if (body.replyTo) {
      options.replyTo = body.replyTo;
    }

    // fromName görünen addır; Gmail gönderen adresi hesabın kendisi olur.
    var fromName = body.fromName || 'Hat Naturel Resort';
    var subject = body.subject;

    GmailApp.sendEmail(body.to, subject, '', options);

    return json({ ok: true, to: body.to, subject: subject, fromName: fromName });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

// Basit health-check (GET) — deploy sonrası URL'in çalıştığını doğrular.
function doGet() {
  return json({ ok: true, service: 'hat-naturel-mail-bridge' });
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

/* ── TEST ─────────────────────────────────────────────────────────
 * Kurulumdan sonra sunucudan (SSH) çalıştır:
 *
 *   curl -s -X POST "<WEB_APP_URL>" \
 *     -H "Content-Type: application/json" \
 *     -d '{"token":"<TOKEN>","fromName":"Test","to":"hatnaturel@gmail.com",
 *          "subject":"Mail köprüsü test","html":"<b>Çalışıyor!</b>"}'
 *
 * Yanıtta {"ok":true,...} gelmeli ve Gmail gelen kutusuna test maili düşmeli.
 * Ardından siteden gerçek bir test rezervasyonu yap.
 * ─────────────────────────────────────────────────────────────────── */
