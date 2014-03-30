var express = require('express');
var lessMiddleware = require("less-middleware");
var app = express();

// Route handlers
var routes = require('./handlers/routes');

// View engine
app.set('view engine', 'jade');
app.set('views', './views');

// Middlewares
app.use(app.router);
app.use(lessMiddleware('./public', { force: true }));
app.use(express.static('./public')); 

// Routes
var routes = require('./handlers/routes')(app);

app.listen(3000, function() {
	console.log('Let\'s get this party started');
});