import fs from 'fs';

async function findReviewQuery() {
  const url = 'https://cdn.thumbtackstatic.com/fe-assets-rr/es5/pages/instant-results-app/scripts/instant-results-cobalt-app-harness.b69de89c522e633afe57-v3.js.gz';
  const res = await fetch(url);
  const unzipped = await res.text();

  const tokenIdx = unzipped.indexOf('reviewsPageToken');
  if (tokenIdx !== -1) {
    console.log('Snippet around reviewsPageToken:');
    console.log(unzipped.slice(tokenIdx - 300, tokenIdx + 500));
  }
}

findReviewQuery();
