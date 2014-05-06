var mongoose = require('mongoose');
var moment = require('moment');
var dateFormat = "ddd MM-DD-YYYY HH:mm:ss";

var User = require(__dirname + '/../models/users/user.js');
var Article = require(__dirname + '/../models/news/article.js');
var Category = require(__dirname + '/../models/news/category.js');

var FirstRun = mongoose.model('FirstRun', { initialized: Boolean });

exports.gogogo = function () {
	
	var user = new User({ 
		email: 'ben@meedoenisbelangrijkerdanwinnen.nl', 
		password: 's22)pp', 
		name: { first: 'Ben', last: 'van den Ende' } 
	});

	user.save(function(err) { if(err) { console.log(err); } else { console.log(moment().format(dateFormat) + ' - First user seeded: ' + user.email + "."); } });

	var category = new Category({ 
		categories: ['Uncategorized'] 
	});

	category.save(function(err) { if(err) { console.log(err); } else { console.log(moment().format(dateFormat) + ' - First category seeded: ' + category.categories[0] + '.'); } });
	
	User.findOne({}, '_id', function (err, success) {
		
		var postDate = moment().format();
		var userID = user._id;
		console.log(user);

		var article = new Article({
			title: 'Hello world',
			slug: 'hello-world',
			body: 'Welcome to your Yossarian installation. This is the obligatory welcome post. Feel free to delete, print, worship or loath it, just keep it tasteful. If you need any help getting started, visit our website (http://www.meedoenisbelangrijkerdanwinnen). ',
			author: userID,
			dateCreated: postDate,
			category: ['Uncategorized'],
		});

		article.save(function(err) { if(err) { console.log(err); } else { console.log(moment().format(dateFormat) + ' - First article seeded: ' + article.title + "."); } });
	});
};