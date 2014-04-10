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
		
	var Article = require(__dirname + '/../../models/news/article')
	var mongoose = require('mongoose');

	var article = new Article({
		title: req.params.articleTitle,
		author: req.user.id,
		body: req.params.articleBody,
		category: req.params.articleCategory		
	});

	article.save(function (err) {
		if (err) return handleError(err);
		console.log('New article posted by ' + req.user.username + '(' + req.params.articleTitle + ')');

		res.redirect('/news');
	}); 
};

exports.ajaxAdd = function(req, res) { 
		
	var Article = require(__dirname + '/../../models/news/article')
	var mongoose = require('mongoose');

	var article = new Article({
		title: req.params.articleTitle,
		author: req.user.id,
		body: req.params.articleBody,
		category: req.params.articleCategory		
	});

	article.save(function (err) {
		if (err) return handleError(err);
		Article.findById(article, function (err, doc) {
			if (err) return handleError(err);

			console.log('New article posted by ' + req.user.username + '(' + article.title + ')'); 
			console.log(doc);
		})
	})
};

