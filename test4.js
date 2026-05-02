const fs = require('fs');
async function test() {
  const urls = [
    "https://storage.googleapis.com/thetransformationroomassets/Hands%20Touching.mp4",
    "https://storage.googleapis.com/thetransformationroomassets/Dancing%20Bot.mp4",
    "https://storage.googleapis.com/thetransformationroomassets/EE%20Phone.mp4",
    "https://storage.googleapis.com/thetransformationroomassets/AMR%202.mp4",
    "https://storage.googleapis.com/thetransformationroomassets/Glasses.mp4",
    "https://storage.googleapis.com/thetransformationroomassets/Automated%20Warehouse.mp4"
  ];
  for (const url of urls) {
    try {
      const r = await fetch(url);
      const buf = await r.arrayBuffer();
      const magic = Buffer.from(buf).slice(0, 8).toString('hex');
      console.log(url.split('/').pop(), "->", magic);
    } catch(e) { console.log(e); }
  }
}
test();
