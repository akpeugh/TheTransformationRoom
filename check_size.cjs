const fs = require('fs');
const path = require('path');

function getFilesSize(dirPath) {
  let totalSize = 0;
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      totalSize += getFilesSize(filePath);
    } else {
      console.log(`${filePath}: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
      totalSize += stats.size;
    }
  }
  return totalSize;
}

const dir = './public';
const total = getFilesSize(dir);
console.log(`\nTotal size: ${(total / 1024 / 1024).toFixed(2)} MB`);
