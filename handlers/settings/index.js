var pjson = require(__dirname + '/../../package.json');
var site_title = pjson.name;
var site_description = pjson.description;
var nav_menu = require(__dirname + '/../nav.json');

exports.index = function(req, res) { 

	res.render('sections/settings', { 
		user : req.user,
		site_title: site_title, 
		nav_menu: nav_menu, 
		page: "settings" 
	});
};