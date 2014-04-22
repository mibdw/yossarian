var ctrl = angular.module('yossarianControllers', []);

// AUTHORIZATION
ctrl.controller('yossarianAuth', ['$scope', '$http', '$window',
	function ($scope, $http, $window) {

		$scope.credentials = {};

		$scope.yossarianLogin = function () {
			$http
			.post('/ajaxLogin', $scope.credentials)
			.success( function (data) {
				if (data.success) {

					$window.location.href = '/';
				
				} else if (data.failure) {

					$scope.errorMessage = data.failure;

				} else {

					$scope.errorMessage = "Oh boy, something's horribly wrong. Keep calm and contact the authorities."
				}
			});
		}
	}
]);

// CONFIG
ctrl.controller('yossarianConfig', ['$rootScope', '$http',
	function ($rootScope, $http) {

		$http.get('/config').success( function (data) {
			$rootScope.config = data;
		});

		$http.get('/username').success( function (data) {
			$rootScope.user = data;
		});
	}
]);

// NAVIGATION
ctrl.controller('yossarianNav', ['$scope', '$rootScope', '$http',
	function ($scope, $rootScope, $http) {

		$http.get('/navigation').success( function (data) {
			$rootScope.navigation = data;

			var activeURL = document.URL.substr(document.URL.indexOf('#')+2);

			if (activeURL.indexOf('/') > -1) {
				var activeURL = activeURL.substr(0, activeURL.indexOf('/'));
			}

			for (i in data) {
				if(data[i].slug == activeURL) {
					var currentNav = i;
				}
			}

			$rootScope.activeNav = currentNav || 0;

		});

		$rootScope.select = function (index) {
			$rootScope.activeNav = index;
			$rootScope.subTitle = "";
		};

	}
]);

// DOCS
ctrl.controller('yossarianDocs', ['$scope', '$rootScope', '$sce', '$routeParams', '$http', '$window',
	function ($scope, $rootScope, $sce, $routeParams, $http, $window) {	

		$scope.activeSubnav = $routeParams.subdoc;
		$scope.activeSubsubnav = $routeParams.subsubdoc;

		var docSlug = $routeParams.subsubdoc || $routeParams.subdoc;

		$http.get('/getDoc/' + docSlug).success( function (data) {
			$scope.doc = data;
			$scope.doc.body = $sce.trustAsHtml($scope.doc.body);
			$rootScope.subTitle = "\u00BB " + $scope.doc.title;
		});

		$http.get('/docSubmenu').success( function (submenu) {
			$scope.submenu = submenu;
		});
	}
]);

// DOCS / NEW DOC
ctrl.controller('yossarianPostdoc', ['$scope', '$rootScope', '$routeParams', '$http', '$window',
	function ($scope, $rootScope, $routeParams, $http, $window) {

		$rootScope.subTitle = "\u00BB New document";	

		$scope.newDoc = {
			'parent': 'noParent'
		};

		$scope.postDoc = function () { 
			$http.post('/postDoc', $scope.newDoc)
			.success(function (data) { 
				$window.location.href = "/#/docs/" + data.success; 
			})
			.error(function () { 
				$scope.errorMessage = "Something went wrong dude. Get your shit together!"; 
			});
		};
	}
]);

// DOCS / EDIT DOC
ctrl.controller('yossarianEditdoc', ['$scope', '$rootScope', '$routeParams', '$http', '$window',
	function ($scope, $rootScope, $routeParams, $http, $window) {

		var docSlug = $routeParams.subsubdoc || $routeParams.subdoc;

		$http.get('/editDoc/' + docSlug).success( function (data) {
			$scope.editDoc = data;
			$rootScope.subTitle = "\u00BB Edit document";
		});

		$scope.updateDoc = function () { 
			$http.post('/updateDoc', $scope.editDoc)
			.success(function (data) { 
				$window.location.href = "/#/docs/" + data.success; 
			})
			.error(function () { 
				$scope.errorMessage = "Something went wrong dude. Get your shit together!"; 
			});
		};
	}
]);



