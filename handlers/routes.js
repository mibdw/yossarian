module.exports = function (app, res, req) {

	app.get('/', ensureAuthenticated, function (req, res){
		res.render('main.html');
	});
	
	var auth = require(__dirname + '/auth.js');
	app.get('/login', auth.login);
	app.get('/logout', ensureAuthenticated, auth.logout);
	app.post('/login', auth.entry);
	
	var users = require(__dirname + '/users.js');
	app.post('/users/create', ensureAuthenticated, users.create);
	app.post('/users/remove', ensureAuthenticated, users.remove);
	app.post('/users/update', ensureAuthenticated, users.update);
	app.post('/users/detail', ensureAuthenticated, users.detail);
	app.post('/users/list', ensureAuthenticated, users.list);
	app.post('/users/user', ensureAuthenticated, users.user);
	app.post('/users/avatar', ensureAuthenticated, users.avatar);

	var categories = require(__dirname + '/categories.js');
	app.post('/categories/create', ensureAuthenticated, categories.create);
	app.post('/categories/remove', ensureAuthenticated, categories.remove);
	app.post('/categories/update', ensureAuthenticated, categories.update);
	app.post('/categories/list', ensureAuthenticated, categories.list);

	var memo = require(__dirname + '/memo.js');
	app.post('/memo/create', ensureAuthenticated, memo.create);
	app.post('/memo/remove', ensureAuthenticated, memo.remove);
	app.post('/memo/update', ensureAuthenticated, memo.update);
	app.post('/memo/detail', ensureAuthenticated, memo.detail);
	app.post('/memo/list', ensureAuthenticated, memo.list);

	var docs = require(__dirname + '/docs.js');
	app.post('/docs/create', ensureAuthenticated, docs.create);
	app.post('/docs/remove', ensureAuthenticated, docs.remove);
	app.post('/docs/update', ensureAuthenticated, docs.update);
	app.post('/docs/detail', ensureAuthenticated, docs.detail);
	app.post('/docs/menu', ensureAuthenticated, docs.menu);

	var calendar = require(__dirname + '/calendar.js');
	app.post('/calendar/create', ensureAuthenticated, calendar.create);
	app.post('/calendar/remove', ensureAuthenticated, calendar.remove);
	app.post('/calendar/update', ensureAuthenticated, calendar.update);
	app.post('/calendar/detail', ensureAuthenticated, calendar.detail);
	app.post('/calendar/list', ensureAuthenticated, calendar.list);
	app.post('/calendar/upcoming', ensureAuthenticated, calendar.upcoming);

	var projects = require(__dirname + '/projects.js');
	app.post('/projects/create', ensureAuthenticated, projects.create);
	app.post('/projects/remove', ensureAuthenticated, projects.remove);
	app.post('/projects/update', ensureAuthenticated, projects.update);
	app.post('/projects/detail', ensureAuthenticated, projects.detail);
	app.post('/projects/list', ensureAuthenticated, projects.list);
	app.post('/projects/calendar', ensureAuthenticated, projects.calendar);

	var contacts = require(__dirname + '/contacts.js');
	app.post('/contacts/create', ensureAuthenticated, contacts.create);
	app.post('/contacts/remove', ensureAuthenticated, contacts.remove);
	app.post('/contacts/update', ensureAuthenticated, contacts.update);
	app.post('/contacts/detail', ensureAuthenticated, contacts.detail);
	app.post('/contacts/list', ensureAuthenticated, contacts.list);


	var changes = require(__dirname + '/changes.js');
	app.post('/changes/list', ensureAuthenticated, changes.list);
	
	app.get('/partials/:section/:partial', function (req, res) {
		res.render(req.params.section + "/" + req.params.partial + ".html");
	});

	var marked = require('marked');
	marked.setOptions({	gfm: true, tables: true });
	app.post('/marked', ensureAuthenticated, function(req, res) {
		res.send(marked(req.body.text));
	});
};

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) { return next(); }
	res.redirect('/login')
}