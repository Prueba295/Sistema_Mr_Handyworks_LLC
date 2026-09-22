import fs from 'fs';

const servicePage = JSON.parse(fs.readFileSync('scripts/service_page_data.json', 'utf8'));
const revSec = servicePage.sections.find(s => s.__typename === 'ServicePageReviewsSection');

console.log('Total items in itemsV2:', revSec.reviews.itemsV2.length);
revSec.reviews.itemsV2.forEach((it, idx) => {
  console.log(`\nReview #${idx}:`);
  console.log('Keys:', Object.keys(it));
  console.log('Item JSON:');
  console.log(JSON.stringify(it, null, 2));
});
