var ctrl = angular.module('relations', []);

ctrl.controller('relationsController', ['$scope', '$rootScope', '$routeParams', '$http', '$filter',
	function ($scope, $rootScope, $routeParams, $http, $filter) {	
		$rootScope.slug = 'relations';
		$rootScope.heading = 'Relations'; 
		$rootScope.moniker = $rootScope.heading + $rootScope.seperator + $rootScope.masthead;
	}
]);