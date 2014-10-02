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

ctrl.controller('projectsCreate', ['$scope', '$rootScope', '$http', '$routeParams',
	function ($scope, $rootScope, $http, $routeParams) {
		$rootScope.slug = 'projects';
		$rootScope.heading = 'Create project'; 
		$rootScope.moniker = $rootScope.heading + $rootScope.seperator + $rootScope.masthead;

		$scope.userList = [];
		$http.post('/users/list').success( function (userData) {
			$scope.userList = userData;
		});

		$scope.initProject = function () {
			$scope.venture = {
				categories: [],
				participants: [],
				tasks: []
			}
		}

		if ($routeParams.slug) {
			$http.post('/projects/detail', { slug: $routeParams.slug }).success(function (projectData) {
				$scope.venture = projectData;
				if ($scope.venture.start) $scope.venture.start = moment($scope.venture.start).format('DD-MM-YYYY');
				if ($scope.venture.end) $scope.venture.end = moment($scope.venture.end).format('DD-MM-YYYY');

				angular.forEach($scope.venture.tasks, function (task) {
					if (task.start) task.start = moment(task.start).format('DD-MM-YYYY');
					if (task.end) task.end = moment(task.end).format('DD-MM-YYYY');
					$http.post('/marked', {'text': task.description}).success(function (markedText) {
						task.markedDescription = markedText;
					});
				});
			});
		} else {
			$scope.initProject();
		}

		$scope.addParticipant =  function (person) {
			$scope.userSearch = '';
			if ($scope.venture.participants.length == 0) {
				$scope.venture.owner = person._id;
			}
			$scope.venture.participants.push(person);
		}

		$scope.addParticipantKeydown =  function ($event, index, person) {
			if ($event.keyCode == 13) {
				$scope.userSearch = '';
				if ($scope.venture.participants.length == 0) {
					$scope.venture.owner = person._id;
				}
				$scope.venture.participants.push(person);
			}	
		}

		$scope.removeParticipant = function (index) {
			if ($scope.venture.participants[index]._id == $scope.venture.owner) {
				$scope.venture.participants.splice(index, 1);
				if ($scope.venture.participants.length == 0) {
					$scope.venture.owner = '';
				} else {
					$scope.venture.owner = $scope.venture.participants[0]._id;
				}
			} else {
				$scope.venture.participants.splice(index, 1);
			}
		}

		$scope.categoryToggle = function (id) {
			if ($scope.venture.categories.indexOf(id) > -1) {
				var index = $scope.venture.categories.indexOf(id);
				$scope.venture.categories.splice(index, 1);
			} else if ($scope.venture.categories.indexOf(id) == -1) {
				$scope.venture.categories.push(id);
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
					$scope.venture.tasks.push($scope.newTask);
					$scope.initTask();
				});
			}
		}

		$scope.updateTask = function (index) {
			$scope.updatingTask = index;
			$scope.newTask = $scope.venture.tasks[index];
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
				$scope.venture.tasks[$scope.updatingTask] = $scope.newTask;
				$('.task').show();
				$scope.initTask();
			});
		}

		$scope.removeTask = function (index) {
			if (confirm('Are you sure you want to remove this task?') == true) {
				$scope.venture.tasks.splice(index, 1);
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
			$scope.venture.slug = $rootScope.slugify($scope.venture.title);
			$scope.venture.postDate = moment();
			$scope.venture.author = $rootScope.user._id;

			if ($scope.venture.categories.length < 1) {
				$scope.venture.categories.push(uncategorized);
			}
			
			$http.post('/projects/create', $scope.venture).success( function (data) {
				alert('Klaar!');
			});			
		}
	}
]);

ctrl.controller('projectsDetail', ['$scope', '$rootScope', '$routeParams', '$http',
	function ($scope, $rootScope, $routeParams, $http) {
		$rootScope.slug = 'projects';
		$rootScope.heading = 'Update project'; 
		$rootScope.moniker = $rootScope.heading + $rootScope.seperator + $rootScope.masthead;
	}
]);