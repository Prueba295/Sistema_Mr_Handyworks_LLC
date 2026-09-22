import fs from 'fs';

const content = fs.readFileSync('C:/Users/josue/.gemini/antigravity-ide/brain/a0efcc6d-1979-4d57-ae67-6a3ac624ce20/.system_generated/steps/61/content.md', 'utf8');

// Find all matches for "reviewsPageToken" or "mediaPageToken" or query names
const matches = content.match(/"query\s+[^"]+"/g) || [];
console.log('Queries in content:', matches.length);
matches.slice(0, 10).forEach(m => console.log(m));

// Let's also check if there are other tokens or data
const appConfigMatch = content.match(/<script\s+type="application\/json"\s+id="app-page-config">([\s\S]*?)<\/script>/);
if (appConfigMatch) {
  const cfg = JSON.parse(appConfigMatch[1]);
  console.log('app-page-config keys:', Object.keys(cfg));
  fs.writeFileSync('scripts/app_page_config.json', JSON.stringify(cfg, null, 2));
  console.log('Saved app_page_config.json');
}
