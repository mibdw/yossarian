var passport = require('passport');
var Account = require('../models/account');

var home = require('./home');
var docs = require('./docs');
var news = require('./news');
var projects = require('./projects');
var calendar = require('./calendar');
var users = require('./users');
var register = require('./auth/register');
var login = require('./auth/login');

module.exports = function (app) {

	app.get('/', home.index);
	app.get('/home', home.index);
	app.get('/home/:subpage', home.index);
	app.get('/home/:subpage/:subsubpage', home.index);

	app.get('/docs', docs.index);

	app.get('/news', news.index);

	app.get('/calendar', calendar.index);

	app.get('/projects', projects.index);
	
	app.get('/users', users.index);

	// AUTHENTICATION

	app.get('/register', register.getregister);
	app.post('/register', register.postregister);

	app.get('/login', login.getlogin);
	app.post('/login', login.postlogin);

	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
}