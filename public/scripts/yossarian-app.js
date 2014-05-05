var app = angular.module('yossarianApp', ['ngRoute', 'ngAnimate', 'yossarianControllers', 'yossarianArticles', 'yossarianDocs', 'yossarianCalendar', 'yossarianProjects', 'yossarianSettings']);

app.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider
			.when('/' , { 
				templateUrl: '/partials/dashboard/index' 
			}) // NEWS
			.when('/news', { 						
				templateUrl: '/partials/news/index',
				controller: 'yossarianArticleIndex'
			})
			.when('/news/add', {
				templateUrl: '/partials/news/add',
				controller: 'yossarianArticlePost'
			})
			.when('/news/categories', {
				templateUrl: '/partials/news/categories',
				controller: 'yossarianArticleCategories'
			})
			.when('/news/:articleSlug', {
				templateUrl: '/partials/news/detail',
				controller: 'yossarianArticleDetail'
			})
			.when('/news/:articleSlug/edit', {
				templateUrl: '/partials/news/edit',
				controller: 'yossarianArticleEdit'
			})
			.when('/docs', {						// DOCUMENTS
				redirectTo: '/docs/overview' 
			})
			.when('/docs/add', {
				templateUrl: '/partials/docs/add',
				controller: 'yossarianDocPost'
			})
			.when('/docs/:subdoc', { 
				templateUrl: '/partials/docs/index', 
				controller: 'yossarianDocIndex' 
			})
			.when('/docs/:subdoc/edit', { 
				templateUrl: '/partials/docs/edit', 
				controller: 'yossarianDocEdit' 
			})
			.when('/docs/:subdoc/:subsubdoc', { 
				templateUrl: '/partials/docs/index', 
				controller: 'yossarianDocIndex' 
			})
			.when('/docs/:subdoc/:subsubdoc/edit', { 
				templateUrl: '/partials/docs/edit', 
				controller: 'yossarianDocEdit' 
			})
			.when('/calendar', { 					// CALENDAR
				templateUrl: '/partials/calendar/index', 
				controller: 'yossarianCalendarEvents'  
			})
			.when('/projects', { 					// PROJECTS
				templateUrl: '/partials/projects/index', 
				controller: 'yossarianProjectsIndex'  
			})
			.when('/settings', {					// SETTINGS 
				templateUrl: '/partials/settings/index',
				controller: 'yossarianSettingsIndex'  
			})
			.when('/profile', { 
				templateUrl: '/partials/user/profile' 
			})
			.otherwise({ redirectTo: '/' });
	}
]);