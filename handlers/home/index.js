var pjson = require(__dirname + '/../../package.json');
var site_title = pjson.name;
var site_description = pjson.description;
var nav_menu = require(__dirname + '/../nav.json');

exports.index =  function(req, res) { 
	
	if (!req.params.subpage) {

		res.render('sections/home', { 
			user : req.user,
			site_title: site_title, 
			site_description: site_description, 
			nav_menu: nav_menu,
			page: "home",
			subpage: "dashboard"
		});

	} else if (!req.params.subsubpage) {

		if (req.params.subpage == 'address') {

			res.render('sections/home', { 
			user : req.user,
				site_title: site_title, 
				site_description: site_description, 
				nav_menu: nav_menu,
				page: "home",
				subpage: req.params.subpage,
				subsubpage: "shipping"
			}); 
		} else {

			res.render('sections/home', { 
				user : req.user,
				site_title: site_title, 
				site_description: site_description, 
				nav_menu: nav_menu,
				page: "home",
				subpage: req.params.subpage
			}); 
		}

	} else {

		res.render('sections/home', { 
			user : req.user,
			site_title: site_title, 
			site_description: site_description, 
			nav_menu: nav_menu,
			page: "home",
			subpage: req.params.subpage,
			subsubpage: req.params.subsubpage
		}); 

	}
};