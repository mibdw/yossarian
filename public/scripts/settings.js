var ctrl = angular.module('settings', []);

ctrl.controller('settingsController', ['$scope', '$rootScope', '$routeParams', '$http', '$filter',
	function ($scope, $rootScope, $routeParams, $http, $filter) {	
		$rootScope.slug = 'settings';

		$scope.settings = [
			{ name: 'Profile', slug: 'profile', url: '/partials/settings/profile' },
			{ name: 'Users', slug: 'users', url: '/partials/settings/users' },
			{ name: 'Roles', slug: 'roles', url: '/partials/settings/roles' },
			{ name: 'Categories', slug: 'categories', url: '/partials/settings/categories' },
			{ name: 'Departments', slug: 'departments', url: '/partials/settings/departments' }
		];
		
		if ($routeParams.option) {
			$scope.currentSetting = $routeParams.option;

			for (i in $scope.settings) {
				if ($scope.settings[i].slug == $routeParams.option) {
					$scope.currentURL = $scope.settings[i].url;
					$rootScope.heading = 'Settings \u00BB ' + $scope.settings[i].name; 
				}
			}
		} else {
			$scope.currentSetting = $scope.settings[0].slug;
			$scope.currentURL = $scope.settings[0].url;
			$rootScope.heading = 'Settings \u00BB ' + $scope.settings[0].name
		}

		$rootScope.moniker = $rootScope.heading + $rootScope.seperator + $rootScope.masthead;

		$scope.newCategory = {};

		$scope.createCategory = function () {
			
			if (!$scope.newCategory.name) {
				alert('Please fill out a name');
			} else if (!$scope.newCategory.color) {
				alert('Please choose a color');
			} else {
				$http.post('/categories/create', $scope.newCategory).success( function (data) {

					$http.post('/categories/list').success( function (categoryData) {
						$rootScope.categoryList = categoryData;
						$scope.newCategory = {}; 
					});	
				});
			}
		};

		$scope.updateCategory = function (index) {
			$http.post('/categories/update', $rootScope.categoryList[index]);
		};

		$scope.redirectCategory = { from: 0, to: 0 };

		$scope.removeCategory = function () {
			if ($scope.redirectCategory.to == 0) {
				alert('Please choose redirect category');
			} else {
				$http.post('/categories/remove', $scope.redirectCategory).success( function (data) {
						
					$http.post('/categories/list').success( function (categoryData) {
						$rootScope.categoryList = categoryData;
						$scope.redirectCategory = { from: 0, to: 0 }; 
					});
				});
			}			
		};
	}
]);