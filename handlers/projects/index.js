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

exports.getProjectList = function(req, res, next) { };
exports.getProject = function(req, res, next) { };
exports.editProject = function(req, res, next) { };

exports.postProject = function(req, res, next) { };
exports.deleteProject = function(req, res, next) { };
exports.updateProject = function(req, res, next) { };
exports.previewProject = function(req, res, next) { };

exports.postIssue = function(req, res, next) { };
exports.deleteIssue = function(req, res, next) { };
exports.updateIssue = function(req, res, next) { };
exports.previewIssue = function(req, res, next) { };

exports.postNote = function(req, res, next) { };
exports.deleteNote = function(req, res, next) { };
exports.updateNote = function(req, res, next) { };
exports.previewNote = function(req, res, next) { };