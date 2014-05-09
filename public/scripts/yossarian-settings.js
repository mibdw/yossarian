var ctrl = angular.module('yossarianSettings', []);

ctrl.controller('yossarianSettingsIndex', ['$scope', '$rootScope', '$http', '$window',
	function ($scope, $rootScope, $http, $window) {	

		$scope.settings = [
			{ name: 'Users', slug: 'users', url: '/partials/settings/users' },
			{ name: 'Categories', slug: 'categories', url: '/partials/settings/categories' },
		];
		$scope.currentSetting = $scope.settings[0];

		$scope.switchSetting = function (index) {
			$scope.currentSetting = $scope.settings[index];
		};

		$http.get('/settings/categories').success( function (categories) { 
			$scope.categoryList = categories.categories; 
		});
	}
]);

ctrl.controller('yossarianSettingsCategories', ['$scope', '$rootScope', '$http', '$window',
	function ($scope, $rootScope, $http, $window) {	

		$rootScope.subTitle = "\u00BB Categories";

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
	}
]);

ctrl.controller('yossarianSettingsUsers', ['$scope', '$rootScope', '$http', '$window',
	function ($scope, $rootScope, $http, $window) {	

		$rootScope.subTitle = "\u00BB Users";

		$http.get('/settings/users').success( function (users) { 
			$scope.userList = users;

			for (i in $scope.userList) {
				$scope.userList[i].dateCreatedFromNow = moment($scope.userList[i].dateCreated, "YYYY-MM-DDTHH:mm:ssZ").fromNow();
				$scope.userList[i].userIndex = i;
			} 
		});

		$scope.addUser = function () {

			if (!$scope.newUser.password || !$scope.newUser.email || !$scope.newUser.name.last || !$scope.newUser.name.first) {

				$scope.errorMessage = "We cannot continue untill you have filled out every single field in the form. Understand?";

			} else {

				$http.post('/settings/users/add', $scope.newUser)
				.success( function (users) {
					$scope.userList = users; 

					for (i in $scope.userList) {
						$scope.userList[i].dateCreatedFromNow = moment($scope.userList[i].dateCreated, "YYYY-MM-DDTHH:mm:ssZ").fromNow();
						$scope.userList[i].userIndex = i;
					} 
					
					$scope.newUser = {};
				});

			}

		};

		$scope.modifyUser = function (index) { $scope.editUser = $scope.userList[index]; };

		$scope.updateUser = function () {
		 	
		 	$http.post('/settings/users/update', $scope.editUser)
			.success( function (users) {
				$scope.userList = users; 

				for (i in $scope.userList) {
					$scope.userList[i].dateCreatedFromNow = moment($scope.userList[i].dateCreated, "YYYY-MM-DDTHH:mm:ssZ").fromNow();
					$scope.userList[i].userIndex = i;
				} 
				
				$scope.newUser = "";
				$scope.editUser = "";
			});
		};

		$scope.confirmDelete = function(index) {
				
			$scope.newUser = "";
			$scope.editUser = "";

			if ($scope.user._id == $scope.userList[index]._id) {

				$scope.errorMessage = "Step of the ledge bro. You cannot delete yourself!";

			} else {

				$scope.deleteUserId = $scope.userList[index]._id;
				$scope.confirmMessage = "Are you sure you want to exterminate "+ $scope.userList[index].name.first + "?";	
			}

		};

		$scope.deleteUser = function() {

			$http.post('/settings/users/delete', { 'deleteId': $scope.deleteUserId })
			.success( function (users) {
				$scope.userList = users; 

				for (i in $scope.userList) {
					$scope.userList[i].dateCreatedFromNow = moment($scope.userList[i].dateCreated, "YYYY-MM-DDTHH:mm:ssZ").fromNow();
					$scope.userList[i].userIndex = i;
				} 
				
				$scope.confirmMessage = "";
				$scope.newUser = "";
				$scope.editUser = "";
			});
		};
	}
]);