'use strict';

/**
 * @ngdoc function
 * @name angularFirebaseTrelloApp.controller:IndexboardsCtrl
 * @description
 * # IndexboardsCtrl
 * Controller of the angularFirebaseTrelloApp
 */
app.controller('IndexBoardsCtrl', function ($scope, $location, Board) {
	// $scope.user = Authenticate.user;
	$scope.boards = Board.query();
	$scope.board = new Board;
	$scope.board.title = '';
	$scope.board.description = '';
	$scope.addBoard = function () {
		// $scope.board.creator = $scope.user.profile.name;
		// $scope.board.creatorUID = $scope.user.uid;
		$scope.board.$save().then(function (ref) {
			console.log(ref);
			$location.path('boards/' + ref.id);
		});
	};
	$scope.deleteBoard = function (board) {
		Board.delete(board);
	};
});