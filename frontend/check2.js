import fs from 'fs';
import path from 'path';

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      const text = fs.readFileSync(fullPath, 'utf8');
      
      const missing = [];
      const tags = [...text.matchAll(/<([A-Z][a-zA-Z]+)/g)].map(m => m[1]);
      const uniqueTags = [...new Set(tags)];
      
      for (const tag of uniqueTags) {
        if (['React', 'Route', 'Routes', 'Link', 'Navigate', 'Outlet', 'BrowserRouter', 'App', 'AuthProvider', 'AuthContext.Provider'].includes(tag)) continue;
        
        // Find if it's imported or defined in the file
        const isImported = new RegExp(`import\\s+.*?\\b${tag}\\b`).test(text);
        const isDefined = new RegExp(`(const|let|var|function|class)\\s+${tag}\\b`).test(text);
        const isMapped = text.includes(`${tag} = `) || text.includes(`{${tag}}`);
        
        if (!isImported && !isDefined && !isMapped) {
          missing.push(tag);
        }
      }
      
      if (missing.length > 0) {
        console.log(`Missing in ${fullPath}:`, missing.join(', '));
      }
    }
  }
}

walk('./src');
