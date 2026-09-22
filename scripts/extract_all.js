import fs from 'fs';

const servicePage = JSON.parse(fs.readFileSync('scripts/service_page_data.json', 'utf8'));

// 1. Reviews in itemsV2
const revSec = servicePage.sections.find(s => s.__typename === 'ServicePageReviewsSection');
console.log('Reviews count in itemsV2:', revSec?.reviews?.itemsV2?.length);
const reviews = (revSec?.reviews?.itemsV2 || []).map(r => {
  return {
    reviewer: r.reviewer?.name,
    avatar: r.reviewer?.avatar?.thumbnailURL,
    rating: r.starRating,
    date: r.date,
    jobTitle: r.jobTitle,
    reviewText: r.reviewText,
    verified: r.isVerified,
    response: r.response ? { text: r.response.responseText, date: r.response.responseDate } : null
  };
});
console.log('Parsed reviews sample:');
console.log(JSON.stringify(reviews.slice(0, 3), null, 2));

// 2. Business Facts & Info
const headerSec = servicePage.sections.find(s => s.__typename === 'ServicePageHeaderSection');
console.log('\n--- Business Facts in Header ---');
console.log('Summary prefab:', headerSec?.businessSummaryPrefab);
console.log('Business facts:', headerSec?.businessFacts);
console.log('Profile pills:', headerSec?.profilePills);

// 3. Overview & Subsections in BusinessInfo
const bizSec = servicePage.sections.find(s => s.__typename === 'ServicePageBusinessInfoSection');
console.log('\n--- Business Info Subsections ---');
bizSec?.subsections?.forEach(sub => {
  console.log(`\n### Subsection: ${sub.title}`);
  if (sub.items) {
    sub.items.forEach(it => console.log('  *', it.title || it.label || it.text, ':', it.description || it.subtext || ''));
  }
  if (sub.faqItems) {
    sub.faqItems.forEach(faq => console.log('  * Q:', faq.question, '\n    A:', faq.answer));
  }
  if (sub.html) {
    console.log('  HTML:', sub.html);
  }
});

// 4. Specialties
const specSec = servicePage.sections.find(s => s.__typename === 'ServicePageSpecialtiesSection');
console.log('\n--- Specialties ---');
specSec?.sections?.forEach(sec => {
  console.log(`\nGroup: ${sec.title}`);
  sec.items?.forEach(item => {
    console.log(`  - ${item.title}: ${item.description || ''}`);
  });
});

// 5. Credentials
const credSec = servicePage.sections.find(s => s.__typename === 'ServicePageCredentialsSection');
console.log('\n--- Credentials ---');
console.log('Definitions:', credSec?.definitions);
console.log('Inline credentials:', credSec?.inlineCredentials);
