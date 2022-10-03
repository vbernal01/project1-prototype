const characters = {};
let userTraits;
let userCharacterKey;
const fs = require('fs');

const questionsJSON = fs.readFileSync(`${__dirname}/../json/questions.json`);
const charactersJSON = fs.readFileSync(`${__dirname}/../json/characters.json`);

// Basic JSON response method, takes in an object and sends its stringified version
const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

// This method returns the questions found in questions.json. Future plans will be to
// randomize its order
const returnQuestions = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/json' });
  const realJSON = JSON.parse(questionsJSON);
  response.write(JSON.stringify(realJSON));
  response.end();
};

// This is a method that is automatically called when jsonResponses is first intitialized.
// It goes through all the different characters in characters.json, and puts them into
// another json variable stored in this file. Each character will have a unique key to
// identify them, which is all their traits merged into one string(For example,
// Saul Goodman's key would be "mediummediummediummedium"). This makes it easier to match
// the character with the user results.
const loadCharacters = () => {
  const realCharJSON = JSON.parse(charactersJSON);
  for (const x in realCharJSON.characters) {
    const value = realCharJSON.characters[x];
    characters[`${value.temper},${value.morality},${value.intelligence},${value.emotional}`] = {
      name: value.Name,
      temper: value.temper,
      morality: value.morality,
      intelligence: value.intelligence,
      emotional: value.emotional,
    };
  }
};
loadCharacters();

// This method is used in the first page, client.html, to help display all the different
// characters. It will also take into account new characters that users submitted.
const getCharacters = (request, response) => {
  respondJSON(request, response, '200', characters);
};

// This method is called every time results.html is loaded. It  first sees if the users
// results, stored in userCharacterKey, exists in the character[] array. If it does,
// we send out the specific charcter object that matches with the user's results.
// For example, if the user got: temper:medium,morality:medium,intelligence:medium,
// emotional:medium, their userCharacterKey will be "mediummediummediummedium". The
// program can then check the charcter object to see if  any elements in it contains that key.
// If that key doesn't exist yet, we send out a 400 error and an object containing the
// user's results.
const returnUserCharacter = (request, response) => {
  if (!characters[userCharacterKey]) {
    respondJSON(request, response, '400', userTraits);
  } else {
    respondJSON(request, response, '200', characters[userCharacterKey]);
  }
};

// This method is similar to returnUserCharacter, where we check to see if there are any matches in
// character[] with the user's results. In here, however, we actually create the user's key from
// the parsedBody
const matchCharacter = (request, response, body) => {
  console.log(body.results);

  // if the key is not found, we put the traits into an object to be sent back to results.html
  if (!characters[body.results]) {
    const traits = body.results.split(',');
    const newCharacter = {
      temper: traits[0],
      morality: traits[1],
      intelligence: traits[2],
      emotional: traits[3],
    };
    userTraits = newCharacter;
    userCharacterKey = body.results;
    const responseJSON = {
      message: 'New character created',
    };
    respondJSON(request, response, '200', responseJSON);
  }

  // if they are found, we make the user's character equal to the one found in charcter[], and its
  // key as well.
  if (characters[body.results]) {
    userCharacterKey = body.results;
    userTraits = characters[body.results];
    const responseJSON = {
      message: 'Character found',
    };
    respondJSON(request, response, '200', responseJSON);
  }
};

// This is the post method that will add a new character to the character list. We create a 
//new object with all the user's parameters, and send it back with a 201 status code.
const addNewCharacter = (request, response, body) => {
  userCharacterKey = `${body.temper},${body.morality},${body.intelligence},${body.emotional}`;
  characters[userCharacterKey] = {
    name: body.name,
    temper: body.temper,
    morality: body.morality,
    intelligence: body.intelligence,
    emotional: body.emotional,
  };
  const responseJSON = {
    message: 'Successfully Posted!',
  };
  respondJSON(request, response, '201', responseJSON);
};
// public exports
module.exports = {
  getCharacters,
  returnQuestions,
  returnUserCharacter,
  matchCharacter,
  addNewCharacter,
};
