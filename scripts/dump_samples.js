import fs from 'fs';

const servicePage = JSON.parse(fs.readFileSync('scripts/service_page_data.json', 'utf8'));

const revSec = servicePage.sections.find(s => s.__typename === 'ServicePageReviewsSection');
if (revSec?.reviews?.itemsV2) {
  console.log('--- Review item 0 keys and content: ---');
  console.log(JSON.stringify(revSec.reviews.itemsV2[0], null, 2));
}

const bizSec = servicePage.sections.find(s => s.__typename === 'ServicePageBusinessInfoSection');
if (bizSec?.subsections) {
  console.log('--- Subsections sample: ---');
  console.log(JSON.stringify(bizSec.subsections, null, 2));
}

const specSec = servicePage.sections.find(s => s.__typename === 'ServicePageSpecialtiesSection');
if (specSec?.sections) {
  console.log('--- Specialties sample: ---');
  console.log(JSON.stringify(specSec.sections, null, 2));
}
