var mongoose = require('mongoose');
var marked = require('marked');
var moment = require('moment');

var Article = require(__dirname + '/../../models/news/article.js');
var Category = require(__dirname + '/../../models/news/category.js');

marked.setOptions({
	gfm: true,
	tables: true
});

function slugify(text) {
	return text.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
}

exports.getArticleList = function(req, res, next) {

	Article.find({}, function (err, articleList) {
		if (err) return handleError(err);

		return res.send(articleList);
	});
};

exports.getArticle = function(req, res, next) { };

exports.editArticle = function(req, res, next) { };

exports.deleteArticle = function(req, res, next) { };

exports.postArticle = function(req, res, next) {

	var slug = slugify(req.body.title);
	var postDate = moment().format();

	var article = new Article({

		'title': req.body.title,
		'slug': slug,
		'body': req.body.body,
		'author': req.user.email,
		'category': req.body.category,
		'dateCreated': postDate
	});

	article.save(function (err) {
		if (err) return handleError(err);
 		console.log("yoyoyo");
 		res.send("yoyoyo");
	})
};

exports.updateArticle = function(req, res, next) { };

exports.previewArticle = function(req, res, next) { };

exports.getCategories = function(req, res, next) { };