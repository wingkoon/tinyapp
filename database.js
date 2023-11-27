const urlDatabase = {
    b2xVn2: {
      longURL: "http://www.lighthouselabs.ca",
      userID: "abcde5",
      creationDate: "2022-11-27T02:47:39.968Z"
    },
    s9m5xK: {
      longURL: "http://www.google.com",
      userID: "fghij6",
      creationDate: "2022-11-27T02:47:39.968Z"
    }
  };

const users = {
    abcde5: {
      id: "abcde5",
      email: "smith@example.com",
      password: "purple-monkey-dinosaur",
    },
    fghij6: {
      id: "fghij6",
      email: "mary@example.com",
      password: "dishwasher-funk",
    },
  };

const analytic = {
  "http://www.lighthouselabs.ca": {
    visit: 0,
    visitHistory: [],
    uniqueVisitor: []
  }
};

module.exports = {
    urlDatabase,
    users,
    analytic
  };