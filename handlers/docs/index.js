var pjson = require(__dirname + '/../../package.json');
var nav_menu = require(__dirname + '/../nav.json');

exports.index =  function(req, res) {

	res.render('sections/docs', { 
		user: req.user,
		site_title: pjson.name, 
		site_description: pjson.description, 
		nav_menu: nav_menu,
		page: "docs",
		subpage: "overview"
	});
};

exports.subpage = function(req, res) {

	var page = 'docs'

	for (page in nav_menu.options) {
		if (page.slug == page && page.submenu) {
			for (subpage in page.submenu) {
				if (subpage.slug == req.params.subpage) {
					var page_title = subpage.name;
				}
			}
		}
	}

	res.render('sections/docs', { 
		user: req.user,
		site_title: pjson.name, 
		site_description: pjson.description, 
		nav_menu: nav_menu,
		page: "docs",
		page_title: page_title,
		subpage: req.params.subpage
	});
};

exports.subsubpage = function(req, res) {

	res.render('sections/docs', { 
		user: req.user,
		site_title: pjson.name, 
		site_description: pjson.description, 
		nav_menu: nav_menu,
		page: "docs",
		subpage: req.params.subpage,
		subsubpage: req.params.subsubpage
	});
};