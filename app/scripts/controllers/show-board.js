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
	var startIndex = 0;
	var card;
	$scope.sortableOptions = function(list) {
		return {
			connectWith: ".cards-container",
			dropOnEmpty: true,
			start: function(e, ui) {
				startIndex = ui.item.index();
				console.log(this);
			},
			beforeStop: function(e, ui) {
				// console.log($(this).scope().list);
				var addToList = ui.item.parent()[0];
				if (this !== addToList) {
					// console.log(startIndex);
					// console.log(ui.item.index());
					// TODO this is the new index, we need the previous one
					card = list.cards[startIndex];
					// console.log(cards);
					list.cards.$remove(startIndex);
					$(addToList).scope().list.cards.$add(card)
					ui.item.sortable.cancel();
				};
			},
			remove: function(e, ui) {
				// console.log(ui.item);
				// var card = cards[oldIndex];
				// console.log(card);
				// cards.$remove(card);
			},
			receive: function(e, ui) {
				// console.log("here");
			},
			stop: function(e, ui) {
				angular.forEach(list.cards, function(value, index) {
		      var card = list.cards.$getRecord(value.$id);
		      // Reorder items on backend by updating priority to match array index
		      if (card.$priority != index) {
			      card.$priority = index;
			      list.cards.$save(card);
			    }
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
			list.cards.$watch(function (notification) {
				if (notification.event === 'child_added') {
				// Lookup object in FireBase array by key
					var card = list.cards.$getRecord(notification.key);
						// Fetch user object from backend by ID
					card.users = Card.users(card.$id);
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