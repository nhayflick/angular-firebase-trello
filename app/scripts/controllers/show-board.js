'use strict';

/**
 * @ngdoc function
 * @name angularTrelloApp.controller:ShowBoardCtrl
 * @description
 * # ShowBoardCtrl
 * Controller of the angularTrelloApp
 */
app.controller('ShowBoardCtrl', function ($scope, $routeParams, $q, $http) {
	var deferred = $q.defer();

	console.log($routeParams.boardId);

	$http.get('/boards/' + $routeParams.boardId).success(function(data) {
    deferred.resolve(data);
    console.log("resolved");
	});

  deferred.promise.then(function(board) {
  	$scope.board = board;
  });
	// $scope.users = User.all();
	// $scope.lists = Board.lists($routeParams.boardId);
	// // When lists API call is returned succesfully, query for cards 
	// $scope.lists.$loaded().then(function () {
	// 	angular.forEach($scope.lists, function (list) {
	// 		// N+1 query = bad
	// 		list.cards = List.cards(list.$id);
	// 		list.cards.$loaded().then(function () {
	// 			angular.forEach(list.cards, function (card) {
	// 				card.users = Card.users(card.$id);
	// 			});
	// 		});
	// 	});
	// });

	$scope.addList = function () {
		var list = {
			name: $scope.list.name,
			creatorUID: Authenticate.user.uid,
			cards: false
		};
		// $scope.lists.$add(list).then(function () {
		// 	// N+1 query = bad
		// 	list.cards = List.cards(list.$id);
		// 	// list.cards.$loaded().then(function (p) {
		// 	// 	console.log(p);
		// 	// 	list.cards = List.cards(list.$id);
		// 	// });
		// });
		$scope.list.name = '';
	};
	// Create a task card and add it to a list
	$scope.addCard = function (list) {
		list.card = {
			name: list.card.name,
			description: list.card.description,
			creatorUID: Authenticate.user.uid
		};
		// list.cards.$add(list.card);
		list.card.name = '';
		list.card.description = '';
	};
	$scope.addUserToCard = function (user, card) {
		// card.users.$add(user);
	};
});