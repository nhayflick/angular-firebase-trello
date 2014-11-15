'use strict';

/**
 * @ngdoc function
 * @name angularFirebaseTrelloApp.controller:ShowBoardCtrl
 * @description
 * # ShowBoardCtrl
 * Controller of the angularFirebaseTrelloApp
 */
app.controller('ShowBoardCtrl', function ($scope, $routeParams, Board, List, Card, Authenticate, User, $firebase, FIREBASE_URL) {
	$scope.board = Board.get($routeParams.boardId);
	$scope.users = User.all();
	$scope.lists = Board.lists($routeParams.boardId);
	$scope.draggableLists = {};
	var startIndex = 0;
	var card;
	$scope.sortableOptions = function(list) {
		return {
			connectWith: ".cards-container",
			dropOnEmpty: true,
			start: function (e, ui) {
				// Grab the items index before it is moved
				startIndex = ui.item.index();
			},
			beforeStop: function (e, ui) {
				var addToList = ui.item.parent()[0];
				// Identifies a cross-list drag operation
				if (this !== addToList) {
					card = list.cards[startIndex];
					// Trigger $add to update Firebase array
					$(addToList).scope().list.cards.$add(card);
				}
			},
			remove: function (e, ui) {
				// Trigger $remove to update Firebase array
				list.cards.$remove(startIndex);
			},
			stop: function (e, ui) {
				// var draggableCards = $scope.draggableLists[list.$id].cards;
				console.log($scope.draggableLists);
				angular.forEach($scope.draggableLists, function(draggableList, i) {
					console.log(draggableList);
					angular.forEach(draggableList.cards, function(value, index) {
				      var card = $scope.lists.$getRecord(draggableList.$id).cards.$getRecord(value.$id);
				      console.log(card);
				      // Reorder items on backend by updating priority to match array index
				      if (card.$priority != index) {
					      card.$priority = index;
					      list.cards.$save(card);
					    }
				    });
				});
		    }
		}
	};

	$scope.lists.$watch(function(notification){
		if (notification.event === 'child_added') {
			// Lookup object in FireBase array by key
			var list = $scope.lists.$getRecord(notification.key);
			// Fetch cards object from backend by ID
			list.cards = List.cards(list.$id);
			$scope.draggableLists[list.$id] = angular.copy(list);
			$scope.draggableLists[list.$id]['cards'] = [];
			list.cards.$watch(function (notification) {
				if (notification.event === 'child_added') {
					// Lookup object in FireBase array by key
					var card = list.cards.$getRecord(notification.key);
						// Fetch user object from backend by ID
					card.users = Card.users(card.$id);
					$scope.draggableLists[list.$id].cards.push(card);
				}
			});
		}
	});

	$scope.addList = function () {
		var list = {
			name: $scope.list.name,
			creatorUID: Authenticate.user.uid,
			cards: false
		};
		$scope.lists.$add(list).then(function () {
			list.cards = List.cards(list.$id);
		});
		$scope.list.name = '';
	};
	// Create a task card and add it to a list
	$scope.addCard = function (list) {
		list.card = {
			name: list.card.name,
			description: list.card.description || '',
			creatorUID: Authenticate.user.uid
		};
		list.cards.$add(list.card);
		list.card.name = '';
		list.card.description = '';
	};
	$scope.addUserToCard = function (user, card) {
		var ref = new Firebase(FIREBASE_URL + '/user_cards/' + user.$id + '/' + card.$id);
		var sync = $firebase(ref);
		// Uniqueness validated here on backend
		sync.$set(true).then(function(){
			// if object was validated unique in user_cards then add to card.users
			var ref = new Firebase(FIREBASE_URL + '/card/' + card.$id + '/users');
			var sync = $firebase(ref);
			var content = {};
			var userObject = {
				name: user.name,
				md5_hash: user.md5_hash
			};
			content[user.$id] = userObject;
			sync.$update(content);
		});
	};
	$scope.removeUserFromCard = function (user, card) {
		var ref = new Firebase(FIREBASE_URL + 'user_cards/' + user.$id + '/' + card.$id);
		var sync = $firebase(ref);
		sync.$remove();
		var refB = new Firebase(FIREBASE_URL + 'card/' + card.$id + '/users/' + user.$id);
		// console.log(FIREBASE_URL + 'card/' + card.$id + '/users/' + user.$id);
		var syncB = $firebase(refB);
		syncB.$remove();
		// console.log(refB);

		// Uniqueness validated here on backend
		// card.users.$remove(user);
	};
	$scope.userIsOnCard = function (user, card) {
		// console.log(user.$id);
		// console.log(user.name);
		// console.log( card.users.$indexFor(user.$id) > -1);
		return card.users.$indexFor(user.$id) > -1;
	};
});