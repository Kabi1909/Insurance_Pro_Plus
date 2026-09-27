import fs from 'fs';
import path from 'path';

function findUndefinedReactComponents(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      findUndefinedReactComponents(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const usedComponents = new Set();
      // Match <ComponentName
      const regex = /<([A-Z][a-zA-Z0-9_]*)/g;
      let match;
      while ((match = regex.exec(content)) !== null) {
        usedComponents.add(match[1]);
      }
      
      const missing = [];
      for (const comp of usedComponents) {
        // Exclude standard HTML tags just in case, though regex captures capital letters
        if (comp === 'React' || comp === 'Fragment') continue;
        
        // Check if imported or defined
        const definedRegex = new RegExp(`(import.*\\b${comp}\\b|const\\s+${comp}\\s*=|function\\s+${comp}\\b|class\\s+${comp}\\b)`);
        if (!definedRegex.test(content) && !content.includes(`{ ${comp} }`) && !content.includes(` ${comp} `) && !content.includes(comp + '.Provider') && !content.includes(comp + '.Consumer')) {
          missing.push(comp);
        }
      }
      
      if (missing.length > 0) {
        console.log(`Missing in ${fullPath}:`, missing.join(', '));
      }
    }
  }
}

findUndefinedReactComponents('./src');
