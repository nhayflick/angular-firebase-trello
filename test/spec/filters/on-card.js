'use strict';

describe('Filter: onCard', function () {

  // load the filter's module
  beforeEach(module('angularFirebaseTrelloApp'));

  // initialize a new instance of the filter before each test
  var onCard;
  beforeEach(inject(function ($filter) {
    onCard = $filter('onCard');
  }));

  it('should return the input prefixed with "onCard filter:"', function () {
    var text = 'angularjs';
    expect(onCard(text)).toBe('onCard filter: ' + text);
  });

});
