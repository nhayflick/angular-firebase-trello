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
	$scope.dragControlListeners = {
    itemMoved: function (event) {
    	// A reference to the UI drag and drop copy of the card
    	var sortableCard = event.source.sortableScope;
    	 // A reference to the original $firebase model of the card
    	var originalCard = event.source.itemScope.card;
    	// A reference to the UI drag and drop copy of the list
    	var sortableDestination = event.dest.sortableScope;
      // Remove card from source list
      sortableCard.$parent.list.cards.$remove(event.source.index);
      // Add card to destination list
     	$scope.lists.$getRecord(sortableCard.$parent.list.$id).cards.$add(originalCard);
      // Place the card in between two whole integers for now
    	originalCard.$priority = event.dest.index - .5
    	console.log(originalCard.$priority);
      // updateCardOrdering(sortableDestination.modelValue, sortableDestination.$parent.list.cards);
    },
    orderChanged: function (event) {
    	console.log('detected ');
    	// Iterate through UI list
    	var originalCards = event.source.sortableScope.$parent.list.cards;
    	var sortableCards = event.source.sortableScope.modelValue;
    	updateCardOrdering(sortableCards, originalCards);

    },
    containment: '#board'
	};

	$scope.lists.$watch(function(notification){
		if (notification.event === 'child_added') {
			// Lookup list in FireBase array by key
			var list = $scope.lists.$getRecord(notification.key);
			// Fetch cards object from backend by ID
			list.cards = List.cards(list.$id);
			$scope.draggableLists[list.$id] = angular.copy(list);
			$scope.draggableLists[list.$id]['cards'] = [];
			(function(list) {
					list.cards.$watch(function (notification) {
						if (notification.event === 'child_added') {
							console.log('eek!');
							var card = list.cards.$getRecord(notification.key);
								// Fetch user object from backend by ID
							card.users = Card.users(card.$id);
							$scope.draggableLists[list.$id].cards.push(card);
						}
					});
			})(list);
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
	function updateCardOrdering(sortableCards, originalCards) {
		angular.forEach(sortableCards, function(value, index) {
      // Reorder items on backend by updating priority to match array index
      console.log("new index: " + index)
      console.log("current $priority: " + value.$priority)
      if (value.$priority != index) {
	      value.$priority = index + 1;
	      // Step up and back down the scope chain to find the firebase
	      // collection associated with cards.
	      originalCards.$save(value);
	    }
    });
	}
});