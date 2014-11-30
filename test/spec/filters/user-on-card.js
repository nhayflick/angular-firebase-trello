'use strict';

describe('Filter: userOnCard', function () {

  // load the filter's module
  beforeEach(module('angularFirebaseTrelloApp'));

  // initialize a new instance of the filter before each test
  var userOnCard;
  beforeEach(inject(function ($filter) {
    userOnCard = $filter('userOnCard');
  }));

  it('should return the input prefixed with "userOnCard filter:"', function () {
    var text = 'angularjs';
    expect(userOnCard(text)).toBe('userOnCard filter: ' + text);
  });

});
