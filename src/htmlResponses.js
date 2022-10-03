const fs = require('fs'); // pull in the file system module

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);
const questions = fs.readFileSync(`${__dirname}/../client/quiz.html`);
const results = fs.readFileSync(`${__dirname}/../client/results.html`);
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

module.exports = {
  getIndex,
  loadQuestionsPage,
  loadResultsPage,
  getCSS,
};
