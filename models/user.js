var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var SALT_WORK_FACTOR = 10;

var userSchema = mongoose.Schema({
	username: { type: String, unique: true },
	email: { type: String, unique: true },
	password: String,
	name: {
		first: String,
		last: String,
	},
	role: String,
	picture: { type: String, default: 'avatar.gif' },
	birthday: Date,
	department: String,
	note: String,
	active: Boolean,
	postDate: Date,
	editDate: Date
});

userSchema.pre('save', function(next) {
	var user = this;
	if(!user.isModified('password')) return next();
	
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if(err) return next(err);
		bcrypt.hash(user.password, salt, function(err, hash) {
			if(err) return next(err);
			user.password = hash;
			next();
		});
	});
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
		if(err) return cb(err);
		cb(null, isMatch);
	});
};

module.exports = mongoose.model('User', userSchema);