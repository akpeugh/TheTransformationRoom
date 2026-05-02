const urls = [
  "https://storage.googleapis.com/thetransformationroomassets/EE%20Phone.mp4",
  "https://storage.googleapis.com/thetransformationroomassets/AMR%202.mp4",
  "https://storage.googleapis.com/thetransformationroomassets/Glasses.mp4",
  "https://storage.googleapis.com/thetransformationroomassets/Dancing%20Bot.mp4"
];
Promise.all(urls.map(url => fetch(url).then(r => r.text()).then(t => console.log(url, t.substring(0, 50)))))
