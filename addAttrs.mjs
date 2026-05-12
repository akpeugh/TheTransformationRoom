import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      results.push(file);
    }
  });
  return results;
}

const files = walk('./src');
files.forEach(file => {
  if (file.endsWith('.tsx') || file.endsWith('.ts')) {
    let content = fs.readFileSync(file, 'utf8');
    // Fix "/ width"
    let newContent = content.replace(/\/\s+width="160"/g, ' width="160"');
    newContent = newContent.replace(/\/\s+width="400"/g, ' width="400"');
    newContent = newContent.replace(/loading="lazy">/g, 'loading="lazy" />');
    
    // Also let's ensure there aren't duplicate "/> />"
    newContent = newContent.replace(/\/> \/>/g, '/>');

    if (content !== newContent) {
      fs.writeFileSync(file, newContent, 'utf8');
      console.log('Fixed syntax:', file);
    }
  }
});
