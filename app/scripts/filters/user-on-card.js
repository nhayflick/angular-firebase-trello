'use strict';

/**
 * @ngdoc filter
 * @name angularFirebaseTrelloApp.filter:userOnCard
 * @function
 * @description
 * # userOnCard
 * Filter in the angularFirebaseTrelloApp.
 */
app.filter('userOnCard', function ($filter) {
    // TODO: Seems like this is being called more often than necessary - investigate?
    return function (users, card) {
      var out = [];
      if (card) {
	    angular.forEach(card.user_ids, function(userId) {
	    	out.push($filter('filter')(users, {id: userId})[0]);
	    });
	  }
      return out;
    };
  });
