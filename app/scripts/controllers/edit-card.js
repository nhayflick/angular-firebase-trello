'use strict';

/**
 * @ngdoc function
 * @name angularFirebaseTrelloApp.controller:EditCardCtrl
 * @description
 * # EditCardCtrl
 * Controller of the angularFirebaseTrelloApp
 */
'use strict';
app.controller('EditCardCtrl', function ($scope, $mdDialog, $firebase, FIREBASE_URL, $mdToast, Card, User, card, list, lists) {
    var list = list;
    $scope.card = card;
    $scope.users = User.all();
    $scope.modal = {editUsers: false};
      // Create a task card and add it to a list
    $scope.updateCard = function () {
      list.cards.$save(card)
        .then( function () {
          card.users = Card.users(card.$id);
          $mdToast.show($mdToast.simple().position('bottom right').content('Card Updates: ' + $scope.card.name));
          $mdDialog.hide()
        });
    };
    $scope.addUserToCard = function (user, card) {
      var ref = new Firebase(FIREBASE_URL + '/user_cards/' + user.$id + '/' + card.$id);
      var sync = $firebase(ref);
      // Uniqueness validated here on backend
      sync.$set(true).then(function(){
        // if object was validated unique in user_cards then add to card.users
        var ref = new Firebase(FIREBASE_URL + '/card/' + card.$id + '/users');
        var sync = $firebase(ref);
        var content = {};
        var userObject = {
          name: user.name,
          md5_hash: user.md5_hash
        };
        content[user.$id] = userObject;
        sync.$update(content);
      });
    };
  });
