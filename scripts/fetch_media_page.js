import fs from 'fs';

async function fetchMediaPage() {
  const url = 'https://www.thumbtack.com/in/south-bend/handyman/mr-handyworks-llc/service/557892581429960708/media';
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    }
  });
  console.log('Status:', res.status);
  const text = await res.text();
  console.log('Length:', text.length);
  fs.writeFileSync('scripts/media_page.html', text);

  // Check for image IDs in this page
  const imageRegex = /https:\/\/production-next-images-cdn\.thumbtack\.com\/i\/(\d+)\/([^\s"'<>\\]+)/g;
  let m;
  const imageMap = new Map();
  while ((m = imageRegex.exec(text)) !== null) {
    const id = m[1];
    const rest = m[2].replace(/\\u002F/g, '/');
    if (!imageMap.has(id)) {
      imageMap.set(id, []);
    }
    imageMap.get(id).push(rest);
  }
  console.log('Unique Image IDs found on /media:', imageMap.size);
  for (const [id, variations] of imageMap.entries()) {
    console.log(`ID ${id}:`, variations);
  }
}

fetchMediaPage();
