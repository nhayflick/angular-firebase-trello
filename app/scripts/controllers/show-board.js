'use strict';

/**
 * @ngdoc function
 * @name angularTrelloApp.controller:ShowBoardCtrl
 * @description
 * # ShowBoardCtrl
 * Controller of the angularTrelloApp
 */
app.controller('ShowBoardCtrl', function ($scope, $routeParams, $q, $http, $filter) {
	$scope.sortableOptions = {
		connectWith: '.list-cards',
    stop: function(e, ui) {
    	$scope.lists.forEach(function(list) {
    		var oldCardIds = list.card_ids;
	  		for (var i = 0; i < list.cards.length; i++) {
	  			list.card_ids[i] = list.cards[i]['id'];
	  		}
	  		if (list.card_ids.toString() != oldCardIds.toString()) {
	  			$http.post('/lists/' + list.id, list);
	  		}
	  	});
    }
  };
	// Fetch board from API
	var deferred = $q.defer();
	$http.get('/boards/' + $routeParams.boardId).success(function(data) {
    deferred.resolve(data);
	});
  deferred.promise.then(function(board) {
  	$scope.board = board;
  	$scope.lists = board.lists;
  	$scope.users = board.users;
  });
  // Because UI-Sortable needs an array of items, create one for every new list
  $scope.$watchCollection('lists', function(newLists, oldLists){
  	angular.forEach(newLists, function(list) {
  		list.cards = $filter('filter')($scope.board.cards, {list_id: list.id});
  	});
  });
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
			list_id: list.id,
			list_index: list.cards.length
			// creatorUID: Authenticate.user.uid
		};
		var deferred = $q.defer();
		$http.post('/cards', newCard).success(function(data) {
		  deferred.resolve(data);
		});
		// Once server returns the new card, we can add it back to the board object
		deferred.promise.then(function(card) {
			addNewCardToList(card, list);
		});
		list.card = {};
	};
	$scope.addUserToCard = function (user, card) {
		// card.users.$add(user);
	};
	function addNewCardToList(card, list) {
		list.cards.push(card);
		list.card_ids.push(card.id);
		$http.post('/lists/' + list.id, list);
	}
});