import fs from 'fs';

const content = fs.readFileSync('C:/Users/josue/.gemini/antigravity-ide/brain/a0efcc6d-1979-4d57-ae67-6a3ac624ce20/.system_generated/steps/61/content.md', 'utf8');

// Find all image IDs in content.md
// Thumbtack image URLs look like: https://production-next-images-cdn.thumbtack.com/i/{ID}/...
const imageRegex = /https:\/\/production-next-images-cdn\.thumbtack\.com\/i\/(\d+)\/([^\s"'<>\\]+)/g;
let m;
const imageMap = new Map();
while ((m = imageRegex.exec(content)) !== null) {
  const id = m[1];
  const rest = m[2].replace(/\\u002F/g, '/');
  if (!imageMap.has(id)) {
    imageMap.set(id, []);
  }
  imageMap.get(id).push(rest);
}

console.log('Unique Image IDs found in HTML:', imageMap.size);
for (const [id, variations] of imageMap.entries()) {
  console.log(`ID ${id}:`, variations);
}
