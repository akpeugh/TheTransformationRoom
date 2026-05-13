import https from 'https';

https.get('https://storage.googleapis.com/thetransformationroomassets/', res => {
  let data = '';
  res.on('data', chunk => { data += chunk; });
  res.on('end', () => {
    console.log(data);
  });
}).on('error', err => {
  console.log("Error: " + err.message);
});
