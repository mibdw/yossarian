var pjson = require('../../package.json');
var site_title = pjson.name;
var site_description = pjson.description;
var nav_menu = require('../nav.json');

exports.index =  function(req, res) { 
	res.render('sections/calendar', { 
		site_title: site_title, 
		nav_menu: nav_menu, 
		page: "calendar" 
	}); 
};