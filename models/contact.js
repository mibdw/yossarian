var mongoose = require('mongoose');

var relationSchema = mongoose.Schema({
	name1: { type: String, required: true },
	name2: String,
	name3: String,
	street1: String,
	street2: String,
	street3: String,
	postcode: String,
	city: String,
	country: String,
	phone: String,
	fax: String,
	email: String,
	website: String,
	description: String,
	contacts: [{
		name: String,
		email: String,
		phone: String,
		description: String,
		author: { type: String, ref: 'User' },
		editor: { type: String, ref: 'User' },
		postDate: Date,
		editDate: Date
	}],
	relation: String,
	author: { type: String, ref: 'User' },
	editor: { type: String, ref: 'User' },
	postDate: Date,
	editDate: Date,
	active: { type: Boolean, default: true },
	notes: [{
		note: { type: String, required: true },
		postDate: Date,
		author: { type: String, ref: 'User' }
	}]
});

var User = require(__dirname + '/user');

module.exports = mongoose.model('Relation', relationSchema);