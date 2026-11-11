// Simple script to generate valid PNG icon files
import fs from 'node:fs';

// A minimal valid 192x192 PNG with emerald #0B3D2E fill and orange accent
// Or we can generate a real PNG using zlib and raw chunks!
import zlib from 'node:zlib';

function createPng(width, height, r, g, b) {
  // Signature
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 2; // color type RGB
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace

  const ihdrChunk = createChunk('IHDR', ihdrData);

  // Raw image data with filter byte 0 at start of each scanline
  const scanlineLength = 1 + width * 3;
  const rawData = Buffer.alloc(height * scanlineLength);

  for (let y = 0; y < height; y++) {
    const offset = y * scanlineLength;
    rawData[offset] = 0; // filter type 0
    for (let x = 0; x < width; x++) {
      const pxOffset = offset + 1 + x * 3;
      // Draw border or center pattern
      const isBorder = x < 8 || x >= width - 8 || y < 8 || y >= height - 8;
      const isCenter = Math.abs(x - width/2) < width/4 && Math.abs(y - height/2) < height/4;
      if (isCenter) {
        rawData[pxOffset] = 242;     // #F2A541 (Amber)
        rawData[pxOffset + 1] = 165;
        rawData[pxOffset + 2] = 65;
      } else if (isBorder) {
        rawData[pxOffset] = 14;      // #0E6B50 (Emerald)
        rawData[pxOffset + 1] = 107;
        rawData[pxOffset + 2] = 80;
      } else {
        rawData[pxOffset] = r;       // #0B3D2E (Forest)
        rawData[pxOffset + 1] = g;
        rawData[pxOffset + 2] = b;
      }
    }
  }

  const idatData = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', idatData);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const body = Buffer.concat([typeBuf, data]);
  const crc = crc32(body);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc, 0);
  return Buffer.concat([len, body, crcBuf]);
}

// Table-based CRC32
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) c = 0xedb88320 ^ (c >>> 1);
    else c = c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

if (!fs.existsSync('/public')) {
  fs.mkdirSync('/public', { recursive: true });
}

fs.writeFileSync('/public/icon-192.png', createPng(192, 192, 11, 61, 46));
fs.writeFileSync('/public/icon-512.png', createPng(512, 512, 11, 61, 46));
console.log('PNG icons created successfully in /public');
