var mongoose = require('mongoose');

var documentSchema = mongoose.Schema({
	title: { type: String, required: true, unique: true },
	slug: String,
	body: String,
	date: Date,
	author: { type: String, ref: 'User' },
	editDate: Date,
	editor: { type: String, ref: 'User' },
	categories: [{ type: String, ref: 'Category' }],
	parent: String,
	visible: { type: Boolean, default: true }
});

var User = require(__dirname + '/user');
var Category = require(__dirname + '/category');

module.exports = mongoose.model('Document', documentSchema);