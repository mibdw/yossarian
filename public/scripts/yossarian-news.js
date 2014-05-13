var ctrl = angular.module('yossarianArticles', []);

// NEWS
ctrl.controller('yossarianArticleIndex', ['$scope', '$rootScope', '$http', '$window',
	function ($scope, $rootScope, $http, $window) {	

		$rootScope.subTitle = "";
		$scope.listCriteria = {
			'articlesActiveCategories': [],
			'articlesVisible': 10,
			'articlesSort': '-dateCreated',
			'articlesPage': 1
		};

		function newArticleList() {

			$http.post('/news/list', $scope.listCriteria).success( function (data) {
				$scope.articleList = data;

				for (i in $scope.articleList) {
					$scope.articleList[i].dateCreatedFromNow = moment($scope.articleList[i].dateCreated, "YYYY-MM-DDTHH:mm:ssZ").fromNow();
					$scope.articleList[i].dateCreatedPretty = moment($scope.articleList[i].dateCreated, "YYYY-MM-DDTHH:mm:ssZ").format('dddd, DD MMMM YYYY HH:mm:ss');
					$scope.articleList[i].excerpt = $scope.articleList[i].body.substr(0, 300);
					$scope.articleList[i].indexNo = i;

					var commentsAmount = $scope.articleList[i].comments.length;
					if (commentsAmount == 0) {
						$scope.articleList[i].commentNo = "No comments";
					} else if (commentsAmount == 1) {
						$scope.articleList[i].commentNo = "1 comment";
					} else {
						$scope.articleList[i].commentNo = commentsAmount + " comments";
					}
				}
			});

			$http.post('/news/list/total', $scope.listCriteria).success( function (total) {
				$scope.totalArticles = total;
				$scope.totalArticles.pages = [];
				var highEnd = ($scope.totalArticles.totalArticles / $scope.listCriteria.articlesVisible) + 0.99999;

				for (var i = 1; i <= highEnd; i++) {
					$scope.totalArticles.pages.push(i);
				}
			});
		};

		newArticleList();
		$http.get('/settings/categories').success( function (categories) { $scope.articlesCategories = categories.categories; });

		app.filter('slice', function() {
			return function(arr, start, end) {
				return (arr || []).slice(start, end);
			};
		});

		$scope.articleCategoryToggle = function (index) {
		
			var catIndex = $scope.listCriteria.articlesActiveCategories.indexOf($scope.articlesCategories[index]);

			if (catIndex >= 0) {
				$scope.listCriteria.articlesActiveCategories.splice(catIndex, 1);
			} else {
				$scope.listCriteria.articlesActiveCategories.push($scope.articlesCategories[index]);
			}

			$scope.listCriteria.articlesPage = 1;
			newArticleList();
		};

		$scope.articleDetail = function (index) { $window.location.href = "/#/news/" + $scope.articleList[index].slug; };
		$scope.newArticlesVisible = function () { 
			$scope.listCriteria.articlesPage = 1;
			newArticleList(); 
		};

		$scope.$watch('listCriteria.articlesPage', function() {
			newArticleList(); 
		});

	}
]);

ctrl.controller('yossarianArticlePost', ['$scope', '$rootScope', '$http', '$window', '$sce',
	function ($scope, $rootScope, $http, $window, $sce) {	

		$rootScope.subTitle = "\u00BB New article";
		$scope.newArticle = {};
		$scope.newArticle.category = ['Uncategorized'];

		$http.get('/settings/categories').success( function (categories) { $scope.articlesCategories = categories.categories; });

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
				$window.location.href = "/#/news/" + data; 
			})
			.error(function () { 
				$scope.errorMessage = "Something went wrong dude. Get your shit together!"; 
			});			
		};

		$scope.previewArticle = function () {

			if (!$scope.newArticle.body) { $scope.errorMessage = "Preview a vaccuum? Interesting concept, but impossible." }

			$http.post('/news/preview', {'previewBody': $scope.newArticle.body})
			.success(function (data) {
				$scope.previewBody = $sce.trustAsHtml(data);
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
			$scope.article.dateModifiedFromNow = moment($scope.article.dateModified, "YYYY-MM-DDTHH:mm:ssZ").fromNow();
			$scope.article.dateModifiedPretty = moment($scope.article.dateModified, "YYYY-MM-DDTHH:mm:ssZ").format('dddd, DD MMMM YYYY HH:mm:ss');
			$rootScope.subTitle = "\u00BB " + $scope.article.title;	

			for (i in $scope.article.comments) {
				$scope.article.comments[i].dateCreatedFromNow = moment($scope.article.comments[i].dateCreated, "YYYY-MM-DDTHH:mm:ssZ").fromNow();
				$scope.article.comments[i].body = $sce.trustAsHtml($scope.article.comments[i].body);
			}
		});

		$scope.postComment = function () {

			var commentBody = { 
				'articleId': $scope.article._id,
				'commentBody': $scope.commentBody 
			};

			$http.post('/news/comment/add', commentBody)
			.success(function (data) {
				$scope.article.comments = data;	
				$scope.commentBody = "";
				
				for (i in $scope.article.comments) {
					$scope.article.comments[i].dateCreatedFromNow = moment($scope.article.comments[i].dateCreated, "YYYY-MM-DDTHH:mm:ssZ").fromNow();
					$scope.article.comments[i].body = $sce.trustAsHtml($scope.article.comments[i].body);
				}		
			})
			.error(function () { 
				$scope.errorMessage = "Something went horribly wrong. Don't panic, contact professional help!"; 
			});
		};

		$scope.deleteComment = function (commentId) {

			var commentPackage = { 
				'articleId': $scope.article._id,
				'commentId': commentId
			};

			$http.post('/news/comment/delete', commentPackage)
			.success(function (data) {
				$scope.article.comments = data;	
				$scope.commentBody = "";
				
				for (i in $scope.article.comments) {
					$scope.article.comments[i].dateCreatedFromNow = moment($scope.article.comments[i].dateCreated, "YYYY-MM-DDTHH:mm:ssZ").fromNow();
					$scope.article.comments[i].body = $sce.trustAsHtml($scope.article.comments[i].body);
				}		
			})
			.error(function () { 
				$scope.errorMessage = "Something went horribly wrong. Don't panic, contact professional help!"; 
			});
		};
	}
]);

ctrl.controller('yossarianArticleEdit', ['$scope', '$rootScope', '$http', '$window', '$routeParams', '$sce',
	function ($scope, $rootScope, $http, $window, $routeParams, $sce) {	

		$http.get('/news/edit/' + $routeParams.articleSlug).success( function (data) {
			$scope.editArticle = data;
			$scope.editArticle.dateCreatedFromNow = moment($scope.editArticle.dateCreated, "YYYY-MM-DDTHH:mm:ssZ").fromNow();
			$scope.editArticle.dateCreatedPretty = moment($scope.editArticle.dateCreated, "YYYY-MM-DDTHH:mm:ssZ").format('dddd, DD MMMM YYYY HH:mm:ss');
			$scope.editArticle.dateModifiedFromNow = moment($scope.editArticle.dateModified, "YYYY-MM-DDTHH:mm:ssZ").fromNow();
			$scope.editArticle.dateModifiedPretty = moment($scope.editArticle.dateModified, "YYYY-MM-DDTHH:mm:ssZ").format('dddd, DD MMMM YYYY HH:mm:ss');
			$rootScope.subTitle = "\u00BB Edit article";	
		});
		
		$http.get('/settings/categories').success( function (categories) { $scope.articlesCategories = categories.categories; });

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

		$scope.updateArticle = function () { 

			$http.post('/news/update', $scope.editArticle)
			.success(function (data) {
				$window.location.href = "/#/news/" + data;				
			})
			.error(function () { 
				$scope.errorMessage = "Something went horribly wrong. Don't panic, contact professional help!"; 
			});
		};

		$scope.confirmDelete = function() {
			$scope.confirmMessage = "Are you sure you want to delete this article?";
		};

		$scope.deleteArticle = function () { 

			$scope.confirmMessage = "";

			$http.post('/news/delete', { 'id': $scope.editArticle._id })
			.success(function (data) {
				$window.location.href = "/#/news";
			});
		};

		$scope.previewArticle = function () {

			if (!$scope.editArticle.body) { $scope.errorMessage = "Preview a vaccuum? Interesting concept, but impossible." }

			$http.post('/news/preview', {'previewBody': $scope.editArticle.body})
			.success(function (data) {
				$scope.previewBody = $sce.trustAsHtml(data);
			});
		};

	}
]);