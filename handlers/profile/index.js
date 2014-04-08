var config = require(__dirname + '/../../config.json');

exports.index =  function(req, res) { 
	
	res.render('profile/profile', { 
		config: config,
		user: req.user,
		page: "profile" 
	}); 
};