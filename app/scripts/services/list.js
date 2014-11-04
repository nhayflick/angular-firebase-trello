'use strict';

/**
 * @ngdoc service
 * @name angularFirebaseTrelloApp.list
 * @description
 * # list
 * Factory in the angularFirebaseTrelloApp.
 */
app.factory('List', function ($firebase, FIREBASE_URL) {
    // Service logic
    var ref = new Firebase(FIREBASE_URL);
    var List = {
      all: function(boardId) {
        // Access a synced array representing a collection of Firebase objects
        return $firebase(ref.child('lists').child(boardId)).$asArray();
      },
      cards: function (listId) {
        // Access a synced array representing a collection of Firebase objects
        return $firebase(ref.child('cards').child(listId)).$asArray();
      }
    };



    // Public API here
    return List;
  });
