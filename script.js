const https = require('https');
https.get('https://storage.googleapis.com/thetransformationroomassets/TR%20Logo.png', res => {
  console.log('Logo Size:', res.headers['content-length']);
});
https.get('https://storage.googleapis.com/thetransformationroomassets/Nova%20face', res => {
  console.log('Nova Size:', res.headers['content-length']);
});
