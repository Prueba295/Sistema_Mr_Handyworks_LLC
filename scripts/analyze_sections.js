import fs from 'fs';

const servicePage = JSON.parse(fs.readFileSync('scripts/service_page_data.json', 'utf8'));

console.log('Sections count:', servicePage.sections ? servicePage.sections.length : 0);

if (servicePage.sections) {
  servicePage.sections.forEach((sec, idx) => {
    console.log(`\n================ Section ${idx}: ${sec.__typename} ================`);
    console.log('Keys:', Object.keys(sec));
  });
}
