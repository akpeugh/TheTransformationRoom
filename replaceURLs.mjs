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
    let newContent = content
        .replace(/https:\/\/storage\.googleapis\.com\/thetransformationroomassets\/TR%20Logo\.png/g, '/TR_Logo.webp')
        .replace(/https:\/\/storage\.googleapis\.com\/thetransformationroomassets\/Nova%20face/g, '/Nova_face.webp')
        .replace(/https:\/\/storage\.googleapis\.com\/thetransformationroomassets\/TR%20Logo\.webp/g, '/TR_Logo.webp');
    if (content !== newContent) {
      fs.writeFileSync(file, newContent, 'utf8');
      console.log('Updated:', file);
    }
  }
});
