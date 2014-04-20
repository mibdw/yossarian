var app = angular.module('yossarianApp', ['ngRoute', 'yossarianControllers']);

app.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider
			.when('/' , { 
				templateUrl: '/partials/dashboard' 
			})
			.when('/news', { 
				templateUrl: '/partials/news' 
			})

			//DOCS
			.when('/docs', { 
				redirectTo: '/docs/overview' 
			})
			.when('/docs/add', { 
				templateUrl: '/partials/docs/add', 
				controller: 'yossarianDocs' 
			})
			.when('/docs/:subdoc', { 
				templateUrl: '/partials/docs/index', 
				controller: 'yossarianDocs' 
			})
			.when('/docs/:subdoc/:subsubdoc', { 
				templateUrl: '/partials/docs/index', 
				controller: 'yossarianDocs' 
			})

			//CALENDAR
			.when('/calendar', { 
				templateUrl: '/partials/calendar' 
			})
			.when('/projects', { 
				templateUrl: '/partials/projects' 
			})
			.when('/settings', { 
				templateUrl: '/partials/settings' 
			})
			.when('/profile', { 
				templateUrl: '/partials/profile' 
			})
			.otherwise({ redirectTo: '/' });
	}
]);