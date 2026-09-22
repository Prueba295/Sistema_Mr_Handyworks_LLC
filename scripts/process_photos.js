import fs from 'fs';

const mediaList = JSON.parse(fs.readFileSync('scripts/all_media_raw.json', 'utf8'));
console.log('Total media raw items:', mediaList.length);

const photos = [];
for (const item of mediaList) {
  const m = item.media;
  if (!m) continue;
  let imgUrl = null;
  let pk = null;

  if (m.__typename === 'Image') {
    imgUrl = m.thumbnailURL;
    pk = m.imagePk;
  } else if (m.__typename === 'ReviewImage' || m.__typename === 'ProjectImage') {
    imgUrl = m.image?.thumbnailURL;
    pk = m.image?.imagePk;
  }

  if (pk) {
    // Generate high resolution image URL
    // Thumbtack CDN standard high-res pattern: https://production-next-images-cdn.thumbtack.com/i/{pk}/width/1024.jpeg
    const highResUrl = `https://production-next-images-cdn.thumbtack.com/i/${pk}/width/1024.jpeg`;
    photos.push({
      pk,
      title: item.title || null,
      description: item.description || null,
      type: m.__typename,
      highResUrl,
      thumbUrl: imgUrl
    });
  }
}

// Deduplicate by pk
const uniquePhotos = Array.from(new Map(photos.map(p => [p.pk, p])).values());
console.log('Unique high-resolution photos count:', uniquePhotos.length);
fs.writeFileSync('scripts/unique_photos.json', JSON.stringify(uniquePhotos, null, 2));

console.log('Sample photo:', uniquePhotos[0]);
