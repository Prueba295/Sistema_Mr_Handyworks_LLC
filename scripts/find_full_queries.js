import fs from 'fs';

async function findReviewQuery() {
  const url = 'https://cdn.thumbtackstatic.com/fe-assets-rr/es5/pages/instant-results-app/scripts/instant-results-cobalt-app-harness.b69de89c522e633afe57-v3.js.gz';
  const res = await fetch(url);
  const unzipped = await res.text();

  const m = unzipped.match(/query\s+ServicePage[A-Za-z0-9_]*\s*\([^\)]*reviewsPageToken[^\)]*\)/gi) || [];
  console.log('Matches:', m);

  // Also search for "servicePageReviews"
  const m2 = unzipped.match(/query\s+ServicePageReviews[^{]*\{[^}]*\}/gi) || [];
  console.log('Matches 2:', m2);

  // Search around ServicePageMedia
  const idx = unzipped.indexOf('query ServicePageMedia');
  if (idx !== -1) {
    console.log('Full ServicePageMedia query:');
    console.log(unzipped.slice(idx - 500, idx + 500));
  }
}

findReviewQuery();
