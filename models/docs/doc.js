var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var docSchema = new Schema({
	title: { type: String, require: true, unique: true },
	slug: String,
	body: String,
	author: String,
	dateCreated: { type: Date, default: Date.now },
	editor: String,
	dateModified: { type: Date, default: Date.now },
	parent: String
});

module.exports = mongoose.model('Doc', docSchema);