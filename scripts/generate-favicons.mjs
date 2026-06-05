/**
 * H++ Favicon Generator
 * Run: node scripts/generate-favicons.mjs
 * Requires: sharp (already in dependencies)
 *
 * Outputs:
 *   public/favicon.svg         — vector, for modern browsers
 *   public/favicon.ico         — multi-size (16, 32, 48) for legacy + browser tabs
 *   public/apple-touch-icon.png — 180×180 for iOS
 *   public/icon-192.png        — 192×192 for Android / PWA
 *   public/icon-512.png        — 512×512 for PWA splash
 *   public/og.png              — 1200×630 Open Graph placeholder
 *   public/site.webmanifest    — PWA web manifest
 */

import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.join(__dirname, '..', 'public')
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true })

// ─── Brand palette ────────────────────────────────────────────────────────────
const NAVY   = '#0B132B'
const TEAL   = '#00C2A8'
const WHITE  = '#FFFFFF'

// ─── SVG builder (size-aware) ─────────────────────────────────────────────────
function makeSvg(px) {
  const radius    = Math.round(px * 0.16)       // 16 % rounded corners
  const hSize     = Math.round(px * 0.54)       // "H" glyph em-size
  const ppSize    = Math.round(px * 0.38)       // "++" em-size
  const baseline  = Math.round(px * 0.72)       // shared baseline

  // At 16 px the "++" cluster would be < 6 px — illegible.
  // Use a single "H+" mark instead to stay readable.
  if (px <= 20) {
    const sz = Math.round(px * 0.7)
    const y  = Math.round(px * 0.74)
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${px} ${px}" width="${px}" height="${px}">
  <rect width="${px}" height="${px}" rx="${radius}" fill="${NAVY}"/>
  <text x="${px / 2}" y="${y}" text-anchor="middle"
        font-family="Arial Black,Arial,Helvetica,sans-serif"
        font-weight="900" font-size="${sz}" fill="${WHITE}">H<tspan fill="${TEAL}">+</tspan></text>
</svg>`
  }

  // For 32 px and above: full "H++" mark
  // Position: "H" left-anchored, "++" immediately after with teal colour
  const hX  = Math.round(px * 0.10)
  const ppX = Math.round(px * 0.10 + hSize * 0.62)   // snug right of "H"

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${px} ${px}" width="${px}" height="${px}">
  <rect width="${px}" height="${px}" rx="${radius}" fill="${NAVY}"/>
  <text x="${hX}" y="${baseline}"
        font-family="Arial Black,Arial,Helvetica,sans-serif"
        font-weight="900" font-size="${hSize}" fill="${WHITE}">H</text>
  <text x="${ppX}" y="${baseline}"
        font-family="Arial Black,Arial,Helvetica,sans-serif"
        font-weight="900" font-size="${ppSize}" fill="${TEAL}">++</text>
</svg>`
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
async function svgToPng(svgString, width, height) {
  return sharp(Buffer.from(svgString))
    .resize(width, height, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer()
}

function buildIco(entries) {
  /**
   * entries: [{ size: N, png: Buffer }, ...]
   * ICO format (PNG-in-ICO, accepted by all modern browsers + Windows):
   *   6-byte ICONDIR header
   *   16-byte ICONDIRENTRY × N
   *   PNG payloads concatenated
   */
  const count      = entries.length
  const headerSize = 6
  const dirSize    = count * 16
  let offset       = headerSize + dirSize

  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0)     // reserved
  header.writeUInt16LE(1, 2)     // type  = 1 (ICO)
  header.writeUInt16LE(count, 4) // image count

  const dirEntries = entries.map(({ size, png }) => {
    const e = Buffer.alloc(16)
    const dim = size >= 256 ? 0 : size   // 0 means 256 in ICO spec
    e.writeUInt8(dim, 0)                 // width
    e.writeUInt8(dim, 1)                 // height
    e.writeUInt8(0, 2)                   // colorCount (0 = no palette)
    e.writeUInt8(0, 3)                   // reserved
    e.writeUInt16LE(1, 4)               // color planes
    e.writeUInt16LE(32, 6)              // bits per pixel
    e.writeUInt32LE(png.length, 8)      // image data size
    e.writeUInt32LE(offset, 12)         // offset to image data
    offset += png.length
    return e
  })

  return Buffer.concat([header, ...dirEntries, ...entries.map(e => e.png)])
}

// ─── Open Graph placeholder ───────────────────────────────────────────────────
function makeOgSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stop-color="#0B132B"/>
      <stop offset="50%"  stop-color="#1C2541"/>
      <stop offset="100%" stop-color="#00C2A8"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <!-- Logo mark -->
  <rect x="72" y="200" width="120" height="120" rx="22" fill="#0B132B" opacity="0.6"/>
  <text x="132" y="283" text-anchor="middle"
        font-family="Arial Black,Arial,Helvetica,sans-serif"
        font-weight="900" font-size="64" fill="${WHITE}">H<tspan fill="${TEAL}">++</tspan></text>
  <!-- Headline -->
  <text x="72" y="390"
        font-family="Arial Black,Arial,Helvetica,sans-serif"
        font-weight="900" font-size="72" fill="${WHITE}">Building Organizations</text>
  <text x="72" y="470"
        font-family="Arial Black,Arial,Helvetica,sans-serif"
        font-weight="900" font-size="72" fill="${TEAL}">Ready for Growth.</text>
  <!-- Sub -->
  <text x="72" y="555"
        font-family="Arial,Helvetica,sans-serif"
        font-weight="400" font-size="28" fill="rgba(255,255,255,0.7)">Strategic People Consulting · MENA Region</text>
</svg>`
}

// ─── Generate everything ──────────────────────────────────────────────────────
async function main() {
  console.log('🎨  Generating H++ favicon set…\n')

  // 1. favicon.svg (32 px viewport, scalable)
  const svgContent = makeSvg(32)
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgContent, 'utf-8')
  console.log('✅  favicon.svg')

  // 2. PNG buffers at each required size
  const p16  = await svgToPng(makeSvg(16),  16,  16)
  const p32  = await svgToPng(makeSvg(32),  32,  32)
  const p48  = await svgToPng(makeSvg(48),  48,  48)
  const p180 = await svgToPng(makeSvg(180), 180, 180)
  const p192 = await svgToPng(makeSvg(192), 192, 192)
  const p512 = await svgToPng(makeSvg(512), 512, 512)

  // 3. Multi-size favicon.ico  (16 + 32 + 48)
  const ico = buildIco([
    { size: 16, png: p16 },
    { size: 32, png: p32 },
    { size: 48, png: p48 },
  ])
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), ico)
  console.log(`✅  favicon.ico  (${ico.length} bytes — 16+32+48 px)`)

  // 4. apple-touch-icon.png  (180×180)
  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), p180)
  console.log('✅  apple-touch-icon.png  (180×180)')

  // 5. icon-192.png  (Android / PWA)
  fs.writeFileSync(path.join(publicDir, 'icon-192.png'), p192)
  console.log('✅  icon-192.png  (192×192)')

  // 6. icon-512.png  (PWA splash)
  fs.writeFileSync(path.join(publicDir, 'icon-512.png'), p512)
  console.log('✅  icon-512.png  (512×512)')

  // 7. og.png  (Open Graph 1200×630)
  const ogPng = await svgToPng(makeOgSvg(), 1200, 630)
  fs.writeFileSync(path.join(publicDir, 'og.png'), ogPng)
  console.log('✅  og.png  (1200×630)')

  // 8. site.webmanifest
  const manifest = {
    name: 'H++ — Strategic People Consulting',
    short_name: 'H++',
    description: 'Building Organizations Ready for Growth',
    start_url: '/',
    display: 'standalone',
    background_color: '#0B132B',
    theme_color: '#0B132B',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
    ],
  }
  fs.writeFileSync(
    path.join(publicDir, 'site.webmanifest'),
    JSON.stringify(manifest, null, 2),
    'utf-8',
  )
  console.log('✅  site.webmanifest')

  console.log('\n🎉  All favicon assets written to public/')
}

main().catch(err => { console.error(err); process.exit(1) })
