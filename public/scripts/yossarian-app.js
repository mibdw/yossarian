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
			.when('/docs', { 
				redirectTo: '/docs/overview' 
			})
			.when('/docs/:subdoc', { 
				templateUrl: '/partials/docs', 
				controller: 'yossarianDocs' 
			})
			.when('/docs/:subdoc/:subsubdoc', { 
				templateUrl: '/partials/docs', 
				controller: 'yossarianDocs' 
			})
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