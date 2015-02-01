'use strict';

/**
 * @ngdoc function
 * @name angularFirebaseTrelloApp.controller:IndexboardsCtrl
 * @description
 * # IndexboardsCtrl
 * Controller of the angularFirebaseTrelloApp
 */
app.controller('IndexBoardsCtrl', function ($scope, $location, Board, Authenticate) {
	$scope.user = Authenticate.user;
	$scope.boards = Board.all;
	$scope.board = {
		title: '',
		description: ''
	};
	$scope.addBoard = function () {
		if (Authenticate.checkForLogin(true)) return false;
		$scope.board.creator = $scope.user.profile.name;
		$scope.board.creatorUID = $scope.user.uid;
		Board.create($scope.board).then(function (ref) {
			$location.path('boards/' + ref.name());
		});
	};
	$scope.gotoBoard = function (board) {
		console.log(board);
		$location.path('boards/' + board.$id);
	};
});