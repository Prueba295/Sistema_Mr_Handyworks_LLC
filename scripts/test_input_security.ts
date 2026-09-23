import {
  validateFullName,
  validateUSPhone,
  formatUSPhone,
  validateEmail,
  validateStreetAddress,
  validateZipCode,
  sanitizeXSS,
  validateMeaningfulText,
  validateAdminUrl
} from '../src/utils/inputSecurity';

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failed++;
  }
}

console.log('\n======================================================');
console.log('🛡️  TESTING FORM INPUT SECURITY & VALIDATION');
console.log('======================================================\n');

// 1. Full Name
console.log('1. Full Name Validation:');
assert(!validateFullName('aa').isValid, 'Rejects "aa"');
assert(!validateFullName('a').isValid, 'Rejects "a"');
assert(!validateFullName('12345').isValid, 'Rejects numbers');
assert(!validateFullName('John').isValid, 'Rejects single name without surname');
assert(validateFullName('John Miller').isValid, 'Accepts "John Miller"');
assert(validateFullName('Sarah O\'Connor').isValid, 'Accepts "Sarah O\'Connor"');
assert(validateFullName('María José Gómez').isValid, 'Accepts accented names');

// 2. Phone Number
console.log('\n2. Phone Number Validation & Formatting:');
assert(!validateUSPhone('aa').isValid, 'Rejects "aa"');
assert(!validateUSPhone('123').isValid, 'Rejects short number');
assert(!validateUSPhone('0123456789').isValid, 'Rejects area code starting with 0');
assert(!validateUSPhone('1111111111').isValid, 'Rejects repeated digits');
assert(validateUSPhone('5745550192').isValid, 'Accepts 10-digit US phone');
assert(validateUSPhone('(574) 555-0192').isValid, 'Accepts formatted US phone');
assert(formatUSPhone('5745550192') === '(574) 555-0192', 'Formats phone cleanly');

// 3. Email Address
console.log('\n3. Email Validation:');
assert(!validateEmail('aa').isValid, 'Rejects "aa"');
assert(!validateEmail('test@').isValid, 'Rejects incomplete email');
assert(validateEmail('').isValid, 'Accepts empty email (optional)');
assert(validateEmail('client@gmail.com').isValid, 'Accepts valid email');

// 4. Street Address
console.log('\n4. Street Address Validation:');
assert(!validateStreetAddress('aa').isValid, 'Rejects "aa"');
assert(!validateStreetAddress('Main St').isValid, 'Rejects street name without house number');
assert(!validateStreetAddress('12345').isValid, 'Rejects only numbers');
assert(validateStreetAddress('1428 E Jefferson Blvd').isValid, 'Accepts "1428 E Jefferson Blvd"');
assert(validateStreetAddress('51591 SR-933').isValid, 'Accepts "51591 SR-933"');

// 5. Zip Code
console.log('\n5. Zip Code Validation:');
assert(!validateZipCode('aa').isValid, 'Rejects "aa"');
assert(!validateZipCode('1234').isValid, 'Rejects 4 digits');
assert(!validateZipCode('11111').isValid, 'Rejects bogus repeating zip');
assert(validateZipCode('46637').isValid, 'Accepts valid 46637 zip');

// 6. XSS Sanitization
console.log('\n6. XSS Sanitization:');
const clean = sanitizeXSS('<script>alert("hack")</script>TV Mount');
assert(!clean.includes('<script>'), 'Strips HTML/script tags');
assert(clean.includes('TV Mount'), 'Preserves legitimate text content');

// 7. Meaningful Text Validation (Admin Anti-Spam/Placeholder)
console.log('\n7. Meaningful Text Validation (Admin Forms):');
assert(!validateMeaningfulText('aa', 3, 'Title').isValid, 'Rejects "aa" (< 3 chars)');
assert(!validateMeaningfulText('aaaa', 3, 'Title').isValid, 'Rejects repetitive "aaaa"');
assert(!validateMeaningfulText('....', 3, 'Comment').isValid, 'Rejects repetitive "...."');
assert(!validateMeaningfulText('1111', 3, 'Company').isValid, 'Rejects repetitive "1111"');
assert(!validateMeaningfulText('', 3, 'Field').isValid, 'Rejects empty text');
assert(validateMeaningfulText('Plumbing Repair', 3, 'Title').isValid, 'Accepts "Plumbing Repair"');
assert(validateMeaningfulText('Great service and prompt arrival!', 8, 'Comment').isValid, 'Accepts valid review comment');

// 8. Admin URL & Asset Path Validation
console.log('\n8. Admin URL & Asset Path Validation:');
assert(!validateAdminUrl('aa').isValid, 'Rejects "aa"');
assert(!validateAdminUrl('javascript:alert(1)').isValid, 'Rejects javascript URI');
assert(!validateAdminUrl('invalid_string').isValid, 'Rejects non-path/non-URL');
assert(validateAdminUrl('/portfolio/drywall_finish.jpg').isValid, 'Accepts relative local image path');
assert(validateAdminUrl('https://example.com/photo.jpg').isValid, 'Accepts HTTPS URL');

console.log('\n======================================================');
console.log(`📊 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log('======================================================\n');

if (failed > 0) process.exit(1);
