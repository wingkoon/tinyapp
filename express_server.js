const express = require('express');
const app = express();
const morgan = require('morgan');
const bcrypt = require('bcryptjs');
const cookieSession = require('cookie-session');
const { getUserByEmail, generateRandomString, isValidUrl, urlsForUser } = require('./helpers');
const { urlDatabase, users } = require('./database');
const PORT = 8080;

app.use(express.urlencoded({ extended: true })); //populates req.body
app.use(morgan('dev')); //console logs the request coming on the terminal
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
      user: user
  };

  if (!user) {
    return res.status(401).send('<h3>Make sure you are logged in!<h3> Login <a href="/login">here</a>');
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
  const password = req.body.password;
  postUser(email, password, users, "login", req, res);
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
  const password = req.body.password;
  postUser(email, password, users, "register", req, res);
});

//Refactor login and register function
const postUser = function(email, password, users, action, req, res) {
  let userID;
  const user = getUserByEmail(email, users);
  if (action === "login") {
    if (!email || !password) {
      return res.status(400).send('<p>Please provide email and password</p><a href=/login>here</a>');
    }
    if (!user) {
      return res.status(403).send('<p>No user with that email found</p><a href=/login>here</a>');
    }
    const result = bcrypt.compareSync(password, user.password);
    if (!result) {
      return res.status(403).send('<p>Invalid Password</p><a href=/login>here</a>');
    }
    userID = user.id;
  } else {
    if (!email || !password) {
      return res.status(400).send('<p>Please provide email and password</p><a href=/register>here</a>');
    }
    if (user) {
      return res.status(400).send('<p>That email is alredy in use. Please provide a different email.</p><a href=/register>here</a>');
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
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
  if (!userID) {
    return res.status(401).send('<h3>Make sure you are logged in!<h3> Login <a href="/login">here</a>');
  }
  const user = users[userID];
  const templateVars = {
        urls: urlDatabase,
        user: user
  };
  res.render('urls_new', templateVars);
});


//Edit URL
app.get("/urls/:id", (req, res) => {
  const loggedInUser = req.session.user_id;
  const user = users[loggedInUser]; //accessing users database
  let longURL = urlDatabase[req.params.id];
  const templateVars = { id: req.params.id, longURL: longURL, user: user };
  res.render(`urls_show.ejs`, templateVars);
});

app.post("/urls", (req, res) => {
  const userID = req.session.user_id;
  if (!userID) {
    return res.status(400).send('<p>Please login to continue.</p><a href="/login">Login</a>');
  }
  let longURL = req.body.longURL;
  if (longURL === "") {
    return res.send('<h3>Null input! Please type in valid URL!<h3> Login <a href="/urls/new">Go back</a>');
  } else if (!isValidUrl(longURL)) {
    res.send('<h3>Invalid input! Please type in valid URL!<h3> Login <a href="/urls/new">Go back</a>');
  } else {
    let id = generateRandomString();
    urlDatabase[id] = longURL;
    req.session.user_id = userID;
    res.send('<h3>longURL registered! Go to homepage.<h3><a href="/urls">Click here</a>');
  }
});
  
app.get("/urls/:id/edit", (req, res) => {
  const loggedInUser = req.session.user_id;
  const user = users[loggedInUser].id; //accessing users database
  const templateVars = {
        urls: urlDatabase,
        user: user
  };
  res.redirect('/urls');
});

app.post("/urls/:id/edit", (req, res) => {
  let longURL = req.body.longURL;
  if (longURL === "") {
    res.send("Null input");
    res.redirect(`urls/:id`);
  } else if (!isValidUrl(longURL)) {
    res.send("Invalid input");
    res.redirect(`urls/:id`);
  } else {
    let id = req.params.id;
    urlDatabase[id] = longURL;
    res.send('<h3>longURL edited! Go to homepage.<h3><a href="/urls">Click here</a>');
  }
});

//Redirect to the corresponding URL pages
app.get("/u/:id", (req, res) => {
  if (urlDatabase[req.params.id]) {
    let longURL = urlDatabase[req.params.id];
    console.log(longURL);
    res.redirect(longURL);
  } else {
    res
      .status(401)
      .send("This URL does not exist");
  }
});


//Delete URL
app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect('/urls');
});


//Clearing cookies
app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/login');
});

