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
	$http.get('/boards/' + $routeParams.boardId).success(function(data) {
    deferred.resolve(data);
	});
  deferred.promise.then(function(board) {
  	$scope.board = board;
  	$scope.lists = board.lists;
  	$scope.cards = board.cards;
  	$scope.users = board.users;
  });
  	// $scope.lists = Board.lists($routeParams.boardId);
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
		var newList = {
			name: $scope.list.name,
			// creatorUID: Authenticate.user.uid,
			board_id: $scope.board.id,
			cards: false
		};
		var deferred = $q.defer();
		$http.post('/lists', newList).success(function(data) {
		  deferred.resolve(data);
		});
		// After server returns the new list, add it to the board object.
		deferred.promise.then(function(list) {
			$scope.board.lists.push(list);
		});
		$scope.list = {};
	};
	// Create a task card and add it to a list
	$scope.addCard = function (list) {
		var newCard = {
			name: list.card.name,
			description: list.card.description,
			board_id: $scope.board.id,
			list_id: list.id
			// creatorUID: Authenticate.user.uid
		};
		var deferred = $q.defer();
		$http.post('/cards', newCard).success(function(data) {
		  deferred.resolve(data);
		});
		// Once server returns the new card, we can add it back to the board object
		deferred.promise.then(function(card) {
			$scope.board.cards.push(card);
		});
		list.card = {};
	};
	$scope.addUserToCard = function (user, card) {
		// card.users.$add(user);
	};
});