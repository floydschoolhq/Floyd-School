const fs = require('fs');
const lines = fs.readFileSync('true_unused.txt', 'utf8').split('\n');
const toRemove = {};

lines.forEach(l => {
    const match = l.match(/^(.*?):(\d+) '(\w+)' is defined but never used/);
    if (match) {
        const file = match[1];
        const varName = match[3];
        if (!toRemove[file]) toRemove[file] = [];
        if (!toRemove[file].includes(varName)) toRemove[file].push(varName);
    }
});

for (let file in toRemove) {
    if (!fs.existsSync(file)) continue;
    let content = fs.readFileSync(file, 'utf8');
    toRemove[file].forEach(v => {
        // Regex to match imports that destructure variables: `import { varNames, v } from ...`
        const regexGroup = new RegExp('import\\s+\\{([^}]*?)\\b' + v + '\\b([^}]*?)\\}\\s+from\\s+[\'"].*?[\'"];?', 'g');
        content = content.replace(regexGroup, (match) => {
            // Remove the variable and potential commas next to it
            let cleaned = match.replace(new RegExp('\\b' + v + '\\b\\s*,?|,?\\s*\\b' + v + '\\b'), '');
            // If the curly braces are empty, remove the entire line
            if (cleaned.match(/import\\s+\\{\\s*\\}\\s+from/)) return '';
            return cleaned;
        });
        
        // Also remove `import v from ...` or `import v, { ... } from ...`
        const regexDefault = new RegExp('import\\s+\\b' + v + '\\b\\s*,?\\s*', 'g');
        content = content.replace(regexDefault, (match) => {
            if (match.includes(',')) return 'import ';
            return '';
        });
        content = content.replace(/import\s+from\s+['"].*?['"];?\n?/g, ''); // cleanup empty default
    });
    fs.writeFileSync(file, content);
}
console.log('Cleaned unused imports from ' + Object.keys(toRemove).length + ' files');
