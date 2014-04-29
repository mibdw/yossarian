var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var categorySchema = new Schema({
	slug: String,
	name: String
});

module.exports = mongoose.model('Category', categorySchema);