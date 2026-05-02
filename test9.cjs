const fs = require('fs');
async function test() {
  const urls = [
    "https://storage.googleapis.com/thetransformationroomassets/HandsTouching.mp4",
    "https://storage.googleapis.com/thetransformationroomassets/DancingBot.mp4",
    "https://storage.googleapis.com/thetransformationroomassets/EEPhone.mp4"
  ];
  for (const u of urls) console.log(u, (await fetch(u)).status);
}
test();
