var ctrl = angular.module('yossarianArticles', []);
var categories = ['Uncategorized', 'Publishers', 'Customers', 'Events', 'IT'];

// NEWS
ctrl.controller('yossarianArticleIndex', ['$scope', '$rootScope', '$http', '$window',
	function ($scope, $rootScope, $http, $window) {	

		$rootScope.subTitle = "";
		$scope.articlesCategories = categories;
		$scope.articlesActiveCategories = [];
		$scope.articlesVisible = 10;

		$scope.articleCategoryToggle = function (index) {
		
			var catIndex = $scope.articlesActiveCategories.indexOf($scope.articlesCategories[index]);
			if (catIndex >= 0) {
				$scope.articlesActiveCategories.splice(catIndex, 1);
			} else {
				$scope.articlesActiveCategories.push($scope.articlesCategories[index]);
			}
		};

		$http.get('/news/list').success( function (data) {
			$scope.articleList = data;

			for (i in $scope.articleList) {
				$scope.articleList[i].dateCreatedFromNow = moment($scope.articleList[i].dateCreated, "YYYY-MM-DDTHH:mm:ssZ").fromNow();
				$scope.articleList[i].dateCreatedPretty = moment($scope.articleList[i].dateCreated, "YYYY-MM-DDTHH:mm:ssZ").format('dddd, DD MMMM YYYY HH:mm:ss');
				$scope.articleList[i].excerpt = $scope.articleList[i].body.substr(0, 300);
				$scope.articleList[i].indexNo = i;
			}
		});

		$scope.articleFilter = function (article) {

			if ($scope.articlesActiveCategories == 0) { 
				
				return true; 

			} else {

				for (i in article.category) {
					var activeCatIndex = $scope.articlesActiveCategories.indexOf(article.category[i]);

					if (activeCatIndex >= 0) { return true; }
				}
			}

			return false;
		}

		$scope.articleDetail = function (index) {
			$window.location.href = "/#/news/" + $scope.articleList[index].slug;
		};
	}
]);

ctrl.controller('yossarianArticlePost', ['$scope', '$rootScope', '$http', '$window',
	function ($scope, $rootScope, $http, $window) {	

		$rootScope.subTitle = "\u00BB New article";
		$scope.articlesCategories = categories;
		$scope.newArticle = {};
		$scope.newArticle.category = ['Uncategorized'];

		$scope.articleCategoryToggle = function (index) {
		
			var catIndex = $scope.newArticle.category.indexOf($scope.articlesCategories[index]);
			
			if (catIndex >= 0) {
				$scope.newArticle.category.splice(catIndex, 1);
			} else {
				$scope.newArticle.category.push($scope.articlesCategories[index]);
			}

			var catAmount = $scope.newArticle.category.length;

			if (catAmount == 0) {

				$scope.newArticle.category.push('Uncategorized');

			} else if (catAmount >= 2) {

				var uncatIndex = $scope.newArticle.category.indexOf('Uncategorized');
				if (uncatIndex >= 0) { $scope.newArticle.category.splice(uncatIndex, 1); }
				
			}
		};

		$scope.postArticle = function () {

			$http.post('/news/post', $scope.newArticle)
			.success(function (data) { 
				$window.location.href = "/#/news"; 
			})
			.error(function () { 
				$scope.errorMessage = "Something went wrong dude. Get your shit together!"; 
			});

			
		};
	}
]);

ctrl.controller('yossarianArticleDetail', ['$scope', '$rootScope', '$http', '$window', '$routeParams', '$sce',
	function ($scope, $rootScope, $http, $window, $routeParams, $sce) {	

		$http.get('/news/detail/' + $routeParams.articleSlug).success( function (data) {
			$scope.article = data;
			$scope.article.body = $sce.trustAsHtml($scope.article.body);
			$scope.article.dateCreatedFromNow = moment($scope.article.dateCreated, "YYYY-MM-DDTHH:mm:ssZ").fromNow();
			$scope.article.dateCreatedPretty = moment($scope.article.dateCreated, "YYYY-MM-DDTHH:mm:ssZ").format('dddd, DD MMMM YYYY HH:mm:ss');
			$rootScope.subTitle = "\u00BB " + $scope.article.title;	
		});

	}
]);

ctrl.controller('yossarianArticleEdit', ['$scope', '$rootScope', '$http', '$window', '$routeParams', '$sce',
	function ($scope, $rootScope, $http, $window, $routeParams, $sce) {	

		$http.get('/news/edit/' + $routeParams.articleSlug).success( function (data) {
			$scope.editArticle = data;
			$scope.editArticle.body = $sce.trustAsHtml($scope.editArticle.body);
			$scope.editArticle.dateCreatedFromNow = moment($scope.editArticle.dateCreated, "YYYY-MM-DDTHH:mm:ssZ").fromNow();
			$scope.editArticle.dateCreatedPretty = moment($scope.editArticle.dateCreated, "YYYY-MM-DDTHH:mm:ssZ").format('dddd, DD MMMM YYYY HH:mm:ss');
			$rootScope.subTitle = "\u00BB " + $scope.editArticle.title;	
		});

		$scope.articlesCategories = categories;

		$scope.articleCategoryToggle = function (index) {
		
			var catIndex = $scope.editArticle.category.indexOf($scope.articlesCategories[index]);
			
			if (catIndex >= 0) {
				$scope.editArticle.category.splice(catIndex, 1);
			} else {
				$scope.editArticle.category.push($scope.articlesCategories[index]);
			}

			var catAmount = $scope.editArticle.category.length;

			if (catAmount == 0) {

				$scope.editArticle.category.push('Uncategorized');

			} else if (catAmount >= 2) {

				var uncatIndex = $scope.editArticle.category.indexOf('Uncategorized');
				if (uncatIndex >= 0) { $scope.editArticle.category.splice(uncatIndex, 1); }
				
			}
		};

	}
]);
