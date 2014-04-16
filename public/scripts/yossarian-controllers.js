var ctrl = angular.module('yossarianControllers', []);

// CONFIG
ctrl.controller('yossarianConfig', ['$rootScope', '$http',
	function ($rootScope, $http) {

		$http.get('/config').success( function (data) {
			$rootScope.config = data;
		});

		$http.get('/username').success( function (data) {
			$rootScope.user = data;
		});

		var activeURL = window.location.pathname.substr(1);	
		if (activeURL.indexOf('/') > -1) {
			var activeURL = activeURL.substr(0, activeURL.indexOf('/'));
		}

		$rootScope.currentRoute = activeURL || 'dashboard';
	}
]);

ctrl.controller('yossarianAlert', ['$scope', 
	function ($scope) {

		$scope.alertClose = true;
	}
]);

// NAVIGATION
ctrl.controller('yossarianNav', ['$scope', '$http',
	function ($scope, $http) {

		$http.get('/navigation').success( function (data) {
			$scope.navigation = data;
		});

		$scope.activeNav = 0;

		$scope.select = function (index) {
			$scope.activeNav = index; 
		};
	}
]);

ctrl.controller('yossarianAuth', ['$scope', '$http', '$window',
	function ($scope, $http, $window) {

		$scope.credentials = {};

		$scope.yossarianLogin = function () {
			$http
			.post('/ajaxLogin', $scope.credentials)
			.success( function (data) {
				if (data.success) {
					$window.location.href = '/';
				} else if (data.failure) {

					$scope.errorMessage = data.failure;

				} else {

					$scope.errorMessage = "Oh boy, something's horribly wrong. Keep calm and contact the authorities."
				}
			});
		}
	}
]);