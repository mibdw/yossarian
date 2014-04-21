var mongoose = require('mongoose');
var Doc = require(__dirname + '/../../models/docs/doc.js')
var marked = require('marked');

marked.setOptions({
	gfm: true,
	tables: true
});

exports.getDoc =  function(req, res, next) { 
	source = "Deze *shit* is vet. Wat **kunnen** we nog meer verzinnen?\n\n- Misschien\n- Een\n- Lijstje\n\n## Of een H2?\n| Name | Description          |\n| ------------- | ----------- |\n| Help      | ~~Display the~~ help window.|\n| Close     | _Closes_ a window     |";
	blurb = marked(source);

	doc = {
		title: req.params.docSlug,
		content: blurb
	}

	res.send(doc);
};

exports.postDoc =  function(req, res, next) { 

};