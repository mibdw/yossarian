var mongoose = require('mongoose');
var Doc = require(__dirname + '/../../models/docs/doc.js')
var marked = require('marked');

marked.setOptions({
	gfm: true,
	tables: true
});

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

exports.docSubmenu =  function(req, res, next) { 

	Doc.find({ 'parent': 'noParent' }, 'title slug', function (err, submenu) {
		if (err) return handleError(err);

		return res.send(submenu);
	});
};

exports.postDoc =  function(req, res, next) { 

	function slugify(text) {

		return text.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
	}

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
		})
	})

	res.send({ success: "Way to go dude! You rock" });
	
};