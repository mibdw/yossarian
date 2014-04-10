// HEADER NAVIGATION

$('.header-nav a').on('click', function(event) {
	event.preventDefault();
	var href = $(this).attr('href');
	var slug = $(this).parent('li').attr('id');
	var name = $(this).attr('title');

	$('main').load(href + ' main > *', function() {
		$('main').removeAttr("class");
		$('main').addClass(slug);
	});

	$('.header-nav li').removeClass('active');
	$(this).parent('li').addClass('active');

	$('footer li').removeClass('active');
	$('footer li#' + slug).addClass('active');

	window.history.pushState({}, '', href);
	document.title = 'Yossarian \u2014 ' + name;
});

// SIDEBAR NAVIGATION

$('main').on('click', '.sidebar-nav a', function(event) {
	event.preventDefault();
	var href = $(this).attr('href');
	var name = $(this).attr('title');

	$('article').load(href + ' article > *');

	$('.sidebar-nav li').removeClass('active');
	$(this).parent('li').addClass('active');

	$(this).parent('li').find('.sidebar-subnav li:first').addClass('active');
	$(this).parent('li').parent('.sidebar-subnav').parent('li').addClass('active');

	window.history.pushState({}, '', href);
	document.title = 'Yossarian \u2014 ' + name;
});

// ALERTS

$('body').on('click', '.alert .close', function() {
	$(this).parent('.alert').fadeOut(100);
});

// POPUPS

function startPopup (event) {
	
	$('body').append('<div class="popup-wrapper"><div class="popup"><i class="fa fa-refresh fa-spin"></i></div></div>');

	var height = $(window).height();
	var popupWidth = $(".popup").width();
	var popupHeight = height * 0.8;
	var popupLeft = -popupWidth / 2;
	var popupTop = -popupHeight / 2;

	$('.popup').css({
		"height": popupHeight,
		"margin-top": popupTop,
		"margin-left": popupLeft
	});

	setTimeout( function() {
		$('.popup-wrapper').addClass('active');
	}, 50);
}

function stopPopup (event) {

	if ($(event.target).hasClass('popup-wrapper') || $(event.target).hasClass('popup-close')) {
		$('.popup-wrapper').removeClass('active');

		setTimeout( function() {
			$('.popup-wrapper').remove();
		}, 200);
	}
}

$('body').on('click', '.popup-wrapper', function(event) { stopPopup (event); });
$('body').on('click', '.popup-close', function(event) { stopPopup (event); });

$('body').on('click', '.new-article', function(event) {
	
	var href = $(this).attr('href');

	event.preventDefault();
	startPopup (event);

	$('.popup').load(href + ' main > *', function () {
		$('.popup').append('<span class="popup-close">&times;</span>')
		$('.popup form').attr('action', '/news/ajaxAdd');
		$('#article-title').focus();
	});
});
