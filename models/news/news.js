var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var newsSchema = new Schema({
	title: String,
	author: String,
	body: String,
	comments: [{ body: String, date: Date }],
	date: { type: Date, default: Date.now },
	hidden: Boolean,
	category: String
});

var News = mongoose.model('News', newsSchema);