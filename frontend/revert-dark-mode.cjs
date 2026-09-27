const fs = require('fs');
const path = require('path');

const dir = 'd:/Insurance project/Insurance Pro Plus/frontend/src';

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let original = content;

  // Remove dark: variants
  content = content.replace(/ dark:bg-slate-800\/50/g, '');
  content = content.replace(/ dark:bg-slate-800/g, '');
  content = content.replace(/ dark:bg-slate-900\/50/g, '');
  content = content.replace(/ dark:bg-slate-900/g, '');
  content = content.replace(/ dark:bg-slate-700/g, '');
  content = content.replace(/ dark:border-slate-700/g, '');
  content = content.replace(/ dark:border-slate-600/g, '');
  content = content.replace(/ dark:border-slate-800/g, '');
  content = content.replace(/ dark:text-white/g, '');
  content = content.replace(/ dark:text-slate-100/g, '');
  content = content.replace(/ dark:text-slate-200/g, '');
  content = content.replace(/ dark:text-slate-300/g, '');
  content = content.replace(/ dark:text-slate-400/g, '');
  content = content.replace(/ dark:hover:bg-slate-700/g, '');
  content = content.replace(/ dark:hover:bg-slate-800\/50/g, '');
  content = content.replace(/ dark:hover:bg-slate-800/g, '');
  content = content.replace(/ dark:hover:bg-slate-600/g, '');
  content = content.replace(/ dark:hover:text-white/g, '');
  
  content = content.replace(/ dark:bg-green-50/g, '');
  content = content.replace(/ dark:text-green-400/g, '');
  content = content.replace(/ dark:border-green-800\/30/g, '');
  
  content = content.replace(/ dark:bg-yellow-50/g, '');
  content = content.replace(/ dark:text-yellow-400/g, '');
  content = content.replace(/ dark:border-yellow-800\/30/g, '');
  
  content = content.replace(/ dark:bg-red-50/g, '');
  content = content.replace(/ dark:text-red-400/g, '');
  content = content.replace(/ dark:border-red-800\/30/g, '');
  
  content = content.replace(/ dark:bg-orange-500\/10/g, '');
  content = content.replace(/ dark:text-orange-400/g, '');
  content = content.replace(/ dark:border-orange-800\/30/g, '');
  
  content = content.replace(/ dark:focus:bg-slate-800/g, '');
  
  // Also any other `dark:` classes
  content = content.replace(/\s+dark:[a-zA-Z0-9/-]+/g, '');

  // Remove animations
  content = content.replace(/ animate-fade-in-up/g, '');
  content = content.replace(/ animate-fade-in-down/g, '');
  content = content.replace(/ animate-fade-in/g, '');
  content = content.replace(/ animate-scale-in/g, '');
  
  // Remove hover transition additions if possible
  content = content.replace(/ transition-all duration-200 hover:translate-x-0\.5/g, ' transition-colors');
  content = content.replace(/ transition-all duration-200 focus:shadow-md focus:ring-4 focus:ring-blue-500\/20 focus:border-blue-500/g, ' focus:ring-2 focus:ring-blue-500 transition-all');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Reverted classes in ${path.basename(filePath)}`);
  }
}

function traverseDir(currentDir) {
  const files = fs.readdirSync(currentDir);
  for (const file of files) {
    const filePath = path.join(currentDir, file);
    if (fs.statSync(filePath).isDirectory()) {
      traverseDir(filePath);
    } else if (filePath.endsWith('.jsx')) {
      processFile(filePath);
    }
  }
}

traverseDir(dir);
console.log("Done reverting dark mode and animation classes!");
