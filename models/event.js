var mongoose = require('mongoose');

var eventSchema = mongoose.Schema({
	title: { type: String, required: true },
	note: String,
	user: { type: String, ref: 'User' },
	allDay: { type: Boolean, default: true },
	postDate: Date,
	start: { type: Date, required: true },
	end: Date,
	category: { type: String, ref: 'Category' },
	recursion: { type: Boolean, default: false },
	visible: { type: Boolean, default: true }
});

var User = require(__dirname + '/user');
var Category = require(__dirname + '/category');

module.exports = mongoose.model('Event', eventSchema);