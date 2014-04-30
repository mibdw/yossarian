var mongoose = require('mongoose');
var marked = require('marked');
var moment = require('moment');

var Article = require(__dirname + '/../../models/news/article.js');

marked.setOptions({
	gfm: true,
	tables: true
});

function slugify(text) {
	return text.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
}

exports.getArticleList = function(req, res, next) {

	Article.find({}).populate('author', 'name').exec(function (err, articleList) {
		if (err) return handleError(err);

		return res.send(articleList);
	});
};

exports.getArticle = function(req, res, next) { 

	Article.findOne({ 'slug': req.params.articleSlug }).populate('author editor', 'name email').exec(function (err, article) {
		if (err) return handleError(err);

		article.body = marked(article.body);
		return res.send(article);
	});

};

exports.editArticle = function(req, res, next) { 

	Article.findOne({ 'slug': req.params.articleSlug }).populate('author editor', 'name email').exec(function (err, article) {
		if (err) return handleError(err);
		return res.send(article);
	});

};

exports.deleteArticle = function(req, res, next) {

	Article.findByIdAndRemove(req.body.id, function() {
		res.send({ success: 'yay!' });
	});
};

exports.postArticle = function(req, res, next) {

	var slug = slugify(req.body.title);
	var postDate = moment().format();

	var article = new Article({

		'title': req.body.title,
		'slug': slug,
		'body': req.body.body,
		'author': req.user._id,
		'category': req.body.category,
		'dateCreated': postDate
	}); 

	article.save(function (err) {
		if (err) return handleError(err);
 		res.send(slug);
	});


};

exports.updateArticle = function(req, res, next) {

	var slug = slugify(req.body.title);
	var editDate = moment().format();

	Article.findByIdAndUpdate(req.body._id, { 

		$set: { 
			'title': req.body.title,
			'slug': slug,
			'body': req.body.body,
			'category': req.body.category,
			'editor': req.user._id,
			'dateModified': editDate
		}

	}, function (err, data) {

		if (err) return handleError(err);
		res.send(slug);

	});
};

exports.previewArticle = function(req, res, next) {

	var preview = marked(req.body.previewBody);
	res.send(preview);
};

exports.getCategories = function(req, res, next) { };