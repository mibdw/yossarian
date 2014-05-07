module.exports = function (app, res, req) {

	// SEED DATA 
	// var firstrun = require(__dirname + '/firstrun');
	// firstrun.gogogo();

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
	app.post('/user/avatar/upload', ensureAuthenticated, function(req, res) {
		console.log(req.files);
		res.send("ok")
	});

	// NEWS
	var news = require(__dirname + '/news/index');
	
	app.get('/news/list', ensureAuthenticated, news.getArticleList);
	app.get('/news/detail/:articleSlug', ensureAuthenticated, news.getArticle);
	app.get('/news/edit/:articleSlug', ensureAuthenticated, news.editArticle);

	app.post('/news/delete', ensureAuthenticated, news.deleteArticle);
	app.post('/news/post', ensureAuthenticated, news.postArticle);
	app.post('/news/update', ensureAuthenticated, news.updateArticle);
	app.post('/news/preview', ensureAuthenticated, news.previewArticle);

	app.post('/news/comment/add', ensureAuthenticated, news.postComment);
	app.post('/news/comment/delete', ensureAuthenticated, news.deleteComment);

	// DOCS
	var docs = require(__dirname + '/docs/index');
	
	app.get('/docs/get/:docSlug', ensureAuthenticated, docs.getDoc);
	app.get('/docs/edit/:docSlug', ensureAuthenticated, docs.editDoc);
	app.get('/docs/submenu', ensureAuthenticated, docs.docSubmenu);

	app.post('/docs/delete', ensureAuthenticated, docs.deleteDoc);
	app.post('/docs/post', ensureAuthenticated, docs.postDoc);
	app.post('/docs/update', ensureAuthenticated, docs.updateDoc);
	app.post('/docs/preview', ensureAuthenticated, docs.previewDoc);

	// PROJECTS
	var projects = require(__dirname + '/projects/index');
	
	app.get('/projects/list', ensureAuthenticated, projects.getProjectList);
	app.get('/projects/detail/:projectSlug', ensureAuthenticated, projects.getProject);
	app.get('/projects/edit/:projectSlug', ensureAuthenticated, projects.editProject);

	app.post('/projects/delete', ensureAuthenticated, projects.deleteProject);
	app.post('/projects/post', ensureAuthenticated, projects.postProject);
	app.post('/projects/update', ensureAuthenticated, projects.updateProject);
	app.post('/projects/preview', ensureAuthenticated, projects.previewProject);

	app.post('/projects/issue/delete', ensureAuthenticated, projects.deleteIssue);
	app.post('/projects/issue/post', ensureAuthenticated, projects.postIssue);
	app.post('/projects/issue/update', ensureAuthenticated, projects.updateIssue);
	app.post('/projects/issue/preview', ensureAuthenticated, projects.previewIssue);

	app.post('/projects/note/delete', ensureAuthenticated, projects.deleteNote);
	app.post('/projects/note/post', ensureAuthenticated, projects.postNote);
	app.post('/projects/note/update', ensureAuthenticated, projects.updateNote);
	app.post('/projects/note/preview', ensureAuthenticated, projects.previewNote);

	// SETTINGS
	var settings = require(__dirname + '/settings/index');
	
	app.get('/settings/categories', ensureAuthenticated, settings.getCategories);

	app.post('/settings/categories/add', ensureAuthenticated, settings.postCategories);
	app.post('/settings/categories/delete', ensureAuthenticated, settings.deleteCategories);

	app.get('/settings/users', ensureAuthenticated, settings.getUserList);

	app.post('/settings/users/add', ensureAuthenticated, settings.postUser);
	app.post('/settings/users/update', ensureAuthenticated, settings.updateUser);
	app.post('/settings/users/delete', ensureAuthenticated, settings.deleteUser);

}

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) { return next(); }
	res.redirect('/login')
}