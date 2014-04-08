var config = require(__dirname + '/../../config.json');

exports.index =  function(req, res) { 
	
	res.render('news/news', { 
		config: config,
		user: req.user, 
		page: "news" 
	}); 
};

exports.getAdd = function(req, res) { 
		
	res.render('news/add', { 
		config: config,
		user : req.user,
		page: "news" 
	}); 
};

exports.postAdd = function(req, res) { 
		
	console.log('Add news request received');
};

exports.ajaxAdd = function(req, res) { 
		
	console.log('Add news request received'); 
};

