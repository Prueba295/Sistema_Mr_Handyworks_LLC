import fs from 'fs';

const servicePage = JSON.parse(fs.readFileSync('scripts/service_page_data.json', 'utf8'));
const mediaSec = servicePage.sections.find(s => s.__typename === 'ServicePageMediaSection');

console.log('Items in mediaSec.media.items:');
console.log(JSON.stringify(mediaSec.media.items, null, 2));

const revSec = servicePage.sections.find(s => s.__typename === 'ServicePageReviewsSection');
console.log('\n--- Reviews items count:', revSec.reviews.length);
console.log('First 2 reviews:');
console.log(JSON.stringify(revSec.reviews.slice(0, 2), null, 2));
