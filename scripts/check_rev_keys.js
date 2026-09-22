import fs from 'fs';

const servicePage = JSON.parse(fs.readFileSync('scripts/service_page_data.json', 'utf8'));
const revSec = servicePage.sections.find(s => s.__typename === 'ServicePageReviewsSection');

console.log('revSec.reviews keys:', Object.keys(revSec.reviews));
console.log('revSec.reviews JSON sample:');
console.log(JSON.stringify(revSec.reviews, null, 2).slice(0, 2000));
