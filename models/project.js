var mongoose = require('mongoose');

var projectSchema = mongoose.Schema({
	field: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('Project', projectSchema);