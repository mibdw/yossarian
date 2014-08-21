var app = angular.module('yossarian', ['ngRoute', 'dashboard', 'news', 'docs', 'calendar', 'projects', 'relations', 'settings']);

app.config(['$routeProvider', function ($routeProvider) {
	$routeProvider.
		when('/', {
		templateUrl: 'partials/dashboard/main',
		controller: 'dashboardMain'
		}).
		when('/news', {
		templateUrl: 'partials/news/main',
		controller: 'newsMain'
		}).
		when('/docs', {
		templateUrl: 'partials/docs/main',
		controller: 'docsMain'
		}).
		when('/calendar', {
		templateUrl: 'partials/calendar/main',
		controller: 'calendarMain'
		}).
		when('/projects', {
		templateUrl: 'partials/projects/main',
		controller: 'projectsMain'
		}).
		when('/relations', {
		templateUrl: 'partials/relations/main',
		controller: 'relationsMain'
		}).
		when('/settings', {
		templateUrl: 'partials/settings/main',
		controller: 'settingsMain'
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
			{ slug: 'news', name: 'News' },
			{ slug: 'docs', name: 'Documents' },
			{ slug: 'calendar', name: 'Calendar' },
			{ slug: 'projects', name: 'Projects' },
			{ slug: 'relations', name: 'Relations' },
			{ slug: 'settings', name: 'Settings' }
		];
	}
]);