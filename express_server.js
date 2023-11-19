const express = require('express');
const app = express();
const morgan = require('morgan');
const bcrypt = require('bcryptjs');
const cookieSession = require('cookie-session');
const { getUserByEmail, isValidHttpUrl, generateRandomString, urlsForUser } = require('./helpers');
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
app.get('/', (req, res) => {
      res.send('<h1>Welcome to the home page!</h1> Please login <a href="/login">here<a/>');
});



app.get('/urls', (req, res) => {
    const userID = req.session.user_id; //only logged in users will have a cookie
    console.log(5, userID);
    console.log(5, urlDatabase);
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

//If user is not logged in. Redirects to login page
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

app.get("/urls/:id", (req, res) => {
    const loggedInUser = req.session.user_id;
    const user = users[loggedInUser]; //accessing users database
    let longURL = urlDatabase[req.params.id];
    const templateVars = { id: req.params.id, longURL: longURL, user: user };
    res.render(`urls_show.ejs`, templateVars);
  }); 



app.post("/urls", (req, res) => {
    //console.log(urlDatabase);
    const userID = req.session.user_id;
    if (!userID) {
        return res.status(400).send('<p>Please login to continue.</p>');
    }
    let longURL = req.body.longURL;
    if (longURL === "") {
      res.send("Null input");
      res.redirect(`urls/new`);
    } else {
      let id = generateRandomString();
      urlDatabase[id] = longURL;
      req.session.user_id = userID;
      res.send("longURL registered");
      res.redirect('urls');
    }
  }); 
  
  app.get("/urls/:id/edit", (req, res) => {
    const id = req.params.id;
    const loggedInUser = req.session.user_id;
    const user = users[loggedInUser].id; //accessing users database
    const templateVars = {
        urls: urlDatabase,
        user: user
    };
    res.redirect('/urls');
  });

  app.post("/urls/:id/edit", (req, res) => {
    const loggedInUser = req.session.user_id;
    const user = users[loggedInUser]; //accessing users database
    let longURL = req.body.longURL;
     if (longURL === "") {
       res.send("Null input");
       res.redirect(`urls/:id`);
     } else {
       let id = req.params.id;
       urlDatabase[id] = longURL;
       res.send("longURL edited");
       res.redirect('/urls');
     } 
   });



app.get('/u/:id', (req, res) => {
    const url = urlDatabase[req.params.id];
console.log('url', url);
if (url === undefined) {
    // short url undefined
    return res.status(400).send('<p>This Url does not exist!</p>');
}
    res.redirect(url.longURL);
});


app.post("/urls/:id/delete", (req, res) => {
    delete urlDatabase[req.params.id];
    res.redirect('/urls');
  });


//Registering users
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


   //Register post endpoint
app.post('/register', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        return res.status(400).send('Please provide email and password.');
    }

    const user = getUserByEmail(email, users);
    if (user) {
        return res.status(400).send('That email is alredy in use. Please provide a different email.');
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const userID = generateRandomString();
    users[userID] = {
        id: userID,
        email: req.body.email,
        password: hash
    };

    req.session.user_id = userID;
    res.redirect('/urls');
});


//Creating cookies
app.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        return res.status(400).send('<p>Please provide email and password</p>');
    }
    const user = getUserByEmail(email, users);
    if (!user) {
        return res.status(403).send('<p>No user with that email found</p>');
    }

    const result = bcrypt.compareSync(password, user.password);
    if (!result) {
        return res.status(403).send('<p>Invalid Password</p>');
    }

    //create a new cookie using cookie-session
    req.session.user_id = user.id;
    res.redirect('/urls');
});

//Clearing cookies
app.post('/logout', (req, res) => {
    req.session = null;
    res.redirect('/login');
});

