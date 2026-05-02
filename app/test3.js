const fs = require('fs');

async function test() {
  const url = 'https://storage.googleapis.com/thetransformationroomassets/Hands%20Touching.mp4';
  const res = await fetch(url);
  const buf = await res.arrayBuffer();
  console.log(Buffer.from(buf).toString('hex').slice(0, 20));
}

test();
