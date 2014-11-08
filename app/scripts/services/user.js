'use strict';

/**
 * @ngdoc service
 * @name angularTrelloApp.user
 * @description
 * # user
 * Factory in the angularTrelloApp.
 */
app.factory('User', function ($firebase, FIREBASE_URL) {
	// Service logic
	var ref = new Firebase(FIREBASE_URL);
	var User = {
		all: function () {
			// Access a synced array representing a collection of Firebase objects
			return $firebase(ref.child('profile')).$asArray();
		}
	};

	// Public API here
	return User;
});