'use strict';

/**
 * @ngdoc function
 * @name angularFirebaseTrelloApp.controller:EditCardModalInstanceCtrl
 * @description
 * # EditCardModalInstanceCtrl
 * Controller of the angularFirebaseTrelloApp
 */
app.controller('EditCardModalInstanceCtrl', function ($scope, $modal, card, users, $q, $http, $filter) {
    $scope.card = card;
    $scope.users = users;
	$scope.ok = function () {
		$modalInstance.close($scope.selected);
	};

	$scope.cancel = function () {
	  $modalInstance.dismiss('cancel');
	};
	$scope.addUserToCard = function (user, card) {
		var deferred = $q.defer();
		var cardUser = {user_id: user.id, card_id: card.id}
		$http.post('/cards/' + card.id + '/users/' + user.id, cardUser).success(function(data) {
		  deferred.resolve(data);
		});
		// Once server returns the new card, we can add it back to the board object
		deferred.promise.then(function(cardUser) {
			if (Object.keys(cardUser).length) {
				card.user_ids.push(cardUser.user_id);
			}
		});
	};
	$scope.removeUserFromCard = function(user, card) {
		var deferred = $q.defer();
		$http.delete('/cards/' + card.id + '/users/' + user.id).success(function(data) {
		  deferred.resolve(data);
		});
		deferred.promise.then(function(cardUser) {
			var indexToRemove = card.user_ids.indexOf(cardUser.user_id);
			if (indexToRemove != -1) {
		        card.user_ids.splice(indexToRemove, 1);
		      }
		});
	}
	$scope.userIsOnCard = function (user, card) {
		return card.user_ids.indexOf(user.id) != -1;
	};

  });
