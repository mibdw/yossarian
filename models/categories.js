var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var categorySchema = new Schema({
	categories: [String]
});

module.exports = mongoose.model('Category', categorySchema);