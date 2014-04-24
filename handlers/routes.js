module.exports = function (app, res, req) {

	// BASE
	app.get('/', ensureAuthenticated, function(req, res) {
		res.render('index.html');
	});

	// AUTHENTICATION
	var authentication = require(__dirname + '/auth/authentication');
	
	app.get('/login', authentication.getLogin);
	app.post('/login', authentication.postLogin);
	app.post('/ajaxLogin', authentication.ajaxLogin);

	app.get('/logout', authentication.logout);

	// CONFIG
	app.get('/config', ensureAuthenticated, function(req, res) {
		var config = require(__dirname + '/../config.json');
		res.json(config);
	});

	app.get('/navigation', ensureAuthenticated, function(req, res) {
		var config = require(__dirname + '/../config.json');
		res.json(config.navigation);
	});


	// PARTIALS
	app.get('/partials/:partial', ensureAuthenticated, function(req, res) {
		res.render("partials/" + req.params.partial + ".html");
	});

	// USERS
	var users = require(__dirname + '/users/index');

	app.get('/user/get/:userEmail', ensureAuthenticated, users.getUser);	
	app.get('/user/current', ensureAuthenticated, function(req, res) { res.send(req.user); });

	//DOCS
	var docs = require(__dirname + '/docs/index');
	
	app.get('/docs/get/:docSlug', ensureAuthenticated, docs.getDoc);
	app.get('/docs/edit/:docSlug', ensureAuthenticated, docs.editDoc);
	app.get('/docs/submenu', ensureAuthenticated, docs.docSubmenu);

	app.post('/docs/delete', ensureAuthenticated, docs.deleteDoc);
	app.post('/docs/post', ensureAuthenticated, docs.postDoc);
	app.post('/docs/update', ensureAuthenticated, docs.updateDoc);
	app.post('/docs/preview', ensureAuthenticated, docs.previewDoc);

}

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) { return next(); }
	res.redirect('/login')
}