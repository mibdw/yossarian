$('.header-nav a').on('click', function(event) {
	event.preventDefault();
	var href = $(this).attr('href');

	$('#main').html('<div class="loading"><i class="fa fa-refresh fa-spin"></i></div>');
	$('#main').load(href + ' #main > *');

	$('.header-nav li').removeClass('active');
	$(this).parent('li').addClass('active');

	window.history.pushState({}, '', href);
});

$('.sidebar-nav a').on('click', function(event) {
	event.preventDefault();
	var href = $(this).attr('href');

	$('#main').html('<div class="loading"><i class="fa fa-refresh fa-spin"></i></div>');
	$('#main').load(href + ' #main > *');

	$('.sidebar-nav li').removeClass('active');
	$(this).parent('li').addClass('active');

	window.history.pushState({}, '', href);
});

