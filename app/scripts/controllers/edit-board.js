'use strict';

/**
 * @ngdoc function
 * @name angularFirebaseTrelloApp.controller:EditBoardCtrl
 * @description
 * # EditBoardCtrl
 * Controller of the angularFirebaseTrelloApp
 */
angular.module('angularFirebaseTrelloApp')
  .controller('EditBoardCtrl', function ($scope, board, $mdToast, $mdDialog) {
    $scope.board = board;
    $scope.updateBoard = function () {
      board.$save()
        .then( function () {
          $mdToast.show($mdToast.simple().position('bottom right').content('Updated Board: ' + board.title));
          $mdDialog.hide()
        });
    };
  });
