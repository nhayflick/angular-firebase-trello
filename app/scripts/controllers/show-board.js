'use strict';

/**
 * @ngdoc function
 * @name angularFirebaseTrelloApp.controller:ShowBoardCtrl
 * @description
 * # ShowBoardCtrl
 * Controller of the angularFirebaseTrelloApp
 */
app.controller('ShowBoardCtrl', function (
	$scope,
  $rootScope,
	$routeParams,
	$mdDialog,
  $mdToast,
	$firebase,
	FIREBASE_URL,
	Board, 
	List, 
	Card, 
	Authenticate, 
	User
) {
	$scope.board = Board.get($routeParams.boardId);
	$scope.users = User.all();
	$scope.board.loadingLists = true;
	$scope.lists = Board.lists($routeParams.boardId);
  $scope.list = {};
	$scope.draggableLists = {};
	

  var startIndex = 0;
	var card;

  // Set params for ng-sortable
	$scope.dragControlListeners = {
    accept: false,
    itemMoved: function (event) {
    	transferCard(event);
    },
    orderChanged: function (event) {
    	// Iterate through UI list
    	var cards = event.source.sortableScope.$parent.list.cards;
    	var sortableCards = event.source.sortableScope.modelValue;
    	updateCardOrdering(sortableCards, cards);
    },
    containment: '#board'
	};

	$scope.lists.$watch(function(notification){
		if (notification.event !== 'child_added') return false;
		updateListFromNotification(notification);
	});

  // 
	$scope.addList = function () {
		var list = {
			name: $scope.list.name,
			creatorUID: Authenticate.user.uid,
			cards: false
		};
		$scope.lists.$add(list).then(function () {
			list.cards = List.cards(list.$id);
		});
		$scope.list.name = '';
	};
  $scope.createCardDialog = function (list, $event) {
    if (Board.shouldReject($scope.board, true)) return false;
    $mdDialog.show({
      targetEvent: $event,
      templateUrl: 'views/create-card.html',
      controller: 'CreateCardCtrl',
      locals: {
        list: list, 
        lists: $scope.lists
      }
    });
  };
  $scope.editCardDialog = function (list, card, $event) {
    if (Board.shouldReject($scope.board, true)) return false;
    $mdDialog.show({
      targetEvent: $event,
      templateUrl: 'views/edit-card.html',
      controller: 'EditCardCtrl',
      locals: {
        card: card,
        list: list, 
        lists: $scope.lists
      }
    });
  };
  $scope.editBoardDialog = function ($event) {
    if (Board.shouldReject($scope.board, true)) return false;
    $mdDialog.show({
      targetEvent: $event,
      templateUrl: 'views/edit-board.html',
      controller: 'EditBoardCtrl',
      locals: {
        board: $scope.board
      }
    });
  };
  // Hide initial spinner when finished loading
  $scope.lists.$loaded()
    .then(function () {
      $scope.board.loadingLists = false;
    })

  function transferCard(event) {
    // A reference to the UI drag and drop copy of the card
    var sortableCard = event.source.sortableScope;
     // A reference to the original $firebase model of the card
    var card = event.source.itemScope.card;
    // A reference to the UI drag and drop copy of the list
    var sortableDestination = event.dest.sortableScope;
    // Remove card from source list
    $scope.lists.$getRecord(sortableCard.$parent.list.$id).cards.$remove(event.source.index);
    // Place the card in between two whole integers for now
    card.$priority = event.dest.index + .5;
     // Add card to destination list
    (function (event) {
      $scope
        .lists
        .$getRecord(sortableDestination.$parent.list.$id)
        .cards
        .$add(card)
        // NG-sortable has already added the sortable item to our UI but
        // it's not properly bound to the server.
        // So we wait for firebase to complete the sync, add it's own card 
        // then we remove the ng-sortable version
        .then(function(ref) {
          var newCard = $firebase(ref).$asObject();
          for (var i = card.users.length - 1; i >= 0; i--) {
            addUserToCard(card.users[i], newCard);
          };
          event.dest.sortableScope.removeItem(event.dest.index);
          // updateCardOrdering(event.dest.sortableScope.modelValue, event.dest.sortableScope.$parent.list.cards);
        });
    })(event);
  }

	function addUserToCard (user, card) {
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
	}

	function updateCardOrdering(sortableCards, cards) {
		angular.forEach(sortableCards, function(value, index) {
      // Reorder items on backend by updating priority to match array index
      if (value.$priority != index) {
	      value.$priority = index;
	      // Step up and back down the scope chain to find the firebase
	      // collection associated with cards.
	      cards.$save(value);
	    }
    });
	}

  // Sets up UI when Firebase detects a new list added to the board
  function updateListFromNotification(notification) {
    // Lookup list in FireBase array by key
    var list = $scope.lists.$getRecord(notification.key);
    list.loadingCards = true;
    // Fetch cards object from backend by ID
    list.cards = List.cards(list.$id)
    // Hide Spinnder when loading is complete
    list.cards.$loaded()
      .then(function() {
        list.loadingCards = false;
      });
    $scope.draggableLists[list.$id] = angular.copy(list);
    $scope.draggableLists[list.$id]['cards'] = [];
    (function(list) {
        // Sets up UI when Firebase detects a new card added to the list
        list.cards.$watch(function (notification) {
          if (notification.event !== 'child_added') return false;
          var card = list.cards.$getRecord(notification.key);
          // Fetch user object from backend by ID
          card.users = Card.users(card.$id);
          // $scope.draggableLists[list.$id].cards.splice(parseInt(card.$priority), 0, card);
          $scope.draggableLists[list.$id].cards.push(card);
        });
    })(list);
  }

  $scope.shouldReject = function (toast) {
    Board.shouldReject($scope.board, toast);
  }
});