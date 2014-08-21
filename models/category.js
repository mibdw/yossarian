var mongoose = require('mongoose');

var categorySchema = new Schema({
	name: { type: String, unique: true },
	slug: String,
	color: { type: String, unique: true },
});

module.exports = mongoose.model('Category', categorySchema);