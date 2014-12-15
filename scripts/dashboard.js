var ctrl = angular.module('dashboard', []);

ctrl.controller('dashboardController', ['$scope', '$rootScope', '$cookies',	function ($scope, $rootScope, $cookies) {	
		$rootScope.slug = 'dashboard';
		$rootScope.heading = 'Dashboard';
		$rootScope.moniker = $rootScope.heading + $rootScope.seperator + $rootScope.masthead;

		$scope.dashMenu = [
			{ 'name': 'News', 'slug': 'news', 'url': '/partials/dashboard/news' },
			{ 'name': 'People', 'slug': 'people', 'url': '/partials/dashboard/people' },
			{ 'name': 'Addresses', 'slug': 'addresses', 'url': '/partials/dashboard/addresses' },
			{ 'name': 'Links', 'slug': 'links', 'url': '/partials/dashboard/links' }
		];

		$scope.dashActive = $scope.dashMenu[0];
		if ($cookies.dashActive) $scope.dashActive = $scope.dashMenu[$cookies.dashActive];
	
		$rootScope.moniker = $scope.dashActive.name + ' \u00AB ' + $rootScope.heading + $rootScope.seperator + $rootScope.masthead;

		$scope.dashMenuClick = function (index) {
			$scope.dashActive = $scope.dashMenu[index];
			$cookies.dashActive = index;
			$rootScope.moniker = $scope.dashActive.name + ' \u00AB ' + $rootScope.heading + $rootScope.seperator + $rootScope.masthead;
		}
	}
]);

ctrl.controller('dashboardNews', ['$scope', '$http', '$cookies',	
	function ($scope, $http, $cookies) {

		// MEMOS

		$scope.memoPage = 0;
		$scope.memoPages = 0;
		$scope.memoLimit = 10;

		$scope.memos = [];
		$scope.getMemos = function () {
			$http.post('/memos/list', { 'limit': $scope.memoLimit, 'skip': $scope.memoPage }).success(function (memoData) {
				$scope.memos = memoData;
				$scope.memoPages = Math.ceil(memoData.count / $scope.memoLimit);
			});		
		};
		$scope.getMemos();

		$scope.createMemo = function () {
			$http.post('/memos/create', { 'memo': $scope.newMemo }).success(function (memoData) {
				$scope.freshMemo = false;
				$scope.newMemo = '';
				$scope.getMemos();
			});
		}

		$scope.removeMemo = function (id) {
			$http.post('/memos/remove', { 'remove': id }).success(function (memoData) {
				$scope.freshMemo = false;
				$scope.newMemo = '';
				$scope.getMemos();
			});
		}

		$scope.navMemo = function (direction) {
			if (direction == 'next') $scope.memoPage = $scope.memoPage + 1;
			if (direction == 'prev') $scope.memoPage = $scope.memoPage - 1;
			$scope.getMemos();
		}

		// CHANGELOG

		$scope.changePage = 0;
		$scope.changePages = 0;
		$scope.changeLimit = 12;

		$scope.changelog = [];
		$scope.getChangelog = function () {
			$http.post('/changes/list', { 'limit': $scope.changeLimit, 'skip': $scope.changePage }).success(function (changeData) {
				$scope.changelog = changeData;
				$scope.changePages = Math.ceil(changeData.count / $scope.changeLimit);
			});		
		};
		$scope.getChangelog();

		$scope.navChange = function (direction) {
			if (direction == 'next') $scope.changePage = $scope.changePage + 1;
			if (direction == 'prev') $scope.changePage = $scope.changePage - 1;
			$scope.getChangelog();
		}

		// EVENTS 

		if (!$cookies.eventFilter) $cookies.eventFilter = [];
		if (typeof $cookies.eventFilter == 'string') {
			$scope.eventFilter = $cookies.eventFilter.split(',');
		} else {
			$scope.eventFilter = $cookies.eventFilter;
		}

		$scope.categoryToggle = function (id) {
			if ($scope.eventFilter.indexOf(id) > -1) {
				var index = $scope.eventFilter.indexOf(id);
				$scope.eventFilter.splice(index, 1);
			} else if ($scope.eventFilter.indexOf(id) == -1) {
				$scope.eventFilter.push(id);
			}
			$cookies.eventFilter = $scope.eventFilter;
		}

		$scope.upcomingEvents = [];
		$scope.getUpcoming = function () {
			$http.post('/calendar/upcoming', { 'categories': $scope.eventFilter }).success(function (upcomingData) {
				$scope.upcomingEvents = upcomingData;
				for (i in $scope.upcomingEvents) {
					$scope.upcomingEvents[i].period = moment($scope.upcomingEvents[i].start).format('DD/MM');
					if ($scope.upcomingEvents[i].end) {
					var start = moment($scope.upcomingEvents[i].start).format('DD/MM');
					var end = moment($scope.upcomingEvents[i].end).format('DD/MM');

						$scope.upcomingEvents[i].period = start + ' - ' + end;		
					}
				}
			});
		};
		$scope.getUpcoming();

		$scope.$watch('eventFilter', function() { $scope.getUpcoming(); }, true);

		$scope.removeEventCategories = function () { $scope.eventFilter.length = 0;	}

		$scope.upcomingClick = function (date) {
			window.location.pathname = '/#/calendar/' + moment(date).format('YYYY/MM');
		}
	}
]);