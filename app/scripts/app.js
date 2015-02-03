'use strict';

/* global app:true */
/* exported app */

/**
 * @ngdoc overview
 * @name angularFirebaseTrelloApp
 * @description
 * # angularFirebaseTrelloApp
 *
 * Main module of the application.
 */
var app = angular
  .module('angularFirebaseTrelloApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngMaterial',
    'ui.sortable',
    'firebase'
  ])
  .config(function ($routeProvider, $mdThemingProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/index-boards.html',
        controller: 'IndexBoardsCtrl'
      })
      .when('/boards/:boardId', {
        templateUrl: 'views/show-board.html',
        controller: 'ShowBoardCtrl',
        resolve: {
          user: function(Authenticate) {
            return Authenticate.resolveUser();
          }
        }
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

      // Primary Theme
      $mdThemingProvider.theme('default')
       .primaryPalette('cyan')
        .accentPalette('green');

  }).constant('FIREBASE_URL', 'https://fiery-heat-4015.firebaseio.com/');