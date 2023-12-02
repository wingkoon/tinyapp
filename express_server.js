const express = require('express');
const app = express();
const morgan = require('morgan');
const bcrypt = require('bcryptjs');
const cookieSession = require('cookie-session');
const { getUserByEmail, generateRandomString, isValidUrl, urlsForUser } = require('./helpers');
const { urlDatabase, users, analytic } = require('./database');
let methodOverride = require('./node_modules/method-override');
const PORT = 8080;

app.use(express.urlencoded({ extended: true })); //populates req.body
app.use(morgan('dev')); //console logs the request coming on the terminal
app.use(methodOverride('_method'));
app.set('view engine', 'ejs'); //set the view engine to ejs templates
app.use(cookieSession({
  name: 'user_id',
  keys: ['secret']
}));

app.listen(PORT, () => {
  console.log(`Tinyapp listening on port: ${PORT}!`);
});

//Homepage
app.get("/", (req, res) => {
  if (users[req.session.user_id]) {
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
});

app.get('/urls', (req, res) => {
  const userID = req.session.user_id; //only logged in users will have a cookie
  const user = users[userID];
  const userURLs = urlsForUser(userID, urlDatabase);
  const templateVars = {
      urls: userURLs,
      user: user,
      userID: userID,
      analytic: analytic
  };

  if (!user) {
    return res.status(401).send('<h3>Make sure you are logged in!</h3> Login <a href="/login">here</a>');
  }

  res.render("urls_index", templateVars);
});


//login page
app.get('/login', (req, res) => {
  const userID = req.session.user_id;
  const user = users[userID];
  if (user) {
    return res.redirect('/urls');
  }
  const templateVars = {
    user: user
  };
  res.render('login', templateVars);
});

app.post('/login', (req, res) => {
  const email = req.body.email;
  postUser(email, req.body.password, users, "/login", req, res);
});


//Registering users page
app.get('/register', (req, res) => {
  const userID = req.session.user_id;
  const user = users[userID];
  if (user) {
    return res.redirect('/urls');
  }
  const templateVars = {
      user: user
  };
  res.render('register', templateVars);
});

//Register post endpoint
app.post('/register', (req, res) => {
  const email = req.body.email;
  postUser(email, req.body.password, users, "/register", req, res);
});

//Refactor login and register function
const postUser = function(email, password, users, action, req, res) {
  let userID;

  //Hash the password
  const salt = bcrypt.genSaltSync(9);
  const hash = bcrypt.hashSync(password, salt);
  const user = getUserByEmail(email, users);
  if (action === "/login") {
    if (!user) {
      return res.status(403).send('<p>No user with that email found</p><a href=/login>here</a>');
    }
    const result = bcrypt.compareSync(password, user.password);
    if (!result) {
      return res.status(403).send('<p>Invalid Password</p><a href=/login>here</a>');
    }
    userID = user.id;
  } else {
    if (user) {
      return res.status(400).send('<p>That email is alredy in use. Please provide a different email.</p><a href=/register>here</a>');
    }
    userID = generateRandomString();
    users[userID] = {
        id: userID,
        email: email,
        password: hash
    };
  }
  req.session.user_id = userID;
  res.redirect('/urls');
};

//Create new URL
app.get('/urls/new', (req, res) => {
  const userID = req.session.user_id;
  const user = users[userID];
  if (!user) {
    return res.status(401).send('<h3>Make sure you are logged in!</h3> Login <a href="/login">here</a>');
  }
  const userURLs = urlsForUser(userID, urlDatabase);
  const templateVars = {
        urls: userURLs,
        user: user,
        userID: userID
  };
  res.render('urls_new', templateVars);
});


//Edit URL
app.get("/urls/:id", (req, res) => {
  const userID = req.session.user_id;
  const user = users[userID]; //accessing users database
  if (!user) {
    return res.status(401).send('<h3>Make sure you are logged in!</h3> Login <a href="/login">here</a>');
  }
  let id = req.params.id;
  if (!urlDatabase[id]) {
    return res.send(`<h3>Short URL ${req.params.id} does not exist</h3> Press <a href="/urls">here</a> to Homepage.`);
  }
  let longURL = urlDatabase[id].longURL;
  if (userID !== urlDatabase[id].userID) {
    return res.send(`<h3>This URL does not belong to you.</h3> Press <a href="/urls">here</a> to Homepage.`);
  }

  const uniqueVisit = analytic[longURL].uniqueVisitor.length;
  const visit = analytic[longURL].visit;
  const visitHistory = analytic[longURL].visitHistory;

  const templateVars = {
    id: id,
    longURL: urlDatabase[id].longURL,
    user: user,
    url: urlDatabase[id],
    userID: userID,
    visit: visit,
    uniqueVisit: uniqueVisit,
    visitHistory: visitHistory
  };
  res.render(`urls_show.ejs`, templateVars);
});

//This create new URL
//Here uses method-override put
app.put("/urls", (req, res) => {
  const userID = req.session.user_id;
  if (!userID) {
    return res.status(400).send('<p>Please login to continue.</p><a href="/login">Login</a>');
  }
  let longURL = req.body.longURL;
  const link = "/urls/new";
  if (!checkUrl(longURL, link, res)) {
    let id = generateRandomString();
    const creationDate = new Date();
    urlDatabase[id] = {
      longURL: longURL,
      userID: userID,
      creationDate: creationDate
    };
    //initialize analytic object
    if (!analytic[longURL]) {
      analytic[longURL] = {
        visit: 0,
        visitHistory: [],
        uniqueVisitor: []
      };
    }
    req.session.user_id = userID;
    console.log(1);
    res.redirect('urls');
  }
});

app.put("/urls/:id", (req, res) => {
  let longURL = req.body.longURL;
  let id = req.params.id;
  const link = "/urls/" + id;
  if (!checkUrl(longURL, link, res)) {
    urlDatabase[id].longURL = longURL;
    if (!analytic[longURL]) {
      analytic[longURL] = {
        visit: 0,
        visitHistory: [],
        uniqueVisitor: []
      };
    }
    res.send('<h3>longURL edited! Go to homepage.<h3><a href="/urls">Click here</a>');
  }
});

//Check the Url validity
//Share by create and edit usages
const checkUrl = function(longURL, link, res) {
  if (longURL === "") {
    return res.send(`<h3>Null input! Please type in valid URL!<h3> Login <a href="${link}">Go back</a>`);
  } else if (!isValidUrl(longURL)) {
    return res.send(`<h3>Invalid input! Please type in valid URL!<h3> Login <a href="${link}">Go back</a>`);
  }
  return false;
};

//Redirect to the corresponding URL pages
app.get("/u/:id", (req, res) => {
  const userID = req.session.user_id;
  if (!userID) {
    return res.status(400).send('<p>Please login to continue.</p><a href="/login">Login</a>');
  }
  if (urlDatabase[req.params.id]) {
    let longURL = urlDatabase[req.params.id].longURL;
    let date = new Date();
    //update the analytics before redirect to the URL pages
    if (!analytic[longURL]) {
      analytic[longURL].visit = 1;
      analytic[longURL].visitHistory = [[date, userID]];
      analytic[longURL].uniqueVisitor = [userID];
    } else {
      analytic[longURL].visit ++;
      analytic[longURL].visitHistory.push([date, userID]);
      if (!analytic[longURL].uniqueVisitor.includes(userID)) {
        analytic[longURL].uniqueVisitor.push(userID);
      }
    }
    res.redirect(longURL);
  } else {
    res
      .status(401)
      .send("This URL does not exist");
  }
});


//Delete URL
//Here uses the method-override delete
app.delete("/urls/:id", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect('/urls');
});


//Clearing cookies
app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/login');
});



