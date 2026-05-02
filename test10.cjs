const ReactDOMServer = require('react-dom/server');
const React = require('react');
const el = React.createElement('video', { src: "https://storage.googleapis.com/thetransformationroomassets/Hands%20Touching.mp4" });
console.log(ReactDOMServer.renderToStaticMarkup(el));
