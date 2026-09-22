import fs from 'fs';

const contentPath = 'C:/Users/josue/.gemini/antigravity-ide/brain/a0efcc6d-1979-4d57-ae67-6a3ac624ce20/.system_generated/steps/61/content.md';
const content = fs.readFileSync(contentPath, 'utf8');

const apolloMatch = content.match(/<script>\s*window\.__APOLLO_STATE__\s*=\s*(\{[\s\S]*?\});\s*<\/script>/);
if (apolloMatch) {
  const apolloState = JSON.parse(apolloMatch[1]);
  fs.writeFileSync('scripts/apollo_state.json', JSON.stringify(apolloState, null, 2));
  console.log('Successfully saved Apollo state. Top level keys:', Object.keys(apolloState).length);
  
  // Find all keys by typenames
  const typenames = {};
  for (const [key, value] of Object.entries(apolloState)) {
    if (value && value.__typename) {
      typenames[value.__typename] = (typenames[value.__typename] || 0) + 1;
    }
  }
  console.log('Typenames in Apollo state:', typenames);
} else {
  console.log('Apollo state pattern not found.');
}
