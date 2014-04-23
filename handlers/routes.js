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

	app.get('/username', ensureAuthenticated, function(req, res) {
		res.send(req.user);
	});

	// PARTIALS
	app.get('/partials/:partial', ensureAuthenticated, function(req, res) {
		res.render("partials/" + req.params.partial + ".html");
	});

	//DOCS
	var docs = require(__dirname + '/docs/index');
	
	app.get('/getDoc/:docSlug', ensureAuthenticated, docs.getDoc);
	app.get('/editDoc/:docSlug', ensureAuthenticated, docs.editDoc);
	app.get('/docSubmenu', ensureAuthenticated, docs.docSubmenu);

	app.get('/deleteDoc/:docID', ensureAuthenticated, docs.deleteDoc)
	app.post('/postDoc', ensureAuthenticated, docs.postDoc);
	app.post('/updateDoc', ensureAuthenticated, docs.updateDoc);

}

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) { return next(); }
	res.redirect('/login')
}