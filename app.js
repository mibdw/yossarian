var express = require('express');
var moment = require('moment');

var mongodb = require('mongodb');
var mongoose = require('mongoose');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require(__dirname + '/models/user');
  
mongoose.connect('mongodb://localhost/yossarian');
mongoose.connection.on('error', console.error.bind(console, 'Connection error:'));
mongoose.connection.once('open', function callback() {
	console.log(moment().format('YYYY-MM-DD HH:mm:ss') + ' - Database connection established');
});

passport.serializeUser(function(user, done) { done(null, user.id); });
passport.deserializeUser(function(id, done) {
	User.findById(id, function (err, user) {
		done(err, user);
	});
});

passport.use(new LocalStrategy(function(username, password, done) {
	User.findOne({ email: username }, function(err, user) {
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

var app = express();

app.engine('html', require('ejs').renderFile);
app.set('views', __dirname + '/views');

app.use(express.json());
app.use(express.urlencoded());
app.use(express.cookieParser()); 	
app.use(express.session({ secret: 'Where are the Snowdens of yesteryear?' }));

app.use(passport.initialize());
app.use(passport.session());

app.use(app.router);
app.use(express.static(__dirname + '/public')); 

var routes = require(__dirname + '/handlers/routes')(app);

app.listen(999, function() {
	console.log('\n\nYossarian\n\n' + moment().format('YYYY-MM-DD HH:mm:ss') + ' - Where are the Snowdens of yesteryear?\n' + moment().format('YYYY-MM-DD HH:mm:ss') + ' - Application launched at http://localhost:999');
});

/* SEED A USER 
var user = new User({ username: 'admin', email: 'admin@example.com', password: 'secret' });
user.save(function(err) {
	if(err) {
		console.log(err);
	} else {
		console.log(moment().format('YYYY-MM-DD HH:mm:ss') + ' - New user seeded: ' + user.username + ".");
	}
});
*/