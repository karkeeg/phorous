const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

const manifestStr = fs.readFileSync('manifest.json', 'utf8');
const manifest = JSON.parse(manifestStr);

const assetsDir = path.join(__dirname, 'public', 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

Object.keys(manifest).forEach(uuid => {
  const item = manifest[uuid];
  let ext = '';
  if (item.mime === 'image/jpeg') ext = '.jpg';
  else if (item.mime === 'image/png') ext = '.png';
  else if (item.mime === 'image/svg+xml') ext = '.svg';
  else if (item.mime === 'font/woff2' || item.mime.includes('font')) ext = '.woff2';
  else if (item.mime.includes('javascript')) ext = '.js';
  else ext = '.bin';

  let buffer = Buffer.from(item.data, 'base64');
  
  if (item.compressed) {
    try {
      buffer = zlib.gunzipSync(buffer);
    } catch (e) {
      console.warn(`Failed to decompress ${uuid}`, e.message);
    }
  }

  const filename = `${uuid}${ext}`;
  fs.writeFileSync(path.join(assetsDir, filename), buffer);
  console.log(`Saved ${filename}`);
});
