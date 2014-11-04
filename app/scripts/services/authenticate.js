'use strict';

/**
 * @ngdoc service
 * @name angularFirebaseTrelloApp.authenticate
 * @description
 * # authenticate
 * Factory in the angularFirebaseTrelloApp.
 */
app.factory('Authenticate', function (FIREBASE_URL, $firebase, $firebaseSimpleLogin, $rootScope) {
    var ref = new Firebase(FIREBASE_URL);
    var authenticate = $firebaseSimpleLogin(ref);

    var Authenticate = {
      register: function (user) {
        return authenticate.$createUser(user.email, user.password);
      },
      login: function (user) {
        return authenticate.$login('password', user);
      },
      logout: function () {
        authenticate.$logout();
      },
      resolveUser: function() {
        return authenticate.$getCurrentUser();
      },
      signedIn: function() {
        return !!Authenticate.user.provider;
      },
      createProfile: function(user) {
        /*jshint camelcase: false */
        var profile = {
          name: user.name,
          md5_hash: user.md5_hash
        };
        var profileRef = $firebase(ref.child('profile'));
        return profileRef.$set(user.uid, profile);
      },
      user: {}
    };

    $rootScope.$on('$firebaseSimpleLogin:login', function(e, user) {
        //create a deep, derenferenced copy of user for assignment
      angular.copy(user, Authenticate.user);
        // save a synced JS object of the User's profile object in Firebase
      Authenticate.user.profile = $firebase(ref.child('profile').child(Authenticate.user.uid)).$asObject();
    });
    $rootScope.$on('$firebaseSimpleLogin:logout', function() {
        //create a deep, derenferenced copy of user for assignment
      angular.copy({}, Authenticate.user);
    });

    // Public API here
    return Authenticate;
  });
