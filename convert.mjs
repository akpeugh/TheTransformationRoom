import sharp from 'sharp';
import fs from 'fs';

async function run() {
  await sharp('public/TR_Logo.png')
    .resize(320)
    .webp({ quality: 80 })
    .toFile('public/TR_Logo.webp');
    
  await sharp('public/Nova_face.png')
    .resize(400)
    .webp({ quality: 80 })
    .toFile('public/Nova_face.webp');
    
  console.log('Converted');
}
run();
