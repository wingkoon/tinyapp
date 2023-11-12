const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bcrypt = require("bcryptjs");
const password = "purple-monkey-dinosaur"; // found in the req.body object
const hashedPassword = bcrypt.hashSync(password, 10);

app.set("view engine", "ejs");


let urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const generateRandomString = function() {
  const result = Math.random().toString(36).substring(2,8);
  return result;
};

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
    res.render("urls/:id", templateVars);
  }); 
  
  app.get("/hello", (req, res) => {
    const templateVars = { greeting: "Hello World!" };
    res.render(`hello_world`, templateVars);
  });

  app.get("/urls/:id", (req, res) => {
    let longURL = urlDatabase[req.params.id];
    const templateVars = { id: req.params.id, longURL: longURL };
    res.render(`urls_show`, templateVars);
  });

  app.post("/urls/:id", (req, res) => {
    let longURL = urlDatabase[req.params.id];
    const templateVars = { id: req.params.id, longURL: longURL };
    res.render(`urls_show`, templateVars);
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
