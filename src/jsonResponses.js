const users = {};
const fs = require('fs');
let questionsJSON = fs.readFileSync(`${__dirname}/../json/questions.json`);

const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

const returnQuestions = (request, response) =>{
  response.writeHead(200, { 'Content-Type': 'application/json' });
  
  let realJSON = JSON.parse(questionsJSON);
  response.write(JSON.stringify(realJSON));
  response.end();
}


// public exports
module.exports = {
  returnQuestions
};
