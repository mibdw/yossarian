var ctrl = angular.module('calendar', []);

ctrl.controller('calendarController', ['$scope', '$rootScope', '$routeParams', '$http', '$filter',
	function ($scope, $rootScope, $routeParams, $http, $filter) {	
		$rootScope.slug = 'calendar';
		$rootScope.heading = 'Calendar'; 
		$rootScope.moniker = $rootScope.heading + $rootScope.seperator + $rootScope.masthead;
	}
]);