var config = require(__dirname + '/../../config.json');

exports.index =  function(req, res) { 
	
	res.render('news/news', { 
		config: config,
		user: req.user, 
		page: "news" 
	}); 
};

exports.addition = function(req, res) { 
		
	res.render('news/news', { 
		config: config,
		user : req.user,
		page: "news" 
	}); 
};