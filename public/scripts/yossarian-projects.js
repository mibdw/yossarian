var ctrl = angular.module('yossarianProjects', []);

ctrl.controller('yossarianProjectIndex', ['$scope', '$rootScope', '$http', '$window',
	function ($scope, $rootScope, $http, $window) {

		$rootScope.subTitle = "";
		$scope.listCriteria = {
			'projectActiveCategories': [],
			'projectVisible': 10,
			'projectSort': '-dateCreated',
			'projectPage': 1
		};

		function newProjectList() {

			$http.post('/project/list', $scope.listCriteria).success( function (data) {
				$scope.projectList = data;

				for (i in $scope.projectList) {
					$scope.projectList[i].dateCreatedFromNow = moment($scope.projectList[i].dateCreated, "YYYY-MM-DDTHH:mm:ssZ").fromNow();
					$scope.projectList[i].dateCreatedPretty = moment($scope.projectList[i].dateCreated, "YYYY-MM-DDTHH:mm:ssZ").format('dddd, DD MMMM YYYY HH:mm:ss');
					$scope.projectList[i].excerpt = $scope.projectList[i].body.substr(0, 300);
					$scope.projectList[i].indexNo = i;
				}
			});
		};

		newProjectList();
		$http.get('/settings/categories').success( function (categories) { $scope.projectCategories = categories.categories; });

		app.filter('slice', function() {
			return function(arr, start, end) {
				return (arr || []).slice(start, end);
			};
		});

		$scope.projectCategoryToggle = function (index) {
		
			var catIndex = $scope.listCriteria.projectActiveCategories.indexOf($scope.projectCategories[index]);

			if (catIndex >= 0) {
				$scope.listCriteria.projectActiveCategories.splice(catIndex, 1);
			} else {
				$scope.listCriteria.projectActiveCategories.push($scope.projectCategories[index]);
			}

			$scope.listCriteria.projectPage = 1;
			newProjectList();
		};

		$scope.projectDetail = function (index) { $window.location.href = "/#/projects/" + $scope.projectList[index].slug; };
		$scope.newProjectVisible = function () { 
			$scope.listCriteria.projectPage = 1;
			newProjectList(); 
		};

		$scope.$watch('listCriteria.projectPage', function() {
			newProjectList(); 
		});
	}
]);

ctrl.controller('yossarianProjectPost', ['$scope', '$rootScope', '$http', '$window', '$sce',
	function ($scope, $rootScope, $http, $window, $sce) {

		$rootScope.subTitle = "\u00BB New project";
		$scope.newProject = {};
		$scope.newProject.category = ['Uncategorized'];

		$http.get('/settings/categories').success( function (categories) { $scope.projectCategories = categories.categories; });

		$scope.projectCategoryToggle = function (index) {
		
			var catIndex = $scope.newProject.category.indexOf($scope.projectCategories[index]);
			
			if (catIndex >= 0) {
				$scope.newProject.category.splice(catIndex, 1);
			} else {
				$scope.newProject.category.push($scope.projectCategories[index]);
			}

			var catAmount = $scope.newProject.category.length;

			if (catAmount == 0) {

				$scope.newProject.category.push('Uncategorized');

			} else if (catAmount >= 2) {

				var uncatIndex = $scope.newProject.category.indexOf('Uncategorized');
				if (uncatIndex >= 0) { $scope.newProject.category.splice(uncatIndex, 1); }
				
			}
		};

		$scope.postProject = function () {

			$http.post('/projects/post', $scope.newProject)
			.success(function (data) { 
				$window.location.href = "/#/projects/" + data; 
			})
			.error(function () { 
				$scope.errorMessage = "Something went wrong dude. Get your shit together!"; 
			});			
		};

		$scope.previewProject = function () {

			if (!$scope.newProject.body) { $scope.errorMessage = "Preview a vaccuum? Interesting concept, but impossible." }

			$http.post('/projects/preview', {'previewBody': $scope.newProject.body})
			.success(function (data) {
				$scope.previewBody = $sce.trustAsHtml(data);
			});
		};
	}
]);

ctrl.controller('yossarianProjectDetail', ['$scope', '$http', '$routeParams',
	function ($scope, $http, $routeParams) { }
]);

ctrl.controller('yossarianProjectEdit', ['$scope', '$http', '$routeParams',
	function ($scope, $http, $routeParams) { }
]);
