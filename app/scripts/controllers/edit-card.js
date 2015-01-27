'use strict';

/**
 * @ngdoc function
 * @name angularFirebaseTrelloApp.controller:EditCardCtrl
 * @description
 * # EditCardCtrl
 * Controller of the angularFirebaseTrelloApp
 */
'use strict';
app.controller('EditCardCtrl', function ($scope, $mdDialog, $firebase, $mdToast, Authenticate, card, list, lists) {
    var list = list;
    $scope.card = card;
      // Create a task card and add it to a list
    $scope.updateCard = function () {
      list.cards.$save(card)
        .then( function () {
          $mdToast.show($mdToast.simple().position('bottom right').content('Card Updates: ' + $scope.card.name));
          $mdDialog.hide()
        });
    };
  });
