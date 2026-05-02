const fs = require('fs');
async function test() {
  const r = await fetch("https://storage.googleapis.com/thetransformationroomassets/Hands+Touching.mp4");
  const t = await r.text();
  console.log(t);
}
test();
