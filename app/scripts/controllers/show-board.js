'use strict';

/**
 * @ngdoc function
 * @name angularFirebaseTrelloApp.controller:ShowBoardCtrl
 * @description
 * # ShowBoardCtrl
 * Controller of the angularFirebaseTrelloApp
 */
app.controller('ShowBoardCtrl', function ($scope, $routeParams, Board, List, Authenticate) {
    $scope.board = Board.get($routeParams.boardId);
    $scope.lists = Board.lists($routeParams.boardId);
    $scope.card = {};

    $scope.addList = function() {
      var list = {
        name: $scope.list.name,
        creatorUID: Authenticate.user.uid
      };
      $scope.lists.$add(list);
      $scope.list.name = '';
    };
    // Create a task card and add it to a list
    $scope.addCard = function(list) {
      console.log(list);
      var card = {
        name: $scope.card.name,
        description: $scope.card.description,
        creatorUID: Authenticate.user.uid
      };
      list.cards.$add(card);
      $scope.card.name = '';
      $scope.card.description = '';
    };
  });
