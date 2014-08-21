var mongoose = require('mongoose');

var relationSchema = mongoose.Schema({
	field: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('Relation', relationSchema);