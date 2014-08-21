var ctrl = angular.module('dashboard', []);

ctrl.controller('dashboardMain', ['$scope', '$rootScope', '$routeParams', '$http', '$filter',
	function ($scope, $rootScope, $routeParams, $http, $filter) {	
		$rootScope.slug = 'dashboard';
		$rootScope.heading = 'Dashboard';
		$rootScope.moniker = $rootScope.heading + $rootScope.seperator + $rootScope.masthead;
	}
]);