var mongoose = require('mongoose');
var moment = require('moment');
var dateFormat = "ddd MM-DD-YYYY HH:mm:ss";
var postDate = moment().format();

var User = require(__dirname + '/../models/user.js');
var Article = require(__dirname + '/../models/article.js');
var Category = require(__dirname + '/../models/categories.js');

exports.gogogo = function () {
	
	var user = new User({ 
		email: 'ben@meedoenisbelangrijkerdanwinnen.nl', 
		password: 's22)pp', 
		name: { first: 'Ben', last: 'van den Ende' },
		dateCreated: postDate
	});

	user.save(function(err) { if(err) { console.log(err); } else { console.log(moment().format(dateFormat) + ' - First user seeded: ' + user.email + "."); } });

	var category = new Category({ 
		categories: ['Uncategorized'] 
	});

	category.save(function(err) { if(err) { console.log(err); } else { console.log(moment().format(dateFormat) + ' - First category seeded: ' + category.categories[0] + '.'); } });
	
	User.findOne({}, '_id', function (err, success) {
		
		var userID = user._id;

		var article = new Article({
			title: 'Hello world',
			slug: 'hello-world',
			body: 'Welcome to your Yossarian installation. This is the obligatory welcome post. Feel free to delete, print, worship or loath it, just try to keep your pants on. If you need any help getting started, you\'re out of luck. \n\nFor now, Yossarian is still in it\'s very early stages. So please mind the rough edges and if you break something, you pay for it. Remember, *where are the Snowdens of yesteryear*?',
			author: userID,
			dateCreated: postDate,
			category: ['Uncategorized'],
		});

		article.save(function(err) { if(err) { console.log(err); } else { console.log(moment().format(dateFormat) + ' - First article seeded: ' + article.title + "."); } });
	});
};