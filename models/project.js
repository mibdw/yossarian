var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var projectSchema = new Schema({
	title: { type: String, require: true, unique: true },
	slug: String,
	description: String,
	priority: Number,
	author: { type: String, ref: 'User' },
	editor: { type: String, ref: 'User' },
	leader: { type: String, ref: 'User' },
	participants: [{ type: String, ref: 'User' }],
	dateCreated: Date,
	dateModified: Date,
	dateStart: Date,
	dateEnd: Date,
	category: [String],
	issues: [{
		title: { type: String, require: true },
		description: String,
		priority: Number,
		author: { type: String, ref: 'User' },
		editor: { type: String, ref: 'User' },
		owner: { type: String, ref: 'User' },
		participants: [{ type: String, ref: 'User' }],
		dateCreated: Date,
		dateModified: Date,
		dateStart: Date,
		dateEnd: Date,
		notes: [{
			body: String,
			author: { type: String, ref: 'User' },
			dateCreated: Date
		}]
	}]
});

var User = require(__dirname + '/user');

module.exports = mongoose.model('Project', projectSchema);