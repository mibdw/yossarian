var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var articleSchema = new Schema({
	title: { type: String, require: true, unique: true },
	slug: String,
	body: String,
	author: String,
	dateCreated: String,
	editor: String,
	dateModified: String,
	category: [String]
});

module.exports = mongoose.model('Article', articleSchema);