#!/usr/bin/env node
/*
 * Optimize photos in public/images/ → public/images/optimized/
 *
 * - Resizes the long edge to MAX_EDGE px (no enlargement)
 * - Re-encodes JPEG at QUALITY using mozjpeg
 * - Honors EXIF orientation (rotate()) so portraits stay portrait
 * - Sanitizes the output filename (web-friendly: no spaces, lowercase)
 * - Skips files where the optimized version is already newer than the source
 *
 * Usage:  yarn optimize:images
 */

import { readdir, mkdir, stat } from "node:fs/promises";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const SRC_DIR = fileURLToPath(new URL("../public/images/", import.meta.url));
const OUT_DIR = fileURLToPath(
  new URL("../public/images/optimized/", import.meta.url)
);
const MAX_EDGE = 1800;
const QUALITY = 80;
const EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

/** Web-safe filename: no spaces, lowercase, only alnum / dash / dot. */
function sanitize(name) {
  const ext = extname(name).toLowerCase();
  const stem = name.slice(0, -ext.length);
  return (
    stem
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9._-]/g, "") + ext
  );
}

await mkdir(OUT_DIR, { recursive: true });

const entries = await readdir(SRC_DIR, { withFileTypes: true });
const files = entries
  .filter(
    (e) =>
      e.isFile() &&
      EXTENSIONS.has(extname(e.name).toLowerCase()) &&
      !e.name.startsWith(".")
  )
  .map((e) => e.name)
  .sort();

if (files.length === 0) {
  console.log(`No source images found in ${SRC_DIR}`);
  process.exit(0);
}

console.log(
  `Optimizing ${files.length} image(s) → ${OUT_DIR}\n` +
    `(max ${MAX_EDGE}px on long edge, JPEG q${QUALITY} mozjpeg)\n`
);

let totalIn = 0;
let totalOut = 0;
let skipped = 0;

const fmtMB = (b) => (b / 1024 / 1024).toFixed(2);

for (const name of files) {
  const inFs = join(SRC_DIR, name);
  const outName = sanitize(name);
  const outFs = join(OUT_DIR, outName);

  const inStat = await stat(inFs);
  let outStat = null;
  try {
    outStat = await stat(outFs);
  } catch {
    /* missing — will write */
  }

  if (outStat && outStat.mtimeMs >= inStat.mtimeMs) {
    skipped++;
    totalIn += inStat.size;
    totalOut += outStat.size;
    console.log(`  ${name} → ${outName} — up to date, skipped`);
    continue;
  }

  await sharp(inFs)
    .rotate() // apply EXIF orientation, then strip it
    .resize({
      width: MAX_EDGE,
      height: MAX_EDGE,
      fit: "inside",
      withoutEnlargement: true,
    })
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toFile(outFs);

  const afterSize = (await stat(outFs)).size;
  totalIn += inStat.size;
  totalOut += afterSize;

  const ratio = ((1 - afterSize / inStat.size) * 100).toFixed(1);
  console.log(
    `  ${name} → ${outName}: ${fmtMB(inStat.size)} MB → ${fmtMB(
      afterSize
    )} MB (-${ratio}%)`
  );
}

const totalRatio = ((1 - totalOut / totalIn) * 100).toFixed(1);
console.log(
  `\nDone. ${fmtMB(totalIn)} MB → ${fmtMB(totalOut)} MB ` +
    `(-${totalRatio}%, ${skipped} skipped)`
);
