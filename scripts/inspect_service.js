import fs from 'fs';

const apollo = JSON.parse(fs.readFileSync('scripts/apollo_state.json', 'utf8'));
const rootQuery = apollo.ROOT_QUERY;
console.log('Root query keys:', Object.keys(rootQuery));

const servicePageKey = Object.keys(rootQuery).find(k => k.startsWith('servicePage'));
console.log('Service page query key:', servicePageKey);
if (servicePageKey) {
  const servicePage = rootQuery[servicePageKey];
  console.log('Service page keys:', Object.keys(servicePage));
  fs.writeFileSync('scripts/service_page_data.json', JSON.stringify(servicePage, null, 2));
  console.log('Saved servicePage to scripts/service_page_data.json');
}
