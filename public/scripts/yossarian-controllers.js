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

		$http.get('/config').success( function (data) { $rootScope.config = data; });
		$http.get('/user/current').success( function (data) { $rootScope.user = data; });
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

		$http.get('/docs/get/' + docSlug).success( function (data) {
			$scope.doc = data;
			$scope.doc.body = $sce.trustAsHtml($scope.doc.body);
			$rootScope.subTitle = "\u00BB " + $scope.doc.title;
		});

		$http.get('/docs/submenu').success( function (submenu) {
			$scope.submenu = submenu;
		});
	}
]);

// DOCS / NEW DOC
ctrl.controller('yossarianPostdoc', ['$scope', '$sce', '$rootScope', '$routeParams', '$http', '$window',
	function ($scope, $sce, $rootScope, $routeParams, $http, $window) {

		$rootScope.subTitle = "\u00BB New document";	
		$scope.newDoc = { 'parent': 'noParent' };

		$scope.postDoc = function () { 
			$http.post('/docs/post', $scope.newDoc)
			.success(function (data) { 
				$window.location.href = "/#/docs/" + data.success; 
			})
			.error(function () { 
				$scope.errorMessage = "Something went wrong dude. Get your shit together!"; 
			});
		};

		$http.get('/docs/submenu').success( function (submenu) {
			$scope.submenu = submenu;
		});

		$scope.previewDoc = function () {


			$http.post('/docs/preview', { 'previewBody': $scope.newDoc.body })
			.success(function (data) {
				$scope.previewBody = $sce.trustAsHtml(data.body);
			});
		};
	}
]);

// DOCS / EDIT DOC
ctrl.controller('yossarianEditdoc', ['$scope', '$sce', '$rootScope', '$routeParams', '$http', '$window',
	function ($scope, $sce, $rootScope, $routeParams, $http, $window) {

		var docSlug = $routeParams.subsubdoc || $routeParams.subdoc;

		$http.get('/docs/edit/' + docSlug).success( function (data) {
			$scope.editDoc = data;
			$rootScope.subTitle = "\u00BB Edit document";

			$http.get('/user/get/' + data.author).success( function (hero) {
				$scope.author = hero;
			});

			$scope.originalSlug = data.slug;
		});

		$http.get('/docs/submenu').success( function (submenu) {
			$scope.submenu = submenu;
		});

		$scope.updateDoc = function () { 
			
			var hasChildren = false;
			for (i in $scope.submenu) {
				if ($scope.submenu[i]['parent'] == $scope.originalSlug) {
					hasChildren = true; 
				}
			}

			if (hasChildren === true) {

				$scope.errorMessage = "This document has children! Please find them a foster family first. Geez!"; 

			} else if (hasChildren === false) {

				$http.post('/docs/update', $scope.editDoc)
				.success(function (data) {
					if ($scope.editDoc.parent == 'noParent') {
						$window.location.href = "/#/docs/" + $scope.editDoc.slug; 
					} else {
						$window.location.href = "/#/docs/" + $scope.editDoc.parent +"/" + $scope.editDoc.slug; 
					}				
				})
				.error(function () { 
					$scope.errorMessage = "Something went wrong dude. Get your shit together!"; 
				});
			}
		};

		$scope.confirmDelete = function() {

			var hasChildren = false;
			for (i in $scope.submenu) {
				if ($scope.submenu[i]['parent'] == $scope.originalSlug) {
					hasChildren = true; 
				}
			}
			if (hasChildren === true) {

				$scope.errorMessage = "This document has children! Please find them a foster family first. Geez!"; 

			} else if (hasChildren === false) {

				$scope.confirmMessage = "Are you sure you want to delete this document?";

			}
		};

		$scope.deleteDoc = function () { 

			$scope.confirmMessage = "";

			$http.post('/docs/delete', { 'docid': $scope.editDoc._id })
			.success(function (data) {
				$window.location.href = "/#/docs";
			});
		};

		$scope.previewDoc = function () {

			$http.post('/docs/preview', { 'previewBody': $scope.editDoc.body })
			.success(function (data) {
				$scope.previewBody = $sce.trustAsHtml(data.body);
			});
		};
	}
]);