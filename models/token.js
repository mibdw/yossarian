var mongoose = require('mongoose');

var tokenSchema = mongoose.Schema({
	userId: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('Token', tokenSchema);