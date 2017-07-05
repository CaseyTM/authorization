const express = require("express");
const bodyParser = require("body-parser");
const mustacheExpress = require("mustache-express");
const path = require("path");
const session = require("express-session");
const app = express();
const validator = require("express-validator");

app.use(express.static(path.join(__dirname, "public")));

app.engine("mustache", mustacheExpress());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "mustache");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(validator());

app.use(session({
  secret: 'asdfasdf',
  resave: false,
  saveUninitialized: false
}));

let users = [{username: "casey", password: "apassword"}];
let messages = [];
let clicked = 0;
app.get("/", function(req, res) {
  if (!req.session.username) {
    res.redirect('/login');
  }else if (req.session.username){
  	res.redirect("/home");
  }
});
app.get('/home', function(req, res){
  res.render('index',{username: req.session.username,clicked:clicked});
});


app.get("/login", function(req, res) {
  res.render("login");
});
app.post('/click',function(req,res){
  clicked += 1;
  res.redirect('/home');
});

app.post("/login", function(req, res) {
  let loggedUser;
  messages = [];

  req.checkBody("username", "Please Enter a valid username.").isLength({min: 5, max: 20});
  req.checkBody("password", "Please Enter a Password.").notEmpty();
  users.forEach(function(user){

    if (user.username === req.body.username && user.password === req.body.password) {
      loggedUser = user;
  req.session.username = req.body.username;
    }
  });
  let errors = req.validationErrors();
  let signupMsg = "";
  if (errors) {
    errors.forEach(function(error) {
      messages.push(error.msg);
    });
    res.render("login", {errors: messages});
    errors = [];
  } else if(!req.session.username){
    users.push({username:req.body.username,password:req.body.password});
    req.session.username = req.body.username;
    console.log(users);
  }
    res.redirect("/home");


});




app.listen(8080, function() {
  console.log("App is running on localhost:8080");
});