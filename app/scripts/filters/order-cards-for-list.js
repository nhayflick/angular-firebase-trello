'use strict';

/**
 * @ngdoc filter
 * @name angularFirebaseTrelloApp.filter:orderCardsForList
 * @function
 * @description
 * # orderCardsForList
 * Filter in the angularFirebaseTrelloApp.
 */
app.filter('orderCardsForList', function ($filter) {
    return function (cards, list) {
      var out = [];
      console.log(cards);
      angular.forEach(list.card_ids, function(card_id) {
        var card = $filter('filter')(cards, {id: card_id})[0];
        out.push(card);
      })
      return out;
    };
  });
