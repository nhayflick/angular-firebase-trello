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
    return function (users, card, present) {
      var present = typeof present !== 'undefined' ? present : true;
      return users.filter(function (user) {
        var matches = 0;
        if (!card.users) return  present ? false: true;
        for (var j = card.users.length - 1; j >= 0; j--) {
          if (card.users[j].$id == user.$id) {
            matches++;
          }
        };
        return present ? matches > 0 : matches == 0;
      });
    };
  });
