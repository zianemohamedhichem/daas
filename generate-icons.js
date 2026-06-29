#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function createPNG(width, height, pixels) {
  function crc32(buf) {
    let c = 0xFFFFFFFF;
    const table = new Int32Array(256);
    for (let n = 0; n < 256; n++) {
      let v = n;
      for (let k = 0; k < 8; k++) v = v & 1 ? 0xEDB88320 ^ (v >>> 1) : v >>> 1;
      table[n] = v;
    }
    for (let i = 0; i < buf.length; i++) c = table[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
    return (c ^ 0xFFFFFFFF) >>> 0;
  }

  function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const typeData = Buffer.concat([Buffer.from(type), data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(typeData));
    return Buffer.concat([len, typeData, crc]);
  }

  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

  const raw = Buffer.alloc(height * (1 + width * 4));
  for (let y = 0; y < height; y++) {
    raw[y * (1 + width * 4)] = 0;
    for (let x = 0; x < width; x++) {
      const srcIdx = (y * width + x) * 4;
      const dstIdx = y * (1 + width * 4) + 1 + x * 4;
      raw[dstIdx] = pixels[srcIdx];
      raw[dstIdx + 1] = pixels[srcIdx + 1];
      raw[dstIdx + 2] = pixels[srcIdx + 2];
      raw[dstIdx + 3] = pixels[srcIdx + 3];
    }
  }

  const compressed = zlib.deflateSync(raw);

  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', compressed),
    chunk('IEND', Buffer.alloc(0))
  ]);
}

function generateIcon(size) {
  const pixels = Buffer.alloc(size * size * 4);
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= r) {
        const t = dist / r;
        const gradient = Math.pow(1 - t * 0.3, 2);

        const br = Math.round(21 * gradient);
        const bg = Math.round(101 * gradient);
        const bb = Math.round(192 * gradient);

        pixels[idx] = br;
        pixels[idx + 1] = bg;
        pixels[idx + 2] = bb;
        pixels[idx + 3] = 255;

        const innerR = size * 0.35;
        if (dist < innerR) {
          const it = dist / innerR;
          if (it < 0.9) {
            pixels[idx] = 255;
            pixels[idx + 1] = 255;
            pixels[idx + 2] = 255;
            pixels[idx + 3] = 255;
          } else {
            const aa = Math.max(0, 1 - (it - 0.9) / 0.1);
            pixels[idx] = Math.round(255 * aa + br * (1 - aa));
            pixels[idx + 1] = Math.round(255 * aa + bg * (1 - aa));
            pixels[idx + 2] = Math.round(255 * aa + bb * (1 - aa));
          }
        }

        if (dist < innerR * 0.85) {
          const checkSize = size * 0.06;
          const localX = x - cx;
          const localY = y - cy;

          const barY1 = -checkSize * 2.5;
          const barY2 = -checkSize * 0.8;
          const barY3 = checkSize * 1.0;

          const barW = checkSize * 3;
          const barH = checkSize * 0.7;

          const isBar = (
            (localX > -barW && localX < barW) && (
              (localY > barY1 - barH/2 && localY < barY1 + barH/2) ||
              (localY > barY2 - barH/2 && localY < barY2 + barH/2) ||
              (localY > barY3 - barH/2 && localY < barY3 + barH/2)
            )
          );

          const checkX = barW * 0.5;
          const checkY = barY3 + checkSize * 2;
          const checkS = checkSize * 1.2;

          const isCheck = (
            localX > checkX - checkS && localX < checkX + checkS &&
            localY > checkY - checkS && localY < checkY + checkS
          );

          if (isBar || isCheck) {
            pixels[idx] = 21;
            pixels[idx + 1] = 101;
            pixels[idx + 2] = 192;
          }
        }
      } else {
        pixels[idx] = 0;
        pixels[idx + 1] = 0;
        pixels[idx + 2] = 0;
        pixels[idx + 3] = 0;
      }
    }
  }

  return createPNG(size, size, pixels);
}

const iconDir = path.join(__dirname, 'assets', 'icons');

const icon192 = generateIcon(192);
fs.writeFileSync(path.join(iconDir, 'icon-192.png'), icon192);
console.log('Created icon-192.png (' + icon192.length + ' bytes)');

const icon512 = generateIcon(512);
fs.writeFileSync(path.join(iconDir, 'icon-512.png'), icon512);
console.log('Created icon-512.png (' + icon512.length + ' bytes)');

console.log('Icons generated successfully!');
