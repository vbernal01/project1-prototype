const fs = require('fs'); // pull in the file system module

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);
const otherCss = fs.readFileSync(`${__dirname}/../client/other-style.css`);
const questions = fs.readFileSync(`${__dirname}/../client/quiz.html`);
const results = fs.readFileSync(`${__dirname}/../client/results.html`);
const bulma = fs.readFileSync(`${__dirname}/../client/bulma.css`);

// This is the function i use to load all my images from the server. I take in the pathname
// and add it into the file sync so I can reuse the function for all the images
const getImages = (request, response, imageDir) => {
  const image = fs.readFileSync(`${__dirname}/..${imageDir}`);
  response.writeHead(200, { 'Content-Type': 'image/png' });
  response.write(image);
  response.end();
};

const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

const loadQuestionsPage = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(questions);
  response.end();
};
const loadResultsPage = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(results);
  response.end();
};
const getCSS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });

  response.write(css);
  response.end();
};
const getOtherCSS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });

  response.write(otherCss);
  response.end();
};

const getBulma = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(bulma);
  response.end();
};

module.exports = {
  getIndex,
  loadQuestionsPage,
  loadResultsPage,
  getCSS,
  getOtherCSS,
  getBulma,
  getImages,
};
