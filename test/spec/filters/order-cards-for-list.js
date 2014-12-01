'use strict';

describe('Filter: orderCardsForList', function () {

  // load the filter's module
  beforeEach(module('angularFirebaseTrelloApp'));

  // initialize a new instance of the filter before each test
  var orderCardsForList;
  beforeEach(inject(function ($filter) {
    orderCardsForList = $filter('orderCardsForList');
  }));

  it('should return the input prefixed with "orderCardsForList filter:"', function () {
    var text = 'angularjs';
    expect(orderCardsForList(text)).toBe('orderCardsForList filter: ' + text);
  });

});
