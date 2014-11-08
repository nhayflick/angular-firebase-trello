'use strict';

describe('Service: Board', function () {

  // load the service's module
  beforeEach(module('angularTrelloApp'));

  // instantiate service
  var Board;
  beforeEach(inject(function (_Board_) {
    Board = _Board_;
  }));

  // var board;
  //  beforeEach(inject(function () {
  //   board = new Board();
  // }));

  it('should correctly catch validation errors in missing fields', function () {
    var content = {
      name: '',
      description: 'User forgot to name this...'
    };
    Board.insert(content).catch(function(error){
      expect(error).toBe('Field can\'t be empty');
      done(); // Alerts test runner when completed for async operations
    });
    scope.$digest();
  });
});
