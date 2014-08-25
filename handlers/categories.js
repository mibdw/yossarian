var mongoose = require('mongoose');
var moment = require('moment');

var Category = require(__dirname + '/../models/category.js');

function slugify (text) {
	return text.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
};

exports.create = function(req, res, next) {
	
	var slug = slugify(req.body.name);
	var createCategory = new Category({
		'name': req.body.name,
		'color': req.body.color,
		'slug': slug
	});

	createCategory.save(function (err) {
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

	console.log(req.body);
	var slug = slugify(req.body.name);
	Category.findByIdAndUpdate(req.body._id, { $set: { 
		name: req.body.name,
		slug: slug,
		color: req.body.color 
	}}, function (err, category) {
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