import fs from 'fs';

async function checkReviewFragment() {
  const url = 'https://cdn.thumbtackstatic.com/fe-assets-rr/es5/pages/instant-results-app/scripts/instant-results-cobalt-app-harness.b69de89c522e633afe57-v3.js.gz';
  const res = await fetch(url);
  const text = await res.text();

  const idx = text.indexOf('reviewsItemV2Fields');
  if (idx !== -1) {
    console.log('Snippet of reviewsItemV2Fields:');
    console.log(text.slice(idx - 100, idx + 1000));
  }
}

checkReviewFragment();
