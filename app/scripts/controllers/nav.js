'use strict';

/**
 * @ngdoc function
 * @name angularTrelloApp.controller:NavCtrl
 * @description
 * # NavCtrl
 * Controller of the angularTrelloApp
 */
app.controller('NavCtrl', function ($scope, Authenticate) {
    $scope.signedIn = Authenticate.signedIn;
    $scope.logout = Authenticate.logout;
    $scope.user = Authenticate.user;
  });
