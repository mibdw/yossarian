var mongoose = require('mongoose');

var categorySchema = mongoose.Schema({
	name: { type: String, unique: true},
	slug: String,
	color: String,
});

module.exports = mongoose.model('Category', categorySchema);