var ctrl = angular.module('yossarianDocs', []);

// DOCS
ctrl.controller('yossarianDocIndex', ['$scope', '$rootScope', '$sce', '$routeParams', '$http', '$window',
	function ($scope, $rootScope, $sce, $routeParams, $http, $window) {	

		$scope.activeSubnav = $routeParams.docSlug;
		$scope.activeSubsubnav = $routeParams.subdocSlug;

		var docSlug = $routeParams.subdocSlug || $routeParams.docSlug;

		if ($routeParams.docSlug == 'overview') {

			$rootScope.subTitle = "\u00BB Overview";

		} else {

			$http.get('/docs/get/' + docSlug).success( function (data) {
				$scope.doc = data;
				$scope.doc.body = $sce.trustAsHtml($scope.doc.body);
				$scope.doc.dateCreatedFromNow = moment($scope.doc.dateCreated, "YYYY-MM-DDTHH:mm:ssZ").fromNow();
				$scope.doc.dateModifiedFromNow = moment($scope.doc.dateModified, "YYYY-MM-DDTHH:mm:ssZ").fromNow();
				$rootScope.subTitle = "\u00BB " + $scope.doc.title;	
			});
		}

		$http.get('/docs/submenu').success( function (submenu) {
			$scope.submenu = submenu;

			for (i in $scope.submenu) {
				$scope.submenu[i].excerpt = $scope.submenu[i].body.substr(0, 300);
				$scope.submenu[i].dateCreatedFromNow = moment($scope.submenu[i].dateCreated, "YYYY-MM-DDTHH:mm:ssZ").fromNow();
				$scope.submenu[i].dateCreatedPretty = moment($scope.submenu[i].dateCreated, "YYYY-MM-DDTHH:mm:ssZ").format('dddd, DD MMMM YYYY HH:mm:ss');
				$scope.submenu[i].dateModifiedFromNow = moment($scope.submenu[i].dateModified, "YYYY-MM-DDTHH:mm:ssZ").fromNow();
				$scope.submenu[i].dateModifiedPretty = moment($scope.submenu[i].dateModified, "YYYY-MM-DDTHH:mm:ssZ").format('dddd, DD MMMM YYYY HH:mm:ss');

				$scope.submenu[i].children = 0;

				if ($scope.submenu[i].parent == 'noParent') {
					for (j in $scope.submenu) {
						if ($scope.submenu[j].parent == $scope.submenu[i].slug) {
							$scope.submenu[i].children = $scope.submenu[i].children + 1;
						}
					}
				}
			}
		});
	}
]);

// DOCS / NEW DOC
ctrl.controller('yossarianDocPost', ['$scope', '$sce', '$rootScope', '$routeParams', '$http', '$window',
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
ctrl.controller('yossarianDocEdit', ['$scope', '$sce', '$rootScope', '$routeParams', '$http', '$window',
	function ($scope, $sce, $rootScope, $routeParams, $http, $window) {

		var docSlug = $routeParams.subdocSlug || $routeParams.docSlug;

		$http.get('/docs/edit/' + docSlug).success( function (data) {
			$scope.editDoc = data;
			$rootScope.subTitle = "\u00BB Edit document";
			$scope.editDoc.dateCreatedFromNow = moment($scope.editDoc.dateCreated, "YYYY-MM-DDTHH:mm:ssZ").fromNow();
			$scope.editDoc.dateModifiedFromNow = moment($scope.editDoc.dateModified, "YYYY-MM-DDTHH:mm:ssZ").fromNow();
			$scope.originalSlug = data.slug;
		});

		$http.get('/docs/submenu').success( function (submenu) {
			$scope.submenu = submenu;

			for (i in $scope.submenu) {
				if ($scope.submenu[i]['parent'] == $scope.originalSlug) {
					$scope.hasChildren = true; 
				}
			}
		});

		$scope.updateDoc = function () { 

			$http.post('/docs/update', $scope.editDoc)
			.success(function (data) {
				$window.location.href = "/#/docs/" + data.success;				
			})
			.error(function () { 
				$scope.errorMessage = "Something went horribly wrong. Don't panic, contact professional help!"; 
			});
		};

		$scope.confirmDelete = function() {

			if ($scope.hasChildren === true) {

				$scope.errorMessage = "This document has children! Please find them a foster family first. Geez!"; 

			} else {

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