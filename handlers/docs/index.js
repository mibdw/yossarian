var mongoose = require('mongoose');
var marked = require('marked');
var moment = require('moment');

var Doc = require(__dirname + '/../../models/doc.js');

marked.setOptions({
	gfm: true,
	tables: true
});

function slugify(text) {
	return text.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
}

exports.getDoc =  function(req, res, next) { 

	if (req.params.docSlug == "overview") {

		var doc = { title: "Overview", body: "Overview" };
		res.send(doc)

	} else {

		Doc.findOne({ 'slug': req.params.docSlug }).populate('author editor', 'name email').exec(function (err, doc) {
			if (err) return handleError(err);

			doc.body = marked(doc.body);
			return res.send(doc);
		});
	}
};

exports.editDoc =  function(req, res, next) { 
	Doc.findOne({ 'slug': req.params.docSlug }).populate('author editor', 'name email').exec(function (err, doc) {
		if (err) return handleError(err);

		return res.send(doc);
	});
};

exports.docSubmenu =  function(req, res, next) { 

	Doc.find('title slug parent', function (err, submenu) {
		if (err) return handleError(err);

		return res.send(submenu);
	});
};

exports.postDoc =  function(req, res, next) { 

	var slug = slugify(req.body.title);
	var postDate = moment().format();

	var doc = new Doc({

		'title': req.body.title,
		'slug': slug,
		'body': req.body.body,
		'parent': req.body.parent,
		'author': req.user._id,
		'dateCreated': postDate

	});

	doc.save(function (err) {
		if (err) return handleError(err);
		Doc.findById(doc, function (err, data) {
			if (err) return handleError(err);

			if (doc.parent != 'noParent') {
				var path = doc.parent + "/" + slug;
				res.send({ success: path })
			} else {
				res.send({ success: slug });
			}
		});
	})
};

exports.updateDoc =  function(req, res, next) { 

	var slug = slugify(req.body.title);
	var editDate = moment().format();

	Doc.findByIdAndUpdate(req.body._id, { 

		$set: { 
			'title': req.body.title,
			'slug': slug,
			'body': req.body.body,
			'parent': req.body.parent,
			'editor': req.user._id,
			'dateModified': editDate
		}

	}, function (err, data) {

		if (err) return handleError(err);
		
		if (req.body.parent != 'noParent') {
			var path = req.body.parent + "/" + slug;
			res.send({ success: path })
		} else {
			res.send({ success: slug });
		}

	});
};

exports.deleteDoc =  function(req, res, next) {

	Doc.findByIdAndRemove(req.body.docid, function() {
		res.send({ success: 'yay!' });
	});
};

exports.previewDoc = function(req, res, next) {

	var preview = marked(req.body.previewBody);
	res.send({ 'body': preview });
};