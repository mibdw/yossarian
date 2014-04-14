// REQUIREMENTS
var express = require('express');
var less = require('less-middleware');
var mongodb = require('mongodb');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var utils = require(__dirname + '/handlers/auth/utils');
var User = require(__dirname + '/models/users/user');

// DATABASE CONNECTION
mongoose.connect('mongodb://localhost/yossarian');
mongoose.connection.on('error', console.error.bind(console, 'Connection error:'));
mongoose.connection.once('open', function callback() {
	  console.log('Connected to database');
});

// PASSPORT CONNECTION
passport.serializeUser(function(user, done) {
	done(null, user.email);
});

passport.deserializeUser(function(email, done) {
	User.findOne( { email: email } , function (err, user) {
		done(err, user);
	});
});

passport.use(new LocalStrategy(
	function(username, password, done) {

		User.findOne({ username: username }, function(err, user) {
			if (err) { return done(err); }
			if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
			
			user.comparePassword(password, function(err, isMatch) {
				if (err) return done(err);
				if(isMatch) {
					return done(null, user);
				} else {
					return done(null, false, { message: 'Invalid password' });
				}
			});
		});
	}
));

var app = express();

// MAIN CONFIGURATION
app.configure(function (){ 

	app.engine('html', require('ejs').renderFile);
	app.set('views', __dirname + '/views');

	app.use(express.json());
	app.use(express.urlencoded());
	app.use(express.cookieParser('Where are the Snowdens of yesteryear?'));
	app.use(express.methodOverride());
	app.use(express.session());

	app.use(passport.initialize());
	app.use(passport.session());

	app.use(app.router);

	app.use(less(__dirname + '/', {
		force: true,
		dest: __dirname + '/public'
	}));
	app.use(express.static(__dirname + '/public')); 

});

// ROUTES
var routes = require(__dirname + '/handlers/routes')(app);

app.listen(3000, function() {
	console.log('\n----------\nYOSSARIAN\n----------\n\nLet\'s get this party started (http://localhost:3000)!');
});