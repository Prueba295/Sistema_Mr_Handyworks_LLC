import fs from 'fs';

async function fetchAllMediaAndReviews() {
  const servicePage = JSON.parse(fs.readFileSync('scripts/service_page_data.json', 'utf8'));
  const mediaSec = servicePage.sections.find(s => s.__typename === 'ServicePageMediaSection');
  const revSec = servicePage.sections.find(s => s.__typename === 'ServicePageReviewsSection');

  let mediaToken = mediaSec?.media?.mediaPageToken;
  let revToken = revSec?.reviews?.reviewsPageToken;

  const allMedia = [];
  const allReviews = [];

  // Add initial items from servicePage
  if (mediaSec?.media?.items) {
    allMedia.push(...mediaSec.media.items);
  }
  if (revSec?.reviews?.itemsV2) {
    allReviews.push(...revSec.reviews.itemsV2);
  }

  async function fetchGraphQL(query, variables, operationName) {
    const res = await fetch('https://app.thumbtack.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'X-Thumbtack-Client-Version': '2452b78bdde'
      },
      body: JSON.stringify({ operationName, query, variables })
    });
    return await res.json();
  }

  // 1. Fetch Media
  const mediaQuery = `
    query ServicePageMedia($mediaPageToken: ID!) {
      servicePageMedia(mediaPageToken: $mediaPageToken) {
        items {
          media {
            __typename
            ... on Image {
              imagePk
              thumbnailURL
            }
            ... on Video {
              source
              sourceID
              thumbnailURL
              stillURL
            }
            ... on ProjectImage {
              projectPk
              imageIndex
              image {
                imagePk
                thumbnailURL
              }
            }
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

  console.log('Fetching media pages...');
  let mediaPage = 0;
  while (mediaToken && mediaPage < 30) {
    mediaPage++;
    console.log(`Media page ${mediaPage}...`);
    const res = await fetchGraphQL(mediaQuery, { mediaPageToken: mediaToken }, 'ServicePageMedia');
    if (res.errors) {
      console.error('Media GraphQL errors:', res.errors);
      break;
    }
    const data = res?.data?.servicePageMedia;
    if (!data?.items?.length) {
      console.log('End of media.');
      break;
    }
    allMedia.push(...data.items);
    console.log(`Got ${data.items.length} items. Total so far: ${allMedia.length}`);
    if (!data.mediaPageToken || data.mediaPageToken === mediaToken) {
      break;
    }
    mediaToken = data.mediaPageToken;
    await new Promise(r => setTimeout(r, 400));
  }

  // 2. Fetch Reviews
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
              verifier {
                text
              }
            }
            text {
              segments {
                text
              }
            }
            jobDetailsV2
            images {
              imagePk
              thumbnailURL
            }
            labels {
              text
            }
            response {
              attribution
              text
            }
          }
        }
      }
    }
  `;

  console.log('\nFetching reviews pages...');
  let revPage = 0;
  while (revToken && revPage < 30) {
    revPage++;
    console.log(`Reviews page ${revPage}...`);
    const res = await fetchGraphQL(reviewQuery, { reviewsPageToken: revToken }, 'ServicePageReviews');
    if (res.errors) {
      console.error('Reviews GraphQL errors:', res.errors);
      break;
    }
    const data = res?.data?.servicePageReviews;
    if (!data?.itemsV2?.length) {
      console.log('End of reviews.');
      break;
    }
    allReviews.push(...data.itemsV2);
    console.log(`Got ${data.itemsV2.length} reviews. Total so far: ${allReviews.length}`);
    if (!data.reviewsPageToken || data.reviewsPageToken === revToken) {
      break;
    }
    revToken = data.reviewsPageToken;
    await new Promise(r => setTimeout(r, 400));
  }

  fs.writeFileSync('scripts/all_media_raw.json', JSON.stringify(allMedia, null, 2));
  fs.writeFileSync('scripts/all_reviews_raw.json', JSON.stringify(allReviews, null, 2));
  console.log(`\nCOMPLETED SUCCESSFULLY!`);
  console.log(`Total Media: ${allMedia.length}`);
  console.log(`Total Reviews: ${allReviews.length}`);
}

fetchAllMediaAndReviews();
