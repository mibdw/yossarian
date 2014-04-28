var ctrl = angular.module('yossarianNews', []);

// NEWS
ctrl.controller('yossarianNews', ['$scope', '$rootScope',
	function ($scope, $rootScope) {	

		$scope.articleDetail = function () {
			alert("Let's go to the article!");
		};
	}
]);