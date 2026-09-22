import fs from 'fs';

const servicePage = JSON.parse(fs.readFileSync('scripts/service_page_data.json', 'utf8'));
const mediaSec = servicePage.sections.find(s => s.__typename === 'ServicePageMediaSection');
const mediaPageToken = mediaSec?.media?.mediaPageToken;

console.log('Media Page Token:', mediaPageToken);

async function testFetch() {
  // Let's test calling https://app.thumbtack.com/graphql
  // or testing media overflow
  const query = `
    query ServicePageMediaModal($token: String!) {
      servicePageMedia(token: $token) {
        media {
          id
          mediaType
          caption
          tag
          image {
            url
            width
            height
          }
        }
      }
    }
  `;

  try {
    const res = await fetch('https://app.thumbtack.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      body: JSON.stringify({
        query: query,
        variables: { token: mediaPageToken }
      })
    });
    console.log('Status:', res.status);
    const data = await res.json();
    console.log('Response:', JSON.stringify(data, null, 2).slice(0, 1000));
  } catch (err) {
    console.error('Fetch error:', err.message);
  }
}

testFetch();
