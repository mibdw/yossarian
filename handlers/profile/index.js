var config = require(__dirname + '/../../config.json');

exports.index =  function(req, res) { 
	
	res.render('sections/profile', { 
		config: config,
		user: req.user,
		page: "profile" 
	}); 
};