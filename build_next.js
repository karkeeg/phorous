const fs = require('fs');

const template = fs.readFileSync('template_fixed.html', 'utf8');

// Extract all <style> blocks
const styleRegex = /<style>([\s\S]*?)<\/style>/g;
let match;
let cssContent = `@tailwind base;
@tailwind components;
@tailwind utilities;

`;

while ((match = styleRegex.exec(template)) !== null) {
  cssContent += match[1] + '\n';
}

fs.writeFileSync('app/globals.css', cssContent);

// Extract body contents
// The original body has some GSAP script at the top. Let's extract the main div `<div ref="{{ rootRef }}"`
const bodyRegex = /<div ref="\{\{ rootRef \}\}"([\s\S]*?)<\/div>\s*<\/body>/;
const bodyMatch = template.match(bodyRegex);

// Oh wait, the original template has closing tags that might not match perfectly.
// Let's just grab everything from <x-dc> to </body> or simply use cheerio if needed.
// Actually, I can just use a simple string extraction since it's an HTML file.
const xdcMatch = template.indexOf('<x-dc>');
const bodyEndMatch = template.indexOf('</body>');

let pageHtml = template.substring(xdcMatch, bodyEndMatch);

// We need to convert it to valid JSX. 
// 1. Convert style="xxx" to style={{ xxx }}
// 2. class -> className
// 3. self closing tags like <img ... > to <img ... />
// 4. svg tags like <svg ...></svg> to valid JSX.

// To do this perfectly, I'll use a small script that converts HTML to JSX, or just write it with react's dangerouslySetInnerHTML for the raw HTML for 100% fidelity, because converting 1000 lines of complex HTML to JSX with regex is very error prone (e.g. style string parsing). 
// Wait, dangerouslySetInnerHTML is a great idea to maintain 100% exact design and scrolling without breaking any of the inline styles or GSAP query selectors!
// But Next.js requires a single root element.
// Let's check the HTML.

// Let's extract the JS tags
const scriptRegex = /<script src="([^"]+)"><\/script>/g;
let scripts = [];
while ((match = scriptRegex.exec(template)) !== null) {
  scripts.push(match[1]);
}

let dangerouslySetHtml = pageHtml.replace(/<helmet>[\s\S]*?<\/helmet>/, ''); // remove helmet as styles are in globals.css

const pageTsx = `
import Script from 'next/script';

export default function Home() {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: ${JSON.stringify(dangerouslySetHtml)} }} />
      ${scripts.map(src => `<Script src="${src}" strategy="lazyOnload" />`).join('\n      ')}
    </>
  );
}
`;

fs.writeFileSync('app/page.tsx', pageTsx);
console.log('Built app/page.tsx and app/globals.css');
