import https from 'https';
https.get('https://storage.googleapis.com/thetransformationroomassets/Hands%20Touching.mp4', res => {
  console.log(res.headers);
});
