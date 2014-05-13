var mongoose = require('mongoose');
var marked = require('marked');
var moment = require('moment');

var Article = require(__dirname + '/../../models/article.js');
var Category = require(__dirname + '/../../models/categories.js');

marked.setOptions({
	gfm: true,
	tables: true
});

function slugify(text) {
	return text.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
}

exports.listArticle = function(req, res, next) {

	var articlesSkip = (req.body.articlesPage - 1) * req.body.articlesVisible;

	if (req.body.articlesActiveCategories.length < 1) {

		Article.find({})
		.limit(req.body.articlesVisible)
		.skip(articlesSkip)
		.sort(req.body.articlesSort)
		.populate('author', 'name')
		.exec(function (err, articleList) {
			if (err) return handleError(err);

			return res.send(articleList);
		});

	} else {

		Article.find({})
		.where('category').in(req.body.articlesActiveCategories)
		.limit(req.body.articlesVisible)
		.skip(articlesSkip)
		.sort(req.body.articlesSort)
		.populate('author', 'name')
		.exec(function (err, articleList) {
			if (err) return handleError(err);

			return res.send(articleList);
		});

	}
};

exports.totalArticle = function(req, res, next) {
	
	if (req.body.articlesActiveCategories.length < 1) {

		Article.count({})
		.exec(function (err, totalArticles) {
			if (err) return handleError(err);

			return res.send({'totalArticles': totalArticles});
		});

	} else {

		Article.count({})
		.where('category').in(req.body.articlesActiveCategories)
		.exec(function (err, totalArticles) {
			if (err) return handleError(err);

			return res.send({'totalArticles': totalArticles});
		});
	}
};

exports.getArticle = function(req, res, next) { 

	Article.findOne({ 'slug': req.params.articleSlug }).populate('author editor comments.author', 'name email').exec(function (err, article) {
		if (err) return handleError(err);

		article.body = marked(article.body);

		for (i in article.comments) {
			if (article.comments[i].body) {
				article.comments[i].body = marked(article.comments[i].body);
			}
		}

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


// COMMENTS

exports.postComment = function(req, res, next) {
	
	var datePosted = moment().format();

	Article.findByIdAndUpdate(req.body.articleId, { 

		$push: { 'comments': {
			'dateCreated': datePosted,
			'author': req.user.id,
			'body': req.body.commentBody
		}}

	}, function () {

		Article.findById(req.body.articleId).populate('comments.author', 'name email').exec(function (err, article) {
			if (err) return handleError(err);

			for (i in article.comments) {
				if (article.comments[i].body) {
					article.comments[i].body = marked(article.comments[i].body);
				}
			}

			res.send(article.comments);
		});
	});
};

exports.deleteComment = function(req, res, next) {
	
	Article.findByIdAndUpdate(req.body.articleId, { 

		$pull: { 'comments': {
			'_id': req.body.commentId,
		}}

	}, function () {

		Article.findById(req.body.articleId).populate('comments.author', 'name email').exec(function (err, article) {
			if (err) return handleError(err);

			for (i in article.comments) {
				if (article.comments[i].body) {
					article.comments[i].body = marked(article.comments[i].body);
				}
			}

			res.send(article.comments);
		});
	});
};