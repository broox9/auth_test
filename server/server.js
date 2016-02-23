var express = require('express');
var renderEngine = require('ejs-mate');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var app = express();

//DB default user 'brookes'
mongoose.connect('mongodb://localhost/tracebook');

var User = mongoose.model('User', new Schema({
  id: ObjectId,
  fname: String,
  lname: String,
  email: {type: String, unique: true},
  password: String
}));


//middleware
var jsonParser = bodyParser.json();
var formParser = bodyParser.urlencoded({extended: true});

//settings
app.locals.pretty = true
app.engine('html', renderEngine);
app.set('view engine', 'html');
app.set('views', __dirname + '/views' );
app.use(formParser);
app.use(jsonParser);
// app.set('view options', {layout: 'layout.html'});


app.get('/', function(req, res) {
  res.render('index');
});

app.get('/login', function(req, res) {
  res.render('login');
});

app.post('/login', function(req, res) {
  res.json(req.body);
});

app.get('/logout', function(req, res) {
  res.render('index');
});

app.get('/register', function(req, res) {
  res.render('register');
});

app.post('/register', function(req, res) {
  var user = new User({
    fname: req.body.fname,
    lname: req.body.lname,
    email: req.body.email,
    password: req.body.password
  });

  user.save(function(err) {
    if (err) {
      var msg = 'Mistakes were made';
      if(err.code === 11000) {
        msg = 'That email is already taken';
      }
      var errMsg = new Error(msg)
      res.render('register', {error: errMsg});
    } else {
      res.render('dashboard');
    }
  });
});

app.get('/dashboard', function(req, res) {
  res.render('dashboard');
});

app.post('/authenticate', function(req, res) {
  res.json(req.body);
});

var server = app.listen(3005, function() {
  console.log('AUTH TEST on 3005');
});
