var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var docSchema = new Schema({
	title: { type: String, require: true, unique: true },
	slug: String,
	body: String,
	author: String,
	dateCreated: Date,
	editor: String,
	dateModified: Date,
	parent: String
});

module.exports = mongoose.model('Doc', docSchema);