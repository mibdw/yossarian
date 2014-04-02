// REQUIREMENTS

var express = require('express');

var mongodb = require('mongodb');
var mongoose = require('mongoose');

var User = require(__dirname + '/models/user')
var Token = require(__dirname + '/models/token')

var less = require('less-middleware');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var RememberMeStrategy = require('passport-remember-me').Strategy;
var utils = require(__dirname + '/handlers/auth/utils');

// MONGO CONNECTION
mongoose.connect('mongodb://localhost/yossarian');
mongoose.connection.on('error', console.error.bind(console, 'Connection error:'));
mongoose.connection.once('open', function callback() {
	  console.log('Connected to database');
});

// FAKE TOKEN DATABASE

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

// PASSPORT CONNECTION

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.findById(id, function (err, user) {
		done(err, user);
	});
}); 

passport.use(new LocalStrategy(function(username, password, done) {

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
}));

// REMEMBER ME

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

	app.use(express.json());
	app.use(express.urlencoded());
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
	console.log('\n----------\nYOSSARIAN\n----------\n\nLet\'s get this party started (http://localhost:3000)!');
});