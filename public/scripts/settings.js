var ctrl = angular.module('settings', []);

ctrl.controller('settingsController', ['$scope', '$rootScope', '$routeParams', '$http', '$filter',
	function ($scope, $rootScope, $routeParams, $http, $filter) {	
		$rootScope.slug = 'settings';
		$rootScope.heading = 'Settings'; 
		$rootScope.moniker = $rootScope.heading + $rootScope.seperator + $rootScope.masthead;

		$scope.settings = [
			{ name: 'Profile', slug: 'profile', url: '/partials/settings/profile'},
			{ name: 'Users', slug: 'users', url: '/partials/settings/users'},
			{ name: 'Categories', slug: 'categories', url: '/partials/settings/categories'}
		];
		
		if ($routeParams.option) {
			$scope.currentSetting = $routeParams.option;

			for (i in $scope.settings) {
				if ($scope.settings[i].slug == $routeParams.option) {
					$scope.currentURL = $scope.settings[i].url;
				}
			}
		} else {
			$scope.currentSetting = $scope.settings[0].slug;
			$scope.currentURL = $scope.settings[0].url;
		}


		$scope.createCategory = function () {
			alert('What!');	
		}

		$(document).on('focusin', '.color', function () {
			alert('CONGO')
		});
	}
]);