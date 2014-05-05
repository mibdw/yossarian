var ctrl = angular.module('yossarianSettings', []);

ctrl.controller('yossarianSettingsIndex', ['$scope', '$rootScope', '$http', '$window',
	function ($scope, $rootScope, $http, $window) {	

		$rootScope.subTitle = "";

		$http.get('/settings/categories').success( function (categories) { 
			$scope.categoryList = categories.categories; 
		});

		$scope.deleteCategory = function (category) {

			if (category == "Uncategorized") {

				$scope.errorMessage = 'Pardon me, but I cannot let you do that!';

			} else {

				$http.post('/settings/categories/delete', {'deleteCategory': category })
				.success( function (categories) {
					$scope.categoryList = categories.categories;
					$scope.newCategory = "";
				});
			}
		};

		$scope.addCategory = function () {

			var catIndex = $scope.categoryList.indexOf($scope.newCategory);

			if (catIndex >= 0) {

				$scope.errorMessage = 'That category already exists';

			} else {

				$http.post('/settings/categories/add', {'newCategory': $scope.newCategory})
				.success( function (categories) {
					$scope.categoryList = categories.categories;
					$scope.newCategory = "";
				});
			}
		};

		$http.get('/settings/users').success( function (users) { 
			$scope.userList = users; 
		});

		$scope.addUser = function () {

			$http.post('/settings/users/add', $scope.newUser)
			.success( function (users) {
				$scope.userList = users; 
				$scope.newUser = {};
			});

		};
	}
]);