import fs from 'fs';

const allMedia = JSON.parse(fs.readFileSync('scripts/all_media_raw.json', 'utf8'));
const allReviews = JSON.parse(fs.readFileSync('scripts/all_reviews_raw.json', 'utf8'));

// Build imagePk -> review mapping
const imageToReview = new Map();
allReviews.forEach(item => {
  const r = item.reviewV2;
  if (!r) return;
  const label = r.labels?.[0]?.text || 'General Handyman';
  const details = r.jobDetailsV2 || '';
  const text = (r.text?.segments || []).map(s => s.text).join(' ');
  const author = r.header?.attribution || '';
  (r.images || []).forEach(img => {
    if (img.imagePk) {
      imageToReview.set(img.imagePk, { label, details, text, author });
    }
  });
});

console.log('Images mapped to review metadata:', imageToReview.size);

const manifest = JSON.parse(fs.readFileSync('jobs/photos_manifest.json', 'utf8'));

const categorizedPhotos = manifest.map((p, idx) => {
  const meta = imageToReview.get(p.pk) || {};
  let category = 'GENERAL';
  let categoryNameEs = 'Trabajos Generales';
  let categoryNameEn = 'General Handyman';
  const textCorpus = `${p.title || ''} ${p.description || ''} ${meta.label || ''} ${meta.details || ''} ${meta.text || ''}`.toLowerCase();

  if (textCorpus.includes('tv') || textCorpus.includes('mount') || textCorpus.includes('theater') || textCorpus.includes('speaker') || textCorpus.includes('sound') || textCorpus.includes('fireplace') || textCorpus.includes('screen') || textCorpus.includes('cable')) {
    category = 'TV_AUDIO';
    categoryNameEs = 'Montaje de TV y Audio';
    categoryNameEn = 'TV Mounting & Audio';
  } else if (textCorpus.includes('plumb') || textCorpus.includes('sink') || textCorpus.includes('faucet') || textCorpus.includes('toilet') || textCorpus.includes('bath') || textCorpus.includes('shower') || textCorpus.includes('leak') || textCorpus.includes('pipe') || textCorpus.includes('drain')) {
    category = 'PLUMBING';
    categoryNameEs = 'Plomería y Grifería';
    categoryNameEn = 'Plumbing & Fixtures';
  } else if (textCorpus.includes('door') || textCorpus.includes('lock') || textCorpus.includes('barn') || textCorpus.includes('window') || textCorpus.includes('hinge')) {
    category = 'DOORS_LOCKS';
    categoryNameEs = 'Puertas y Cerraduras';
    categoryNameEn = 'Doors & Locks';
  } else if (textCorpus.includes('shelf') || textCorpus.includes('shelv') || textCorpus.includes('carpentry') || textCorpus.includes('wood') || textCorpus.includes('molding') || textCorpus.includes('baseboard') || textCorpus.includes('trim') || textCorpus.includes('cabinet')) {
    category = 'CARPENTRY';
    categoryNameEs = 'Carpintería y Repisas';
    categoryNameEn = 'Carpentry & Shelving';
  } else if (textCorpus.includes('furniture') || textCorpus.includes('assembl') || textCorpus.includes('gym') || textCorpus.includes('fitness') || textCorpus.includes('desk') || textCorpus.includes('ikea') || textCorpus.includes('bed')) {
    category = 'ASSEMBLY';
    categoryNameEs = 'Ensamblaje y Muebles';
    categoryNameEn = 'Furniture Assembly';
  } else if (textCorpus.includes('light') || textCorpus.includes('fan') || textCorpus.includes('outlet') || textCorpus.includes('switch') || textCorpus.includes('electric') || textCorpus.includes('pendant')) {
    category = 'ELECTRICAL';
    categoryNameEs = 'Electricidad e Iluminación';
    categoryNameEn = 'Electrical & Lighting';
  }

  return {
    id: `job-${p.pk}`,
    pk: p.pk,
    filename: p.filename,
    url: `/jobs/${p.filename}`,
    category,
    categoryNameEs,
    categoryNameEn,
    client: meta.author || null,
    jobLabel: meta.label || (p.title || 'Mr Handyworks Project'),
    jobDetails: meta.details || p.description || '',
    reviewSnippet: meta.text ? meta.text.slice(0, 160) + '...' : null
  };
});

// Category counts
const counts = {};
categorizedPhotos.forEach(p => {
  counts[p.category] = (counts[p.category] || 0) + 1;
});
console.log('Category distribution:', counts);

fs.writeFileSync('scripts/categorized_portfolio.json', JSON.stringify(categorizedPhotos, null, 2));
