var mongoose = require('mongoose');
var moment = require('moment');

var Doc = require(__dirname + '/../models/doc.js');
var User = require(__dirname + '/../models/user.js');
var Category = require(__dirname + '/../models/category.js');

exports.create = function(req, res, next) {
	var createDoc = new Doc(req.body);
	createDoc.save(function (err, doc) {
		if (err) return console.log(err);
		return res.send(doc);
	});
};

exports.remove = function(req, res, next) {
	Doc.findByIdAndRemove(req.body.remove, function (err) {
		if (err) return console.log(err);
		res.send('success');
	});
};

exports.update = function(req, res, next) {
	Doc.findById(req.body._id)
	.exec(function (err, oldDoc) {
		if (err) console.log(err);
		Doc.update({ 'parent': oldDoc.slug }, { 'parent': req.body.slug }, function (err) {
			if (err) console.log(err);
			Doc.findByIdAndUpdate(req.body._id, { $set: req.body }, function (err, docData) {
				if (err) console.log(err);
				return res.send(docData);
			});
		});
	});
};

exports.detail = function(req, res, next) {
	Doc.findOne({ 'slug': req.body.slug })
	.populate('author editor', 'email name role picture department')
	.populate('categories')
	.exec(function (err, docData) {
		if (err) console.log(err);
		return res.send(docData);
	});
};

exports.menu = function(req, res, next) {
	Doc.find({})
	.select('_id title slug parent order')
	.exec(function (err, docMenu) {
		if (err) console.log(err);
		return res.send(docMenu);
	});
};
