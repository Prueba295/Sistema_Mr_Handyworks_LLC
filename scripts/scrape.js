import fs from 'fs';
import path from 'path';

const contentPath = 'C:/Users/josue/.gemini/antigravity-ide/brain/a0efcc6d-1979-4d57-ae67-6a3ac624ce20/.system_generated/steps/61/content.md';
const content = fs.readFileSync(contentPath, 'utf8');

// Extract all JSON-LD data
const jsonLdRegex = /<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi;
let match;
let jsonLds = [];
while ((match = jsonLdRegex.exec(content)) !== null) {
  try {
    jsonLds.push(JSON.parse(match[1]));
  } catch (e) {
    console.error('Error parsing JSON-LD:', e);
  }
}

fs.writeFileSync('scripts/json_ld.json', JSON.stringify(jsonLds, null, 2));
console.log('Saved JSON-LD to scripts/json_ld.json. Number of objects:', jsonLds.length);

// Also look for window.__PRELOADED_STATE__ or other script tags with data
const allScripts = content.match(/<script[^>]*>([\s\S]*?)<\/script>/gi) || [];
console.log('Total script tags:', allScripts.length);
allScripts.forEach((s, idx) => {
  if (s.includes('window.') || s.includes('557892581429960708') || s.includes('Mr Handyworks LLC') || s.includes('reviews')) {
    console.log(`Script ${idx} matches keywords, length: ${s.length}`);
    if (s.length < 1000) {
      console.log(s);
    } else {
      console.log(s.slice(0, 400) + '...');
    }
  }
});
