'use strict';

/**
 * @ngdoc service
 * @name angularFirebaseTrelloApp.board
 * @description
 * # board
 * Factory in the angularFirebaseTrelloApp.
 */
app.factory('Board', function ($firebase, $mdToast, Authenticate, FIREBASE_URL) {
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
		},
		// Only allow creator to make changes on a locked board
	  shouldReject: function (board, withToast) {
	    if (board.locked && Authenticate.user.uid === board.creator_uid) {
	      if (withToast) $mdToast.show($mdToast.simple().position('bottom right').content('This Board is locked. Only it\'s owner can make edits.'));
	      return true;
	    }
	    return false;
	  }
	};
	return Board;
});