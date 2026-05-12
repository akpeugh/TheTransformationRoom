import fs from 'fs';
import https from 'https';

const download = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, response => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', err => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
};

async function run() {
  await download('https://storage.googleapis.com/thetransformationroomassets/TR%20Logo.png', 'public/TR_Logo.png');
  await download('https://storage.googleapis.com/thetransformationroomassets/Nova%20face', 'public/Nova_face.png');
  console.log('Downloaded');
}
run();
