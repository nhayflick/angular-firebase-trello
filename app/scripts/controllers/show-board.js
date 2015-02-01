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
	$scope.lists.$loaded()
		.then(function () {
			$scope.board.loadingLists = false;
		})
	$scope.draggableLists = {};
	var startIndex = 0;
	var card;
	$scope.dragControlListeners = {
    itemMoved: function (event) {
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
		// Lookup list in FireBase array by key
		var list = $scope.lists.$getRecord(notification.key);
		list.loadingCards = true;
		// Fetch cards object from backend by ID
		list.cards = List.cards(list.$id)
		list.cards.$loaded()
			.then(function() {
				list.loadingCards = false;
			});
		$scope.draggableLists[list.$id] = angular.copy(list);
		$scope.draggableLists[list.$id]['cards'] = [];
		(function(list) {
				list.cards.$watch(function (notification) {
					if (notification.event !== 'child_added') return false;
					var card = list.cards.$getRecord(notification.key);
						// Fetch user object from backend by ID
					console.log(card.users);
					// if (!card.users) card.users = Card.users(card.$id);
          card.users = Card.users(card.$id);
					console.log(card.users);
					// Gotta work on fixing the card placement
					// $scope.draggableLists[list.$id].cards.splice(parseInt(card.$priority), 0, card);
					$scope.draggableLists[list.$id].cards.push(card);
				});
		})(list);
	});

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
	function addUserToCard (user, card) {
    console.log(arguments);
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
	$scope.removeUserFromCard = function (user, card) {
		var ref = new Firebase(FIREBASE_URL + 'user_cards/' + user.$id + '/' + card.$id);
		var sync = $firebase(ref);
		sync.$remove();
		var refB = new Firebase(FIREBASE_URL + 'card/' + card.$id + '/users/' + user.$id);
		var syncB = $firebase(refB);
		syncB.$remove();
	};
	// $scope.userIsOnCard = function (user, card) {
	// 	return card.users.$indexFor(user.$id) > -1;
	// };
	function createCardDialog (list, $event) {
    $mdDialog.show({
      targetEvent: $event,
      templateUrl: 'views/create-card.html',
      controller: 'CreateCardCtrl',
      onComplete: afterShowAnimation,
      locals: {
      	list: list, 
      	lists: $scope.lists
      }
    });
    // When the 'enter' animation finishes...
    function afterShowAnimation(scope, element, options) {
       // post-show code here: DOM element focus, etc.
    }
  };
  function editCardDialog (list, card, $event) {
    $mdDialog.show({
      targetEvent: $event,
      templateUrl: 'views/edit-card.html',
      controller: 'EditCardCtrl',
      onComplete: afterShowAnimation,
      locals: {
      	card: card,
      	list: list, 
      	lists: $scope.lists
      }
    });
    // When the 'enter' animation finishes...
    function afterShowAnimation(scope, element, options) {
       // post-show code here: DOM element focus, etc.
    }
  };
  $scope.createCardDialog = createCardDialog;
  $scope.editCardDialog = editCardDialog;

	function updateCardOrdering(sortableCards, cards) {
		angular.forEach(sortableCards, function(value, index) {
      // Reorder items on backend by updating priority to match array index
      console.log("new index: " + index)
      console.log("current $priority: " + value.$priority)
      if (value.$priority != index) {
	      value.$priority = index;
	      // Step up and back down the scope chain to find the firebase
	      // collection associated with cards.
	      cards.$save(value);
	    }
    });
	}
});