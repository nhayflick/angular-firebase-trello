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
			card.users.$add(user);
		});
	};
});