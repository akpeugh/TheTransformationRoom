import https from "node:https";
const names = ["Hands%20Touching.mp4", "Hands%20touching.mp4", "hands%20touching.mp4", "Hero.mp4", "Hands_Touching.mp4", "Hands%20Touching%20Compressed.mp4", "file.mp4"];
names.forEach(name => {
  https.get(`https://storage.googleapis.com/thetransformationroomassets/${name}`, res => {
    console.log(`${name}: ${res.statusCode}`);
  });
});
