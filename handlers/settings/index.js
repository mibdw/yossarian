var mongoose = require('mongoose');
var moment = require('moment');

var Article = require(__dirname + '/../../models/news/article.js');
var Category = require(__dirname + '/../../models/news/category.js');
var User = require(__dirname + '/../../models/users/user.js');

// CATEGORIES

exports.getCategories = function(req, res, next) {
	
	Category.findOne({}).exec(function (err, category) {
		if (err) return handleError(err);
		res.send(category);
	});
};


exports.postCategories = function(req, res, next) {
	
	Category.findOne({}).exec(function (err, category) {
		if (err) return handleError(err);

		var newCategoryList = category.categories;
		newCategoryList.push(req.body.newCategory);

		Category.findByIdAndUpdate(category._id, { 

			$set: { 'categories': newCategoryList }

		}, function (err, data) {

			if (err) return handleError(err);
			Category.findOne({}).exec(function (err, category) {
				if (err) return handleError(err);

				res.send(category);
			});
		});
	});
};

exports.deleteCategories = function(req, res, next) {
	
	Category.findOne({}).exec(function (err, category) {
		if (err) return handleError(err);

		var newCategoryList = category.categories;
		var deleteCatIndex = newCategoryList.indexOf(req.body.deleteCategory);
		newCategoryList.splice(deleteCatIndex, 1);

		Category.findByIdAndUpdate(category._id, { 

			$set: { 'categories': newCategoryList }

		}, function (err, data) {

			if (err) return handleError(err);
			Category.findOne({}).exec(function (err, category) {
				if (err) return handleError(err);

				res.send(category);
			});

		});
	});
};

// USERS

exports.getUserList = function(req, res, next) {
	
	User.find({}, 'name email _id dateCreated').exec(function (err, users) {
		if (err) return handleError(err);
		res.send(users);
	});
};

exports.postUser = function(req, res, next) {

	var postDate = moment().format();

	var user = new User({ 
		email: req.body.email, 
		password: req.body.password, 
		name: { 
			first: req.body.name.first, 
			last: req.body.name.last 
		},
		dateCreated: postDate
	});

	user.save(function(err) {
		if(err) {
			console.log(err);
		} else {

			User.find({}, 'name email _id dateCreated').exec(function (err, users) {
				if (err) return handleError(err);
				res.send(users);
			});
		}
	});
};

