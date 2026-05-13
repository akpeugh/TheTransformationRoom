import https from 'https';
const names = ['Hands%20Touching.mp4', 'Hands%20touching.mp4', 'hands%20touching.mp4', 'HandsTouching.mp4', 'Hero.mp4', 'Hero_Header.mp4', 'hands_touching.mp4'];
names.forEach(name => {
  https.get('https://storage.googleapis.com/thetransformationroomassets/' + name, res => {
    console.log(name, res.statusCode);
  });
});
