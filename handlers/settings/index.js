var config = require(__dirname + '/../../config.json');

exports.index =  function(req, res) { 
	
	res.render('settings/settings', {
		config: config, 
		user: req.user,
		page: "settings" 
	}); 
};