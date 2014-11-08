'use strict';

/**
 * @ngdoc service
 * @name angularTrelloApp.list
 * @description
 * # list
 * Factory in the angularTrelloApp.
 */
app.factory('List', function ($firebase, FIREBASE_URL) {
	// Service logic
	var ref = new Firebase(FIREBASE_URL);
	var List = {
		all: function (boardId) {
			// Access a synced array representing a collection of Firebase objects
			return $firebase(ref.child('lists').child(boardId)).$asArray();
		},
		cards: function (listId) {
			// Access a synced array representing a collection of Firebase objects
			return $firebase(ref.child('list/' + listId + '/cards')).$asArray();
		}
	};



	// Public API here
	return List;
});