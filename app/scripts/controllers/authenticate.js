'use strict';

/**
 * @ngdoc function
 * @name angularFirebaseTrelloApp.controller:AuthenticateCtrl
 * @description
 * # AuthenticateCtrl
 * Controller of the angularFirebaseTrelloApp
 */
app.controller('AuthenticateCtrl', function ($scope, $location, user, Authenticate) {
    if (user) {
      $location.path('/');
    }

    $scope.register = function () {
      Authenticate.register($scope.user).then(function(user){
        return Authenticate.login($scope.user).then(function() {
            user.name = $scope.user.name;
            return Authenticate.createProfile(user);
          }).then(function() {
            $location.path('/');
          });
        }, function(error) {
          $scope.error = error.toString();
        }
      );
    };
    $scope.login = function () {
      console.log($scope.user);
      Authenticate.login($scope.user).then(function() {
          $location.path('/');
        }, function(error) {
          console.log(error.toString());
          $scope.error = error.toString();
        }
      );
    };
  });
