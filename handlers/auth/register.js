var pjson = require('../../package.json');
var site_title = pjson.name;
var site_description = pjson.description;

exports.getregister =  function(req, res) { 
	
	res.render('sections/login', { });

};

exports.postregister =  function(req, res) { 

	Account.register (new Account({ username : req.body.username }), req.body.password, function(err, account) {
		if (err) {
			return res.render('sections/login', { 
				account : account,
				site_title : site_title,
				site_description : site_description
			});
		}

		passport.authenticate('local')(req, res, function () {
			res.redirect('/');
		});
	});

};