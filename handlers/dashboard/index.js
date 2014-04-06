var config = require(__dirname + '/../../config.json');

exports.index =  function(req, res) { 
	
	res.render('sections/dashboard', { 
		config: config,
		user: req.user,
		page: "dashboard" 
	}); 
};