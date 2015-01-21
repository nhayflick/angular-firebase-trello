'use strict';

/* global app:true */
/* exported app */

/**
 * @ngdoc overview
 * @name angularTrelloApp
 * @description
 * # angularTrelloApp
 *
 * Main module of the application.
 */
var app = angular
  .module('angularTrelloApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngMockE2E',
    'ui.sortable',
    'ui.bootstrap',
    'ui.bootstrap.tpls'
  ])
  .config(function ($routeProvider) {
    // $urlRouterProvider.otherwise({
    //   redirectTo: '/'
    // });
    $routeProvider
      .when('/', {
        templateUrl: 'views/index-boards.html',
        controller: 'IndexBoardsCtrl'
      })
      .when('/boards/:boardId', {
        templateUrl: 'views/show-board.html',
        controller: 'ShowBoardCtrl'
      })
      .when('/register', {
        templateUrl: 'views/register.html',
        controller: 'AuthenticateCtrl',
        resolve: {
          user: function(Authenticate) {
            return Authenticate.resolveUser();
          }
        }
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'AuthenticateCtrl',
        resolve: {
          user: function(Authenticate) {
            return Authenticate.resolveUser();
          }
        }
      }).otherwise({
        redirectTo: '/'
      });
  }).run(function($httpBackend, $filter) {
    /*jshint camelcase: false */
    var currentBoardId = 1;
    var currentCardId = 2;
    var currentListId = 3;
    var boards = [{
      id: 1, 
      title: 'Paris Trip', 
      description: 'Ball so hard...',
      user_id: 1
    }];
    var lists = [{
      id: 1, 
      name: 'To Do', 
      description: 'So much to do, so little time', 
      board_id: 1,
      card_ids: [1]
    },
    {
      id: 2, 
      name: 'Doing', 
      board_id: 1,
      card_ids: [2]
    },{
      id: 3, 
      name: 'Doing', 
      board_id: 2
    }];
    var cards = [{
      id: 1, 
      name: 'Order Fish Fillets', 
      list_id: 1,
      board_id: 1,
      list_index: 0,
      user_ids: [1,2]
    }, {
      id: 2, 
      name: 'Get Croissants', 
      description: 'Hurry up...!',
      list_id: 2,
      board_id: 1,
      list_index: 0,
      user_ids: [1]
    }];
    var users = [{
      id: 1, 
      name: 'Kanye West', 
      url_image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8OX6-NuQBIZcufKwKAO8E25PXjHBGE8Kml2C2T4gIgRPnzyoI'
    }, {
      id: 2, 
      name: 'Jay-Z',
      url_image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuGs3lglC_GtBU5RVPZMSCj9bdySZ7E_XrZI2gcb-tHvYbNoakAQ'
    }];

    var idRegEx = /\/boards\/(\w+.*)/;

    // Mock Detail API Calls
    $httpBackend.whenGET(idRegEx).respond(function(method, url, data, headers) {
        var boardId = parseInt(url.match(idRegEx)[1]);
        var board = $filter('filter')(boards, {id: boardId})[0];
        board.lists = $filter('filter')(lists, {board_id: boardId});
        board.cards = $filter('filter')(cards, {board_id: boardId});
        board.users = users;
        return [200, board, {}];
      }
    );

    // Mock Index API Calls
    $httpBackend.whenGET('/boards').respond(boards);
    $httpBackend.whenGET('/lists').respond(lists);
    $httpBackend.whenGET('/cards').respond(cards);
    $httpBackend.whenGET('/users').respond(users);

    var cardUserDetailRegEx = /\/cards\/(\w+.*)\/users\/(\w+.*)/;
    var listDetailRegEx = /\/lists\/(\w+.*)/;
    var cardDetailRegEx = /\/cards\/(\w+.*)/;

    // POST to CARDUSER:UPDATE endpoint
    $httpBackend.whenPOST(cardUserDetailRegEx).respond(function(method, url, data) {
      var cardId = parseInt(url.match(cardUserDetailRegEx)[1]);
      var userId = parseInt(url.match(cardUserDetailRegEx)[2]);
      var updatedCardUser = {};
      cards.forEach(function (card, i) {
        if (card.id == cardId) {
          console.log(card.user_ids);
          if (card.user_ids.indexOf(userId) == -1) {
            console.log('true');
            console.log(userId);
            card.user_ids.push(userId);
            updatedCardUser = {card_id: cardId, user_id: userId};
          }
          return false;
        };
      });
      return [200, updatedCardUser, {}];
    });
    // POST to LIST:UPDATE endpoint
    $httpBackend.whenPOST(listDetailRegEx).respond(function(method, url, data) {
      var listId = parseInt(url.match(listDetailRegEx)[1]);
      var updatedList;
      lists.forEach(function (list, i) {
        if (list.id == listId) {
          lists[i] = JSON.parse(data);
          updatedList = lists[i];
          return false;
        };
      });
      return [200, updatedList, {}];
    });
    // POST to CARD:UPDATE endpoint
    $httpBackend.whenPOST(cardDetailRegEx).respond(function(method, url, data) {
      var cardId = parseInt(url.match(cardDetailRegEx)[1]);
      var updatedCard;
      cards.forEach(function (card, i) {
        if (card.id == cardId) {
          cards[i] = JSON.parse(data);
          updatedCard = cards[i];
          console.log(updatedCard);        
          return false;
        };
      });
      return [200, updatedCard, {}];
    });
    // CREATE a new Board
    $httpBackend.whenPOST('/boards').respond(function(method, url, data) {
      var board = angular.fromJson(data);
      currentBoardId++;
      board.id = currentBoardId;
      boards.push(board);
      return [200, board, {}];
    });
    // CREATE a new List
    $httpBackend.whenPOST('/lists').respond(function(method, url, data) {
      var list = angular.fromJson(data);
      currentListId++;
      list.id = currentListId;
      lists.push(list);
      return [200, list, {}];
    });
    // POST to CARD:CREATE
    $httpBackend.whenPOST('/cards').respond(function(method, url, data) {
      var card = angular.fromJson(data);
      currentCardId++;
      card.id = currentCardId;
      card.user_ids = [];
      cards.push(card);
      return [200, card, {}];
    });
    // DELETE to CARDUSER:DELETE endpoint
    $httpBackend.whenDELETE(cardUserDetailRegEx).respond(function(method, url, data) {
      var cardId = parseInt(url.match(cardUserDetailRegEx)[1]);
      var userId = parseInt(url.match(cardUserDetailRegEx)[2]);
      var deletedCardUser = {};
      var card = $filter('filter')(cards, {id: cardId}, true)[0];
      var indexToRemove = card.user_ids.indexOf(userId);
      if (card && indexToRemove != -1) {
        card.user_ids.splice(indexToRemove, 1);
        deletedCardUser = {card_id: cardId, user_id: userId};
      }
      return [200, deletedCardUser, {}];
    });


    // takes away an old board

    $httpBackend.whenGET(/views\/\w+.*/).passThrough();
    //...
  });
