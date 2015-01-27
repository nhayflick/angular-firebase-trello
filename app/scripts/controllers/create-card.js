'use strict';

/**
 * @ngdoc function
 * @name angularFirebaseTrelloApp.controller:CreateCardCtrl
 * @description
 * # CreateCardCtrl
 * Controller of the angularFirebaseTrelloApp
 */
app.controller('CreateCardCtrl', function ($scope, $mdDialog, $firebase, $mdToast, Authenticate, list, lists) {
    $scope.lists = lists;
    $scope.card = {
      name: '',
      description: '',
      list: list || $scope.lists[0]
    };
      // Create a task card and add it to a list
    $scope.createCard = function (list) {
      var card = {
        name: $scope.card.name,
        description: $scope.card.description || '',
        creatorUID: Authenticate.user.uid
      };
      list.cards
        .$add(card)
        .then( function () {
          $mdToast.show($mdToast.simple().position('bottom right').content('New Card Added: ' + card.name));
          $mdDialog.hide()
        });
    };
  });
