var ctrl = angular.module('calendar', []);

ctrl.controller('calendarController', ['$scope', '$rootScope', '$routeParams', '$http', '$location',
	function ($scope, $rootScope, $routeParams, $http, $location) {	
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

		$('.calendar-view').fullCalendar();
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
	}
]);