var app = angular.module('yossarianApp', ['ngRoute', 'ngAnimate', 'yossarianControllers', 'yossarianArticles', 'yossarianDocs', 'yossarianCalendar', 'yossarianProjects', 'yossarianSettings']);

app.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider
			.when('/' , { 
				templateUrl: '/partials/dashboard/index' 
			}) // =========================================== >>> NEWS
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
			}) // =========================================== >>> DOCS
			.when('/docs', {
				redirectTo: '/docs/overview' 
			})
			.when('/docs/add', {
				templateUrl: '/partials/docs/add',
				controller: 'yossarianDocPost'
			})
			.when('/docs/:docSlug', { 
				templateUrl: '/partials/docs/index', 
				controller: 'yossarianDocIndex' 
			})
			.when('/docs/:docSlug/edit', { 
				templateUrl: '/partials/docs/edit', 
				controller: 'yossarianDocEdit' 
			})
			.when('/docs/:docSlug/:subdocSlug', { 
				templateUrl: '/partials/docs/index', 
				controller: 'yossarianDocIndex' 
			})
			.when('/docs/:docSlug/:subdocSlug/edit', { 
				templateUrl: '/partials/docs/edit', 
				controller: 'yossarianDocEdit' 
			}) // =========================================== >>> CALENDAR
			.when('/calendar', {
				templateUrl: '/partials/calendar/index', 
				controller: 'yossarianCalendarEvents'  
			}) // =========================================== >>> PROJECTS
			.when('/projects', {
				templateUrl: '/partials/projects/index', 
				controller: 'yossarianProjectIndex'  
			})
			.when('/projects/add', {
				templateUrl: '/partials/projects/add', 
				controller: 'yossarianProjectPost'  
			})
			.when('/projects/:projectSlug', {
				templateUrl: '/partials/projects/detail', 
				controller: 'yossarianProjectDetail'  
			})
			.when('/projects/:projectSlug/edit', {
				templateUrl: '/partials/projects/edit', 
				controller: 'yossarianProjectEdit'  
			}) // =========================================== >>> SETTINGS
			.when('/settings', {
				templateUrl: '/partials/settings/index',
				controller: 'yossarianSettingsIndex'  
			})
			.when('/profile', { 
				templateUrl: '/partials/user/profile' 
			})
			.otherwise({ redirectTo: '/' });
	}
]);