'use strict';

describe('Controller: CreateCardCtrl', function () {

  // load the controller's module
  beforeEach(module('angularFirebaseTrelloApp'));

  var CreateCardCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CreateCardCtrl = $controller('CreateCardCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
