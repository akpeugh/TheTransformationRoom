const fs = require('fs');
async function test() {
  const r = await fetch("https://storage.googleapis.com/thetransformationroomassets/Hands%20Touching.mp4");
  const t = await r.text();
  console.log(t);
}
test();
