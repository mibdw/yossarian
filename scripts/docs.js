var ctrl = angular.module('docs', []);

ctrl.controller('docsController', ['$scope', '$rootScope', '$routeParams', '$http', '$sce',
	function ($scope, $rootScope, $routeParams, $http, $sce) {	
		$rootScope.slug = 'docs';
		$rootScope.heading = 'Knowledge base'; 
		$rootScope.moniker = $rootScope.heading + $rootScope.seperator + $rootScope.masthead;

		$scope.docsMenu = [];
		$http.post('/docs/menu').success( function (menu) {
			$scope.docsMenu = menu;
			if ($routeParams.slug) {
				$scope.currentSlug = $routeParams.slug;
			} else {
				var parentLess = [];
				for (i in $scope.docsMenu) {
					if ($scope.docsMenu[i].parent == 'none') {
						parentLess.push($scope.docsMenu[i]);
					}
				}

				parentLess = parentLess.sort(function (low, high) {
					return low.order - high.order;
				});
				$scope.currentSlug = parentLess[0].slug;
			}

			$scope.currentDoc = {};
			$http.post('/docs/detail', { 'slug': $scope.currentSlug }).success( function (docData) {
				$scope.currentDoc = docData;

				$http.post('/marked', { 'text': $scope.currentDoc.body }).success( function (markedText) {
					$scope.currentDoc.marked = $sce.trustAsHtml(markedText);
				});

				$rootScope.heading = $scope.currentDoc.title + ' \u00AB Knowledge base'; 
				$rootScope.moniker = $rootScope.heading + $rootScope.seperator + $rootScope.masthead;
			});

		});

		$scope.gotoDoc = function (slug) {
			window.location.pathname = "/#/docs/" + slug;
		}
	}
]);

ctrl.controller('docsCreate', ['$scope', '$rootScope', '$http', '$sce',
	function ($scope, $rootScope, $http, $sce) {	
		$rootScope.slug = 'docs';
		$rootScope.heading = 'Create document \u00AB Documents'; 
		$rootScope.moniker = $rootScope.heading + $rootScope.seperator + $rootScope.masthead;

		var uncategorized = '';
		for (i in $rootScope.categoryList) {
			if ($rootScope.categoryList[i].slug == 'uncategorized') {
				uncategorized = $rootScope.categoryList[i]._id;
			}
		}

		$scope.docParents = [];
		$http.post('/docs/menu').success( function (menu) {
			$scope.docParents = menu;
		});

		$scope.createDoc = {
			categories: [uncategorized],
			parent: 'none'
		};

		$scope.categoryToggle = function (id) {
			if ($scope.createDoc.categories.indexOf(id) > -1) {
				var index = $scope.createDoc.categories.indexOf(id);
				$scope.createDoc.categories.splice(index, 1);
			} else if ($scope.createDoc.categories.indexOf(id) == -1) {
				$scope.createDoc.categories.push(id);
			}
		}

		$scope.createDocument = function () {
			$scope.createDoc.slug = $rootScope.slugify($scope.createDoc.title);
			$scope.createDoc.postDate = moment();
			$scope.createDoc.author = $rootScope.user._id;
			if ($scope.createDoc.title == 'None') {
				$scope.createDoc.title = 'No title';
			}
			if ($scope.createDoc.categories.length < 1) {
				$scope.createDoc.categories.push(uncategorized);
			}

			$http.post('/docs/create', $scope.createDoc).success( function (data) {
				window.location.pathname = '/#/docs/' + $scope.createDoc.slug;	
			});
		}

		$scope.previewDocument = function () {
			$http.post('/marked', { 'text': $scope.createDoc.body }).success( function (markedText) {
				$scope.previewVisible = true;
				$scope.preview = $sce.trustAsHtml(markedText);
			});
		}
	}
]);

ctrl.controller('docsUpdate', ['$scope', '$rootScope', '$routeParams', '$http', '$sce',
	function ($scope, $rootScope, $routeParams, $http, $sce) {	
		$rootScope.slug = 'docs';
		$rootScope.heading = 'Update document \u00AB Documents'; 
		$rootScope.moniker = $rootScope.heading + $rootScope.seperator + $rootScope.masthead;

		var uncategorized = '';
		for (i in $rootScope.categoryList) {
			if ($rootScope.categoryList[i].slug == 'uncategorized') {
				uncategorized = $rootScope.categoryList[i]._id;
			}
		}

		$scope.docParents = [];
		$http.post('/docs/menu').success( function (menu) {
			$scope.docParents = menu;
		});

		$scope.updateSlug = $routeParams.slug;
		$scope.updateDoc = {};
		$http.post('/docs/detail', { 'slug': $scope.updateSlug }).success( function (docData) {

			var strippedCategories = [];
			for (i in docData.categories) {
				strippedCategories.push(docData.categories[i]._id);
			}

			docData.categories = strippedCategories;
			$scope.updateDoc = docData;
		});

		$scope.categoryToggle = function (id) {
			if ($scope.updateDoc.categories.indexOf(id) > -1) {
				var index = $scope.updateDoc.categories.indexOf(id);
				$scope.updateDoc.categories.splice(index, 1);
			} else if ($scope.updateDoc.categories.indexOf(id) == -1) {
				$scope.updateDoc.categories.push(id);
			}
		}

		$scope.updateDocument = function () {
			$scope.updateDoc.slug = $rootScope.slugify($scope.updateDoc.title);
			$scope.updateDoc.editDate = moment();
			$scope.updateDoc.author = $scope.updateDoc.author._id;
			$scope.updateDoc.editor = $rootScope.user._id;
			if ($scope.updateDoc.title == 'None') {
				$scope.updateDoc.title = 'No title';
			}
			if ($scope.updateDoc.categories.length < 1) {
				$scope.updateDoc.categories.push(uncategorized);
			}

			$http.post('/docs/update', $scope.updateDoc).success( function (data) {
				window.location.pathname = '/#/docs/' + $scope.updateDoc.slug;	
			});
		}

		$scope.removeDoc = function () {
			var children = [];
			for (i in $scope.docParents) {
				if ($scope.docParents[i].parent == $scope.updateDoc.slug) {
					children.push($scope.docParents[i].slug);
				}
			}

			if (children.length > 0) {
				alert('This document has child-documents. Unable to remove.');
			} else {

				if (confirm('Are you sure you want to remove this document?') == true) {
					$http.post('/docs/remove', { remove: $scope.updateDoc._id }).success( function (data) {
						window.location.pathname = '/#/docs';	
					});
				}	
			}
		};

		$scope.previewDocument = function () {
			if ($scope.preview) {
				$scope.preview = !$scope.preview;
			} else {
				$http.post('/marked', { 'text': $scope.updateDoc.body }).success( function (markedText) {
					$scope.previewVisible = true;
					$scope.preview = $sce.trustAsHtml(markedText);
				});	
			}
		}
	}
]);