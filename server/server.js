var express = require('express');
var renderEngine = require('ejs-mate');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var session = require('client-sessions');
var bcrypt = require('bcryptjs');

var app = express();

// = DB default user 'brookes' password: 'w00t'
mongoose.connect('mongodb://localhost/tracebook');

var User = mongoose.model('User', new Schema({
  id: ObjectId,
  fname: String,
  lname: String,
  email: {type: String, unique: true},
  password: String
}));


// = Middleware
var jsonParser = bodyParser.json();
var formParser = bodyParser.urlencoded({extended: true});

//settings
app.locals.pretty = true
app.engine('html', renderEngine);
app.set('view engine', 'html');
app.set('views', __dirname + '/views' );
app.use(formParser);
app.use(jsonParser);
app.use(express.static(process.cwd() + '/public'))
// app.set('view options', {layout: 'layout.html'});
app.use(session({
  cookieName: 'session',
  secret: '9a79ah9aa98a98na98na', //totes made up for encryptification
  duration: 1000 * 60 * 30, //30 minutes hard limit
  activeDuration: 1000 * 60 * 5 //5 minute renewal on navigation
}));

//my own get session.  find the user and set it on the request
app.use(function(req, res, next) {
  if (req.session && req.session.user) {
    User.findOne({email: req.session.user.email}, function(err, user) {
      if (user) {
        req.user = user;
        delete req.user.password;
        req.session.user = user;
        res.locals.user = user;
      }
      next();
    });
  } else {
    next();
  }
});

// my own require login
function requireLogin(req, res, next) {
  if (!req.user) {
    res.redirect(301, '/');
  } else {
    next();
  }
}


app.get('/', function(req, res) {
  res.render('index');
});

app.get('/login', function(req, res) {
  res.render('login');
});

app.post('/login', function(req, res) {
  User.findOne({ email: req.body.email}, function (err, user) {
    if (!user) {

      res.render('login', {error: 'no user exists'});

    } else if (bcrypt.compareSync(req.body.password, user.password)) {

      req.session.user = user; //set-cookie: session={..user/session data}
      res.locals.user = user;
      res.redirect(301, 'dashboard');

    } else {
      console.log('some other thing happened', req.body, user);
      res.render('login', {error: 'incorrect password'});

    }
  });
});


app.get('/logout', function(req, res) {
  req.session.reset();
  res.redirect(301, '/');
});

app.get('/register', function(req, res) {
  res.render('register');
});

app.post('/register', function(req, res) {
  var passwordHash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
  var usr = new User({
    fname: req.body.fname,
    lname: req.body.lname,
    email: req.body.email,
    password: passwordHash
  });

  usr.save(function(err, user) {
    if (err) {
      var msg = 'Mistakes were made';
      if(err.code === 11000) {
        msg = 'That email is already taken';
      }
      var errMsg = new Error(msg);
      res.render('register', {error: errMsg});
    } else {
      res.locals.user = user;
      res.redirect(301, '/dashboard');
    }
  });
});

app.get('/dashboard', requireLogin, function(req, res) {
  res.render('dashboard');
});



// = Server
var server = app.listen(3005, function() {
  console.log('AUTH TEST on 3005');
});
