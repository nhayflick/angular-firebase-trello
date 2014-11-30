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
    'ngMockE2E'
  ])
  .config(function ($routeProvider) {
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
      })
      .otherwise({
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
      board_id: 1
    },
    {
      id: 2, 
      name: 'Doing', 
      board_id: 1
    },{
      id: 3, 
      name: 'Doing', 
      board_id: 2
    }];
    var cards = [{
      id: 1, 
      name: 'Order Fish Fillet', 
      list_id: 1,
      board_id: 1,
      user_ids: [1]
    }, {
      id: 2, 
      name: 'Wait for Croissants', 
      description: 'Seems to be taking longer than expected',
      list_id: 2,
      board_id: 1,
      user_ids: [2]
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

    // adds a new board to the boards array
    $httpBackend.whenPOST('/boards').respond(function(method, url, data) {
      var board = angular.fromJson(data);
      currentBoardId++;
      board.id = currentBoardId;
      boards.push(board);
      return [200, board, {}];
    });
    $httpBackend.whenPOST('/lists').respond(function(method, url, data) {
      var list = angular.fromJson(data);
      currentListId++;
      list.id = currentListId;
      lists.push(list);
      return [200, list, {}];
    });
    $httpBackend.whenPOST('/cards').respond(function(method, url, data) {
      var card = angular.fromJson(data);
      currentCardId++;
      card.id = currentCardId;
      cards.push(card);
      return [200, card, {}];
    });



    // takes away an old board

    $httpBackend.whenGET(/views\/\w+.*/).passThrough();
    //...
  });
