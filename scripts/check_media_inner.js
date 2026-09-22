import fs from 'fs';

const servicePage = JSON.parse(fs.readFileSync('scripts/service_page_data.json', 'utf8'));
const mediaSec = servicePage.sections.find(s => s.__typename === 'ServicePageMediaSection');
console.log('mediaSec.media keys:', Object.keys(mediaSec.media));
if (mediaSec.media.media) {
  console.log('media items count:', mediaSec.media.media.length);
  console.log('First item:', JSON.stringify(mediaSec.media.media[0], null, 2));
}
if (mediaSec.media.items) {
  console.log('items count:', mediaSec.media.items.length);
}
if (mediaSec.media.projects) {
  console.log('projects count:', mediaSec.media.projects.length);
}
console.log(JSON.stringify(mediaSec.media, null, 2).slice(0, 2000));
