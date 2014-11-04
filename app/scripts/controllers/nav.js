'use strict';

/**
 * @ngdoc function
 * @name angularFirebaseTrelloApp.controller:NavCtrl
 * @description
 * # NavCtrl
 * Controller of the angularFirebaseTrelloApp
 */
app.controller('NavCtrl', function ($scope, Authenticate) {
    $scope.signedIn = Authenticate.signedIn;
    $scope.logout = Authenticate.logout;
    $scope.user = Authenticate.user;
  });
