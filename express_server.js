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


let urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const generateRandomString = function() {
  const result = Math.random().toString(36).substring(2,8);
  return result;
};

// Sign-in endpoint
app.post('/sign-in', (req, res) => {
  console.log("hi");
  // Set the cookie with whatever value you wish
  res.cookie('user_id', userObject.id);

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

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
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
