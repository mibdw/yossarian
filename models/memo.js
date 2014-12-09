var mongoose = require('mongoose');

var memoSchema = mongoose.Schema({
	body: String,
	date: { type: Date, default: Date.now },
	author: { type: String, ref: 'User' }
});

var User = require(__dirname + '/user');

module.exports = mongoose.model('Memo', memoSchema);