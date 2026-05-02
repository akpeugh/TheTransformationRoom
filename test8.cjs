const fs = require('fs');
async function test() {
  const r = await fetch("https://storage.googleapis.com/thetransformationroomassets/");
  const t = await r.text();
  const keys = t.split('<Key>').slice(1).map(s => s.split('</Key>')[0]);
  console.log(keys.join('\n'));
}
test();
