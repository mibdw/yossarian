var config = require(__dirname + '/../../config.json');

exports.profile =  function(req, res) { 
	
	res.render('user/profile', { 
		config: config,
		user: req.user,
		page: "profile" 
	}); 
};