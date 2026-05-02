const urls = [
  "https://storage.googleapis.com/thetransformationroomassets/EE%20Phone.mp4",
  "https://storage.googleapis.com/thetransformationroomassets/AMR%202.mp4",
  "https://storage.googleapis.com/thetransformationroomassets/Glasses.mp4",
  "https://storage.googleapis.com/thetransformationroomassets/Dancing%20Bot.mp4",
  "https://storage.googleapis.com/thetransformationroomassets/Hands%20Touching.mp4"
];

async function check() {
  for (const url of urls) {
    const r = await fetch(url);
    const buf = await r.arrayBuffer();
    const arr = new Uint8Array(buf).slice(0, 10);
    const str = String.fromCharCode(...arr);
    console.log(url, "->", r.status, r.headers.get("content-type"), "->", str);
  }
}
check();
