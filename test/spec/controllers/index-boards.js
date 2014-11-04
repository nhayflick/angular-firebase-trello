'use strict';

describe('Controller: IndexBoardsCtrl', function () {

  // load the controller's module
  beforeEach(module('angularFirebaseTrelloApp'));

  var IndexboardsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    IndexboardsCtrl = $controller('IndexBoardsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.boards.length).toBe(3);
  });
});
