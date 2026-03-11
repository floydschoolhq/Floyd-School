const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'Client', 'src');

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') {
        arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
      }
    } else {
      if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js') || fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
        arrayOfFiles.push(fullPath);
      }
    }
  });

  return arrayOfFiles;
}

const allSrcFiles = getAllFiles(srcDir);
const allFileContents = allSrcFiles.map(file => fs.readFileSync(file, 'utf8'));

// Find all components
const componentsDir = path.join(srcDir, 'components');
const components = getAllFiles(componentsDir);

const unusedComponents = [];

components.forEach(comp => {
  const basename = path.basename(comp, path.extname(comp));
  if (basename === 'index' || basename.toLowerCase() === 'app' || basename.toLowerCase() === 'main') return;
  
  // Check if this component name is used in any file other than itself
  let isUsed = false;
  for (let i = 0; i < allSrcFiles.length; i++) {
    const file = allSrcFiles[i];
    if (file === comp) continue;
    
    const content = allFileContents[i];
    // Simple check: does the file content contain the basename?
    // A better check is if it contains `import ${basename}` or `from '.../${basename}'` or `<${basename}`
    if (content.includes(basename)) {
      isUsed = true;
      break;
    }
  }
  
  if (!isUsed) {
    unusedComponents.push(comp);
  }
});

console.log("Unused Components:");
unusedComponents.forEach(c => console.log(c.replace(__dirname, '')));

// Also check for common unnecessary files like old READMEs or txt files
const rootDir = __dirname;
const rootFiles = fs.readdirSync(rootDir);
console.log("\nPotential Unnecessary Root Files:");
rootFiles.forEach(f => {
    if (f.endsWith('.txt') || f.endsWith('.md') && f !== 'README.md') {
        console.log(f);
    }
});
