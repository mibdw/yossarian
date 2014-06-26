var mongoose = require('mongoose');
var marked = require('marked');
var moment = require('moment');

var Project = require(__dirname + '/../../models/project.js');
var Category = require(__dirname + '/../../models/categories.js');

marked.setOptions({
	gfm: true,
	tables: true
});

function slugify(text) {
	return text.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
}

exports.getProjectList = function(req, res, next) {

	var projectsSkip = (req.body.projectsPage - 1) * req.body.projectsVisible;

	if (req.body.projectsActiveCategories.length < 1) {

		Project.find({})
		.limit(req.body.projectsVisible)
		.skip(projectsSkip)
		.sort(req.body.projectSort)
		.populate('author', 'name')
		.exec(function (err, projectlist) {
			if (err) return handleError(err);

			return res.send(projectlist);
		});

	} else {

		Project.find({})
		.where('category').in(req.body.projectsActiveCategories)
		.limit(req.body.projectsVisible)
		.skip(projectsSkip)
		.sort(req.body.projectSort)
		.populate('author', 'name')
		.exec(function (err, projectlist) {
			if (err) return handleError(err);

			return res.send(projectlist);
		});
	}
};

exports.getProject = function(req, res, next) {
	
	Project.findOne({ 'slug': req.params.projectSlug }).populate('author editor', 'name email').exec(function (err, project) {
		if (err) return handleError(err);

		project.description = marked(project.description);

		return res.send(project);
	});
};

exports.editProject = function(req, res, next) { 

	Project.findOne({ 'slug': req.params.projectSlug }).populate('author editor', 'name email').exec(function (err, project) {
		if (err) return handleError(err);
		return res.send(project);
	});
};

exports.postProject = function(req, res, next) {
	
	var slug = slugify(req.body.title);
	var postDate = moment().format();

	var project = new Project({

		'title': req.body.title,
		'slug': slug,
		'description': req.body.body,
		'author': req.user._id,
		'category': req.body.category,
		'dateCreated': postDate
	}); 

	project.save(function (err) {
		if (err) return handleError(err);
 		res.send(slug);
	});
};

exports.deleteProject = function(req, res, next) {

	Project.findByIdAndRemove(req.body.id, function() {
		res.send({ success: 'yay!' });
	});
};

exports.updateProject = function(req, res, next) {

	var slug = slugify(req.body.title);
	var editDate = moment().format();

	Project.findByIdAndUpdate(req.body._id, { 

		$set: { 
			'title': req.body.title,
			'slug': slug,
			'description': req.body.description,
			'category': req.body.category,
			'editor': req.user._id,
			'dateModified': editDate
		}

	}, function (err, dateCreated) {

		if (err) return handleError(err);
		res.send(slug);

	});
};

exports.previewProject = function(req, res, next) {

	var preview = marked(req.body.previewBody);
	res.send(preview);
};
	
exports.postIssue = function(req, res, next) { };
exports.deleteIssue = function(req, res, next) { };
exports.updateIssue = function(req, res, next) { };
exports.previewIssue = function(req, res, next) { };

exports.postNote = function(req, res, next) { };
exports.deleteNote = function(req, res, next) { };
exports.updateNote = function(req, res, next) { };
exports.previewNote = function(req, res, next) { };