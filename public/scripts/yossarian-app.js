var app = angular.module('yossarianApp', ['ngRoute', 'ngAnimate', 'yossarianControllers', 'yossarianNews', 'yossarianDocs']);

app.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider
			.when('/' , { 
				templateUrl: '/partials/dashboard/index' 
			})
			.when('/news', { 						// NEWS
				templateUrl: '/partials/news/index',
				controller: 'yossarianNews'
			})
			.when('/news/add', {
				templateUrl: '/partials/news/add',
				controller: 'yossarianNews'
			})
			.when('/news/:article', {
				templateUrl: '/partials/news/detail',
				controller: 'yossarianNews'
			})
			.when('/news/:article/edit', {
				templateUrl: '/partials/news/edit',
				controller: 'yossarianNews'
			})
			.when('/docs', {						// DOCUMENTS
				redirectTo: '/docs/overview' 
			})
			.when('/docs/add', {
				templateUrl: '/partials/docs/add',
				controller: 'yossarianPostdoc'
			})
			.when('/docs/:subdoc', { 
				templateUrl: '/partials/docs/index', 
				controller: 'yossarianDocs' 
			})
			.when('/docs/:subdoc/edit', { 
				templateUrl: '/partials/docs/edit', 
				controller: 'yossarianEditdoc' 
			})
			.when('/docs/:subdoc/:subsubdoc', { 
				templateUrl: '/partials/docs/index', 
				controller: 'yossarianDocs' 
			})
			.when('/docs/:subdoc/:subsubdoc/edit', { 
				templateUrl: '/partials/docs/edit', 
				controller: 'yossarianEditdoc' 
			})
			.when('/calendar', { 					// CALENDAR
				templateUrl: '/partials/calendar/index' 
			})
			.when('/projects', { 					// PROJECTS
				templateUrl: '/partials/projects/index' 
			})
			.when('/settings', {					// SETTINGS 
				templateUrl: '/partials/settings/index' 
			})
			.when('/profile', { 
				templateUrl: '/partials/user/profile' 
			})
			.otherwise({ redirectTo: '/' });
	}
]);