var app = angular.module('yossarianApp', []);

app.controller('yossarianConfig', ['$scope', '$http',
	function ($scope, $http) {

		$http.get('/config').success(function(data) {
			$scope.config = data;
		});

		$http.get('/username').success(function(data) {
			$scope.username = data;
		});

		var activeURL = window.location.pathname.substr(1);		
		if (activeURL.indexOf('/') > -1) {
			var activeURL = activeURL.substr(0, activeURL.indexOf('/'));
		}
		$scope.currentRoute = activeURL || 'dashboard';
	}
]);