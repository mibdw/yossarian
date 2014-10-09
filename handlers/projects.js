var mongoose = require('mongoose');
var moment = require('moment');

var Project = require(__dirname + '/../models/project.js');

exports.create = function(req, res, next) {

	function taskLoop (done) {
		for (y in req.body.tasks) {
			delete req.body.tasks[y]['markedDescription'];
			if (req.body.tasks[y].start) req.body.tasks[y].start = moment(req.body.tasks[y].start, 'DD-MM-YYYY').format(); 
			if (req.body.tasks[y].end) req.body.tasks[y].end = moment(req.body.tasks[y].end, 'DD-MM-YYYY').format(); 

			for (z in req.body.tasks[y].participants) {
				if (req.body.participants.indexOf(req.body.tasks[y].participants[z]._id) == -1) {
					req.body.participants.push(req.body.tasks[y].participants[z]._id);
				}

				req.body.tasks[y].participants[z] = req.body.tasks[y].participants[z]._id;

				if (y == req.body.tasks.length - 1 && z == req.body.tasks[y].participants.length - 1) {
					done();
				}
			}
		}
	}

	function saveProject () {
		if (req.body.start) req.body.start = moment(req.body.start, 'DD-MM-YYYY').format();
		if (req.body.end) req.body.end = moment(req.body.end, 'DD-MM-YYYY').format();
		if (!req.body.owner) req.body.owner = req.body.participants[0];
		
		var project = new Project(req.body);
		project.save(function (err, project) {
			if (err) return console.log(err);
			return res.send(project);
		});
	}

	if (req.body.participants.length > 0) {
		for (x in req.body.participants) {
			req.body.participants[x] = req.body.participants[x]._id;

			if (x == req.body.participants.length - 1) {

				if (req.body.tasks.length > 0) {
					taskLoop(saveProject);
				} else {
					saveProject();
				}
			}
		}
	} else {
		if (req.body.tasks.length > 0) {
			taskLoop(saveProject);
		} else {
			saveProject();
		}
	}
};

exports.remove = function(req, res, next) {

};

exports.update = function(req, res, next) {
	var completedTasks = 0;
	function taskLoop (done) {
		for (y in req.body.tasks) {
			delete req.body.tasks[y]['markedDescription'];
			if (req.body.tasks[y].start) req.body.tasks[y].start = moment(req.body.tasks[y].start, 'DD-MM-YYYY').format(); 
			if (req.body.tasks[y].end) req.body.tasks[y].end = moment(req.body.tasks[y].end, 'DD-MM-YYYY').format();
			if (req.body.tasks[y].completed == true) completedTasks = completedTasks + 1; 

			for (z in req.body.tasks[y].participants) {
				if (req.body.participants.indexOf(req.body.tasks[y].participants[z]._id) == -1) {
					req.body.participants.push(req.body.tasks[y].participants[z]._id);
				}

				req.body.tasks[y].participants[z] = req.body.tasks[y].participants[z]._id;

				if (y == req.body.tasks.length - 1 && z == req.body.tasks[y].participants.length - 1) {
					done();
				}
			}
		}
	}

	function saveProject () {
		if (req.body.start) req.body.start = moment(req.body.start, 'DD-MM-YYYY').format();
		if (req.body.end) req.body.end = moment(req.body.end, 'DD-MM-YYYY').format();
		if (!req.body.owner) req.body.owner = req.body.participants[0];
		if (completedTasks == req.body.tasks.length && req.body.tasks.length != 0) req.body.completed = true;
		if (completedTasks != req.body.tasks.length || req.body.tasks.length == 0) req.body.completed = false;

		Project.findByIdAndUpdate(req.body._id, { $set: req.body }, function (err, projectData) {
			if (err) console.log(err);
			return res.send(projectData);
		});
	}

	if (req.body.participants.length > 0) {
		for (x in req.body.participants) {
			req.body.participants[x] = req.body.participants[x]._id;

			if (x == req.body.participants.length - 1) {

				if (req.body.tasks.length > 0) {
					taskLoop(saveProject);
				} else {
					saveProject();
				}
			}
		}
	} else {
		if (req.body.tasks.length > 0) {
			taskLoop(saveProject);
		} else {
			saveProject();
		}
	}
};

exports.detail = function(req, res, next) {
	Project.findOne({ 'slug': req.body.slug })
	.populate('author editor participants tasks.participants', 'email name role picture department')
	.populate('categories')
	.exec(function (err, projectData) {
		if (err) console.log(err);
		return res.send(projectData);
	});
};

exports.list = function(req, res, next) {
	var completion = [true, false];
	if (req.body.completed == 'open') completion = [false];
	if (req.body.completed == 'closed') completion = [true];

	if (req.body.categories && req.body.categories.length > 0) {
		Project.find({})
		.where('categories').in(req.body.categories)
		.where('completed').in(completion)
		.sort(req.body.sort)
		.populate('author editor participants tasks.participants', 'email name role picture department')
		.populate('categories')	
		.exec(function (err, projectData) {
			if (err) console.log(err);
			return res.send(projectData);
		});
	} else {
		Project.find({})
		.where('completed').in(completion)
		.sort(req.body.sort)
		.populate('author editor participants tasks.participants', 'email name role picture department')
		.populate('categories')	
		.exec(function (err, projectData) {
			if (err) console.log(err);
			return res.send(projectData);
		});

	}
};

exports.taskCreate = function(req, res, next) {
	
};

exports.taskUpdate = function(req, res, next) {
	
};

exports.taskRemove = function(req, res, next) {

};
