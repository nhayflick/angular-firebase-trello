'use strict';

describe('Controller: EditCardModalInstanceCtrl', function () {

  // load the controller's module
  beforeEach(module('angularFirebaseTrelloApp'));

  var EditCardModalInstanceCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EditCardModalInstanceCtrl = $controller('EditCardModalInstanceCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
