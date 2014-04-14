var mongoose = require('mongoose');
var markdown = require('markdown').markdown;

var config = require(__dirname + '/../../config.json');
var Article = require(__dirname + '/../../models/news/article');


exports.index =  function(req, res) { 

	Article.find({}, function(err, articles) {
	
		res.render('news/news', { 
			config: config,
			user: req.user, 
			page: "news",
			articles: articles
		});
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

	var article = new Article ({
		title: req.body.articleTitle,
		author: req.user.id,
		body: req.body.articleBody,
		category: req.body.articleCategory		
	});

	article.save (function (err) {
		if (err) return handleError(err);
		
		console.log('New article posted by ' + req.user.username + '(' + req.body.articleTitle + ')');
	});	

	res.redirect('/news');
};

