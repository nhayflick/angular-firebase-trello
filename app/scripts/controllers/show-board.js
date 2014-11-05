'use strict';

/**
 * @ngdoc function
 * @name angularFirebaseTrelloApp.controller:ShowBoardCtrl
 * @description
 * # ShowBoardCtrl
 * Controller of the angularFirebaseTrelloApp
 */
app.controller('ShowBoardCtrl', function ($scope, $routeParams, Board, List, Authenticate) {
	$scope.board = Board.get($routeParams.boardId);
	$scope.lists = Board.lists($routeParams.boardId);
	// When lists API call is returned succesfully, query for cards 
	$scope.lists.$loaded().then(function () {
		angular.forEach($scope.lists, function (obj) {
			// N+1 query here is bad
			obj.cards = List.cards(obj.$id);
		});
	});

	$scope.addList = function () {
		var list = {
			name: $scope.list.name,
			creatorUID: Authenticate.user.uid,
			cards: false
		};
		console.log(list);
		$scope.lists.$add(list);
		$scope.list.name = '';
	};
	// Create a task card and add it to a list
	$scope.addCard = function (list) {
		console.log(list);
		list.card = {
			name: list.card.name,
			description: list.card.description,
			creatorUID: Authenticate.user.uid
		};
		list.cards.$add(list.card);
		list.card.name = '';
		list.card.description = '';
	};
});