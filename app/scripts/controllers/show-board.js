'use strict';

/**
 * @ngdoc function
 * @name angularTrelloApp.controller:ShowBoardCtrl
 * @description
 * # ShowBoardCtrl
 * Controller of the angularTrelloApp
 */
app.controller('ShowBoardCtrl', function ($scope, $routeParams, $q, $http, $filter, $modal) {
	$scope.sortableOptions = function(list, card) {
		return {
			connectWith: '.list-cards',
			beforeStop: function(e, ui) {
				var oldIndex = ui.item.index();
			},
			remove: function(e, ui) {
				list.card_ids.splice(ui.item.sortable.index, 1);
				$http.post('/lists/' + list.id, list);
			},
			receive: function(e, ui) {
				ui.item.sortable.crosslist = true;
			},
			stop: function(e, ui) {
				// New Index
				$scope.lists.forEach(function(list) {
					var oldListLength = list.card_ids.length;
					var needsUpdate = false;
			  		for (var i = 0; i < list.cards.length; i++) {
			  			if (list.card_ids[i] != list.cards[i]['id']) {
			  				needsUpdate = true;
			  				list.card_ids[i] = list.cards[i]['id'];
			  			}
			  		}
			  		if (oldListLength < list.card_ids.length)  {
			  			var targetId = list.card_ids[ui.item.sortable.dropindex];
			  			var droppedCard = $filter('filter')(list.cards, {id: targetId})[0];
			  			droppedCard.list_id = list.id;
			  			$http.post('/cards/' + droppedCard.id, droppedCard);
			  		}
			  		// Post updated list order to server
			  		if (needsUpdate) {
			  			$http.post('/lists/' + list.id, list);
			  		}
			  	});
			}
		}
 	};
	// Fetch board from API
	var deferred = $q.defer();
	$http.get('/boards/' + $routeParams.boardId).success(function(data) {
    deferred.resolve(data);
	});
	deferred.promise.then(function(board) {
		console.log(board);
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
	$scope.openCard = function (card) {
	    var modalInstance = $modal.open({
	      templateUrl: 'views/show-card.html',
	      // backdrop: false,
	      controller: 'EditCardModalInstanceCtrl',
	      resolve: {
	        card: function() {
	        	console.log(card);
	        	return card;
	        },
	        users: function() {
	        	return $scope.users;
	        }
	      }
	    });
	}
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