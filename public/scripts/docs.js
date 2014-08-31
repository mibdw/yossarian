var ctrl = angular.module('docs', []);

ctrl.controller('docsController', ['$scope', '$rootScope', '$routeParams', '$http', '$sce',
	function ($scope, $rootScope, $routeParams, $http, $sce) {	
		$rootScope.slug = 'docs';
		$rootScope.heading = 'Documents'; 
		$rootScope.moniker = $rootScope.heading + $rootScope.seperator + $rootScope.masthead;

		$scope.docsMenu = [];
		$http.post('/docs/menu').success( function (menu) {
			$scope.docsMenu = menu;
			if ($routeParams.slug) {
				$scope.currentSlug = $routeParams.slug;
			} else {
				$scope.currentSlug = $scope.docsMenu[0].slug;
			}

			$scope.currentDoc = {};
			$http.post('/docs/detail', { 'slug': $scope.currentSlug }).success( function (docData) {
				$scope.currentDoc = docData;

				$http.post('/marked', { 'text': $scope.currentDoc.body }).success( function (markedText) {
					$scope.currentDoc.marked = $sce.trustAsHtml(markedText);
				});
			});
		});
	}
]);

ctrl.controller('docsCreate', ['$scope', '$rootScope', '$http',
	function ($scope, $rootScope, $http) {	
		$rootScope.slug = 'docs';
		$rootScope.heading = 'Documents \u00BB Create document'; 
		$rootScope.moniker = $rootScope.heading + $rootScope.seperator + $rootScope.masthead;

		var uncategorized = '';
		for (i in $rootScope.categoryList) {
			if ($rootScope.categoryList[i].slug == 'uncategorized') {
				uncategorized = $rootScope.categoryList[i]._id;
			}
		}

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
			if ($scope.createDoc.categories.length < 1) {
				$scope.createDoc.categories.push(uncategorized);
			}

			$http.post('/docs/create', $scope.createDoc).success( function (data) {
				window.location.pathname = '/#/docs/' + $scope.createDoc.slug;	
			});
		}
	}
]);

ctrl.controller('docsUpdate', ['$scope', '$rootScope', '$routeParams', '$http',
	function ($scope, $rootScope, $routeParams, $http) {	
		$rootScope.slug = 'docs';
		$rootScope.heading = 'Documents \u00BB Update document'; 
		$rootScope.moniker = $rootScope.heading + $rootScope.seperator + $rootScope.masthead;

		var uncategorized = '';
		for (i in $rootScope.categoryList) {
			if ($rootScope.categoryList[i].slug == 'uncategorized') {
				uncategorized = $rootScope.categoryList[i]._id;
			}
		}

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
			if ($scope.updateDoc.categories.length < 1) {
				$scope.updateDoc.categories.push(uncategorized);
			}

			$http.post('/docs/update', $scope.updateDoc).success( function (data) {
				window.location.pathname = '/#/docs/' + $scope.updateDoc.slug;	
			});
		}

		$scope.removeDoc = function () {
			if (confirm('Are you sure you want to remove this document?') == true) {
				$http.post('/docs/remove', { remove: $scope.updateDoc._id }).success( function (data) {
					window.location.pathname = '/#/docs';	
				});
			}
		};
	}
]);