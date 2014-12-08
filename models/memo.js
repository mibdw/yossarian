var mongoose = require('mongoose');

var memoSchema = mongoose.Schema({
	body: String,
	postDate: Date,
	author: { type: String, ref: 'User' },
	visible: { type: Boolean, default: true }
});

var User = require(__dirname + '/user');

module.exports = mongoose.model('Memo', memoSchema);