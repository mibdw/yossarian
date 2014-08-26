var mongoose = require('mongoose');
var moment = require('moment');

var Category = require(__dirname + '/../models/category.js');

exports.create = function(req, res, next) {
	
	var category = new Category(req.body);

	category.save(function (err) {
		if (err) return console.log(err);
		res.send('success');
	});
};

exports.remove = function(req, res, next) {

	// TODO: REDIRECT ITEMS
	
	Category.findByIdAndRemove(req.body.from, function (err) {
		if (err) return console.log(err);
		res.send('success');
	});
};

exports.update = function(req, res, next) {

	Category.findByIdAndUpdate(req.body._id, { $set: req.body }, function (err, category) {
		if (err) console.log(err);
		res.send(category);
	});
};

exports.list = function(req, res, next) {

	Category.find({})
	.exec(function (err, categoryList) {
		if (err) console.log(err);
		return res.send(categoryList);
	});
};