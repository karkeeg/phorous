const fs = require('fs');
const html = fs.readFileSync('Phorous Standalone.html', 'utf8');

const manifestMatch = html.match(/<script type="__bundler\/manifest">([\s\S]*?)<\/script>/);
const templateMatch = html.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/);

if (manifestMatch) {
  fs.writeFileSync('manifest.json', manifestMatch[1]);
  console.log('Extracted manifest');
} else {
  console.log('Failed to extract manifest');
}

if (templateMatch) {
  const template = JSON.parse(templateMatch[1]);
  fs.writeFileSync('template.html', template);
  console.log('Extracted template');
} else {
  console.log('Failed to extract template');
}
