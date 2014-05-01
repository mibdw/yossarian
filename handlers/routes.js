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
	app.get('/partials/:section/:partial', ensureAuthenticated, function(req, res) {
		res.render("partials/" + req.params.section + "/" + req.params.partial + ".html");
	});

	// USERS
	app.get('/user/current', ensureAuthenticated, function(req, res) { res.send(req.user); });

	// NEWS
	var news = require(__dirname + '/news/index');
	
	app.get('/news/list', ensureAuthenticated, news.getArticleList);
	app.get('/news/detail/:articleSlug', ensureAuthenticated, news.getArticle);
	app.get('/news/edit/:articleSlug', ensureAuthenticated, news.editArticle);

	app.post('/news/delete', ensureAuthenticated, news.deleteArticle);
	app.post('/news/post', ensureAuthenticated, news.postArticle);
	app.post('/news/update', ensureAuthenticated, news.updateArticle);
	app.post('/news/preview', ensureAuthenticated, news.previewArticle);
	
	app.get('/news/categories', ensureAuthenticated, news.getCategories);

	app.post('/news/categories/add', ensureAuthenticated, news.postCategories);
	app.post('/news/categories/delete', ensureAuthenticated, news.deleteCategories);

	// DOCS
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