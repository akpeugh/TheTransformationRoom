fetch("https://storage.googleapis.com/thetransformationroomassets/Hands%20Touching.mp4").then(r => r.text()).then(t => console.log(t.substring(0,200))).catch(console.error);
