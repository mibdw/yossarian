var mongoose = require('mongoose');

var projectSchema = mongoose.Schema({
	title: { type: String, required: true, unique: true },
	slug: String,
	author: { type: String, ref: 'User' },
	editor: { type: String, ref: 'User' },
	owner: { type: String, ref: 'User' },
	participants: [{ type: String, ref: 'User'}],
	postDate: Date,
	editDate: Date,
	start: Date,
	end: Date,
	categories: [{ type: String, ref: 'User' }],
	description: String,
	comments: [{
		author: { type: String, ref: 'User' },
		body: String,
		postDate: Date,
		visible: { type: Boolean, default: true }
	}],
	tasks: [{
		note: String,
		author: { type: String, ref: 'User' },
		editor: { type: String, ref: 'User' },
		participants: [{ type: String, ref: 'User' }],
		completed: { type: Boolean, default: false },
		postDate: Date,
		editDate: Date,
		start: Date,
		end: Date,
	}],
	visible: { type: Boolean, default: true }
});

var User = require(__dirname + '/user');
var Category = require(__dirname + '/category');

module.exports = mongoose.model('Project', projectSchema);