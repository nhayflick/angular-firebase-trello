'use strict';

/**
 * @ngdoc service
 * @name angularTrelloApp.Card
 * @description
 * # Card
 * Factory in the angularTrelloApp.
 */
app.factory('Card', function ($firebase, FIREBASE_URL) {
	// Service logic
	var ref = new Firebase(FIREBASE_URL);

	var Card = {
		all: function () {
			// Access a synced array representing a collection of Firebase objects
			return $firebase(ref.child('card')).$asArray();
		},
		users: function (cardId) {
			// Access a synced array representing a collection of Firebase objects
			return $firebase(ref.child('card').child(cardId).child('users')).$asArray();
		}
	};

	// Public API here
	return Card;
});