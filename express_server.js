const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bcrypt = require("bcryptjs");
const password = "purple-monkey-dinosaur"; // found in the req.body object
const hashedPassword = bcrypt.hashSync(password, 10);

app.set("view engine", "ejs");


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
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

  app.post("/urls", (req, res) => {
    console.log(req.body); // Log the POST request body to the console
    res.send("Ok"); // Respond with 'Ok' (we will replace this)
  });

  app.get("/hello", (req, res) => {
    const templateVars = { greeting: "Hello World!" };
    res.render(`hello_world`, templateVars);
  });

  app.get("/urls/:id", (req, res) => {
    let longURL = urlDatabase[req.params.id];
    const templateVars = { id: req.params.id, longURL: longURL };
    res.render(`urls_new`, templateVars);
  });

  function generateRandomString() {};

  app.get("/urls/new", (req, res) => {
    res.render(`urls_new.ejs`);
  }); 

  
  //POST /urls/:id/delete
  
  //curl -i http://localhost:8080/hello

  app.get("/urls", (req, res) => {
    const templateVars = {
      username: req.cookies["username"],
      // ... any other vars
    };
    res.render("urls_index", templateVars);
  });
