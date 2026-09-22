import fs from 'fs';

const servicePage = JSON.parse(fs.readFileSync('scripts/service_page_data.json', 'utf8'));

// 1. Media Section
const mediaSec = servicePage.sections.find(s => s.__typename === 'ServicePageMediaSection');
console.log('--- Media Section ---');
console.log('numMediaItems:', mediaSec?.numMediaItems);
console.log('media array length:', mediaSec?.media?.length);
if (mediaSec?.media) {
  mediaSec.media.forEach((item, idx) => {
    console.log(`Media #${idx}:`, {
      id: item.id,
      mediaType: item.mediaType,
      caption: item.caption,
      tag: item.tag,
      image: item.image,
      video: item.video
    });
  });
}

// 2. Reviews Section
const revSec = servicePage.sections.find(s => s.__typename === 'ServicePageReviewsSection');
console.log('\n--- Reviews Section ---');
console.log('Total reviews array length:', revSec?.reviews?.length);
console.log('Overview:', revSec?.overview);
console.log('Histogram:', revSec?.histogramItems);

// 3. Specialties Section
const specSec = servicePage.sections.find(s => s.__typename === 'ServicePageSpecialtiesSection');
console.log('\n--- Specialties Section ---');
console.log('Specialties sections length:', specSec?.sections?.length);
if (specSec?.sections) {
  specSec.sections.forEach(s => {
    console.log('Category:', s.title);
    if (s.items) {
      s.items.forEach(it => console.log('  -', it.label || it.title || it));
    }
  });
}

// 4. Business Info Section
const bizSec = servicePage.sections.find(s => s.__typename === 'ServicePageBusinessInfoSection');
console.log('\n--- Business Info Section ---');
console.log('Introduction:', bizSec?.introduction);
console.log('Subsections length:', bizSec?.subsections?.length);
if (bizSec?.subsections) {
  bizSec.subsections.forEach(sub => {
    console.log(`\nSubsection [${sub.title}]:`);
    console.log(JSON.stringify(sub, null, 2).slice(0, 300));
  });
}
