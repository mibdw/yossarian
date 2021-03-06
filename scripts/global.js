var app = angular.module('yossarian', ['ngRoute', 'ngCookies', 'ngSanitize', 'ui.highlight', 'angularFileUpload', 'dashboard', 'docs', 'calendar', 'projects', 'contacts', 'settings']);

app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
	$routeProvider.when('/', {
		templateUrl: 'partials/dashboard/main',
		controller: 'dashboardController'
	})
	.when('/dashboard', {
		redirectTo: '/'
	})
	.when('/docs/:slug/update', {
		templateUrl: 'partials/docs/update',
		controller: 'docsUpdate'
	})
	.when('/docs/create', {
		templateUrl: 'partials/docs/create',
		controller: 'docsCreate'
	})
	.when('/docs/:slug', {
		templateUrl: 'partials/docs/main',
		controller: 'docsController'
	})
	.when('/docs', {
		templateUrl: 'partials/docs/main',
		controller: 'docsController'
	})
	.when('/calendar', {
		templateUrl: 'partials/calendar/main',
		controller: 'calendarController'
	})
	.when('/calendar/:year/:month', {
		templateUrl: 'partials/calendar/main',
		controller: 'calendarController'
	})
	.when('/projects/:slug/update', {
		templateUrl: 'partials/projects/update',
		controller: 'projectsForm'
	})
	.when('/projects/create', {
		templateUrl: 'partials/projects/create',
		controller: 'projectsForm'
	})
	.when('/projects/:slug', {
		templateUrl: 'partials/projects/detail',
		controller: 'projectsDetail'
	})
	.when('/projects', {
		templateUrl: 'partials/projects/main',
		controller: 'projectsController'
	})
	.when('/contacts', {
		templateUrl: 'partials/contacts/main',
		controller: 'contactsController'
	})
	.when('/settings/:option', {
		templateUrl: 'partials/settings/main',
		controller: 'settingsController'
	})
	.when('/settings', {
		templateUrl: 'partials/settings/main',
		controller: 'settingsController'
	})
	.otherwise({
		redirectTo: '/'
	});

	$locationProvider.html5Mode(false);
}]);

app.controller('global', ['$scope', '$rootScope', '$http',
	function ($scope, $rootScope, $http) {

		var socket = io();
		
		$rootScope.masthead = 'Yossarian';
		$rootScope.seperator = ' \u2014 ';

		$rootScope.menu = [
			{ slug: 'dashboard', name: 'Dashboard' },
			{ slug: 'docs', name: 'Knowledge base' },
			{ slug: 'calendar', name: 'Calendar' },	
			{ slug: 'projects', name: 'Projects' },
			// { slug: 'contacts', name: 'Contacts' }
		];

		$rootScope.user = {};
		$http.post('/users/user').success( function (userData) {
			$rootScope.user = userData;
		});

		$rootScope.message = {};

		$rootScope.categoryList = [];		
		$http.post('/categories/list').success( function (categoryData) {
			$rootScope.categoryList = categoryData;
		});

		$rootScope.markdownURL = 'https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet';

		$rootScope.fromNow = function (date) { 	return moment(date).fromNow(); }
		$rootScope.fromNowDays = function (date) {
			var today = moment().format();
			if (moment(date).diff(today, 'days') < 1) return 'Now'; 
			return moment(date).diff(today, 'days') + 'd'; 
		}
		$rootScope.durationDays = function (start, end) {
			if (moment(end).diff(start, 'days') < 1) return 1 + 'd';
			return moment(end).diff(start, 'days') + 1 + 'd';
		}
		$rootScope.daysFromNow = function (date) { return moment(date).fromNow('dd'); }
		$rootScope.displayDate = function (date) { return moment(date).format('DD/MM/YYYY'); }

		$rootScope.slugify = function (text) {
			return text.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
		}

		$rootScope.morphColor = function (col, amt) {
			var usePound = false;
			if (col[0] == "#") {
				col = col.slice(1);
				usePound = true;
			}
			var num = parseInt(col,16);
			var r = (num >> 16) + amt;
			if (r > 255) r = 255;
			else if  (r < 0) r = 0;
			var b = ((num >> 8) & 0x00FF) + amt;
			if (b > 255) b = 255;
			else if  (b < 0) b = 0;
			var g = (num & 0x0000FF) + amt;
			if (g > 255) g = 255;
			else if (g < 0) g = 0;
			return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
		}	
	}
]);

angular.module('ui.highlight',[]).filter('highlight', function () {
	return function (text, search, caseSensitive) {
		if (text && (search || angular.isNumber(search))) {
			text = text.toString();
			search = search.toString();
			if (caseSensitive) {
				return text.split(search).join('<mark>' + search + '</mark>');
			} else {
				return text.replace(new RegExp(search, 'gi'), '<mark>$&</mark>');
			}
		} else {
			return text;
		}
	};
});