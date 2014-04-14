var app = angular.module('yossarianApp', []);

app.controller('yossarianNav', 
	function ($scope, $http) {

		$http.get('/config').success(function(data) {
			$scope.config = data;
		});

		var activeURL = window.location.pathname.substr(1);
		
		if (activeURL.indexOf('/') > -1) {
			var activeURL = activeURL.substr(0, activeURL.indexOf('/'));
		}

		$scope.currentRoute = activeURL || 'dashboard';
	}
);