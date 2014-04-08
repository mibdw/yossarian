var config = require(__dirname + '/../../config.json');

exports.index =  function(req, res) { 
	
	res.render('calendar/calendar', { 
		config: config,
		user: req.user,
		page: "calendar" 
	}); 
};