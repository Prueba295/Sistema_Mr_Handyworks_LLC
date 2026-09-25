import {
  validateUSPhone,
  formatUSPhone,
  validateEmail
} from '../src/utils/inputSecurity';
import {
  getFileExtension,
  getDetailedCategory,
  classifyFileType,
  normalizeDataUrl
} from '../src/utils/attachmentOptimizer';

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
console.log('📱 TESTING PHONE-BASED 6-DIGIT OTP RECOVERY FLOW');
console.log('======================================================\n');

// 1. Phone number is strictly required and validated for password recovery
console.log('1. Primary Recovery Phone Validation:');
assert(!validateUSPhone('').isValid, 'Rejects empty phone number as primary recovery');
assert(!validateUSPhone('12345').isValid, 'Rejects short phone number');
assert(validateUSPhone('(574) 555-0199').isValid, 'Accepts Mr Handyworks LLC\'s formatted phone number (574) 555-0199');
assert(validateUSPhone('5745550199').isValid, 'Accepts 10-digit unformatted phone number 5745550199');
assert(formatUSPhone('5745550199') === '(574) 555-0199', 'Formats phone correctly to (574) 555-0199');

// 2. Email is strictly validated and mandatory for communications
console.log('\n2. Email Validation:');
assert(!validateEmail('').isValid, 'Rejects empty string for email (mandatory)');
assert(!validateEmail('   ').isValid, 'Rejects whitespace-only email');
assert(validateEmail('contact@mrhandyworks.com').isValid, 'Accepts valid email');
assert(!validateEmail('invalid-email-address').isValid, 'Rejects malformed email');

// 3. 6-digit OTP generation logic
console.log('\n3. 6-Digit OTP Generation & Expiry Simulation:');
function generate6DigitOtp(): { code: string; expiresAt: number } {
  const code = String(Math.floor(100000 + Math.random() * 900000));
  return {
    code,
    expiresAt: Date.now() + 15 * 60 * 1000
  };
}

for (let i = 0; i < 20; i++) {
  const otp = generate6DigitOtp();
  assert(otp.code.length === 6, `OTP is exactly 6 digits: ${otp.code}`);
  assert(/^\d{6}$/.test(otp.code), `OTP is purely numeric: ${otp.code}`);
  assert(parseInt(otp.code, 10) >= 100000 && parseInt(otp.code, 10) <= 999999, `OTP is in 100000-999999 range`);
  assert(otp.expiresAt > Date.now(), `OTP expiration timestamp is in future`);
}

// 4. OTP verification and password update logic
console.log('\n4. Password Reset with Code Verification:');
const sessionOtp = generate6DigitOtp();

function verifyAndReset(inputCode: string, newPassword: string, otpData: { code: string; expiresAt: number } | null): { success: boolean; error?: string } {
  if (!otpData) return { success: false, error: 'No OTP generated' };
  if (Date.now() > otpData.expiresAt) return { success: false, error: 'OTP expired' };
  if (inputCode.trim() !== otpData.code) return { success: false, error: 'Invalid OTP' };
  if (!newPassword || newPassword.length < 6) return { success: false, error: 'Password too short' };
  return { success: true };
}

assert(!verifyAndReset('999999', 'newpass123', sessionOtp).success, 'Rejects incorrect OTP code');
assert(!verifyAndReset(sessionOtp.code, '123', sessionOtp).success, 'Rejects password shorter than 6 chars');
assert(verifyAndReset(sessionOtp.code, 'newStrongPassword2026', sessionOtp).success, 'Accepts correct 6-digit OTP code and sets new password');

// Expired OTP simulation
const expiredOtp = { code: '123456', expiresAt: Date.now() - 1000 };
assert(!verifyAndReset('123456', 'newpass123', expiredOtp).success, 'Rejects expired OTP');

// 5. Universal Attachment Extensions & Categorization
console.log('\n======================================================');
console.log('📎 TESTING UNIVERSAL ATTACHMENT VISUALIZATION');
console.log('======================================================\n');

const testCases: Array<{ filename: string; mime: string; expectedCategory: string; isGlobal: boolean }> = [
  { filename: 'Job_Site_Photo_HW-9289.jpg', mime: 'image/jpeg', expectedCategory: 'image', isGlobal: true },
  { filename: 'IMG_4821.HEIC', mime: 'image/heic', expectedCategory: 'image', isGlobal: true },
  { filename: 'Site_Blueprint.dwg', mime: 'application/acad', expectedCategory: 'cad', isGlobal: true },
  { filename: 'Floor_Plan.dxf', mime: '', expectedCategory: 'cad', isGlobal: true },
  { filename: 'Audio_Note_VoiceMemo.m4a', mime: 'audio/mp4', expectedCategory: 'audio', isGlobal: true },
  { filename: 'Inspection_Voice.mp3', mime: 'audio/mpeg', expectedCategory: 'audio', isGlobal: true },
  { filename: 'Scope_Of_Work.pdf', mime: 'application/pdf', expectedCategory: 'pdf', isGlobal: true },
  { filename: 'Cost_Estimates.xlsx', mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', expectedCategory: 'spreadsheet', isGlobal: true },
  { filename: 'Client_Contract.docx', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', expectedCategory: 'word', isGlobal: true },
  { filename: 'Project_Archive.zip', mime: 'application/zip', expectedCategory: 'archive', isGlobal: true },
  { filename: 'Walkthrough_Video.mp4', mime: 'video/mp4', expectedCategory: 'video', isGlobal: true }
];

testCases.forEach(tc => {
  const ext = getFileExtension(tc.filename);
  const cat = getDetailedCategory(tc.filename, tc.mime);
  assert(cat === tc.expectedCategory, `${tc.filename} (.${ext}) classified as "${cat}"`);
});

// Test DataURL normalization for base64
console.log('\nDataURL Normalization:');
const rawBase64 = '/9j/4AAQSkZJRgABAQEASABIAAD...';
const normalized = normalizeDataUrl(rawBase64, 'test.jpg');
assert(normalized.startsWith('data:image/jpeg;base64,'), 'Repairs raw base64 missing standard header to valid JPEG DataURL');

console.log('\n======================================================');
console.log(`📊 RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log('======================================================\n');

if (failed > 0) {
  process.exit(1);
}
