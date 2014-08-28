var ctrl = angular.module('settings', []);

ctrl.controller('settingsController', ['$scope', '$rootScope', '$routeParams', '$http', '$filter',
	function ($scope, $rootScope, $routeParams, $http, $filter) {	
		$rootScope.slug = 'settings';

		$scope.settings = [
			{ name: 'Profile', slug: 'profile', url: '/partials/settings/profile' },
			{ name: 'Users', slug: 'users', url: '/partials/settings/users' },
			{ name: 'Structure', slug: 'structure', url: '/partials/settings/structure' },
			{ name: 'Categories', slug: 'categories', url: '/partials/settings/categories' }
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
	}
]);

ctrl.controller('settingsCategories', ['$scope', '$rootScope', '$routeParams', '$http', '$filter',
	function ($scope, $rootScope, $routeParams, $http, $filter) {	

		$scope.newCategory = {};
		$scope.createCategory = function () {
			
			if (!$scope.newCategory.name) {
				alert('Please fill out a name');
			} else if (!$scope.newCategory.color) {
				alert('Please choose a color');
			} else {

				$scope.newCategory.slug = $rootScope.slugify($scope.newCategory.name);
				$http.post('/categories/create', $scope.newCategory).success( function (data) {

					$http.post('/categories/list').success( function (categoryData) {
						$rootScope.categoryList = categoryData;
						$scope.newCategory = {}; 
					});	
				});
			}
		};

		$scope.updateCategory = function (index) {
			 $rootScope.categoryList[index].slug = $rootScope.slugify( $rootScope.categoryList[index].name);
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

ctrl.controller('settingsUsers', ['$scope', '$rootScope', '$routeParams', '$http', '$filter',
	function ($scope, $rootScope, $routeParams, $http, $filter) {	
		$rootScope.datePicker();
		$scope.userView = 'create';
		$scope.userList = [];
		
		$http.post('/users/list').success( function (userData) {
			$scope.userList = userData;

			$scope.userLimit = 8;
			$scope.userOffset = 0;
			$scope.userPages = Math.ceil($scope.userList.length / $scope.userLimit);
		});

		$scope.newUser = {
			role: 'user',
			department: 'management',
			active: true
		};

		$scope.passwordMatch = true;
		$scope.passwordCheck = function () {
			if ($scope.userView == 'create') {
				if ($scope.newUser.password != $scope.newUser.confirm) {
					$scope.passwordMatch = false;
				} else if ($scope.newUser.password == $scope.newUser.confirm) {
					$scope.passwordMatch = true;
				}	
			} else if ($scope.userView == 'update') {
				if ($scope.editUser.password != $scope.editUser.confirm) {
					$scope.passwordMatch = false;
				} else if ($scope.editUser.password == $scope.editUser.confirm) {
					$scope.passwordMatch = true;
				}
			}
		};

		$scope.createUser = function () {
			if ($scope.newUser.password != $scope.newUser.confirm) {
				alert("Your passwords do not match, please retry")
			} else {
				var username = $scope.newUser.name.first + " " + $scope.newUser.name.last;

				$scope.newUser.username = $rootScope.slugify(username);
				$scope.newUser.birthday = moment($scope.newUser.birthday, "DD-MM-YYYY");
				$scope.newUser.postDate = moment();
				$http.post('/users/create', $scope.newUser).success( function (data) {
					window.location.reload();	
				});
			}
		};

		$scope.userEditor = function (id) {
			if ($scope.userView == 'create') {
				$scope.userView = 'update';
				$http.post('/users/detail', { _id: id}).success( function (userData) {
					$scope.editUser = userData; 
					$scope.editUser.birthday = moment($scope.editUser.birthday).format('DD-MM-YYYY');
				});	
			} else if ($scope.userView == 'update' && id != $scope.editUser._id) {
				$http.post('/users/detail', { _id: id}).success( function (userData) {
					$scope.editUser = userData; 
					$scope.editUser.birthday = moment($scope.editUser.birthday).format('DD-MM-YYYY');
				});	
			} else {
				$scope.userView = 'create';
				$scope.editUser = {};
			}
		};

		$scope.updateUser = function () {
			if ($scope.editUser.password != $scope.editUser.confirm) {
				alert("Your passwords do not match, please retry")
			} else {
				var username = $scope.editUser.name.first + " " + $scope.editUser.name.last;

				$scope.editUser.username = $rootScope.slugify(username);
				$scope.editUser.birthday = moment($scope.editUser.birthday, "DD-MM-YYYY");
				$scope.editUser.editDate = moment();
				$http.post('/users/update', $scope.editUser).success( function (data) {
					window.location.reload();
				});
			}
		};

		$scope.removeUser = function () {
			if (confirm('Are you sure you want to remove this user?') == true) {
				$http.post('/users/remove', { remove: $scope.editUser._id }).success( function (data) {
					window.location.reload();	
				});
			}
		};

		$scope.closeUpdateUser = function () {
			$scope.userView = 'create';
			$scope.editUser = {}; 
		};
	}
]);