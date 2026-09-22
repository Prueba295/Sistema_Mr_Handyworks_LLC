import fs from 'fs';

async function fetchAndAnalyzeJs() {
  const url = 'https://cdn.thumbtackstatic.com/fe-assets-rr/es5/pages/instant-results-app/scripts/instant-results-cobalt-app-harness.b69de89c522e633afe57-v3.js.gz';
  const res = await fetch(url);
  const unzipped = await res.text();
  console.log('JS text length:', unzipped.length);

  // Search for operation names
  const opMatches = unzipped.match(/name:\{kind:"Name",value:"([^"]+)"\}/g) || [];
  const uniqueOps = [...new Set(opMatches.map(m => m.match(/value:"([^"]+)"/)[1]))];
  console.log('GraphQL Operation names found:', uniqueOps.length);
  const mediaOps = uniqueOps.filter(o => o.toLowerCase().includes('media') || o.toLowerCase().includes('review') || o.toLowerCase().includes('service'));
  console.log('Matching Ops:', mediaOps);

  // Search for mediaPageToken usage
  const tokenIdx = unzipped.indexOf('mediaPageToken');
  if (tokenIdx !== -1) {
    console.log('Snippet around mediaPageToken:');
    console.log(unzipped.slice(tokenIdx - 200, tokenIdx + 500));
  }
}

fetchAndAnalyzeJs();
