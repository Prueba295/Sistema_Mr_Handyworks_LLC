import fs from 'fs';

const servicePage = JSON.parse(fs.readFileSync('scripts/service_page_data.json', 'utf8'));
const mediaSec = servicePage.sections.find(s => s.__typename === 'ServicePageMediaSection');
const revSec = servicePage.sections.find(s => s.__typename === 'ServicePageReviewsSection');

const mediaPageToken = mediaSec?.media?.mediaPageToken;
const reviewsPageToken = revSec?.reviews?.reviewsPageToken;

console.log('mediaPageToken exists:', !!mediaPageToken);
console.log('reviewsPageToken exists:', !!reviewsPageToken);

async function fetchGraphQL(query, variables, operationName) {
  const res = await fetch('https://app.thumbtack.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'X-Thumbtack-Client-Version': '2452b78bdde'
    },
    body: JSON.stringify({
      operationName,
      query,
      variables
    })
  });
  return await res.json();
}

async function run() {
  // Test ServicePageMedia
  const mediaQuery = `
    query ServicePageMedia($mediaPageToken: ID!) {
      servicePageMedia(mediaPageToken: $mediaPageToken) {
        items {
          media {
            __typename
            ... on ReviewImage {
              reviewPk
              imageIndex
              image {
                imagePk
                thumbnailURL
              }
            }
          }
          title
          description
        }
        mediaPageToken
      }
    }
  `;

  console.log('Fetching media...');
  const mediaRes = await fetchGraphQL(mediaQuery, { mediaPageToken }, 'ServicePageMedia');
  console.log('Media res:', JSON.stringify(mediaRes, null, 2).slice(0, 1000));

  // Test ServicePageReviews
  const reviewQuery = `
    query ServicePageReviews($reviewsPageToken: ID!) {
      servicePageReviews(reviewsPageToken: $reviewsPageToken) {
        reviewsPageToken
        itemsV2 {
          reviewV2 {
            header {
              attribution
              rating {
                rating
              }
              date
            }
            text {
              segments {
                text
              }
            }
            jobDetailsV2
            labels {
              text
            }
          }
        }
      }
    }
  `;

  console.log('\nFetching reviews...');
  const revRes = await fetchGraphQL(reviewQuery, { reviewsPageToken }, 'ServicePageReviews');
  console.log('Reviews res:', JSON.stringify(revRes, null, 2).slice(0, 1000));
}

run();
