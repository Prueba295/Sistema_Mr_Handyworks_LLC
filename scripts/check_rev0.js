import fs from 'fs';

const servicePage = JSON.parse(fs.readFileSync('scripts/service_page_data.json', 'utf8'));
const revSec = servicePage.sections.find(s => s.__typename === 'ServicePageReviewsSection');

console.log('Review #0:');
console.log(JSON.stringify(revSec.reviews.itemsV2[0], null, 2));
