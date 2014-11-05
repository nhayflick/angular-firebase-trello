'use strict';

/**
 * @ngdoc service
 * @name angularFirebaseTrelloApp.board
 * @description
 * # board
 * Factory in the angularFirebaseTrelloApp.
 */
app.factory('Board', function ($firebase, FIREBASE_URL) {
	var ref = new Firebase(FIREBASE_URL);
	var boards = $firebase(ref.child('boards')).$asArray();
	var Board = {
		all: boards,
		create: function (board) {
			return boards.$add(board).then(function (boardRef) {
				$firebase(ref.child('user_boards').child(board.creatorUID)).$push(boardRef.name());
				return boardRef;
			});
		},
		get: function (boardId) {
			return $firebase(ref.child('boards').child(boardId)).$asObject();
		},
		delete: function (board) {
			return boards.$remove(board);
		},
		lists: function (boardId) {
			// Access a synced array representing a collection of Firebase objects
			return $firebase(ref.child('lists').child(boardId)).$asArray();
		}
	};
	return Board;
});