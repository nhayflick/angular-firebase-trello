'use strict';

/**
 * @ngdoc filter
 * @name angularFirebaseTrelloApp.filter:onCard
 * @function
 * @description
 * # onCard
 * Filter down an array of users to those assigned to the card.
 */
app.filter('onCard', function () {
    return function (users, card, negate) {
      var negate = typeof negate !== 'undefined' ? negate : true;
      var filteredUsers = [];

      for (var i = users.length - 1; i >= 0; i--) {
        for (var j = card.users.length - 1; j >= 0; j--) {
          if ((card.users[j].md5_hash == users[i].md5_hash) == negate) filteredUsers.push(users[i]);
        };
      };
      return filteredUsers;
    };
  });
