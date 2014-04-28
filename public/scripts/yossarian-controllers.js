var ctrl = angular.module('yossarianControllers', []);

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

// CONFIG
ctrl.controller('yossarianConfig', ['$rootScope', '$http',
	function ($rootScope, $http) {

		$http.get('/config').success( function (data) { $rootScope.config = data; });
		$http.get('/user/current').success( function (data) { $rootScope.user = data; });
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

			for (i in data) {
				if(data[i].slug == activeURL) {
					var currentNav = i;
				}
			}

			$rootScope.activeNav = currentNav || 0;

		});

		$rootScope.select = function (index) {
			$rootScope.activeNav = index;
			$rootScope.subTitle = "";
		};

		$scope.yossarianSearch = function (term) {
			alert("\"" + term + "\"!? Go search for yourself!");
		};

	}
]);