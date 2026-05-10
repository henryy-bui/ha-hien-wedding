#!/usr/bin/env node
/*
 * Generate public/og-image.jpg (1200×630) for social link previews.
 *
 * Layout: bride and groom portraits as gold-ringed circles flanking
 * the names, with date and "Save the Date" caption below, on a cream
 * gradient with corner ornaments.
 *
 * Usage:  yarn og:image
 */

import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = fileURLToPath(new URL("../", import.meta.url));
const BRIDE = ROOT + "public/images/bride.jpg";
const GROOM = ROOT + "public/images/groom.jpg";
const OUT = ROOT + "public/og-image.jpg";

const W = 1200;
const H = 630;
const PORTRAIT = 200;
const PORTRAIT_GAP = 50;
const RING = 5;

// Wedding palette (must match src/index.css)
const CREAM = "#FFF8F0";
const ROSE = "#FAEDED";
const GOLD = "#C9A96E";
const GOLD_DEEP = "#A88A4F";
const CHARCOAL = "#2C2C2C";
const MUTED = "#6B6B6B";

/** Crop one image to a circle of `size` px with a gold ring. */
async function circlePortrait(srcPath, size) {
  const photo = await sharp(srcPath)
    .rotate() // honor EXIF
    .resize(size, size, { fit: "cover", position: "attention" })
    .toBuffer();

  const ringedSize = size + RING * 2;
  const mask = Buffer.from(
    `<svg width="${ringedSize}" height="${ringedSize}" xmlns="http://www.w3.org/2000/svg">
       <circle cx="${ringedSize / 2}" cy="${ringedSize / 2}" r="${size / 2}" fill="white"/>
     </svg>`
  );
  const ring = Buffer.from(
    `<svg width="${ringedSize}" height="${ringedSize}" xmlns="http://www.w3.org/2000/svg">
       <circle cx="${ringedSize / 2}" cy="${ringedSize / 2}"
               r="${size / 2 + RING / 2}"
               fill="none" stroke="${GOLD}" stroke-width="${RING}"/>
     </svg>`
  );

  // Mask the photo into a circle, then composite the gold ring on top.
  const masked = await sharp({
    create: {
      width: ringedSize,
      height: ringedSize,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      { input: photo, top: RING, left: RING },
      { input: mask, blend: "dest-in" },
      { input: ring, blend: "over" },
    ])
    .png()
    .toBuffer();

  return masked;
}

/** Background + all text, rendered as a single SVG. */
function backgroundSvg() {
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%"  stop-color="${CREAM}"/>
      <stop offset="100%" stop-color="${ROSE}"/>
    </linearGradient>
    <linearGradient id="goldText" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%"  stop-color="${GOLD_DEEP}"/>
      <stop offset="50%" stop-color="${GOLD}"/>
      <stop offset="100%" stop-color="${GOLD_DEEP}"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>

  <!-- Inner border -->
  <rect x="24" y="24" width="${W - 48}" height="${H - 48}"
        fill="none" stroke="${GOLD}" stroke-width="1.5" opacity="0.5"/>
  <rect x="34" y="34" width="${W - 68}" height="${H - 68}"
        fill="none" stroke="${GOLD}" stroke-width="0.75" opacity="0.35"/>

  <!-- Corner flourishes -->
  <g stroke="${GOLD}" stroke-width="1.25" fill="none" opacity="0.7">
    <path d="M 60 90 Q 90 60 130 60"/>
    <path d="M ${W - 60} 90 Q ${W - 90} 60 ${W - 130} 60"/>
    <path d="M 60 ${H - 90} Q 90 ${H - 60} 130 ${H - 60}"/>
    <path d="M ${W - 60} ${H - 90} Q ${W - 90} ${H - 60} ${W - 130} ${H - 60}"/>
  </g>

  <!-- Eyebrow under the portraits -->
  <text x="${W / 2}" y="370" text-anchor="middle"
        font-family="Georgia, 'Times New Roman', serif"
        font-size="20" letter-spacing="9" fill="${GOLD_DEEP}">
    TRÂN TRỌNG KÍNH MỜI
  </text>

  <line x1="${W / 2 - 70}" y1="388" x2="${W / 2 + 70}" y2="388"
        stroke="${GOLD}" stroke-width="1"/>

  <!-- Names -->
  <text x="${W / 2}" y="455" text-anchor="middle"
        font-family="Georgia, 'Times New Roman', serif"
        font-size="64" font-weight="400"
        fill="url(#goldText)">
    Văn Hà
    <tspan font-style="italic" font-size="56" dx="12" fill="${GOLD_DEEP}">&amp;</tspan>
    <tspan dx="12">Thanh Hiền</tspan>
  </text>

  <!-- Divider with diamond -->
  <g transform="translate(${W / 2}, 500)">
    <line x1="-180" y1="0" x2="-14" y2="0" stroke="${GOLD}" stroke-width="1"/>
    <line x1="14"   y1="0" x2="180" y2="0" stroke="${GOLD}" stroke-width="1"/>
    <path d="M 0 -7 L 7 0 L 0 7 L -7 0 Z" fill="${GOLD}"/>
  </g>

  <!-- Date -->
  <text x="${W / 2}" y="552" text-anchor="middle"
        font-family="Georgia, 'Times New Roman', serif"
        font-size="34" letter-spacing="6" fill="${CHARCOAL}">
    31 · 05 · 2026
  </text>

  <!-- Sub caption -->
  <text x="${W / 2}" y="588" text-anchor="middle"
        font-family="Georgia, 'Times New Roman', serif"
        font-style="italic" font-size="19" fill="${MUTED}">
    Save the Date — Chung vui ngày trọng đại
  </text>
</svg>`;
}

async function main() {
  const [bride, groom] = await Promise.all([
    circlePortrait(BRIDE, PORTRAIT),
    circlePortrait(GROOM, PORTRAIT),
  ]);

  const bg = Buffer.from(backgroundSvg());

  // Portraits sit at the top center, side-by-side with a small gap.
  const ringedSize = PORTRAIT + RING * 2;
  const pairWidth = ringedSize * 2 + PORTRAIT_GAP;
  const leftX = Math.round((W - pairWidth) / 2);
  const portraitY = 80;

  await sharp(bg)
    .composite([
      { input: bride, left: leftX, top: portraitY },
      { input: groom, left: leftX + ringedSize + PORTRAIT_GAP, top: portraitY },
    ])
    .jpeg({ quality: 88, mozjpeg: true })
    .toBuffer()
    .then((buf) => writeFile(OUT, buf));

  console.log(`✓ wrote ${OUT.replace(ROOT, "")} (${W}×${H})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
