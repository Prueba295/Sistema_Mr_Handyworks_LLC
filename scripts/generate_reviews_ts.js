import fs from 'fs';

const scraped = JSON.parse(fs.readFileSync('thumbtack_scraped_data.json', 'utf8'));
const reviews = scraped.reviews;

const formattedReviews = reviews.map((r, i) => {
  return {
    id: `rev-thumbtack-${r.id}`,
    authorName: r.author,
    location: 'South Bend, IN',
    rating: r.rating || 5,
    date: r.date || 'Reciente',
    commentEs: r.text,
    commentEn: r.text,
    tags: [r.jobLabel || 'Handyman', 'Verified Thumbtack Hire'],
    isVerified: true,
    source: 'Thumbtack',
    jobType: r.jobLabel || 'Handyman Service',
    featured: i < 10,
    status: 'APPROVED',
    jobDetails: r.jobDetails || ''
  };
});

const tsContent = `// Auto-generated real customer reviews from Thumbtack
import { Review } from '../types';

export const REAL_THUMBTACK_REVIEWS: Review[] = ${JSON.stringify(formattedReviews, null, 2)};
`;

fs.writeFileSync('src/data/realReviews.ts', tsContent);
console.log(`Saved ${formattedReviews.length} reviews to src/data/realReviews.ts`);
