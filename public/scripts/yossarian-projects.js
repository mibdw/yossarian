var ctrl = angular.module('yossarianProjects', []);

ctrl.controller('yossarianProjectIndex', ['$scope', '$rootScope', '$http', '$window',
	function ($scope, $rootScope, $http, $window) {

		$rootScope.subTitle = "";
		$scope.listCriteria = {
			'projectsActiveCategories': [],
			'projectsVisible': 10,
			'projectsSort': '-dateCreated',
			'projectsPage': 1
		};

		function newProjectList() {

			$http.post('/projects/list', $scope.listCriteria).success( function (data) {
				$scope.projectList = data;

				for (i in $scope.projectList) {
					$scope.projectList[i].dateCreatedFromNow = moment($scope.projectList[i].dateCreated, "YYYY-MM-DDTHH:mm:ssZ").fromNow();
					$scope.projectList[i].dateCreatedPretty = moment($scope.projectList[i].dateCreated, "YYYY-MM-DDTHH:mm:ssZ").format('dddd, DD MMMM YYYY HH:mm:ss');
					$scope.projectList[i].excerpt = $scope.projectList[i].description.substr(0, 300);
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
		
			var catIndex = $scope.listCriteria.projectsActiveCategories.indexOf($scope.projectCategories[index]);

			if (catIndex >= 0) {
				$scope.listCriteria.projectsActiveCategories.splice(catIndex, 1);
			} else {
				$scope.listCriteria.projectsActiveCategories.push($scope.projectCategories[index]);
			}

			$scope.listCriteria.projectsPage = 1;
			newProjectList();
		};

		$scope.projectDetail = function (index) { $window.location.href = "/#/projects/" + $scope.projectList[index].slug; };
		$scope.newProjectVisible = function () { 
			$scope.listCriteria.projectsPage = 1;
			newProjectList(); 
		};

		$scope.$watch('listCriteria.projectsPage', function() {
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

ctrl.controller('yossarianProjectDetail',  ['$scope', '$rootScope', '$http', '$window', '$routeParams', '$sce',
	function ($scope, $rootScope, $http, $window, $routeParams, $sce) {	

		$http.get('/projects/detail/' + $routeParams.projectSlug).success( function (data) {
			$scope.project = data;
			$scope.project.description = $sce.trustAsHtml($scope.project.description);
			$scope.project.dateCreatedFromNow = moment($scope.project.dateCreated, "YYYY-MM-DDTHH:mm:ssZ").fromNow();
			$scope.project.dateCreatedPretty = moment($scope.project.dateCreated, "YYYY-MM-DDTHH:mm:ssZ").format('dddd, DD MMMM YYYY HH:mm:ss');
			$scope.project.dateModifiedFromNow = moment($scope.project.dateModified, "YYYY-MM-DDTHH:mm:ssZ").fromNow();
			$scope.project.dateModifiedPretty = moment($scope.project.dateModified, "YYYY-MM-DDTHH:mm:ssZ").format('dddd, DD MMMM YYYY HH:mm:ss');
			$rootScope.subTitle = "\u00BB " + $scope.project.title;	
		});
	}
]);

ctrl.controller('yossarianProjectEdit', ['$scope', '$rootScope', '$http', '$window', '$routeParams', '$sce',
	function ($scope, $rootScope, $http, $window, $routeParams, $sce) {	

		$http.get('/projects/edit/' + $routeParams.projectSlug).success( function (data) {
			$scope.editProject = data;
			$scope.editProject.dateCreatedFromNow = moment($scope.editProject.dateCreated, "YYYY-MM-DDTHH:mm:ssZ").fromNow();
			$scope.editProject.dateCreatedPretty = moment($scope.editProject.dateCreated, "YYYY-MM-DDTHH:mm:ssZ").format('dddd, DD MMMM YYYY HH:mm:ss');
			$scope.editProject.dateModifiedFromNow = moment($scope.editProject.dateModified, "YYYY-MM-DDTHH:mm:ssZ").fromNow();
			$scope.editProject.dateModifiedPretty = moment($scope.editProject.dateModified, "YYYY-MM-DDTHH:mm:ssZ").format('dddd, DD MMMM YYYY HH:mm:ss');
			$rootScope.subTitle = "\u00BB Edit project";	
		});
		
		$http.get('/settings/categories').success( function (categories) { $scope.projectsCategories = categories.categories; });

		$scope.projectCategoryToggle = function (index) {
		
			var catIndex = $scope.editProject.category.indexOf($scope.projectsCategories[index]);
			
			if (catIndex >= 0) {
				$scope.editProject.category.splice(catIndex, 1);
			} else {
				$scope.editProject.category.push($scope.projectsCategories[index]);
			}

			var catAmount = $scope.editProject.category.length;

			if (catAmount == 0) {

				$scope.editProject.category.push('Uncategorized');

			} else if (catAmount >= 2) {

				var uncatIndex = $scope.editProject.category.indexOf('Uncategorized');
				if (uncatIndex >= 0) { $scope.editProject.category.splice(uncatIndex, 1); }
				
			}
		};

		$scope.updateProject = function () { 

			$http.post('/projects/update', $scope.editProject)
			.success(function (data) {
				$window.location.href = "/#/projects/" + data;				
			})
			.error(function () { 
				$scope.errorMessage = "Something went horribly wrong. Don't panic, contact professional help!"; 
			});
		};

		$scope.confirmDelete = function() {
			$scope.confirmMessage = "Are you sure you want to delete this project?";
		};

		$scope.deleteProject = function () { 

			$scope.confirmMessage = "";

			$http.post('/projects/delete', { 'id': $scope.editProject._id })
			.success(function (data) {
				$window.location.href = "/#/projects";
			});
		};

		$scope.previewProject = function () {

			if (!$scope.editProject.body) { $scope.errorMessage = "Preview a vaccuum? Interesting concept, but impossible." }

			$http.post('/projects/preview', {'previewBody': $scope.editProject.body})
			.success(function (data) {
				$scope.previewBody = $sce.trustAsHtml(data);
			});
		};

	}
]);
