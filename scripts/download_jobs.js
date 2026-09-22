import fs from 'fs';
import path from 'path';

const photos = JSON.parse(fs.readFileSync('scripts/unique_photos.json', 'utf8'));
const targetDir = path.resolve('jobs');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

console.log(`Starting download of ${photos.length} photos to ${targetDir}...`);

async function downloadPhoto(photo, index) {
  const filename = `job_${String(index + 1).padStart(3, '0')}_${photo.pk}.jpeg`;
  const filePath = path.join(targetDir, filename);

  if (fs.existsSync(filePath) && fs.statSync(filePath).size > 1000) {
    return { ...photo, filename, status: 'already_exists' };
  }

  // Try high res first, then fallback to thumb
  const urlsToTry = [photo.highResUrl, photo.thumbUrl];
  for (const url of urlsToTry) {
    if (!url) continue;
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': 'https://www.thumbtack.com/'
        }
      });
      if (res.ok) {
        const buffer = await res.arrayBuffer();
        fs.writeFileSync(filePath, Buffer.from(buffer));
        return { ...photo, filename, status: 'downloaded', size: buffer.byteLength };
      }
    } catch (e) {
      // try next
    }
  }

  return { ...photo, filename, status: 'failed' };
}

// Download with concurrency limit of 6
async function downloadAll() {
  const results = [];
  const concurrency = 6;
  let active = 0;
  let index = 0;

  async function next() {
    if (index >= photos.length) return;
    const curIndex = index++;
    const photo = photos[curIndex];
    active++;
    const res = await downloadPhoto(photo, curIndex);
    results.push(res);
    active--;
    if (results.length % 15 === 0 || results.length === photos.length) {
      console.log(`Progress: ${results.length}/${photos.length} photos handled.`);
    }
    await next();
  }

  const workers = Array.from({ length: concurrency }, () => next());
  await Promise.all(workers);

  const downloadedCount = results.filter(r => r.status === 'downloaded' || r.status === 'already_exists').length;
  console.log(`\nDownload completed: ${downloadedCount}/${photos.length} successful.`);

  fs.writeFileSync(path.join(targetDir, 'photos_manifest.json'), JSON.stringify(results, null, 2));
  console.log('Saved manifest to jobs/photos_manifest.json');
}

downloadAll();
