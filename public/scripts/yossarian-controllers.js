var ctrl = angular.module('yossarianControllers', []);

ctrl.controller('yossarianConfig', ['$scope', '$rootScope', '$http',
	function ($scope, $rootScope, $http) {

		$http.get('/config').success(function(data) {
			$rootScope.config = data;
		});

		$http.get('/username').success(function(data) {
			$rootScope.username = data;
		});

		var activeURL = window.location.pathname.substr(1);		
		if (activeURL.indexOf('/') > -1) {
			var activeURL = activeURL.substr(0, activeURL.indexOf('/'));
		}

		$rootScope.currentRoute = activeURL || 'dashboard';
	}
]);

ctrl.controller('yossarianNav', ['$scope', '$http',
	function ($scope, $http) {

		$http.get('/navigation').success(function(data) {
			$scope.navigation = data;
		});

		$scope.activeNav = 0;

		$scope.select = function (index) {
			$scope.activeNav = index; 
		};

	}
]);