$('.header-nav a').on('click', function(event) {
	event.preventDefault();
	var href = $(this).attr('href');
	var slug = $(this).parent('li').attr('id');
	var name = $(this).attr('title');

	$('#main').load(href + ' #main > *');

	$('.header-nav li').removeClass('active');
	$(this).parent('li').addClass('active');

	$('footer nav li').removeClass('active');
	$('footer nav li#' + slug).addClass('active');

	window.history.pushState({}, '', href);
	document.title = 'Yossarian \u2014 ' + name;
});

$('#main').on('click', '.sidebar-nav a', function(event) {
	event.preventDefault();
	var href = $(this).attr('href');
	var name = $(this).attr('title');

	$('#content').load(href + ' #content > *');

	$('.sidebar-nav li').removeClass('active');
	$(this).parent('li').addClass('active');

	$(this).parent('li').find('.sidebar-subnav li:first').addClass("active");
	$(this).parent('li').parent('.sidebar-subnav').parent('li').addClass('active');

	window.history.pushState({}, '', href);
	document.title = 'Yossarian \u2014 ' + name;
});

