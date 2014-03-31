var pjson = require('../../package.json');
var site_title = pjson.name;
var site_description = pjson.description;
var nav_menu = require('../nav.json');

exports.getlogin =  function(req, res) { 

	res.render('sections/login', { 
		user : req.user,
		site_title : site_title,
		site_description : site_description,
		nav_menu: nav_menu
	});

};

exports.postlogin =  function(req, res) { 
	
	res.redirect('/');

};