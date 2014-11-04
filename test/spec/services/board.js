'use strict';

describe('Service: Board', function () {

  // load the service's module
  beforeEach(module('angularFirebaseTrelloApp'));

  // instantiate service
  var board;
  beforeEach(inject(function (_board_) {
    board = _board_;
  }));

  it('should do something', function () {
    expect(!!board).toBe(true);
  });

});
