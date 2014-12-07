var mongoose = require('mongoose');

var changeSchema = mongoose.Schema({
	user: { type: String, ref: 'User' }, 
		date: { type: Date, default: Date.now },
		slug: String,
		title: String,
		action: String,
		section: String
});

var User = require(__dirname + '/user');

module.exports = mongoose.model('Change', changeSchema);