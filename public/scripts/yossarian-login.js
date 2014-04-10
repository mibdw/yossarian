if ($('body').hasClass('auth')) {

	var login_height = $('.login').height();
	var margin_correction = '-' + login_height / 2 + 'px';

	$('.login').css('margin-top', margin_correction);
}

$('body').on('click', '.login-form button[type="submit"]', function(event) {

	event.preventDefault();

	$('.alert').fadeOut(100);
	$('.alert').remove();

	$('.login').addClass('loading');

	$.ajax({
		type: 'POST',
		url: '/ajaxLogin',
		dataType: 'json',
		data: { 
			'username': $('.login-username').val(),
			'password': $('.login-password').val()
		},

		success: function (data) {

			if (data.success) {

				$.get("/", function(contents) {

					var body_contents = contents.split('<body>');
					$('body').append(body_contents[1]);

					$('.login-top, .login-bottom').addClass('active');
					$('.login').fadeOut(500);

					setTimeout( function() {
						$('.login-top, .login-bottom, .login, .login-scripts').remove();
						$('body').removeClass('auth');
					}, 3000);

					window.history.pushState({}, '', '/');
					document.title = 'Yossarian \u2014 Dashboard';
					$('.header-nav #dashboard, footer #dashboard').addClass('active');

				});
				
			} else if (data.failure) {

				$('body').append('<div class="alert" style="display: none;">' + data.failure + '<span class="close">&times;</span></div>');
				$('.alert').fadeIn(200);
				$('.login').removeClass('loading');

			} else {

				$('body').append('<div class="alert" style="display: none;">I\'m not sure what\'s going on!<span class="close">&times;</span></div>');
				$('.alert').fadeIn(200);
				$('.login').removeClass('loading');
			}	
		},

		error: function() {
			$('body').append('<div class="alert">Something is horribly wrong. Please contact the authorities!<span class="close">&times;</span></div>');

			$('.login-form button[type="submit"]').html('Login');
		},
	});
});