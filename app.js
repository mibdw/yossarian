// Requirements

var express = require('express');

var mongodb = require('mongodb');
var mongoose = require('mongoose');

var less = require('less-middleware');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var RememberMeStrategy = require('passport-remember-me').Strategy;
var utils = require(__dirname + '/handlers/auth/utils');

// Mongo connection
mongoose.connect('mongodb://localhost/yossarian');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', function callback() {
	  console.log('Connected to DB');
});

/* Fake, in-memory database of remember me tokens */

var tokens = {}

function consumeRememberMeToken(token, fn) {
  var uid = tokens[token];
  // invalidate the single-use token
  delete tokens[token];
  return fn(null, uid);
}

function saveRememberMeToken(token, uid, fn) {
  tokens[token] = uid;
  return fn();
}


// Passport config

var Account = require(__dirname + '/models/account');

passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

passport.use(new LocalStrategy(Account.authenticate()));
passport.use(new RememberMeStrategy(
  function(token, done) {
    consumeRememberMeToken(token, function(err, uid) {
      if (err) { return done(err); }
      if (!uid) { return done(null, false); }
      
      findById(uid, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        return done(null, user);
      });
    });
  },
  issueToken
));

function issueToken(user, done) {
  var token = utils.randomString(64);
  saveRememberMeToken(token, user.id, function(err) {
    if (err) { return done(err); }
    return done(null, token);
  });
}

var app = express();

// Main configuration

app.configure(function (){ 

	app.set('view engine', 'jade');
	app.set('views', __dirname + '/views');

	app.use(express.bodyParser());
	app.use(express.cookieParser('Where are the Snowdens of yesteryear?'));
	app.use(express.methodOverride());
	app.use(express.session());

	app.use(passport.initialize());
	app.use(passport.session());
	app.use(passport.authenticate('remember-me'));

	app.use(app.router);

	app.use(less(__dirname + '/', {
		force: true,
		dest: __dirname + '/public'
	}));
	app.use(express.static(__dirname + '/public')); 

});

// Routes
var routes = require(__dirname + '/handlers/routes')(app);

app.listen(3000, function() {
	console.log('Let\'s get this party started (http://localhost:3000)!');
});