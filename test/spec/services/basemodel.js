'use strict';

describe('Service: BaseModel', function () {
  var $httpBackend, $rootScope;

  // load the service's module
  beforeEach(module('angularTrelloApp'));

  // instantiate service
  var BaseModel;
  beforeEach(inject(function (_BaseModel_) {
    BaseModel = _BaseModel_;
  }));

  var baseModel;
  beforeEach(function () {
    baseModel = new BaseModel();
    baseModel.ENDPOINT = '/test'
    baseModel.FIELDS = [{
      fieldName: 'title',
      required: true
    }, {
      fieldName: 'description',
      required: false
    }];
  });

  // it('should correctly catch validation errors in missing fields', function () {
  //   var content = {
  //     name: '',
  //     description: 'User forgot to name this...'
  //   };
  //   baseModel.insert(content).catch(function(error){
  //     expect(error).toBe('Field can\'t be empty');
  //     done(); // Alerts test runner when completed for async operations
  //   });
  //   scope.$digest();
  // });

});
