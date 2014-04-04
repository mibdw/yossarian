var pjson = require(__dirname + '/../../package.json');
var site_title = pjson.name;
var site_description = pjson.description;
var nav_menu = require(__dirname + '/../nav.json');

exports.index =  function(req, res) {

	if (!req.params.subpage) {

		res.render('sections/docs', { 
			user : req.user,
			site_title: site_title, 
			site_description: site_description, 
			nav_menu: nav_menu,
			page: "docs",
			subpage: "overview"
		});

	} else if (!req.params.subsubpage) {

		if (req.params.subpage == 'address') {

			res.render('sections/docs', { 
			user : req.user,
				site_title: site_title, 
				site_description: site_description, 
				nav_menu: nav_menu,
				page: "docs",
				subpage: req.params.subpage,
				subsubpage: "shipping"
			}); 
		} else {

			res.render('sections/docs', { 
				user : req.user,
				site_title: site_title, 
				site_description: site_description, 
				nav_menu: nav_menu,
				page: "docs",
				subpage: req.params.subpage
			}); 
		}

	} else {

		res.render('sections/docs', { 
			user : req.user,
			site_title: site_title, 
			site_description: site_description, 
			nav_menu: nav_menu,
			page: "docs",
			subpage: req.params.subpage,
			subsubpage: req.params.subsubpage
		}); 

	}
};