const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bcrypt = require("bcryptjs");
const password = "purple-monkey-dinosaur"; // found in the req.body object
const hashedPassword = bcrypt.hashSync(password, 10);
const cookieParser = require('cookie-parser');

// Set cookie-parser as a middleware
app.use(cookieParser());
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

let urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

const generateRandomString = function() {
  const result = Math.random().toString(36).substring(2,8);
  return result;
};

//const password = "purple-monkey-dinosaur"; // found in the req.body object
//const hashedPassword = bcrypt.hashSync(password, 10);
bcrypt.compareSync("purple-monkey-dinosaur", hashedPassword);

app.get('/register', (req, res) => {
  res.render(`register.ejs`);
});

app.post(`/register`, (req, res) => {
  const id = generateRandomString();
  console.log(id);
  console.log(req.body);
 // console.log(req.email);
  let templ = {};
  templ.id = id;
  templ.email = req.body.email;
  templ.password = req.body.password;
  users[id] = templ;
  console.log(users);
  res.redirect(`/urls`);
})

app.get('/login', (req, res) => {
  res.render(`login.ejs`);
});

app.get("/", (req, res) => {
  res.send("Hello!");
});



app.get("/urls.json", (req, res) => {
    res.json(urlDatabase);
  });

  app.get("/urls", (req, res) => {
    const templateVars = { urls: urlDatabase };
    res.render(`urls_index.ejs`, templateVars);
  });


  app.get("/urls/new", (req, res) => {
    let longURL = urlDatabase[req.params.id];
    const templateVars = { id: req.params.id, longURL: longURL };
    res.render("urls_new", templateVars);
  }); 

  app.get("/urls/:id", (req, res) => {
    let longURL = urlDatabase[req.params.id];
    const templateVars = { id: req.params.id, longURL: longURL };
    res.render(`urls_show.ejs`, templateVars);
  }); 
  
  app.get("/hello", (req, res) => {
    const templateVars = { greeting: "Hello World!" };
    res.render(`hello_world`, templateVars);
  });

  app.get("/urls/:id/edit", (req, res) => {
    const templateVars = { urls: urlDatabase };
    res.render(`urls_index.ejs`, templateVars);
  });

  app.post("/urls/edit/:id", (req, res) => {
    const templateVars = { urls: urlDatabase };
   res.redirect(`/urls`);
  });

  app.post("/urls/:id/edit", (req, res) => {
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
  


  //POST /urls/:id/delete
  app.post("/urls/:id/delete", (req, res) => {
    delete urlDatabase[req.params.id];
    res.redirect('/urls');
  });
  
  app.post("/urls", (req, res) => {
    //console.log(urlDatabase);
    let longURL = req.body.longURL;
    if (longURL === "") {
      res.send("Null input");
      res.redirect(`urls/new`);
    } else {
      let id = generateRandomString();
      urlDatabase[id] = longURL;
      res.send("longURL registered");
      res.redirect('/urls');
    }
  }); 
  
  //curl -i http://localhost:8080/hello

  app.get("/urls", (req, res) => {
    const templateVars = {
      username: req.cookies["username"],
      // ... any other vars
    };
    res.render("urls_index", templateVars);
  });

  // Sign-in endpoint
app.post('/sign-in', (req, res) => {
  console.log("hi");
  // Set the cookie with whatever value you wish
  res.cookie('user_id', userObject.id);
  req.session.user_id = "some value";

  // Finish the request-response cycle with 
  // res.redirect(), res.send() or res.json():
  res.redirect('/');
})

// Home endpoint
app.get('/', (req, res) => {
  // We can read cookies with req.cookies.cookieName
  const idUser = req.cookies.user_id;

  if (!idUser) return res.send('No cookie stored...');
  return res.send('There is a cookie stored!');
});