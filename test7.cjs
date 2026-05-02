const fs = require('fs');
async function test() {
  const r = await fetch("https://storage.googleapis.com/thetransformationroomassets/");
  const t = await r.text();
  const hands = t.split('<Key>').map(s => s.split('</Key>')[0]).find(k => k.includes('Hands'));
  console.log(hands);
  console.log(Buffer.from(hands).toString('hex'));
}
test();
