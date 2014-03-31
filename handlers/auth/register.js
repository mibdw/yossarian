var passport = require('passport');
var Account = require('../../models/account');

var pjson = require('../../package.json');
var site_title = pjson.name;
var site_description = pjson.description;
var nav_menu = require('../nav.json');


exports.getregister =  function(req, res) { 
	
	res.render('sections/register', {
		site_title : site_title,
		site_description : site_description,
		nav_menu: nav_menu
	});

};

exports.postregister =  function(req, res) { 

	Account.register (new Account({ username : req.body.username }), req.body.password, function(err, account) {
		if (err) {
			return res.render('sections/register', { 
				account : account,
				site_title : site_title,
				site_description : site_description,
				nav_menu: nav_menu
			});
		}

		passport.authenticate('local')(req, res, function () {
			res.redirect('/');
		});
	});

};