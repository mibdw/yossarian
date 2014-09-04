var ctrl = angular.module('calendar', []);

ctrl.controller('calendarController', ['$scope', '$rootScope', '$routeParams', '$http',
	function ($scope, $rootScope, $routeParams, $http) {	
		$rootScope.slug = 'calendar';

		$scope.displayDate = moment();
		if ($routeParams.year && $routeParams.month) {
			var dateCriteria = $routeParams.year + '-' + $routeParams.month;
			$scope.displayDate = moment(dateCriteria, 'YYYY-MM');
		}

		$scope.actualMonth = moment().format('MMMM YYYY');
		$scope.displayMonth = moment($scope.displayDate).format('MMMM YYYY');

		$rootScope.heading = $scope.displayMonth + ' \u00AB Calendar'; 
		$rootScope.moniker = $rootScope.heading + $rootScope.seperator + $rootScope.masthead;

		$scope.incident = {};

		$scope.displayMin = moment($scope.displayDate).startOf('month').subtract('15', 'day');
		$scope.displayMax = moment($scope.displayDate).endOf('month').add('15', 'day');

		setTimeout(function () {
			$('.calendar-view').fullCalendar({
				firstDay: 1,
				eventSources: [
					{
						url: '/calendar/list',
						method: 'POST',
						data: {
							categories: $scope.eventFilter
						},
						error: function() {
							alert('there was an error while fetching events!');
						}
					}
				],
				dayRender: function (date, cell) { 
					var scope = angular.element('#main').scope();

					scope.$apply (function() {
						if (scope.incident.start) {
							var start = moment(scope.incident.start, 'DD/MM/YYYY');
							scope.startDate(start);
						}
						if (scope.incident.end) {
							var end = moment(scope.incident.end, 'DD/MM/YYYY');
							scope.endDate(end);
						}
					});				
				},
				dayClick: function (date, jsEvent, view) {
					var scope = angular.element('#main').scope();

					scope.$apply (function() {
						if (scope.eventOption.slug == 'update') {
							if (!$('#end').is(':visible') || scope.resetStart == true) {	
								scope.startDate(date);
							} else {
								scope.endDate(date);
							}
						} else {
							scope.eventPage(1);
							if (!$('#end').is(':visible') || scope.resetStart == true) {	
								scope.startDate(date);
							} else {
								scope.endDate(date);
							}
						}
										
					});
				},
				eventRender: function (event, element) {
					element.css({
						'background-color': event.category.color
					});
					element.attr('title', event.title + ' [' + event.category.name + ']');
					element.addClass(event._id);
				},
				eventMouseover: function (event, jsEvent, view) {
					var scope = angular.element('#main').scope();
					var rootScope = scope.$root;
					var hoverColor = rootScope.morphColor(event.category.color, 40);

					$('.' + event._id).css('background-color', hoverColor);
				},
				eventMouseout: function (event, jsEvent, view) {
					$('.' + event._id).css('background-color', event.category.color);
				},
				eventClick: function (event, jsEvent, view) {
					var scope = angular.element('#main').scope();

					scope.$apply (function() {
						scope.eventPage(2);
						scope.getEvent(event);
					});
				}
			});
		}, 1);
		
		$('.calendar-view').fullCalendar('gotoDate', $scope.displayDate);

		$scope.eventOptions = [
			{ name: 'Default', slug: 'default', url: '/partials/calendar/default' },
			{ name: 'Create event', slug: 'create', url: '/partials/calendar/create' },
			{ name: 'Update event', slug: 'update', url: '/partials/calendar/update' }
		];

		$scope.navMonth = function (arg) {
			var gotoMonth = moment()
			if (arg == 'next') {
				gotoMonth = moment($scope.displayDate).add('1', 'month');
			} else if (arg == 'prev') {
				gotoMonth = moment($scope.displayDate).subtract('1', 'month');
			} else if (moment(arg).isValid) {
				gotoMonth = arg;
			}

			$scope.displayDate = moment(gotoMonth);
			$scope.displayMonth = moment(gotoMonth).format('MMMM YYYY');
			$rootScope.heading = $scope.displayMonth + ' \u00AB Calendar'; 
			$rootScope.moniker = $rootScope.heading + $rootScope.seperator + $rootScope.masthead;

			$('.calendar-view').fullCalendar('gotoDate', gotoMonth);
		}

		$scope.eventOption = $scope.eventOptions[0];
		$scope.eventPage = function (index) {
			$scope.eventRange = false;
			if (index == 1 && $scope.eventOption.slug != 'create') {
				$scope.incident = {};
			}
			if (index == 0) { $scope.getUpcoming(); }
			$scope.eventOption = $scope.eventOptions[index];
		}

		$scope.getEvent = function (id) {
			$http.post('/calendar/detail', id).success(function (incident) {
				$scope.incident = incident;
				$('.fc-day').removeClass('start range end');
				$scope.incident.start = moment($scope.incident.start).format('DD/MM/YYYY');
				var beginning = moment($scope.incident.start, 'DD/MM/YYYY').format('YYYY-MM-DD');
				$('.fc-day[data-date="' + beginning + '"]').addClass('start');

				if ($scope.incident.end) {
					$scope.rangeToggle();
					$scope.incident.end = moment($scope.incident.end).format('DD/MM/YYYY');
					var finale = moment($scope.incident.end, 'DD/MM/YYYY').format('YYYY-MM-DD');
					$('.fc-day[data-date="' + finale + '"]').addClass('end');
					$scope.rangeMark($scope.incident.start, $scope.incident.end);
				}
			});
		}

		$scope.categoryToggle = function (id) {
			if ($scope.incident.categories.indexOf(id) > -1) {
				var index = $scope.incident.categories.indexOf(id);
				$scope.incident.categories.splice(index, 1);
			} else if ($scope.incident.categories.indexOf(id) == -1) {
				$scope.incident.categories.push(id);
			}
		}

		$scope.rangeToggle = function () {
			$scope.eventRange = !$scope.eventRange;
			if ($scope.eventRange == false) {
				$scope.incident.end = '';
				$('.fc-day').removeClass('end range');
			}
		}

		$scope.startDate = function (date) {
			var dataDate = moment(date).format('YYYY-MM-DD');			
			if ($scope.incident.end) {
				var checkDate = moment($scope.incident.end, 'DD/MM/YYYY');
				if (moment(date).isBefore(checkDate)) {
					$('.fc-day').removeClass('start');
					$('.fc-day[data-date="' + dataDate + '"]').addClass('start');
					$scope.incident.start = moment(date).format('DD/MM/YYYY');
					$scope.rangeMark($scope.incident.start, $scope.incident.end);
				}
			} else {
				$('.fc-day').removeClass('start');
				$('.fc-day[data-date="' + dataDate + '"]').addClass('start');
				$scope.incident.start = moment(date).format('DD/MM/YYYY');
			}			

			$scope.resetStart = false;
		}

		$scope.endDate = function (date) {
			var dataDate = moment(date).format('YYYY-MM-DD');
			var checkDate = moment($scope.incident.start, 'DD/MM/YYYY');

			if (moment(date).isAfter(checkDate)) {
				$scope.incident.end = moment(date).format('DD/MM/YYYY');

				$('.fc-day').removeClass('end');
				$('.fc-day[data-date="' + dataDate + '"]').addClass('end');

				$scope.rangeMark($scope.incident.start, $scope.incident.end);
			}
		}

		$scope.rangeMark = function (start, end) {
			$('.fc-day').removeClass('range');
			var startRange = moment(start, 'DD/MM/YYYY');
			var endRange = moment(end, 'DD/MM/YYYY');
			var numDays = startRange.diff(endRange, 'days');
			numDays = Math.abs(numDays);
			
			for (i = 1; i < numDays; i++) {
				var mark = moment(start, 'DD/MM/YYYY').add(i, 'day').format('YYYY-MM-DD');
				$('.fc-day[data-date="' + mark + '"]').addClass('range');
			}
		}

		$scope.resetStartDate = function () {
			if ($scope.incident.end) {
				$scope.resetStart = true;
			}
		}

		$scope.checkStart = function () {
			setTimeout(function(){
				if (moment($scope.incident.start, 'DD/MM/YYYY').isValid()) {
					var date = moment($scope.incident.start, 'DD/MM/YYYY');
					$scope.startDate(date);
				}
			}, 500);
		}

		$scope.checkEnd = function () {
			setTimeout(function(){	
				if (moment($scope.incident.end, 'DD/MM/YYYY').isValid()) {
					var date = moment($scope.incident.end, 'DD/MM/YYYY');
					$scope.endDate(date);
				}
			}, 500);
		}

		$scope.incidentCancel = function () {
			$scope.eventPage(0);
			$scope.incident = {};
			$scope.eventRange = false;
			$('.fc-day').removeClass('start end range');
		}

		$scope.createEvent = function () {
			$scope.incident.postDate = moment();
			$scope.incident.author = $rootScope.user._id;
			$scope.incident.start = moment($scope.incident.start, 'DD/MM/YYYY').format('YYYY-MM-DD');
			if ($scope.incident.end) {
				$scope.incident.end = moment($scope.incident.end, 'DD/MM/YYYY').endOf('day');
			}
			$http.post('/calendar/create', $scope.incident).success(function () {
				$scope.navMonth($scope.incident.start);		
				$scope.incident = {};
				$scope.eventPage(0);

				$('.fc-day').removeClass('start end range');
				$('.calendar-view').fullCalendar('refetchEvents');
			});
		}

		$scope.updateEvent = function () {
			$scope.incident.editDate = moment();
			$scope.incident.author = $scope.incident.author._id;
			$scope.incident.editor = $rootScope.user._id;
			$scope.incident.start = moment($scope.incident.start, 'DD/MM/YYYY').format('YYYY-MM-DD');
			if ($scope.incident.end) {
				$scope.incident.end = moment($scope.incident.end, 'DD/MM/YYYY').endOf('day');
			}
			$http.post('/calendar/update', $scope.incident).success(function () {
				$scope.navMonth($scope.incident.start);		
				$scope.incident = {};
				$scope.eventPage(0);

				$('.fc-day').removeClass('start end range');
				$('.calendar-view').fullCalendar('refetchEvents');
			});
		}

		$scope.upcomingEvents = [];
		$scope.getUpcoming = function () {
			$http.post('/calendar/upcoming', { 'categories': $scope.eventFilter }).success(function (upcomingData) {
				$scope.upcomingEvents = upcomingData;
				var today = moment();
				var tomorrow = moment().add('1', 'day');
				for (i in $scope.upcomingEvents) {
					if (moment($scope.upcomingEvents[i].start).isBefore(today, 'day')) {
						$scope.upcomingEvents[i].timeline = 'history';
					} else if (moment($scope.upcomingEvents[i].start).isSame(today, 'day')) {
						$scope.upcomingEvents[i].timeline = 'today';
					} else if (moment($scope.upcomingEvents[i].start).isSame(tomorrow, 'day')) {
						$scope.upcomingEvents[i].timeline = 'tomorrow';
					} else if (moment($scope.upcomingEvents[i].start).isAfter(today, 'day')) {
						$scope.upcomingEvents[i].timeline = 'future';
					}

					$scope.upcomingEvents[i].period = moment($scope.upcomingEvents[i].start).format('DD/MM/YYYY');
					if ($scope.upcomingEvents[i].end) {
						var start = moment($scope.upcomingEvents[i].start).format('DD/MM/YYYY');
						var end = moment($scope.upcomingEvents[i].end).format('DD/MM/YYYY');

						if (moment($scope.upcomingEvents[i].start).isAfter(today, 'day') == false) {
							var timeleft = moment($scope.upcomingEvents[i].end).fromNow(today, true);
							$scope.upcomingEvents[i].period = start + ' \u2014 ' + end + ' (' + timeleft + ' left)';
						} else {
							$scope.upcomingEvents[i].period = start + ' \u2014 ' + end;
						}						
					}
				}
			});
		}
		$scope.getUpcoming();

		$scope.eventFilter = [];
		$scope.categoryToggle = function (id) {
			if ($scope.eventFilter.indexOf(id) > -1) {
				var index = $scope.eventFilter.indexOf(id);
				$scope.eventFilter.splice(index, 1);
			} else if ($scope.eventFilter.indexOf(id) == -1) {
				$scope.eventFilter.push(id);
			}
		}

		$scope.$watch('eventFilter', function() {
			$('.calendar-view').fullCalendar('refetchEvents');
			$scope.incidentCancel();
		}, true);

		$scope.removeEventCategories = function () {
			$scope.eventFilter.length = 0;
			$('.checkboxes input').attr('checked', false);
		}
	}
]);	