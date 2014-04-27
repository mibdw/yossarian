var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var docSchema = new Schema({
	title: { type: String, require: true, unique: true },
	slug: String,
	body: String,
	author: String,
	dateCreated: String,
	editor: String,
	dateModified: String,
	parent: String
});

module.exports = mongoose.model('Doc', docSchema);