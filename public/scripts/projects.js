var ctrl = angular.module('projects', []);

ctrl.controller('projectsController', ['$scope', '$rootScope', '$http', '$cookies', '$timeout',
	function ($scope, $rootScope, $http, $cookies, $timeout) {
		$rootScope.slug = 'projects';
		$rootScope.heading = 'Projects'; 
		$rootScope.moniker = $rootScope.heading + $rootScope.seperator + $rootScope.masthead;

		$scope.projectViews = [
			{ 'name': 'list', 'url': '/partials/projects/list' },
			{ 'name': 'calendar', 'url': '/partials/projects/calendar' }
		];

		$scope.projectView = $scope.projectViews[0];

		if (!$cookies.statusProjects) $cookies.statusProjects = ['all'];
		$scope.statusProjects = $cookies.statusProjects;
		$scope.setStatusProjects = function (status) {
			if ($scope.statusProjects != status) $cookies.statusProjects = status;
			if ($scope.statusProjects == status) $cookies.statusProjects = 'all';
			$scope.statusProjects = $cookies.statusProjects;
			$scope.projectsCriteria.completed = $scope.statusProjects;
			if ($scope.projectView.name == 'list') $scope.getProjects();
			if ($scope.projectView.name == 'calendar') $('.projects-calendar-view').fullCalendar('refetchEvents');
		}

		if (!$cookies.sortProjects) $cookies.sortProjects = '-postDate';
		$scope.sortProjects = $cookies.sortProjects;
		$scope.setSortProjects = function () {
			$cookies.sortProjects = $scope.sortProjects;
			$scope.projectsCriteria.sort = $scope.sortProjects;
			$scope.getProjects();
		}

		if (!$cookies.categoriesProjects) $cookies.categoriesProjects = [];
		if (typeof $cookies.categoriesProjects == 'string') {
			$scope.categoriesProjects = $cookies.categoriesProjects.split(',');
		} else {
			$scope.categoriesProjects = $cookies.categoriesProjects;
		}

		$scope.categoryToggle = function (id) {
			if ($scope.categoriesProjects.indexOf(id) > -1) {
				var index = $scope.categoriesProjects.indexOf(id);
			$scope.categoriesProjects.splice(index, 1);
			} else if ($scope.categoriesProjects.indexOf(id) == -1) {
				$scope.categoriesProjects.push(id);
			}
			$scope.projectsCriteria.categories = $scope.categoriesProjects;
			if ($scope.projectView.name == 'list') $scope.getProjects();
			if ($scope.projectView.name == 'calendar') $('.projects-calendar-view').fullCalendar('refetchEvents');
			$cookies.categoriesProjects = $scope.categoriesProjects;
		}

		$scope.clearProjectSearch = function () {
			delete $scope.projectSearch;
			delete $scope.projectsCriteria.search;
			$scope.getProjects();
		}

		$scope.navProjects = function (direction) {
			if (direction == 'next') $scope.projectsPage = $scope.projectsPage + 1;
			if (direction == 'prev') $scope.projectsPage = $scope.projectsPage - 1;
			$scope.getProjects();
		}

		$scope.projectsPage = 0;
		$scope.projectsLimit = 8;
		$scope.projectsPages = 1;

		$scope.projectsCriteria = {
			'limit': $scope.projectsLimit,
			'page': $scope.projectsPage,
			'sort': $scope.sortProjects,
			'completed': $scope.statusProjects,
			'categories': $scope.categoriesProjects		
		}

		$scope.getProjects = function () {
			$scope.projectList = [];
			$http.post('/projects/list', $scope.projectsCriteria).success(function (projectResults) {
				$scope.projectList = projectResults.data;

				for (i in $scope.projectList) {
					if (moment($scope.projectList[i].start).isAfter()) {
						$scope.projectList[i].time = "Project starts " + moment($scope.projectList[i].start).fromNow();
					} else if (moment($scope.projectList[i].start).isBefore() && moment($scope.projectList[i].end).isAfter()) {
						$scope.projectList[i].time = "Project ends " + moment($scope.projectList[i].end).fromNow();
					} else if (moment($scope.projectList[i].end).isBefore()) {
						$scope.projectList[i].time = "Project ended " + moment($scope.projectList[i].end).fromNow();
					} else {
						$scope.projectList[i].time = "End date undefined";
					}

					if ($scope.projectList[i].description.length > 750) $scope.projectList[i].description = $scope.projectList[i].description.substring(0, 749) + "...";

					$scope.projectList[i].completedTasks = 0;
					for (j in $scope.projectList[i].tasks) {

						if ($scope.projectList[i].tasks[j].completed == true) $scope.projectList[i].completedTasks = $scope.projectList[i].completedTasks + 1;
					}
				}

				$scope.projectsPages = Math.ceil(projectResults.count / $scope.projectsLimit);
			});
		}
		$scope.getProjects();
		
		var timer = false;
		$scope.$watch('projectSearch', function () {
			if ($scope.projectSearch) {
				if (timer) $timeout.cancel(timer);
				timer = $timeout(function () {
					$scope.projectsCriteria["search"] = $scope.projectSearch;
					$scope.getProjects();
				}, 500);
			}
		});
		
		$scope.projectsCalendar = function () {
			setTimeout(function () {
				$('.projects-calendar-view').fullCalendar({
					firstDay: 1,
					eventSources: [
						{
							url: '/projects/calendar',
							method: 'POST',
							data: {
								'completed': $scope.statusProjects,
								'categories': $scope.categoriesProjects		
							},
							error: function() {
								alert('there was an error while fetching events!');
							}
						}
					],
					eventRender: function (event, element) {
						
					},
					eventMouseover: function (event, jsEvent, view) {
						
					},
					eventMouseout: function (event, jsEvent, view) {
						
					},
					eventClick: function (event, jsEvent, view) {
						window.location.pathname = '/#/projects/' + event.slug; 
					}
				});
			}, 1);
		};

		$scope.projCalDate = moment();
		$scope.projCalActual = moment().format('MMMM YYYY');
		$scope.projCalMonth = moment($scope.projCalDate).format('MMMM YYYY');

		$scope.navMonth = function (arg) {
			var gotoMonth = moment()
			if (arg == 'next') {
				gotoMonth = moment($scope.projCalDate).add('1', 'month');
			} else if (arg == 'prev') {
				gotoMonth = moment($scope.projCalDate).subtract('1', 'month');
			} else if (moment(arg).isValid) {
				gotoMonth = arg;
			}

			$scope.projCalDate = moment(gotoMonth);
			$scope.projCalMonth = moment(gotoMonth).format('MMMM YYYY');
			$('.projects-calendar-view').fullCalendar('gotoDate', gotoMonth);
		}
	}
]);

ctrl.controller('projectsForm', ['$scope', '$rootScope', '$http', '$routeParams',
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
					if (task.start) task.start = $rootScope.displayDate(task.start);
					if (task.end) task.end = $rootScope.displayDate(task.end);
					$http.post('/marked', {'text': task.description}).success(function (markedText) {
						task.markedDescription = markedText;
					});
				});

				for (i in $scope.venture.categories) {
					$scope.venture.categories[i] = $scope.venture.categories[i]._id;
				}
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
				participants: [],
				start: '',
				end: '',
				author: '',
				postDate: ''
			}
			$scope.updatingTask = 'none';
		}
		$scope.initTask();

		$scope.copyTask = {};
		$scope.updateTask = function (task, index) {
			$scope.copyTask = task;
			$scope.updatingTask = index;
		}

		$scope.cancelUpdateTask = function () {
			$scope.initTask();
			$scope.copyTask = {};
		}

		$scope.confirmUpdateTask = function (task) {
			$scope.venture.tasks[$scope.venture.tasks.indexOf(task)] = $scope.copyTask;
			$scope.initTask();
			$scope.copyTask = {};
		}

		$scope.removeTask = function (task) {
			if (confirm('Are you sure you want to remove this task?') == true) {
				$scope.venture.tasks.splice($scope.venture.tasks.indexOf(task), 1);
				$scope.initTask();
				$scope.copyTask = {};
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

		$scope.removeTaskParticipant = function (id, index) {
			for (i in $scope.venture.tasks) {
				if ($scope.venture.tasks[i]._id == id) {
					if ($scope.venture.tasks[i].participants[index]._id == $scope.venture.tasks[i].owner) {
						$scope.venture.tasks[i].participants.splice(index, 1);
						if ($scope.venture.tasks[i].participants.length == 0) {
							$scope.venture.tasks[i].owner = '';
						} else {
							$scope.venture.tasks[i].owner = $scope.venture.tasks[i].participants[0]._id;
						}
					} else {
						$scope.venture.tasks[i].participants.splice(index, 1);
					}				
				}
			}
		}

		$scope.removeNewTaskParticipant = function (index) {
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

		$('#new-task-start').datepicker({
			dateFormat: 'dd-mm-yy',
			onClose: function (selectedDate) {
				$('#new-task-end').datepicker('option', 'minDate', selectedDate);
			}
		});

		$('#new-task-end').datepicker({
			dateFormat: 'dd-mm-yy',
			onClose: function (selectedDate) {
				$('#new-task-start').datepicker('option', 'maxDate', selectedDate);
			}
		});

		var uncategorized = '';
		for (i in $rootScope.categoryList) {
			if ($rootScope.categoryList[i].slug == 'uncategorized') {
				uncategorized = $rootScope.categoryList[i]._id;
			}
		}

		$scope.completeTask = function (task) {
			$scope.venture.tasks[$scope.venture.tasks.indexOf(task)].completed = true;
		}

		$scope.uncompleteTask = function (task) {
			$scope.venture.tasks[$scope.venture.tasks.indexOf(task)].completed = false;
		}

		$scope.addNewTask = function () {
			if (!$scope.newTask.title) return alert("Please give your task a title");
			$http.post('/marked', {'text': $scope.newTask.description}).success(function (markedText) {
				$scope.newTask.markedDescription = markedText;
				$scope.newTask.author = $scope.user._id;
				$scope.newTask.postDate = moment().format();
				$scope.venture.tasks.push($scope.newTask);
				$scope.initTask();
			});
		}

		$scope.removeProject = function () {
			if (confirm('Are you sure you want to remove this project?') == true) {
				$http.post('/projects/remove', {'remove': $scope.venture._id}).success( function (data) {
					window.location.pathname = "/#/projects";
				});	
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
				window.location.pathname = "/#/projects/" + $scope.venture.slug;
			});			
		}

		$scope.updateProject = function () {
			$scope.venture.author = $scope.venture.author._id; 
			$scope.venture.slug = $rootScope.slugify($scope.venture.title);
			$scope.venture.editDate = moment();
			$scope.venture.editor = $rootScope.user._id;

			if ($scope.venture.categories.length < 1) {
				$scope.venture.categories.push(uncategorized);
			}
			
			$http.post('/projects/update', $scope.venture).success( function (data) {
				window.location.pathname = "/#/projects/" + $scope.venture.slug;
			});			
		}
	}
]);

ctrl.controller('projectsDetail', ['$scope', '$rootScope', '$routeParams', '$http', '$cookies',
	function ($scope, $rootScope, $routeParams, $http, $cookies) {
		$rootScope.slug = 'projects';
		$rootScope.heading = 'Update project'; 
		$rootScope.moniker = $rootScope.heading + $rootScope.seperator + $rootScope.masthead;

		$scope.getProject = function () {
			$scope.currentProject = {};
			$http.post('/projects/detail', { 'slug': $routeParams.slug }).success( function (projectData) {
				$scope.currentProject = projectData;

				$rootScope.heading = $scope.currentProject.title + ' \u00AB Projects'; 
				$rootScope.moniker = $rootScope.heading + $rootScope.seperator + $rootScope.masthead;

				$scope.currentProject.markedDescription = "";
				$http.post('/marked', { 'text': $scope.currentProject.description }).success( function (markedText) {
					$scope.currentProject.markedDescription = markedText;
				});

				$scope.currentProject.duration = 'Undefined';
				if ($scope.currentProject.start && $scope.currentProject.end) {
					var start = moment($scope.currentProject.start);
					var end = moment($scope.currentProject.end);
					$scope.currentProject.duration = end.from(start, true);
				}

				$scope.currentProject.completedTasks = 0;
				angular.forEach($scope.currentProject.tasks, function (task) {
					if (task.completed == true) $scope.currentProject.completedTasks = $scope.currentProject.completedTasks + 1;
					if (task.start) task.start = $rootScope.displayDate(task.start);
					if (task.end) task.end = $rootScope.displayDate(task.end);

					$http.post('/marked', {'text': task.description}).success(function (markedText) {
						task.markedDescription = markedText;
					});
				});

				$scope.updatingTask = 'none';

				$scope.userList = [];
				$http.post('/users/list').success( function (userData) {
					$scope.userList = userData;
				});
			});
		}
		$scope.getProject();

		$scope.sendProject = {}
		$scope.updateProject = function () {
			$scope.sendProject = angular.copy($scope.currentProject);
			$scope.sendProject.author = $scope.sendProject.author._id;
			$scope.sendProject.editDate = moment();
			$scope.sendProject.editor = $rootScope.user._id;
			if ($scope.sendProject.start) $scope.sendProject.start = moment($scope.sendProject.start).format("DD-MM-YYYY");
			if ($scope.sendProject.end) $scope.sendProject.end = moment($scope.sendProject.end).format("DD-MM-YYYY");
			delete $scope.sendProject.markedDescription;
			delete $scope.sendProject.completedTasks;
			
			$http.post('/projects/update', $scope.sendProject).success( function (data) {
				$scope.sendProject = {};
			});

			$scope.updatingTask = 'none';
		}

		if (!$cookies.sortTasks) $cookies.sortTasks = 'priority';
		$scope.sortTasks = $cookies.sortTasks;
		$scope.setSortTasks = function () {
			$cookies.sortTasks = $scope.sortTasks;
		}

		$scope.completeTask = function (id) {
			for (i in $scope.currentProject.tasks) {
				if ($scope.currentProject.tasks[i]._id == id) {
					$scope.currentProject.tasks[i].completed = true;
					$scope.currentProject.completedTasks = $scope.currentProject.completedTasks + 1;
					$scope.currentProject.tasks[i].editor = $scope.user._id;
					$scope.currentProject.tasks[i].editDate = moment().format();
				} 
				if (i ==  $scope.currentProject.tasks.length - 1) $scope.updateProject(); 
			}
		}

		$scope.uncompleteTask = function (id) {
			for (i in $scope.currentProject.tasks) {
				if ($scope.currentProject.tasks[i]._id == id) {
					$scope.currentProject.tasks[i].completed = false;	
					$scope.currentProject.completedTasks = $scope.currentProject.completedTasks - 1;
					$scope.currentProject.tasks[i].editor = $scope.user._id;
					$scope.currentProject.tasks[i].editDate = moment().format();
				} 
				if (i ==  $scope.currentProject.tasks.length - 1)$scope.updateProject(); 
			}
		}

		$scope.copyTask = {};
		$scope.updateTask = function (index) {
			$scope.copyTask = angular.copy($scope.currentProject.tasks[index]);
			$scope.updatingTask = index;
		}

		$scope.cancelUpdateTask = function (index) {
			$scope.currentProject.tasks[index] = $scope.copyTask;
			$scope.copyTask = {};
			$scope.updatingTask = 'none';
		}

		$scope.addTaskParticipant =  function (id, person) {
			for (i in $scope.currentProject.tasks) {
				if ($scope.currentProject.tasks[i]._id == id) {
					$scope.humanSearch = '';
					if ($scope.currentProject.tasks[i].participants.length == 0) {
						$scope.currentProject.tasks[i].owner = person._id;
					}
					$scope.currentProject.tasks[i].participants.push(person);	
				}
			}
		}

		$scope.addTaskParticipantKeydown =  function (id, $event, person) {
			if ($event.keyCode == 13) {
				for (i in $scope.currentProject.tasks) {
					if ($scope.currentProject.tasks[i]._id == id) {
						$scope.humanSearch = '';
						if ($scope.currentProject.tasks[i].participants.length == 0) {
							$scope.currentProject.tasks[i].owner = person._id;
						}
						$scope.currentProject.tasks[i].participants.push(person);
					}
				}
			}				
		}

		$scope.removeTaskParticipant = function (id, index) {
			for (i in $scope.currentProject.tasks) {
				if ($scope.currentProject.tasks[i]._id == id) {
					if ($scope.currentProject.tasks[i].participants[index]._id == $scope.currentProject.tasks[i].owner) {
						$scope.currentProject.tasks[i].participants.splice(index, 1);
						if ($scope.currentProject.tasks[i].participants.length == 0) {
							$scope.currentProject.tasks[i].owner = '';
						} else {
							$scope.currentProject.tasks[i].owner = $scope.currentProject.tasks[i].participants[0]._id;
						}
					} else {
						$scope.currentProject.tasks[i].participants.splice(index, 1);
					}
				}
			}
		}

		$scope.removeTask = function (task) {
			if (confirm('Are you sure you want to remove this task?') == true) {
				
				if ($scope.currentProject.tasks[$scope.currentProject.tasks.indexOf(task)].completed == true) {
					$scope.currentProject.completedTasks = $scope.currentProject.completedTasks - 1;
				}
				$scope.currentProject.tasks.splice($scope.currentProject.tasks.indexOf(task), 1);
				$scope.updateProject();
				$scope.copyTask = {};
				$scope.updatingTask = 'none';
			}
		}
	}
]);