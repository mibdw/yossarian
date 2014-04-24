var mongoose = require('mongoose');
var User = require(__dirname + '/../../models/users/user.js');

exports.getUser =  function(req, res, next) { 

	User.findOne({ 'email': req.params.userEmail }, function (err, user) {
		if (err) return handleError(err);

		return res.send(user);
	});
};