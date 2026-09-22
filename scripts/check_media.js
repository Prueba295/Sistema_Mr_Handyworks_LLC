import fs from 'fs';

const servicePage = JSON.parse(fs.readFileSync('scripts/service_page_data.json', 'utf8'));
const mediaSec = servicePage.sections.find(s => s.__typename === 'ServicePageMediaSection');
console.log('mediaSec keys:', Object.keys(mediaSec));
console.log('media type:', typeof mediaSec.media, Array.isArray(mediaSec.media));
console.log('mediaSec JSON:', JSON.stringify(mediaSec, null, 2).slice(0, 1500));
