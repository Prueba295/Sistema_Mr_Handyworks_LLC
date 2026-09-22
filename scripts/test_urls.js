async function testUrls() {
  const base = 'https://www.thumbtack.com/in/south-bend/handyman/mr-handyworks-llc/service/557892581429960708';
  const urls = [
    `${base}/media`,
    `${base}/reviews`,
    `${base}/projects`,
    `https://www.thumbtack.com/profile/services/557892581429960708/media`,
    `https://www.thumbtack.com/profile/services/557892581429960708/reviews`
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, { method: 'HEAD', headers: { 'User-Agent': 'Mozilla/5.0' } });
      console.log(url, '-->', res.status);
    } catch (e) {
      console.log(url, '--> error:', e.message);
    }
  }
}

testUrls();
