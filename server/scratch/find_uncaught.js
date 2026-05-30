const fs = require('fs');
const path = require('path');

const bundlePath = path.resolve(__dirname, '../../Client/dist/assets/index-BXaFD7dB.js');

if (!fs.existsSync(bundlePath)) {
    console.error('Bundle file not found at:', bundlePath);
    process.exit(1);
}

const content = fs.readFileSync(bundlePath, 'utf8');

// Find references to components or names
console.log('Bundle loaded. Length:', content.length, 'bytes');

// Search for "LiveSessionView" or similar strings
const matchIndex = content.indexOf('LiveSessionView');
if (matchIndex === -1) {
    console.log('String "LiveSessionView" not found in bundle.');
} else {
    console.log('String "LiveSessionView" found at index:', matchIndex);
    const start = Math.max(0, matchIndex - 500);
    const end = Math.min(content.length, matchIndex + 500);
    console.log('--- Context around LiveSessionView ---');
    console.log(content.slice(start, end));
    console.log('-------------------------------------');
}
