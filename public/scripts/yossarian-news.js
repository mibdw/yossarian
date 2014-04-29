var ctrl = angular.module('yossarianArticles', []);
var categories = [
	{ 'slug': 'uncategorized', 'name': 'Uncategorized', 'active': false },
	{ 'slug': 'publishers', 'name': 'Publishers', 'active': false },
	{ 'slug': 'customers', 'name': 'Customers', 'active': false },
	{ 'slug': 'events', 'name': 'Events', 'active': false },
	{ 'slug': 'it', 'name': 'IT', 'active': false }
];

// NEWS
ctrl.controller('yossarianArticleIndex', ['$scope', '$rootScope', '$http',
	function ($scope, $rootScope, $http) {	

		$scope.articleCategories = categories;

		$scope.articleCategoryToggle = function (index) {
			$scope.articleCategories[index].active = !$scope.articleCategories[index].active;
		};

		$http.get('/news/list').success( function (data) {
			$scope.articleList = data;

			for (i in $scope.articleList) {
				$scope.articleList[i].dateCreatedFromNow = moment($scope.articleList[i].dateCreated, "YYYY-MM-DDTHH:mm:ssZ").fromNow();
				$scope.articleList[i].dateCreatedPretty = moment($scope.articleList[i].dateCreated, "YYYY-MM-DDTHH:mm:ssZ").format('dddd, DD MMMM YYYY HH:mm:ss');
				$scope.articleList[i].excerpt = $scope.articleList[i].body.substr(0, 300);

				$http.get('/user/get/' + $scope.articleList[i].author).success( function (hero) {
					$scope.articleList[i].hero = hero;
				});
			}
		});

		$scope.articleDetail = function (index) {
			alert("Let's go to the article!");
		};
	}
]);

ctrl.controller('yossarianArticlePost', ['$scope', '$rootScope', '$http',
	function ($scope, $rootScope, $http) {	

		$rootScope.subTitle = "\u00BB New article";
		$scope.newArticle = {};
		$scope.newArticle.category = categories;

		for (i in $scope.newArticle.category) {
			if ($scope.newArticle.category[i].slug == 'uncategorized') {
				$scope.newArticle.category[i].active = true;
				var uncategorizedIndex = i;
			}
		}

		$scope.articleCategoryToggle = function (index) {
			$scope.newArticle.category[index].active = !$scope.newArticle.category[index].active;
		};

		$scope.postArticle = function () {

			var activeCategories = 0;
			for (i in $scope.newArticle.category) {
				if ($scope.newArticle.category[i].active == true) {
					activeCategories++;
				}
			}

			if (activeCategories == 0) { 
				$scope.newArticle.category[uncategorizedIndex].active = true;
			}

			$http.post('/news/post', $scope.newArticle)
			.success(function (data) { 
				$window.location.href = "/#/news/" + data.success; 
			})
			.error(function () { 
				$scope.errorMessage = "Something went wrong dude. Get your shit together!"; 
			});

			
		};
	}
]);