var ctrl = angular.module('projects', []);

ctrl.controller('projectsController', ['$scope', '$rootScope', '$http',
	function ($scope, $rootScope, $http) {
		$rootScope.slug = 'projects';
		$rootScope.heading = 'Projects'; 
		$rootScope.moniker = $rootScope.heading + $rootScope.seperator + $rootScope.masthead;

		$scope.visibleProjects = 'open';

		$scope.getProjects = function () {
			$scope.projectList = [];
			$http.post('/projects/list').success(function (projectData) {
				$scope.projectList = projectData;

				for (i in $scope.projectList) {
					if (moment($scope.projectList[i].start).isAfter()) {
						$scope.projectList[i].time = "Project starts " + moment($scope.projectList[i].start).fromNow();
					} else if (moment($scope.projectList[i].start).isBefore() && moment($scope.projectList[i].end).isAfter()) {
						$scope.projectList[i].time = "Project ends " + moment($scope.projectList[i].end).fromNow();
					} else if (moment($scope.projectList[i].end).isBefore()) {
						$scope.projectList[i].time = "Project ended " + moment($scope.projectList[i].end).fromNow();
					}

					if ($scope.projectList[i].description.length > 400) $scope.projectList[i].description = $scope.projectList[i].description.substring(0, 399) + "...";

					$scope.projectList[i].completedTasks = 0;
					for (j in $scope.projectList[i].tasks) {

						if ($scope.projectList[i].tasks[j].completed == true) $scope.projectList[i].completedTasks = $scope.projectList[i].completedTasks + 1;
					}
				}
			});
		}
		$scope.getProjects();
	}
]);

ctrl.controller('projectsCreate', ['$scope', '$rootScope', '$http',
	function ($scope, $rootScope, $http) {
		$rootScope.slug = 'projects';
		$rootScope.heading = 'Create project'; 
		$rootScope.moniker = $rootScope.heading + $rootScope.seperator + $rootScope.masthead;

		$scope.userList = [];
		$http.post('/users/list').success( function (userData) {
			$scope.userList = userData;
		});

		$scope.initProject = function () {
			$scope.newProject = {
				categories: [],
				participants: [],
				tasks: []
			}
		}
		$scope.initProject();

		$scope.addParticipant =  function (person) {
			$scope.userSearch = '';
			if ($scope.newProject.participants.length == 0) {
				$scope.newProject.owner = person._id;
			}
			$scope.newProject.participants.push(person);
		}

		$scope.addParticipantKeydown =  function ($event, index, person) {
			if ($event.keyCode == 13) {
				$scope.userSearch = '';
				if ($scope.newProject.participants.length == 0) {
					$scope.newProject.owner = person._id;
				}
				$scope.newProject.participants.push(person);
			}	
		}

		$scope.removeParticipant = function (index) {
			if ($scope.newProject.participants[index]._id == $scope.newProject.owner) {
				$scope.newProject.participants.splice(index, 1);
				if ($scope.newProject.participants.length == 0) {
					$scope.newProject.owner = '';
				} else {
					$scope.newProject.owner = $scope.newProject.participants[0]._id;
				}
			} else {
				$scope.newProject.participants.splice(index, 1);
			}
		}

		$scope.categoryToggle = function (id) {
			if ($scope.newProject.categories.indexOf(id) > -1) {
				var index = $scope.newProject.categories.indexOf(id);
				$scope.newProject.categories.splice(index, 1);
			} else if ($scope.newProject.categories.indexOf(id) == -1) {
				$scope.newProject.categories.push(id);
			}
		}

		$('#start').datepicker({
			dateFormat: 'dd-mm-yy',
			beforeShow: function (input, inst) {
				$('#ui-datepicker-div').addClass('right');
			},
			onClose: function (selectedDate) {
				$('#end').datepicker('option', 'minDate', selectedDate);
			}
		});

		$('#end').datepicker({
			dateFormat: 'dd-mm-yy',
			beforeShow: function (input, inst) {
				$('#ui-datepicker-div').addClass('right');
			},
			onClose: function (selectedDate) {
				$('#start').datepicker('option', 'maxDate', selectedDate);
			}
		});

		$scope.initTask = function () {
			$scope.newTask = {
				priority: 2,
				participants: []
			}
			$scope.updatingTask = 'none';
		}
		$scope.initTask();

		$scope.addTask = function () {
			if (!$scope.newTask.title) {
				alert('Please give this task a title');
				$('#task-title').focus();
			} else if (!$scope.newTask.description) {
				alert('Please give this task a description');
				$('#task-description').focus();
			} else {
				$scope.newTask.author = $scope.user._id;
				$scope.newTask.postDate = moment();
				$http.post('/marked', {'text': $scope.newTask.description}).success(function (markedText) {
					$scope.newTask.markedDescription = markedText;
					$scope.newProject.tasks.push($scope.newTask);
					$scope.initTask();
				});
			}
		}

		$scope.updateTask = function (index) {
			$scope.updatingTask = index;
			$scope.newTask = $scope.newProject.tasks[index];
			$('.task-' + index).hide();
		}

		$scope.cancelUpdateTask = function () {
			$scope.initTask();
			$('.task').show();
		}

		$scope.confirmUpdateTask = function () {
			$scope.newTask.author = $scope.user._id;
			$scope.newTask.postDate = moment();
			$http.post('/marked', {'text': $scope.newTask.description}).success(function (markedText) {
				$scope.newTask.markedDescription = markedText;
				$scope.newProject.tasks[$scope.updatingTask] = $scope.newTask;
				$('.task').show();
				$scope.initTask();
			});
		}

		$scope.removeTask = function (index) {
			if (confirm('Are you sure you want to remove this task?') == true) {
				$scope.newProject.tasks.splice(index, 1);
			}
		}

		$scope.addTaskParticipant =  function (person) {
			$scope.humanSearch = '';
			if ($scope.newTask.participants.length == 0) {
				$scope.newTask.owner = person._id;
			}
			$scope.newTask.participants.push(person);
		}

		$scope.addTaskParticipantKeydown =  function ($event, person) {
			if ($event.keyCode == 13) {
				$scope.humanSearch = '';
				if ($scope.newTask.participants.length == 0) {
					$scope.newTask.owner = person._id;
				}
				$scope.newTask.participants.push(person);
			}
		}

		$scope.removeTaskParticipant = function (index) {
			if ($scope.newTask.participants[index]._id == $scope.newTask.owner) {
				$scope.newTask.participants.splice(index, 1);
				if ($scope.newTask.participants.length == 0) {
					$scope.newTask.owner = '';
				} else {
					$scope.newTask.owner = $scope.newTask.participants[0]._id;
				}
			} else {
				$scope.newTask.participants.splice(index, 1);
			}
			
		}

		$('#task-start').datepicker({
			dateFormat: 'dd-mm-yy',
			onClose: function (selectedDate) {
				$('#task-end').datepicker('option', 'minDate', selectedDate);
			}
		});

		$('#task-end').datepicker({
			dateFormat: 'dd-mm-yy',
			onClose: function (selectedDate) {
				$('#task-start').datepicker('option', 'maxDate', selectedDate);
			}
		});

		var uncategorized = '';
		for (i in $rootScope.categoryList) {
			if ($rootScope.categoryList[i].slug == 'uncategorized') {
				uncategorized = $rootScope.categoryList[i]._id;
			}
		}

		$scope.createProject = function () {
			$scope.newProject.slug = $rootScope.slugify($scope.newProject.title);
			$scope.newProject.postDate = moment();
			$scope.newProject.author = $rootScope.user._id;

			if ($scope.newProject.categories.length < 1) {
				$scope.newProject.categories.push(uncategorized);
			}
			
			$http.post('/projects/create', $scope.newProject).success( function (data) {
				alert('Klaar!');
			});			
		}
	}
]);

ctrl.controller('projectsUpdate', ['$scope', '$rootScope', '$routeParams', '$http',
	function ($scope, $rootScope, $routeParams, $http) {
		$rootScope.slug = 'projects';
		$rootScope.heading = 'Update project'; 
		$rootScope.moniker = $rootScope.heading + $rootScope.seperator + $rootScope.masthead;
	}
]);

ctrl.controller('projectsDetail', ['$scope', '$rootScope', '$routeParams', '$http',
	function ($scope, $rootScope, $routeParams, $http) {
		$rootScope.slug = 'projects';
		$rootScope.heading = 'Update project'; 
		$rootScope.moniker = $rootScope.heading + $rootScope.seperator + $rootScope.masthead;
	}
]);