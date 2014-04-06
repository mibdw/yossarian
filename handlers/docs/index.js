var config = require(__dirname + '/../../config.json');

exports.index =  function(req, res) {

	res.render('sections/docs', { 
		config: config,
		user: req.user,
		page: "docs",
		subpage: "overview"
	});
};

exports.subpage = function(req, res) {

	if (req.params.subpage == "address") {	

		res.render('sections/docs', { 
			config: config,
			user: req.user, 
			page: "docs",
			subpage: "address",
			subsubpage: "shipping"
		});

	} else {

		console.log(subsubmenu);

		res.render('sections/docs', { 
			config: config,
			user: req.user, 
			page: "docs",
			subpage: req.params.subpage
		});
	}
};

exports.subsubpage = function(req, res) {

	res.render('sections/docs', { 
		config: config,
		user: req.user,
		page: "docs",
		subpage: req.params.subpage,
		subsubpage: req.params.subsubpage
	});
};