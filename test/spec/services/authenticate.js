'use strict';

describe('Service: authenticate', function () {

  // load the service's module
  beforeEach(module('angularFirebaseTrelloApp'));

  // instantiate service
  var Authenticate;
  beforeEach(inject(function (_authenticate_) {
    Authenticate = _authenticate_;
  }));

  it('should do something', function () {
    expect(!!Authenticate).toBe(true);
  });

});
