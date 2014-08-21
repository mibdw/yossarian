var ctrl = angular.module('projects', []);

ctrl.controller('projectsMain', ['$scope', '$rootScope', '$routeParams', '$http', '$filter',
	function ($scope, $rootScope, $routeParams, $http, $filter) {
		$rootScope.slug = 'projects';
		$rootScope.heading = 'Projects'; 
		$rootScope.moniker = $rootScope.heading + $rootScope.seperator + $rootScope.masthead;
	}
]);