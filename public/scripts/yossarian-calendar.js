var ctrl = angular.module('yossarianCalendar', []);

ctrl.controller('yossarianCalendarEvents', ['$scope', '$http', '$window', '$routeParams',
	function ($scope, $http, $window, $routeParams) { 

		if ($routeParams.year && $routeParams.month) {

			$scope.currentMonth = moment($routeParams.year + "-" + $routeParams.month, 'YYYY-MM');
		} else {

			$scope.currentMonth = moment();
		}

		$scope.displayMonth = moment($scope.currentMonth).format('MMMM YYYY');

		$('.calendar-view').fullCalendar();
		$('.calendar-view').fullCalendar('gotoDate', $scope.currentMonth);


	}
]);
