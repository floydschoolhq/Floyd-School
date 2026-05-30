const path = require('path');
const fs = require('fs');

// Simulate setting CWD to server directory like index.js does
process.chdir(path.resolve(__dirname, '..'));

const staticDir = path.resolve(process.cwd(), 'uploads');
const uploadDir = path.resolve(process.cwd(), 'uploads/assignments');

console.log('Current Working Directory (process.cwd()):', process.cwd());
console.log('Resolved Static Dir (uploads):', staticDir);
console.log('Resolved Upload Dir (uploads/assignments):', uploadDir);

console.log('Does Static Dir exist?', fs.existsSync(staticDir));
console.log('Does Upload Dir exist?', fs.existsSync(uploadDir));

if (!fs.existsSync(staticDir)) {
    console.log('Creating Static Dir...');
    fs.mkdirSync(staticDir, { recursive: true });
}
if (!fs.existsSync(uploadDir)) {
    console.log('Creating Upload Dir...');
    fs.mkdirSync(uploadDir, { recursive: true });
}

console.log('After creation - Does Static Dir exist?', fs.existsSync(staticDir));
console.log('After creation - Does Upload Dir exist?', fs.existsSync(uploadDir));
console.log('Paths are perfectly identical and aligned:', uploadDir.startsWith(staticDir));

