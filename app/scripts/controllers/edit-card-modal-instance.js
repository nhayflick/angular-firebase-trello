'use strict';

/**
 * @ngdoc function
 * @name angularFirebaseTrelloApp.controller:EditCardModalInstanceCtrl
 * @description
 * # EditCardModalInstanceCtrl
 * Controller of the angularFirebaseTrelloApp
 */
app.controller('EditCardModalInstanceCtrl', function ($scope, $modal, card, users) {
    $scope.card = card;
    $scope.users = users;
	$scope.ok = function () {
		$modalInstance.close($scope.selected);
	};

	$scope.cancel = function () {
	  $modalInstance.dismiss('cancel');
	};
  });
