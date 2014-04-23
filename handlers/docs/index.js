var mongoose = require('mongoose');
var Doc = require(__dirname + '/../../models/docs/doc.js')
var marked = require('marked');

marked.setOptions({
	gfm: true,
	tables: true
});

function slugify(text) {
	return text.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
}

exports.getDoc =  function(req, res, next) { 

	if (req.params.docSlug == "overview") {

		var doc = {
			title: "Overview",
			body: "Overview",
			author: "ben@meedoenisbelangrijkerdanwinnen.nl"
		};

		res.send(doc)

	} else {

		Doc.findOne({ 'slug': req.params.docSlug }, function (err, doc) {
			if (err) return handleError(err);

			doc.body = marked(doc.body);
			return res.send(doc);
		});

	}
};

exports.editDoc =  function(req, res, next) { 
	Doc.findOne({ 'slug': req.params.docSlug }, function (err, doc) {
		if (err) return handleError(err);

		return res.send(doc);
	});
};

exports.docSubmenu =  function(req, res, next) { 

	Doc.find( 'title slug parent', function (err, submenu) {
		if (err) return handleError(err);

		return res.send(submenu);
	});
};

exports.postDoc =  function(req, res, next) { 

	var slug = slugify(req.body.title);

	var doc = new Doc({
		title: req.body.title,
		slug: slug,
		body: req.body.body,
		parent: req.body.parent,
		author: req.user.email
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

	Doc.findByIdAndUpdate(req.body._id, { $set: { 
		title: req.body.title,
		slug: slug,
		body: req.body.body,
		parent: req.body.parent,
		editor: req.user.email 
	}}, function (err, data) {
		if (err) return handleError(err);
		res.send({ success: slug });
	});
};