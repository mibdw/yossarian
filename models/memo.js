var mongoose = require('mongoose');

var memoSchema = mongoose.Schema({
	body: String,
	postDate: Date,
	author: { type: String, ref: 'User' },
	editDate: Date,
	editor: { type: String, ref: 'User' },
	categories: [{ type: String, ref: 'Category' }],
	visible: { type: Boolean, default: true }
});

var User = require(__dirname + '/user');
var Category = require(__dirname + '/category');

module.exports = mongoose.model('Memo', memoSchema);