const fs = require('fs');
const path = require('path');

const manifestStr = fs.readFileSync('manifest.json', 'utf8');
const manifest = JSON.parse(manifestStr);

let templateStr = fs.readFileSync('template.html', 'utf8');

Object.keys(manifest).forEach(uuid => {
  const item = manifest[uuid];
  let ext = '';
  if (item.mime === 'image/jpeg') ext = '.jpg';
  else if (item.mime === 'image/png') ext = '.png';
  else if (item.mime === 'image/svg+xml') ext = '.svg';
  else if (item.mime === 'font/woff2' || item.mime.includes('font')) ext = '.woff2';
  else if (item.mime.includes('javascript')) ext = '.js';
  else ext = '.bin';

  const filename = `${uuid}${ext}`;
  const replaceRegex = new RegExp(uuid, 'g');
  templateStr = templateStr.replace(replaceRegex, `/assets/${filename}`);
});

fs.writeFileSync('template_fixed.html', templateStr);
console.log('Fixed template saved to template_fixed.html');
