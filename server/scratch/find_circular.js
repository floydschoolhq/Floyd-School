const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, '../../Client/src');

// Keep track of file dependencies
const graph = {};
const resolvedPaths = {};

// Helper to resolve imports
function resolveImport(sourceFile, importPath) {
    const dir = path.dirname(sourceFile);
    
    // We only care about relative imports (local files)
    if (!importPath.startsWith('.') && !importPath.startsWith('..')) {
        return null;
    }
    
    const possibleExts = ['.jsx', '.js', '.tsx', '.ts', '/index.jsx', '/index.js', '/index.tsx', '/index.ts'];
    let resolved = null;
    
    // Resolve absolute path of import
    const base = path.resolve(dir, importPath);
    
    if (fs.existsSync(base) && fs.statSync(base).isFile()) {
        resolved = base;
    } else {
        for (const ext of possibleExts) {
            const p = base + ext;
            if (fs.existsSync(p) && fs.statSync(p).isFile()) {
                resolved = p;
                break;
            }
        }
    }
    
    return resolved;
}

// Extract imports from a file
function extractImports(filePath) {
    if (!fs.existsSync(filePath)) return [];
    
    const content = fs.readFileSync(filePath, 'utf8');
    const imports = [];
    
    // Regex for dynamic and static imports
    // Static: import ... from '...'; or import '...';
    const staticImportRegex = /(?:import|export)\s+(?:[\w*\s{},]*\s+from\s+)?['"]([^'"]+)['"]/g;
    // Dynamic: import('...')
    const dynamicImportRegex = /import\(['"]([^'"]+)['"]\)/g;
    
    let match;
    while ((match = staticImportRegex.exec(content)) !== null) {
        imports.push(match[1]);
    }
    while ((match = dynamicImportRegex.exec(content)) !== null) {
        imports.push(match[1]);
    }
    
    return imports;
}

// Recursively traverse directory
function scanDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && file !== 'dist' && file !== '.git') {
                scanDir(fullPath);
            }
        } else if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.ts') || file.endsWith('.tsx')) {
            const relativePath = path.relative(srcDir, fullPath).replace(/\\/g, '/');
            const imports = extractImports(fullPath);
            const deps = [];
            
            for (const imp of imports) {
                const resolved = resolveImport(fullPath, imp);
                if (resolved) {
                    const resolvedRel = path.relative(srcDir, resolved).replace(/\\/g, '/');
                    deps.push(resolvedRel);
                }
            }
            
            graph[relativePath] = deps;
        }
    }
}

console.log('Scanning src directory at:', srcDir);
scanDir(srcDir);
console.log(`Scanned ${Object.keys(graph).length} files.`);

// Cycle detection algorithm (DFS)
const visited = {};
const recStack = {};
const cycles = [];

function findCycles(node, pathStack = []) {
    visited[node] = true;
    recStack[node] = true;
    pathStack.push(node);
    
    const neighbors = graph[node] || [];
    for (const neighbor of neighbors) {
        if (!visited[neighbor]) {
            findCycles(neighbor, pathStack);
        } else if (recStack[neighbor]) {
            // Cycle detected!
            const cycleIndex = pathStack.indexOf(neighbor);
            if (cycleIndex !== -1) {
                const cycle = pathStack.slice(cycleIndex);
                cycle.push(neighbor); // Close the loop
                cycles.push(cycle);
            }
        }
    }
    
    recStack[node] = false;
    pathStack.pop();
}

for (const node of Object.keys(graph)) {
    if (!visited[node]) {
        findCycles(node);
    }
}

if (cycles.length === 0) {
    console.log('\nSUCCESS: No circular dependencies found!');
} else {
    console.log(`\nDETECTED ${cycles.length} CIRCULAR DEPENDENCY LOOPS:\n`);
    cycles.forEach((cycle, index) => {
        console.log(`Loop #${index + 1}:`);
        console.log('  ' + cycle.join('  -->  '));
        console.log('');
    });
}
