//finds the user by email
const getUserByEmail = function(email, database) {
  for (let key in database) {
    if (database[key].email === email) {
      return database[key];
    }
  }
  return null;
};

//Checks if the input is a valid URL
const isValidUrl = function(string) {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
};

//Generate random string, this is used for shortURL and userID generations
const generateRandomString = function() {
  const result = Math.random().toString(36).substring(2,8);
  return result;
};

//Adding URLS for the user
const urlsForUser = function(userId, urlDatabase) {
  let result = {};
  for (let key in urlDatabase) {
    if (urlDatabase[key].userID === userId) {
      result[key] = {
        longURL: urlDatabase[key].longURL,
        userID: userId,
        creationDate: urlDatabase[key].creationDate,
        visit: urlDatabase[key].visit,
        visitHistory: urlDatabase[key].visitHistory
      };
    }
  }
  return result;
};


module.exports = {
  generateRandomString,
  getUserByEmail,
  isValidUrl,
  urlsForUser
};