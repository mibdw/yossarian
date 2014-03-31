// Requirements

var express = require('express');
var lessMiddleware = require("less-middleware");
var routes = require('./handlers/routes');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var app = express();

// View engine
app.set('view engine', 'jade');
app.set('views', './views');

// Main configuration
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('Where are the Snowdens of yesteryear?'));
app.use(express.session());
app.use(passport.initialize());
app.use(passport.session());

app.use(app.router);
app.use(lessMiddleware('./public', { force: true }));
app.use(express.static('./public')); 

// Passport config
var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// Mongo connection
mongoose.connect('mongodb://localhost/yossarian');

// Routes
var routes = require('./handlers/routes')(app);

app.listen(3000, function() {
	console.log('Let\'s get this party started (http://localhost:3000)!');
});