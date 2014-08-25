var app = angular.module('yossarian', ['ngRoute', 'dashboard', 'docs', 'calendar', 'projects', 'relations', 'settings']);

app.config(['$routeProvider', function ($routeProvider) {
	$routeProvider.
		when('/', {
		templateUrl: 'partials/dashboard/main',
		controller: 'dashboardController'
		}).
		when('/docs/:slug/update', {
		templateUrl: 'partials/docs/update',
		controller: 'docsController'
		}).
		when('/docs/create', {
		templateUrl: 'partials/docs/create',
		controller: 'docsController'
		}).
		when('/docs/:slug', {
		templateUrl: 'partials/docs/detail',
		controller: 'docsController'
		}).
		when('/docs', {
		templateUrl: 'partials/docs/main',
		controller: 'docsController'
		}).
		when('/calendar', {
		templateUrl: 'partials/calendar/main',
		controller: 'calendarController'
		}).
		when('/projects/:slug/update', {
		templateUrl: 'partials/projects/update',
		controller: 'projectsController'
		}).
		when('/projects/create', {
		templateUrl: 'partials/projects/create',
		controller: 'projectsController'
		}).
		when('/projects/:slug', {
		templateUrl: 'partials/projects/detail',
		controller: 'projectsController'
		}).
		when('/projects', {
		templateUrl: 'partials/projects/main',
		controller: 'projectsController'
		}).
		when('/relations', {
		templateUrl: 'partials/relations/main',
		controller: 'relationsController'
		}).
		when('/settings/:option', {
		templateUrl: 'partials/settings/main',
		controller: 'settingsController'
		}).
		when('/settings', {
		templateUrl: 'partials/settings/main',
		controller: 'settingsController'
		}).
		otherwise({
		redirectTo: '/'
		});
}]);

app.controller('global', ['$scope', '$rootScope', '$http',
	function ($scope, $rootScope, $http) {
		
		$rootScope.masthead = 'Yossarian';
		$rootScope.seperator = ' \u2014 ';

		$rootScope.menu = [
			{ slug: 'docs', name: 'Documents' },
			{ slug: 'calendar', name: 'Calendar' },	
			{ slug: 'projects', name: 'Projects' },
			{ slug: 'relations', name: 'Relations' },
			{ slug: 'settings', name: 'Settings' }
		];

		$rootScope.categoryList = []
		
		$http.post('/categories/list').success( function (categoryData) {
			$rootScope.categoryList = categoryData;
		});
	}
]);