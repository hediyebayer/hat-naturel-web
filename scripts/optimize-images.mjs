/**
 * One-shot image optimization for public/images.
 *
 * Strategy: rewrite oversized source images IN-PLACE with the SAME filename
 * so component src paths don't change. next/image will additionally serve
 * AVIF/WebP at runtime thanks to next.config.js images.formats.
 *
 * - JPG > 1MB → re-encode mozjpeg quality 82, progressive
 * - PNG with alpha > 1MB → palette quantize (sharp.png({ palette:true, quality:80, compressionLevel:9 }))
 *
 * Logo şeffaflığı korunur (PNG kalır). next/image dönüşümü zaten runtime'da yapacak.
 *
 * Usage: node scripts/optimize-images.mjs
 */
import sharp from 'sharp';
import { readdir, stat, rename, unlink } from 'node:fs/promises';
import { join } from 'node:path';

const ROOT = new URL('../public/images/', import.meta.url).pathname;
const SIZE_THRESHOLD = 1024 * 1024; // 1 MB

const JPG_QUALITY = 80;
const PNG_QUALITY = 80;
const MAX_DIMENSION = 2400; // hero/galeri için yeterli; 4K kaynaktan ölçek

/** @type {{file:string, before:number, after:number, savedPct:number}[]} */
const report = [];

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) {
      await walk(full);
    } else if (e.isFile()) {
      await maybeOptimize(full);
    }
  }
}

async function maybeOptimize(file) {
  const lower = file.toLowerCase();
  const isJpg = lower.endsWith('.jpg') || lower.endsWith('.jpeg');
  const isPng = lower.endsWith('.png');
  if (!isJpg && !isPng) return;

  const st = await stat(file);
  if (st.size < SIZE_THRESHOLD) return;

  const tmp = `${file}.tmp`;
  const before = st.size;

  try {
    let pipeline = sharp(file, { failOn: 'none' }).rotate(); // auto-orient

    const meta = await sharp(file).metadata();
    if (
      meta.width &&
      meta.height &&
      Math.max(meta.width, meta.height) > MAX_DIMENSION
    ) {
      pipeline = pipeline.resize({
        width: meta.width >= meta.height ? MAX_DIMENSION : undefined,
        height: meta.height > meta.width ? MAX_DIMENSION : undefined,
        withoutEnlargement: true,
        fit: 'inside',
      });
    }

    if (isJpg) {
      pipeline = pipeline.jpeg({
        quality: JPG_QUALITY,
        mozjpeg: true,
        progressive: true,
      });
    } else {
      // PNG — preserve alpha. Palette quantize azaltır.
      pipeline = pipeline.png({
        palette: true,
        quality: PNG_QUALITY,
        compressionLevel: 9,
        effort: 10,
      });
    }

    await pipeline.toFile(tmp);
    const newSt = await stat(tmp);

    if (newSt.size >= before * 0.98) {
      // anlamlı tasarruf yok — bırak
      await unlink(tmp);
      return;
    }

    await rename(tmp, file);
    const savedPct = ((before - newSt.size) / before) * 100;
    report.push({
      file: file.replace(ROOT, ''),
      before,
      after: newSt.size,
      savedPct,
    });
  } catch (err) {
    try {
      await unlink(tmp);
    } catch {}
    console.error(`✗ ${file}:`, err.message);
  }
}

await walk(ROOT);

// Rapor
report.sort((a, b) => b.before - a.before);
const fmt = (b) => (b / 1024 / 1024).toFixed(2) + 'MB';
const totalBefore = report.reduce((a, r) => a + r.before, 0);
const totalAfter = report.reduce((a, r) => a + r.after, 0);

console.log('\n=== OPTIMIZE RAPORU ===');
for (const r of report) {
  console.log(
    `  ${fmt(r.before)} → ${fmt(r.after)}  (-${r.savedPct.toFixed(0)}%)  ${r.file}`,
  );
}
console.log(
  `\nTOPLAM: ${fmt(totalBefore)} → ${fmt(totalAfter)} (kazanç: ${fmt(totalBefore - totalAfter)}, ${(((totalBefore - totalAfter) / totalBefore) * 100).toFixed(1)}%)`,
);
console.log(`Optimize edilen dosya: ${report.length}`);
