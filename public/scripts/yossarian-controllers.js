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
	}
]);

// NAVIGATION
ctrl.controller('yossarianNav', ['$scope', '$rootScope', '$http',
	function ($scope, $rootScope, $http) {

		$http.get('/navigation').success( function (data) {
			$rootScope.navigation = data;

			var activeURL = document.URL.substr(document.URL.indexOf('#')+2);

			if (activeURL.indexOf('/') > -1) {
				var activeURL = activeURL.substr(0, activeURL.indexOf('/'));
			}

			var currentNav;

			for (i in data) {
				if(data[i].slug == activeURL) {
					currentNav = i;
				}
			}

			$rootScope.activeNav = currentNav || 0;
		});

		$rootScope.select = function (index) {
			$rootScope.activeNav = index;
			
		};

	}
]);

// ALERT
ctrl.controller('yossarianAlert', ['$scope', 
	function ($scope) {

		$scope.alertClose = true;
	}
]);

// AUTHORIZATION
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