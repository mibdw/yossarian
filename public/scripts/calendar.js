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

		$scope.createEvent = {};

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
							categories: $scope.eventCategories
						},
						error: function() {
							alert('there was an error while fetching events!');
						}
					}
				],
				dayRender: function(date, cell) { 
					var scope = angular.element('#main').scope();

					scope.$apply (function() {
						if (scope.createEvent.start) {
							var start = moment(scope.createEvent.start, 'DD/MM/YYYY');
							scope.startDate(start);
						}
						if (scope.createEvent.end) {
							var end = moment(scope.createEvent.end, 'DD/MM/YYYY');
							scope.endDate(end);
						}
					});				
				},
				dayClick: function (date, jsEvent, view) {
					var scope = angular.element('#main').scope();

					scope.$apply (function() {
						scope.eventPage(1);
						if (!$('#end').is(':visible') || scope.resetStart == true) {	
							scope.startDate(date);
						} else {
							scope.endDate(date);
						}			
					});
				},
				eventRender: function(event, element) {
					element.css({
						'background-color': event.category.color
					});
					element.attr('title', event.title + ' [' + event.category.name + ']');
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
			$scope.eventOption = $scope.eventOptions[index];
		}

		$scope.categoryToggle = function (id) {
			if ($scope.createEvent.categories.indexOf(id) > -1) {
				var index = $scope.createEvent.categories.indexOf(id);
				$scope.createEvent.categories.splice(index, 1);
			} else if ($scope.createEvent.categories.indexOf(id) == -1) {
				$scope.createEvent.categories.push(id);
			}
		}

		$scope.rangeToggle = function () {
			$scope.eventRange = !$scope.eventRange;
			if ($scope.eventRange == false) {
				$scope.createEvent.end = '';
				$('.fc-day').removeClass('end');
				$('.fc-day').removeClass('range');
			}
		}

		$scope.startDate = function (date) {
			var dataDate = moment(date).format('YYYY-MM-DD');
			
			if ($scope.createEvent.end) {
				var checkDate = moment($scope.createEvent.end, 'DD/MM/YYYY');
				if (moment(date).isBefore(checkDate)) {
					$('.fc-day').removeClass('start');
					$('.fc-day[data-date="' + dataDate + '"]').addClass('start');
					$scope.createEvent.start = moment(date).format('DD/MM/YYYY');
					$scope.rangeMark($scope.createEvent.start, $scope.createEvent.end);	
				}
			} else {
				$('.fc-day').removeClass('start');
				$('.fc-day[data-date="' + dataDate + '"]').addClass('start');
				$scope.createEvent.start = moment(date).format('DD/MM/YYYY');
			}			

			$scope.resetStart = false;
		}

		$scope.endDate = function (date) {
			var dataDate = moment(date).format('YYYY-MM-DD');
			var checkDate = moment($scope.createEvent.start, 'DD/MM/YYYY');

			if (moment(date).isAfter(checkDate)) {
				$scope.createEvent.end = moment(date).format('DD/MM/YYYY');

				$('.fc-day').removeClass('end');
				$('.fc-day[data-date="' + dataDate + '"]').addClass('end');

				$scope.rangeMark($scope.createEvent.start, $scope.createEvent.end);
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
			if ($scope.createEvent.end) {
				$scope.resetStart = true;
			}
		}

		$scope.checkStart = function () {
			setTimeout(function(){
				if (moment($scope.createEvent.start, 'DD/MM/YYYY').isValid()) {
					var date = moment($scope.createEvent.start, 'DD/MM/YYYY');
					$scope.startDate(date);
				}
			}, 500);
		}

		$scope.checkEnd = function () {
			setTimeout(function(){	
				if (moment($scope.createEvent.end, 'DD/MM/YYYY').isValid()) {
					var date = moment($scope.createEvent.end, 'DD/MM/YYYY');
					$scope.endDate(date);
				}
			}, 500);
		}

		$scope.createCancel = function () {
			$scope.eventPage(0);
			$scope.createEvent = {};
			$scope.eventRange = false;
			$('.fc-day').removeClass('start end range');
		}

		$scope.createNewEvent = function () {
			$scope.createEvent.postDate = moment();
			$scope.createEvent.author = $rootScope.user._id;
			$scope.createEvent.start = moment($scope.createEvent.start, 'DD/MM/YYYY').format('YYYY-MM-DD');
			if ($scope.createEvent.end) {
				$scope.createEvent.end = moment($scope.createEvent.end, 'DD/MM/YYYY').endOf('day');
			}
			$http.post('/calendar/create', $scope.createEvent).success(function () {
				$scope.navMonth($scope.createEvent.start);		
				$scope.createEvent = {};
				$scope.eventPage(0);

				$('.fc-day').removeClass('start end range');
				$('.calendar-view').fullCalendar('refetchEvents');
			});
		}

		$scope.eventCategories = [];
		$scope.categoryToggle = function (id) {
			if ($scope.eventCategories.indexOf(id) > -1) {
				var index = $scope.eventCategories.indexOf(id);
				$scope.eventCategories.splice(index, 1);
			} else if ($scope.eventCategories.indexOf(id) == -1) {
				$scope.eventCategories.push(id);
			}
		}

		$scope.$watch('eventCategories', function() {
			$('.calendar-view').fullCalendar('refetchEvents');
		}, true);
	}
]);	