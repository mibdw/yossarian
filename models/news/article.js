var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var articleSchema = new Schema({
	title: { type: String, require: true, unique: true },
	slug: String,
	body: String,
	author: { type: String, ref: 'User' },
	dateCreated: Date,
	editor: { type: String, ref: 'User' },
	dateModified: Date,
	category: [String]
});

var User = require(__dirname + '/../users/user');

module.exports = mongoose.model('Article', articleSchema);