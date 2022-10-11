const http = require('http'); // pull in http module
// url module for parsing url string
const url = require('url');
// querystring module for parsing querystrings from url
const query = require('querystring');

// pull in our custom files
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// These are the different calls the server will take
const urlStruct = {
  '/': htmlHandler.getIndex,
  '/style.css': htmlHandler.getCSS,
  '/other-style.css': htmlHandler.getOtherCSS,
  '/getCharacters': jsonHandler.getCharacters,
  '/addCharacter': jsonHandler.addNewCharacter,
  '/quiz.html': htmlHandler.loadQuestionsPage,
  '/results.html': htmlHandler.loadResultsPage,
  '/questionsJSON': jsonHandler.returnQuestions,
  '/returnResults': jsonHandler.returnUserCharacter,
  '/bulma.css': htmlHandler.getBulma,
};

// This was used in http-assignment-ii, it will parse the body and then make it readable in the
// approptiate json handler
const parseBody = (request, response, handler) => {
  // The request will come in in pieces. We will store those pieces in this
  // body array.
  const body = [];

  request.on('error', (err) => {
    console.dir(err);
    response.statusCode = 400;
    response.end();
  });
  request.on('data', (chunk) => {
    body.push(chunk);
  });
  // us data in X-WWW-FORM-URLENCODED format. If it was in JSON we could use JSON.parse.
  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    const bodyParams = query.parse(bodyString);

    handler(request, response, bodyParams);
  });
};
// handle post decides which post method to call, even though both have to go through parsebody
// first.
const handlePost = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/sendUserCharacter') {
    parseBody(request, response, jsonHandler.matchCharacter);
  } else if (parsedUrl.pathname === '/addCharacter') {
    parseBody(request, response, jsonHandler.addNewCharacter);
  }
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);
  const acceptedTypes = request.headers.accept.split(',');
  const params = query.parse(parsedUrl.query);
  if (parsedUrl.pathname.includes('charimgs')) {
    htmlHandler.getImages(request, response, parsedUrl.pathname);
  } else if (request.method === 'POST') {
    handlePost(request, response, parsedUrl);
  } else if (urlStruct[parsedUrl.pathname]) {
    urlStruct[parsedUrl.pathname](request, response, acceptedTypes, params);
  } else {
    jsonHandler.notFound(request, response);
  }
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1: ${port}`);
});
